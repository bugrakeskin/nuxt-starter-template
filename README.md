# Unfogy Nuxt Starter

Nuxt 4 and Nuxt UI foundation for Unfogy customer MWO applications. The
verified scope includes native local development, Nuxt UI theme presets,
Supabase SSR authentication, user-scoped server guards, fail-closed readiness,
remote migration execution, metadata contracts and production checks.

## Factory installation template

The application repository owns one Coolify Project with preview and production environments. The single `.unfogy/application.yaml` records repository identity and desired Preview/Production settings. `.unfogy/woodpecker/` contains test/build/image-upload workflows. There is no second deployment config and the former Control `config.yaml` is removed.

The starter stays generic. The application config intentionally contains `__PLACEHOLDERS__`; the unmodified starter cannot pass Factory identity/manifest validation or create provider resources. After creating an authorized project, replace every placeholder in application.yaml, including repository ID/remote, explicit owner (`unfogy` or an admitted `cst-0001`), project ID, application name and each environment's App/API/private Studio domains. The image path uses the same rebound repository ID as CI. The registry host is pinned to the Unfogy-managed platform (`registry.unfogy.com`) in both manifest and workflow; a different platform requires an explicit reviewed change to both definitions. Do not infer a Customer from the GitHub account. Review the actual generated checkout and rebind its KB through [initialization](knowledge/initialization.md).

The template declares remote Supabase with separate preview/production stacks, private Studio, repository migrations and browser-safe URL/anon-key bindings. SMTP inputs are Coolify environment references. Add the project's reviewed migrations before provision; the generic starter does not include a deployed database or ready migration chain. Operator CLI controls reviewed migration application, registry scan verification and publication; CI starts no DB and receives no Coolify/SSH/recovery credentials.

The retained `.unfogy/contract.yaml` is **build/runtime compatibility metadata**, read by local checks. It is not a provision input and contains no resource identity. Existing generation paths must be inspected; these files do not prove an automatic project initializer or a completed deployment.

```text
.unfogy/
├── application.yaml
├── application.schema.json
├── contract.yaml
├── woodpecker/
├── scripts/
└── tests/
```

Runtime migration/container entrypoint helpers remain under root `scripts/` and are included in the built image. The Nuxt application remains at repository root (`app/`, `server/`, `nuxt.config.ts`). No domain/UI code is added by this installation template.

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

Copy `.env.example` to `.env` and set values for the MWO before local use.
The starter does not resolve Customer identity, configure a database, or
provide a customer-specific setup command. `NUXT_PUBLIC_APP_NAME` is the
generic display-name setting and may be set to a Customer short name by a
future MWO initializer; it does not identify or authorize a database.
`.env` is ignored by Git and Coolify supplies deployment values through its own
encrypted environment configuration. Factory does not prepare local `.env` files; configure local values explicitly and keep them out of Git.

| Variable | Exposure | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_APP_NAME` | Browser and server | `Unfogy Starter` |
| `NUXT_PUBLIC_RELEASE_CHANNEL` | Browser and server | `development` |
| `NUXT_PUBLIC_SUPABASE_URL` | Browser and server | UI-only placeholder; set the project API URL |
| `NUXT_PUBLIC_SUPABASE_KEY` | Browser and server | UI-only placeholder; set the project's publishable key |

Only values declared under Nuxt `runtimeConfig.public` may be exposed to the
browser. Secret configuration must never use the `NUXT_PUBLIC_` prefix.

The footer reads the immutable package version and displays the environment separately, for example `v0.2.0 · preview` or `v0.2.0` in production. Legacy `NUXT_PUBLIC_APP_VERSION` values cannot change the bundled version.

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
  "version": "0.2.0",
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

Woodpecker validates pull requests and supported main/branch events without secrets. Main runtime releases and operator-requested manual builds publish the immutable `${CI_COMMIT_SHA}` image through the pinned native Buildx plugin. The manual path supports first provisioning or exact-main builds even when only installation metadata changed; ordinary source/version checks still run in validate. CI does not migrate or deploy.

The operator Factory CLI requires the exact successful build, immutable digest and completed Harbor auto-scan with zero Critical findings before publication. It then deploys through Coolify and verifies health. Production reuses the verified preview image without rebuilding. The local scan verifier remains a diagnostic utility; it no longer runs in CI.

Bootstrap attaches pipeline steps to the isolated `unfogy-ci-egress` network;
workflow steps and the nested Buildx daemon resolve private service names via
the CI bridge gateway DNS endpoint `10.77.30.1`. The repository keeps trusted network/security enabled for these
exact workflows, while trusted host volumes remain disabled.
These values are the materialized form of the platform-owned
`unfogy-buildx-harbor-v1` delivery profile; application repositories must not
invent another runner profile.

The only repository secrets used by Woodpecker are the project-scoped Harbor
push robot credentials, restricted to the pinned Buildx image.
Coolify tokens, resource UUIDs, database URLs and production secrets never enter
Woodpecker. Preview and production promotion, migration and exact-revision
health verification belong to the bounded local CLI executor under current release authority.

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

Read [`knowledge/development.md`](knowledge/development.md),
[`knowledge/contracts/supabase.md`](knowledge/contracts/supabase.md), and [`knowledge/design.md`](knowledge/design.md)
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

## Documentation

Use the [repository KB](knowledge/index.md). Bind the cloned project identity through the initialization concept before project acceptance.

Product and visual design owners: [product](knowledge/product.md) and [design](knowledge/design.md).

## Module source map

The [architecture source map](knowledge/architecture.md) and module READMEs document local implementation paths.

- [supabase/schemas/README.md](supabase/schemas/README.md)
- [supabase/migrations/README.md](supabase/migrations/README.md)


Release source: `package.json`. Run `pnpm version:sync` after editing the release source and `.unfogy/releases/<version>.json`; verify against current main before PR completion. The adopted Control policy revision is pinned in `.unfogy/versioning.json`.

## Application configuration

`.unfogy/application.yaml` is the single application/repository declaration.
`.unfogy/application.schema.json` is its matching Factory schema. The agent asks
the Developer for missing values and fills this file before invoking the CLI.
No secret values, Tasks, approval records or live results belong in this file.
Git owns desired settings; Factory API/DB owns access and approved placement.

Use `unfogy provision --config /absolute/repository/.unfogy/application.yaml --env preview --check`
for local validation. Explicitly approved preparation ends at PREPARED, with no
App migrations, build, start or publication. Woodpecker builds and uploads the
image. Deploy uses the exact successful image and separate SQL/publication
approvals. Production reuses the verified Preview digest without rebuilding.
There are no public CLI `plan` commands.

This config replaces repository.yaml and provision.yaml together. Remove both
retired declarations after merging their identity and environment settings.
Existing release receipts and source hashes need fresh review after migration.
Template placeholders must be filled before execution. Source checks do not
prove hosted installation, authentication or publication.
