# Unfogy Nuxt Starter

Nuxt 4 and Nuxt UI foundation for Unfogy customer project applications. The
verified scope includes native local development, Nuxt UI theme presets,
Supabase SSR authentication, user-scoped server guards, fail-closed readiness,
remote migration execution, metadata contracts and production checks.

## Customer MWO application contract

The MWO owns its repository and corresponding Coolify Project. All Tasks for
the same MWO use this repository and environment set; a different application
requires a different MWO and repository. Approved provisioning writes the
non-secret application and environment metadata under [`.unfogy/`](.unfogy/).

The Control Plane keeps customer/MWO provisioning and deployment intent under
`customers/<CST...>/<MWO...>/.unfogy/`; the local application checkout is
`workspaces/customers/<CST...>/<MWO...>/`. The starter contains no customer
identity or allocated MWO record.

The Nuxt application intentionally remains at repository root (`app/`,
`server/`, `nuxt.config.ts`). The current Coolify recipe has no application
base-directory contract, so moving it to `apps/web` would require a new
starter/recipe compatibility revision.

## Development

Use Node.js 22 and the pinned pnpm version on the local development machine.
Run from this repository root:

```bash
pnpm install
pnpm dev
```

Nuxt prints the local preview URL. Dependencies and generated output stay in
the local checkout and remain excluded from Git.

## Runtime configuration

Copy `.env.example` to `.env` only when a local override is needed. `.env` is
ignored by Git and Coolify supplies deployment values through its own encrypted
environment configuration.

| Variable | Exposure | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_APP_NAME` | Browser and server | `Unfogy Starter` |
| `NUXT_PUBLIC_SUPABASE_URL` | Browser and server | `https://preview-api.unfogy.com` |
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
  "revision": "<image build commit>",
  "checks": {
    "supabaseConfiguration": true
  }
}
```

Missing required Supabase configuration returns HTTP `503` with only the missing
variable names. Credentials are never returned. Local and deployment readiness
checks use this endpoint. Container builds pass the immutable Git commit through
`BUILD_REVISION`; the same value is baked into this response and the OCI
`org.opencontainers.image.revision` label.

## Delivery contract

Woodpecker validates pull requests and `feature/*` pushes without Harbor or
Coolify secrets. A push to `preview` waits for validation, publishes one image
manifest under both `${CI_COMMIT_SHA}` and `preview`, asks the private Coolify
deploy endpoint to re-pull that tag, then waits for `/api/health` to report the
same commit. A push to `main` publishes only the immutable commit tag and does
not deploy production.

The `preview` and `main` pipelines rely on Harbor project auto-scan, then poll
the SHA artifact through Harbor API v2. They fail closed on timeout, scan
failure, malformed results, or any Critical vulnerability. Preview deployment
starts only after this gate passes.

Bootstrap attaches pipeline steps to the isolated `unfogy-ci-egress` network;
workflow steps and the nested Buildx daemon resolve private service names via
the CI bridge gateway DNS endpoint `10.77.30.1`. The repository keeps trusted network/security enabled for these
exact workflows, while trusted host volumes remain disabled.

The `coolify_preview_deploy_token` Woodpecker secret is repository-scoped and
contains the bootstrap-managed shared Coolify token with deploy-only ability.
`coolify_preview_resource_uuid` and `preview_health_url` are also repository-scoped;
the latter is the full HTTPS `/api/health` URL. The deploy endpoint is fixed at
`https://platform.unfogy.com/api/v1/deploy` and the workflow appends only the
repository resource UUID. The manual `bootstrap-canary` workflow builds only
`deploy/canary`, publishes `registry.unfogy.com/unfogy-canary/runtime` under the
immutable commit tag, and uses the separate `unfogy-canary/cache-canary` cache.
Application pushes use `harbor_app_push_username` and
`harbor_app_push_password`; the canary uses the separately scoped
`harbor_canary_push_username` and `harbor_canary_push_password` secrets.

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

Run production verification locally with the pinned package manager:

```bash
pnpm build
```

Coolify deployment remains a separate controlled workflow.
