# Migrations

Commit reviewed forward migrations as `<UTC timestamp>_<name>.sql`. Applied
migrations are immutable. `pnpm db:migrate` reads `SUPABASE_DB_URL` from the
ephemeral migration job environment, serializes execution with an advisory lock,
checks SHA-256 history, and never places the database URL in process arguments.

Applied versions are recorded in Supabase CLI's canonical
`supabase_migrations.schema_migrations` ledger. Checksums are stored separately
in `unfogy_migrations.migration_checksums`; a ledger row without its reviewed
checksum blocks instead of being trusted silently.

The runner wraps each migration in a transaction. Operations that cannot run in
a transaction require a separately reviewed operational plan.
