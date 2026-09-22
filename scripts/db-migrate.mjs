import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import postgres from 'postgres'

const databaseUrl = process.env.SUPABASE_DB_URL
if (!databaseUrl) {
  throw new Error('SUPABASE_DB_URL is required for the isolated migration job.')
}

const migrationsUrl = new URL('../supabase/migrations/', import.meta.url)
const fileNames = (await readdir(migrationsUrl))
  .filter(name => /^\d{14}_[a-z0-9_]+\.sql$/.test(name))
  .sort()

const versions = fileNames.map(name => name.slice(0, 14))
if (new Set(versions).size !== versions.length) {
  throw new Error('Migration versions must be unique.')
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 2,
  prepare: false
})

let lockAcquired = false

try {
  await sql`select pg_advisory_lock(hashtext('unfogy_starter_migrations'))`
  lockAcquired = true
  await sql.unsafe(`
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

  for (const fileName of fileNames) {
    const version = fileName.slice(0, 14)
    const name = fileName.slice(15, -4)
    const migration = await readFile(new URL(fileName, migrationsUrl), 'utf8')
    const checksum = createHash('sha256').update(migration).digest('hex')
    const [applied] = await sql`
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

    await sql.begin(async (transaction) => {
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
    })

    console.log(`Applied ${fileName}`)
  }

  console.log(fileNames.length === 0 ? 'No migrations to apply.' : 'Migration history is current.')
} finally {
  try {
    if (lockAcquired) {
      await sql`select pg_advisory_unlock(hashtext('unfogy_starter_migrations'))`
    }
  } finally {
    await sql.end({ timeout: 2 })
  }
}
