---
type: Contract
title: Nuxt starter system contracts
description: "Routes APIs, data, authorization and extension boundaries to their source owners."
generated: { by: agent/codex, at: "2026-10-21T16:09:59Z" }
status: stable
code_refs: [knowledge/contracts/supabase.md, knowledge/design.md, .unfogy/contract.yaml, nuxt.config.ts, layers/base/, server/api/health.get.ts, scripts/db-migrate.mjs, scripts/runtime-entrypoint.mjs, supabase/]
sources:
  - resource: ../../knowledge/index.md
    id: source-map
    title: Owning repository source map
---

# System contract map

| Interface | Source owner |
| --- | --- |
| Framework layer and runtime config | nuxt.config.ts, layers/base/ |
| Theme presets and semantic tokens | [design](../design.md) (Theme) |
| Auth, schema/migrations and user-scoped access | [supabase](supabase.md) (Supabase) |
| Health, build, migration and immutable delivery | .unfogy/contract.yaml |
| Clone identity and knowledge rebinding | [initialization](../initialization.md) |

Keep domain contracts out of the generic baseline. A generated project must inspect its actual copied files: template contract declarations are not Customer authority. Verify which files the authorized generation path actually preserves; this KB does not prove a generated checkout. Never grant a tenant or select an MWO from template metadata.

Shared PR/SDLC policy belongs to Control contracts/development at the adopted revision. Read [architecture](../architecture.md) and [development](../development.md) before interface changes.


Local detailed contract owners: [Supabase](supabase.md).

## Factory installation boundary

Repository identity belongs to the repository metadata in `.unfogy/application.yaml`; deployment targets belong exclusively to `.unfogy/application.yaml` (one project, preview/production). `.unfogy/woodpecker/` owns build-only CI. `.unfogy/contract.yaml` is only build/runtime compatibility metadata. Factory operator CLI owns migration review/application, scan validation and publication; none of these run in CI. The generic manifests require explicit project rebinding through [initialization](../initialization.md#bind-factory-installation-metadata).

Current config boundary: one application.yaml replaces both old declarations. Fill all template placeholders before execution. Customer execution remains unavailable; this template does not grant admission or publication authority.
