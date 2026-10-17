import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import postgres from 'postgres'

if (process.env.CI) throw new Error('CI cannot apply operator-approved migrations')

const databaseUrl = process.env.SUPABASE_DB_URL
if (!databaseUrl) {
  throw new Error('SUPABASE_DB_URL is required for the approved migration operation.')
}

const migrationsUrl = new URL('../supabase/migrations/', import.meta.url)
const fileNames = (await readdir(migrationsUrl))
  .filter(name => /^\d{14}_[a-z0-9_]+\.sql$/.test(name))
  .sort()

const versions = fileNames.map(name => name.slice(0, 14))
if (new Set(versions).size !== versions.length) {
  throw new Error('Migration versions must be unique.')
}

let expectedHistory
try {
  expectedHistory = JSON.parse(process.env.UNFOGY_MIGRATION_EXPECTED_HISTORY ?? '')
} catch {
  throw new Error('R12 expected migration history is required')
}
if (!expectedHistory || Array.isArray(expectedHistory) || typeof expectedHistory !== 'object' || Object.entries(expectedHistory).some(([v, h]) => !/^\d{14}$/.test(v) || !/^[a-f0-9]{64}$/.test(h))) throw new Error('Invalid expected migration history')

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 2,
  prepare: false
})

let lockAcquired = false

try {
  await sql.unsafe('set lock_timeout = \'10s\'')
  await sql`select pg_advisory_lock(hashtext('unfogy_factory_migrations'))`
  lockAcquired = true
  const [tables] = await sql`select to_regclass('supabase_migrations.schema_migrations') is not null as history, to_regclass('unfogy_migrations.migration_checksums') is not null as checksums`
  if (tables.history !== tables.checksums) throw new Error('Incomplete migration history; no automatic baseline')
  const observed = tables.history ? Object.fromEntries((await sql`select m.version,c.checksum from supabase_migrations.schema_migrations m left join unfogy_migrations.migration_checksums c using(version)`).map(r => [r.version, r.checksum])) : {}
  const canonical = value => JSON.stringify(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
  if (canonical(observed) !== canonical(expectedHistory)) throw new Error('Migration history changed after approval; no SQL applied')
  if (Object.keys(observed).some(v => !versions.includes(v))) throw new Error('Database contains migrations absent from this release')
  const known = Object.keys(observed).sort()
  if (known.some((v, i) => versions[i] !== v)) throw new Error('Migration history is not a release prefix')
  const initialInstall = process.env.UNFOGY_MIGRATION_INITIAL_INSTALL === 'true'
  const appliedNames = []
  const migrate = async (connection) => {
    await connection.unsafe(`
      create schema if not exists supabase_migrations;
      create table if not exists supabase_migrations.schema_migrations (
        version text primary key,
        statements text[],
        name text
      );
      create schema if not exists unfogy_migrations;
      revoke all on schema unfogy_migrations from public, anon, authenticated;
      create table if not exists unfogy_migrations.migration_checksums (
        version text primary key,
        checksum text not null,
        applied_at timestamptz not null default now()
      );
      revoke all on table unfogy_migrations.migration_checksums from public, anon, authenticated;
    `)

    const history = await connection`select version from supabase_migrations.schema_migrations`
    if (history.some(row => !versions.includes(row.version))) throw new Error('Database contains migrations absent from this release')

    for (const fileName of fileNames) {
      const version = fileName.slice(0, 14)
      const name = fileName.slice(15, -4)
      const migration = await readFile(new URL(fileName, migrationsUrl), 'utf8')
      const checksum = createHash('sha256').update(migration).digest('hex')
      const [applied] = await connection`
        select migration.version, checksums.checksum
        from supabase_migrations.schema_migrations as migration
        left join unfogy_migrations.migration_checksums as checksums
          on checksums.version = migration.version
        where migration.version = ${version}
      `

      if (applied) {
        if (!applied.checksum) {
          throw new Error(`Applied migration has no verified checksum: ${fileName}`)
        }
        if (applied.checksum !== checksum) {
          throw new Error(`Applied migration was modified: ${fileName}`)
        }
        continue
      }

      const apply = async (transaction) => {
        await transaction.unsafe('set local lock_timeout = \'10s\'; set local statement_timeout = \'60s\';')
        await transaction.unsafe(migration)
        await transaction`
          insert into supabase_migrations.schema_migrations (version, name, statements)
          values (${version}, ${name}, ${transaction.array([migration])})
        `
        await transaction`
          insert into unfogy_migrations.migration_checksums (version, checksum)
          values (${version}, ${checksum})
        `
      }
      if (initialInstall) await apply(connection)
      else await sql.begin(apply)

      if (initialInstall) appliedNames.push(fileName)
      else console.log(`Applied ${fileName}`)
    }
  }
  if (initialInstall) {
    await sql.begin(async (transaction) => {
      await transaction.unsafe(await readFile(new URL('../scripts/empty-database.sql', import.meta.url), 'utf8'))
      await migrate(transaction)
    })
  } else await migrate(sql)
  for (const fileName of appliedNames) console.log(`Applied ${fileName}`)

  console.log(fileNames.length === 0 ? 'No migrations to apply.' : 'Migration history is current.')
} finally {
  try {
    if (lockAcquired) {
      await sql`select pg_advisory_unlock(hashtext('unfogy_factory_migrations'))`
    }
  } finally {
    await sql.end({ timeout: 2 })
  }
}
