# Unfogy Nuxt Starter

Nuxt 4 and Nuxt UI foundation for Unfogy customer project applications. The
verified scope includes container-native development, Nuxt UI theme presets,
Supabase SSR authentication, user-scoped server guards, fail-closed readiness,
remote migration execution, metadata contracts and production checks.

## Customer project contract

The permanent Customer Project owns its repository and corresponding Coolify
Project. Multiple MWO records can deliver changes to that project; an MWO is a
temporary work record. Approved provisioning writes the non-secret project and
environment metadata under [`.unfogy/`](.unfogy/).

The Control Plane allocates a stable opaque `project_id` and keeps project
plans, approvals, resource identity, leases and runtime status outside Git. The
local checkout convention is
`workspaces/customers/<CST...>/projects/<project_id>`. The starter contains no
customer identity or allocated project record.

The Nuxt application intentionally remains at repository root (`app/`,
`server/`, `nuxt.config.ts`). The current Coolify recipe has no application
base-directory contract, so moving it to `apps/web` would require a new
starter/recipe compatibility revision.

## Development

Connect to the Unfogy Control Server with VS Code Remote SSH, then run from this
admitted repository root:

```bash
cd /home/unfogy/unfogy-control-plane/workspaces/nuxt-starter-template
unfogy dev up
```

The command prints a forwarded `http://localhost:<port>` URL. Source is
bind-mounted from this checkout; Node, pnpm, dependencies and generated output
remain isolated in project-scoped container storage.

Running `unfogy dev up` from the Control Plane root is intentionally blocked.
The CLI does not infer a target repository.

Operational commands:

```bash
unfogy dev status
unfogy dev logs
unfogy dev down
unfogy dev rebuild
unfogy dev purge
```

`down` preserves project volumes. `purge` requires the exact repository identity
before removing this project's containers, volumes and local image.

## Runtime configuration

Copy `.env.example` to `.env` only when a local override is needed. `.env` is
ignored by Git and Coolify supplies deployment values through its own encrypted
environment configuration.

| Variable | Exposure | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_APP_NAME` | Browser and server | `Unfogy Starter` |
| `NUXT_PUBLIC_SUPABASE_URL` | Browser and server | `https://staging-api.unfogy.com` |
| `NUXT_PUBLIC_SUPABASE_KEY` | Browser and server | none; required at runtime |

Only values declared under Nuxt `runtimeConfig.public` may be exposed to the
browser. Secret configuration must never use the `NUXT_PUBLIC_` prefix.

`SUPABASE_DB_URL` belongs only to the ephemeral migration job. Start from
`.env.migration.example`; never inject it into the Nuxt application.

## Health contract

`GET /api/health` returns a non-cached response. A configured environment
returns:

```json
{
  "status": "ok",
  "service": "Unfogy Starter",
  "contractVersion": 1,
  "checks": {
    "supabaseConfiguration": true
  }
}
```

Missing required Supabase configuration returns HTTP `503` with only the missing
variable names. Credentials are never returned. The development container and
deployment readiness checks use this endpoint.

## Verification

```bash
pnpm contract:verify
pnpm test
pnpm lint
pnpm typecheck
pnpm build
SMOKE_BASE_URL=http://127.0.0.1:3000 pnpm smoke
```

Browser E2E and screenshot tests are intentionally not baseline dependencies.
Agents inspect theme behavior with the built-in browser when that capability is
available.

Read [`docs/development.md`](docs/development.md),
[`docs/supabase.md`](docs/supabase.md), and [`docs/theme.md`](docs/theme.md)
before extending the starter.

## Production build check

Run production verification with the same container contract, not host pnpm:

```bash
docker compose \
  --env-file .devcontainer/.env \
  --file .devcontainer/compose.yaml \
  run --rm --no-deps app pnpm build
```

Coolify deployment remains a separate controlled workflow.
