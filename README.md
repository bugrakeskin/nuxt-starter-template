# Unfogy Nuxt Starter

Nuxt 4 and Nuxt UI foundation for Unfogy customer project applications. The
verified scope includes native local development, Nuxt UI theme presets,
Supabase SSR authentication, user-scoped server guards, fail-closed readiness,
remote migration execution, metadata contracts and production checks.

## Customer Project application contract

The Project owns its repository and corresponding Coolify Project. MWO and
Task records bound to the same Project use this repository and environment
set; a different application requires a different Project repository. Approved
provisioning writes the non-secret application and environment metadata under
[`.unfogy/`](.unfogy/).

The Control Plane tracks the customer container at
`workspaces/customers/<CST...>/customer.yaml`; the local Project application
checkout is `workspaces/customers/<CST...>/projects/<project_id>/`. The single
declarative provisioning and deployment input is
`<project_id>/.unfogy/config.yaml`. The starter contains no customer identity
or allocated Project/MWO record.

The generated customer `.unfogy/` directory contains only:

```text
.unfogy/
└── config.yaml    # provisioning and deployment desired state
```

The starter's source-only contract remains in the template repository and is
not copied into customer repositories:

```text
.unfogy/
├── config.yaml
├── contract.yaml
├── templates/
├── scripts/
└── tests/
```

`config.yaml` is the only Project provisioning input. `contract.yaml` contains
the starter's static compatibility, toolchain and delivery authority rules; it
is not copied into customer application repositories and does not contain
customer identity, secrets, provider UUIDs or live state.

Starter-only automation helpers live under `.unfogy/scripts/`:
`verify-contract.mjs` validates the versioned starter contract and
`verify-harbor-scan.mjs` enforces the Harbor scan gate. Application runtime
helpers remain under root `scripts/`: migration and container entrypoint code
are part of the deployed application image. The showcase `smoke.mjs` also
remains at root because it asserts starter routes.

The tests for these starter contracts live under `.unfogy/tests/`. Nuxt and
application behavior tests remain under root `test/`.

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

Copy `.env.example` to `.env` and set values for the project before local use.
The starter does not resolve Customer identity, configure a database, or
provide a customer-specific setup command. `NUXT_PUBLIC_APP_NAME` is the
generic display-name setting and may be set to a Customer short name by a
future project initializer; it does not identify or authorize a database.
`.env` is ignored by Git and Coolify supplies deployment values through its own
encrypted environment configuration. The implemented preview setup helper is
maintained in the separate first-party `unfogy-app` CLI and only targets that
application.

| Variable | Exposure | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_APP_NAME` | Browser and server | `Unfogy Starter` |
| `NUXT_PUBLIC_APP_VERSION` | Browser and server | `0.1.0` |
| `NUXT_PUBLIC_RELEASE_CHANNEL` | Browser and server | `development` |
| `NUXT_PUBLIC_SUPABASE_URL` | Browser and server | UI-only placeholder; set the project API URL |
| `NUXT_PUBLIC_SUPABASE_KEY` | Browser and server | UI-only placeholder; set the project's publishable key |

Only values declared under Nuxt `runtimeConfig.public` may be exposed to the
browser. Secret configuration must never use the `NUXT_PUBLIC_` prefix.

The footer displays the release tag as `v0.1.2-preview.1` for preview and
`v0.1.2` for production. The stable SemVer version remains `0.1.2`; preview
iterations are supplied through `NUXT_PUBLIC_RELEASE_CHANNEL=preview.1`, while
production uses `NUXT_PUBLIC_RELEASE_CHANNEL=production`.

`SUPABASE_DB_URL` is empty in the example and is private configuration for
approved local tooling or an isolated migration job. `pnpm db:migrate` loads
an optional local `.env` via Node 22; injected environment values take precedence.
It applies SQL only when explicitly invoked against an authorized exact target.
Never expose this URL in public runtime config or client bundles. The future
Customer setup helper must resolve that target before preparing its local URL.

## Health contract

`GET /api/health` returns a non-cached response. A configured environment
returns:

```json
{
  "status": "ok",
  "service": "Unfogy Starter",
  "contractVersion": 1,
  "version": "0.1.0",
  "channel": "preview",
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

Woodpecker validates pull requests plus `task/*` and `feature/*` pushes without
secrets. A `main` push validates, publishes one image under the immutable
`${CI_COMMIT_SHA}` tag and waits for the Harbor scan gate. Provider branch
protection is optional defense-in-depth; exact pipeline, scan, digest and
Control Plane promotion gates remain mandatory. The pipeline does not run
migrations or deploy any environment. The same main workflow may be started
manually for the initial template commit after repository activation.

The publish pipeline relies on Harbor project auto-scan, then polls
the SHA artifact through Harbor API v2. They fail closed on timeout, scan
failure, malformed results, or any Critical vulnerability. Control Plane may
promote only a digest that passed this gate.

Bootstrap attaches pipeline steps to the isolated `unfogy-ci-egress` network;
workflow steps and the nested Buildx daemon resolve private service names via
the CI bridge gateway DNS endpoint `10.77.30.1`. The repository keeps trusted network/security enabled for these
exact workflows, while trusted host volumes remain disabled.
These values are the materialized form of the platform-owned
`unfogy-buildx-harbor-v1` delivery profile; application repositories must not
invent another runner profile.

The only repository secrets used by Woodpecker are the project-scoped Harbor
push/scan robot credentials, restricted to the pinned Buildx and scan images.
Coolify tokens, resource UUIDs, database URLs and production secrets never enter
Woodpecker. Preview and production promotion, migration and exact-revision
health verification belong to the Control Plane Deployment Worker.

The same immutable application image supports `web` and domainless
`migration-runner` roles through `UNFOGY_PROCESS_ROLE`. The runner keeps the
target network attachment while Control Plane executes
`node .output/migrate.mjs`; it receives the database URL only in its runtime
secret store. Customer images never contain a deployment worker or provider
credentials.

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

The canonical build path is Woodpecker validation/build, Harbor immutable image
publication and Coolify Docker Image runtime deployment. Coolify does not clone
the repository or run a Nixpacks source build; `nixpacks.toml` is therefore not
part of the starter delivery contract.
