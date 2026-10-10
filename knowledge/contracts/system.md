---
type: Contract
title: Nuxt starter system contracts
description: "Routes APIs, data, authorization and extension boundaries to their source owners."
generated: { by: agent/codex, at: "2026-10-10T08:46:43Z" }
status: stable
code_refs: ["docs/supabase.md", "docs/theme.md", ".unfogy/contract.yaml", "nuxt.config.ts", "layers/base/", "server/api/health.get.ts", "scripts/db-migrate.mjs", "scripts/runtime-entrypoint.mjs", "supabase/"]
sources:
  - resource: ../../docs/README.md
    id: source-map
    title: Owning repository source map
---

# System contract map

| Interface | Source owner |
| --- | --- |
| Framework layer and runtime config | nuxt.config.ts, layers/base/ |
| Theme presets and semantic tokens | `docs/theme.md` (Theme) |
| Auth, schema/migrations and user-scoped access | `docs/supabase.md` (Supabase) |
| Health, build, migration and immutable delivery | .unfogy/contract.yaml |
| Clone identity and knowledge rebinding | [Initialization](../initialization.md) |

Keep domain contracts out of the generic baseline. A generated project must inspect its actual copied files: template contract declarations are not Customer authority. Verify which files the authorized generation path actually preserves; this KB does not prove a generated checkout. Never grant a tenant or select an MWO from template metadata.

Shared PR/SDLC policy belongs to Control contracts/development at the adopted revision. Read [architecture](../architecture.md) and [development](../development.md) before interface changes.
