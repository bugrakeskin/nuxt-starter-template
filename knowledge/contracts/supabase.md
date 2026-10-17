---
type: Contract
title: Supabase auth and migration contract
description: "Defines local authentication, user-scoped access, secret boundaries and reviewed migration procedures."
generated: { by: agent/codex, at: "2026-10-17T18:47:29Z" }
status: stable
code_refs: [nuxt.config.ts, server/utils/auth.ts, supabase/, scripts/db-migrate.mjs]
---

## Guarded automatic initial installation — 2026-10-17

The Factory installer may apply this exact reviewed starter release to a verified
empty target under its protected release approval. Existing DB upgrades retain
separate exact SQL review and approval. The runner rejects CI and requires
UNFOGY_MIGRATION_EXPECTED_HISTORY. For initial installation it repeats the empty
target proof with UNFOGY_MIGRATION_INITIAL_INSTALL=true, then commits all initial
migrations and both ledgers in one transaction. A failed initial batch leaves no
partially installed application schema. Runtime images include scripts/empty-database.sql.
The installation baseline records only reviewed provenance/checksums; it creates
no business tables, users, sample data or privileged browser client. This is local
source and test evidence, not a hosted DB acceptance claim.

# Supabase rules

## Runtime configuration

The Nuxt application uses `@nuxtjs/supabase` with SSR cookies:

- `NUXT_PUBLIC_SUPABASE_URL`: environment API gateway URL;
- `NUXT_PUBLIC_SUPABASE_KEY`: browser-safe publishable key;
- `SUPABASE_DB_URL`: private Postgres URL for approved local tooling or an
  isolated migration job; never public runtime configuration.

The local `.env.example` contains UI-only placeholders, not a usable shared
integration URL or key. Set the project's URL and publishable key explicitly;
application configuration has no fallback. Do not add a secret key or legacy
service-role key to the baseline.

The starter provides no Customer database resolver or Customer setup command.
The first-party preview helper is maintained by the separate `unfogy-app` CLI
and only supports that application. A Customer short name may be supplied as
`NUXT_PUBLIC_APP_NAME`; it does not select database credentials or authority.

## Authentication and authorization

The baseline supports email/password and magic-link sign-in for invited users.
It does not expose self-signup. The current generic showcase is public: nuxt.config.ts sets redirect: false and this source has no application auth middleware. A project clone must implement its reviewed route protection; redirectOptions alone does not activate redirects. Supabase Auth URL configuration must allow the exact
environment callback URL.

Use `requireUser(event)` for authentication and
`requirePermission(event, permission)` for server API authorization. The latter
reads only trusted `app_metadata.permissions`. Never authorize with
user-editable `user_metadata`. Projects may replace the permission lookup with
a server-owned database model.

Business queries use the request's user-scoped server client so RLS remains the
final data boundary. Adding a privileged client requires a reviewed project
need, a narrow adapter and server-only secret handling.

## Schema and migration workflow

1. Change the desired state under `supabase/schemas/`.
2. Generate a migration with the pinned Supabase CLI against the project's
   isolated, resettable development database workflow.
3. Review generated SQL, destructive operations, grants and RLS policies.
4. Commit the declarative state and forward migration together.
5. Replay from zero, run database lint and pgTAP authorization tests, then
   regenerate TypeScript types and reject drift.
6. Apply reviewed migrations only with explicit authorization for the exact DB
   target, through `pnpm db:migrate` using an approved private local connection
   or the same-network ephemeral Coolify job.

Applied migrations are immutable. `pnpm db:migrate` loads an optional local
`.env` using Node 22's `--env-file-if-exists` support, then reads
`SUPABASE_DB_URL` from its environment, serializes execution, verifies
checksums and records history in Supabase CLI's
`supabase_migrations.schema_migrations` ledger, with checksum evidence in
`unfogy_migrations.migration_checksums`. It never puts the connection string in
command arguments. Each migration is transactional; non-transactional DDL needs
a separate reviewed operational plan.

Enable RLS on every Data API table. Explicitly grant only required roles and
test both allowed and denied access. Prefer expand-migrate-contract changes;
there is no automatic database rollback.

## Deferred capabilities

Realtime, Storage, privileged clients, customer-wide theme persistence and
custom SMTP template hosting are not part of the baseline.


## Migration provenance

Human approved root docs consolidation and removal on 2026-10-10. Original source: docs/supabase.md at d5bec342f07c533bd245c60ad54a562200ff3b9e. Preserved intent and source observations do not establish fresh runtime success. Shared governance remains in the separately admitted Control repository.
