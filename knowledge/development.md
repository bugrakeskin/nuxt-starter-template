---
type: Architecture
title: Development and repository discovery
description: "Repository ownership, source map and local verification entry points."
generated: { by: agent/codex, at: "2026-10-16T13:51:06Z" }
status: stable
code_refs: [AGENTS.md, package.json, .unfogy/woodpecker/validate.yaml, .unfogy/scripts/verify-contract.mjs, .unfogy/scripts/verify-docs.mjs, scripts/smoke.mjs]
---

# Development rules

## Scope

This repository is an opinionated base for customer web applications. Keep
shared infrastructure here; add business concepts, project layouts and domain
UI only after provisioning creates the customer repository.

Copy `.env.example` to `.env` and set project-specific values for local use.
The starter has no Customer resolver or Customer-specific setup helper.
`NUXT_PUBLIC_APP_NAME` can carry a later Customer short name, but it is only a
display setting. Factory does not generate local .env files; configure local values explicitly.

## Shared SDLC and PR flow

Apply Control concept `contracts/development`, D-471/D-479/D-480, the
[shared repository PR standard](https://github.com/bugrakeskin/unfogy-control/blob/c085ecdfd65d322b92473cabd3be7abe961eb8c0/knowledge/contracts/development.md#shared-repository-pr-flow--d-471).
Resolve the verified Control source and reviewed revision before work; if
unavailable, report the gap. Before the first write, identify the admitted
repository and use one scoped native Git worktree; reuse it for the same work.
Read-only analysis creates none. Use `feature/`, `fix/`, `docs/` or `chore/`,
open a draft PR on the first push, and target `main` after scoped checks,
review and current exact-candidate human approval. Apply the same Git rules
from SDLC and free-form Developer work. Customer code requires selected
`/sdlc CST...|MWO...|T...` context, current approved plan and recorded authorized
Tasks; dependencies/priority govern execution. An unknown repository is not
implicitly Customer work. Direct-main writes/pushes and mandatory integration
branches are excluded. Merge grants no deployment authority. Branch inspection
preview and main-artifact release preview are distinct; required capability,
owner-specific authority and cleanup rules remain in the Control contract.

## Nuxt conventions

- Prefer Nuxt file routing, middleware, runtime config, server routes,
  composables, error handling and auto-imports.
- Keep browser-safe values under `runtimeConfig.public`; keep secrets out of
  public runtime config and client bundles.
- Use `app/error.vue` for page 403, 404 and unexpected failures.
- Return structured 401/403 errors from server APIs; never redirect API calls.
- Keep pages protected by default when authentication is enabled. Add public
  routes only to the explicit Supabase redirect allowlist.

## UI conventions

- Use Nuxt UI components before introducing a custom primitive.
- Use semantic classes such as `text-muted`, `bg-elevated` and `text-primary`.
- Never branch application templates on a theme preset ID.
- Layout may change in a customer project without changing the theme contract.

## Dependency rule

Reuse Nuxt, Vue and platform capabilities first. Pin tool dependencies that
affect automation. Add state, i18n, ORM, validation or form libraries only for
a demonstrated requirement and document the resulting contract.

## Completion

Run contract verification, tests, lint, typecheck and production build. Run
HTTP smoke against the built application. For UI changes, follow the browser
inspection checklist in [design](design.md) when an agent browser is available.

## Native knowledge checks

CI installs the unchanged official OKF v0.6.0 Linux AMD64 release, checks its
SHA-256 and runs native `okf validate "$(pwd)/knowledge" --strict --drift --json`
from this repository root before application checks. No custom KB validator or
CLI extension is installed. For local use, verify the official platform binary,
Git identity and explicit absolute bundle first; search with --scope project.
Native validation checks conformance, not semantic freshness, tenant authority
or hosted execution. Review source claims and shared references in the PR.

Contract verification also checks active docs and KB Markdown local links and
standard markdownlint table rules MD056/MD058. Historical evidence remains in typed local concepts and is included in link checks. This checks document structure, not OKF semantics or live evidence.


## Testing

The baseline intentionally has no browser E2E or screenshot test package.

- `pnpm test:contract` checks allocation-free project metadata contracts.
- `pnpm contract:verify` checks secret boundaries, immutable delivery tags,
  deploy ordering, build revision metadata, and the bootstrap canary context.
- `pnpm test:unit` checks pure utilities and server policy helpers.
- `pnpm test:nuxt` checks behavior that requires an initialized Nuxt context.
- `pnpm test` runs contract, unit and Nuxt tests; `contract:verify` and smoke run separately.
- `pnpm smoke` checks a running production build over HTTP.

Set `EXPECTED_BUILD_REVISION` when smoke-testing a container to require
`/api/health` to report that exact image build revision.

Tests use synthetic configuration only. Do not put live keys or customer data
in fixtures, snapshots or CI variables. Database projects add pgTAP tests for
RLS, policies and functions alongside their schemas.


## Knowledge discovery

Read `knowledge/index.md` for the source map and [development](development.md) for local development rules. Read this bundle index before selecting concepts. Use an explicit absolute bundle for okf search/show; validate the explicit absolute <verified-root>/knowledge bundle with --strict --drift; search with --scope project. Shared authority belongs to Control concept contracts/repository-knowledge and contracts/development (D-471/D-479/D-480), at the adopted standard_revision. Resolve a verified Control checkout or reviewed standard package; do not silently use another repository KB.

Source observations describe code, not runtime success. Missing tools, KB, identity or sources stop the affected claim. Keep documentation changes with their implementation PR.



## Migration provenance

Human approved root docs consolidation and removal on 2026-10-10. Original source: docs/development.md and docs/testing.md at d5bec342f07c533bd245c60ad54a562200ff3b9e. Preserved intent and source observations do not establish fresh runtime success. Shared governance remains in the separately admitted Control repository.

## Validation branch coverage

`.unfogy/woodpecker/validate.yaml` checks pull requests and push/manual events for
`main`, `feature/*`, `fix/*`, `docs/*`, `chore/*` and historical `task/*`/`uf/*`.
The existing contract verifier enforces these filters and secret-free validation.
Image publication remains main-only; this source configuration does not prove
CI registration, hosted success or branch preview deployment.


## Repository release versioning

Apply Control concept `contracts/development`, D-494 (policy revision is pinned in `.unfogy/versioning.json`). The sole release source is `package.json`. The compatibility surface is generic runtime/configuration, health, migration command and starter integration interfaces. Use independent SemVer; declare impact, summary and actual application runtime impact in `.unfogy/releases/<version>.json`. Run `pnpm version:sync` and then `node .unfogy/scripts/verify-version.mjs --base=<verified-main-SHA>` before PR completion. Existing notes are immutable; semantic impact needs review.

The sync derives CLI/Docker metadata and, for runtime releases, `.unfogy/runtime-release.json`. Native main push publication selects only that marker; CI rejects missing/stale or unnecessary markers against the actual application delta. Metadata-only package/Docker version changes and CLI/docs-only releases do not request an app image. Local/CI source checks establish no hosted PASS, tag publication, trusted receipt, merge or deployment authority. Operator-requested exact-main builds may run for initial installation or metadata-only changes; publication still requires existing authority.

Nuxt health/UI use the bundled package version; legacy `NUXT_PUBLIC_APP_VERSION` cannot override it. Deployment channel is separate. Static Website channel is build provenance (`main`/`development`); target preview/production remains in deployment evidence. Promotion retains the accepted version/commit/digest and migration identity.

## Factory provision template

Factory reads `.unfogy/provision.yaml` as the sole installation input and `.unfogy/repository.yaml` as explicit owner/identity. The generic template intentionally contains unresolved __PLACEHOLDERS__; rebind all of them in both files to the reviewed project after cloning. No Customer allocation or automatic initializer is implemented. The former Control config.yaml template is removed; do not recreate it as a second desired-state source.

One Coolify project contains preview/production with separate App/DB identities and domains. The template declares remote Supabase, private Studio, Coolify SMTP references and anon-only browser bindings; add the project's reviewed migrations before first provision. Factory CLI owns reviewed migration application, Harbor scan gate and Coolify publication. CI performs tests/build/image push only, under `.unfogy/woodpecker/`, with only project-scoped Harbor push inputs. Operator-requested manual builds support first installation and exact-main artifacts without requiring a new runtime-release marker; source/version verification still runs in validate. Existing provider workflow paths and legacy secrets need separate inspected migration; these source edits do not alter providers.

`.unfogy/contract.yaml` remains build/runtime compatibility metadata for local checks, not a provision input. A generated checkout must preserve/review required tooling explicitly. This change provides source/template compatibility, not hosted acceptance.
