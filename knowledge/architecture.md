---
type: Architecture
title: Nuxt starter architecture
description: "Describes local building blocks, runtime flow, deployment boundaries and risks."
generated: { by: agent/codex, at: "2026-10-10T10:54:39Z" }
status: stable
code_refs: [nuxt.config.ts, knowledge/index.md, Dockerfile, .unfogy/contract.yaml, app/, layers/base/, server/, supabase/, scripts/]
sources:
  - resource: ../knowledge/index.md
    id: source-map
    title: Owning repository source map
---

# Architecture

app/ contains generic pages and assets; layers/base provides shared layouts/theme primitives. Nuxt server routing exposes health behavior. supabase/ and scripts/ carry schema/migration and runtime delivery foundations. nuxt.config.ts registers the base layer and framework modules.

Local development serves the generic application; build produces the runtime and migration artifact. Delivery declarations identify Woodpecker, immutable Harbor images and Coolify runtime roles. These declarations do not establish a deployed customer service or authorize provisioning.

After an admitted clone, bind project identity and review these generic claims before adding domain modules. Read [foundation](foundation.md), [initialization](initialization.md), [system](contracts/system.md) and [development](development.md).

Risks: stale schema/client contracts, exposed secrets and unsupported runtime claims. Review source and isolated checks; record dated evidence in typed evidence/ concepts.


## Historical evidence

[Theme measurements](evidence/theme-baseline.md) are dated inherited observations.

## Source map

| Path | Responsibility |
| --- | --- |
| `app/` | Generic pages, fixtures and browser code |
| `layers/base/` | Native shared layouts |
| `server/` | Health and server helpers |
| `supabase/` | Declarative schemas and migration history |
| `scripts/` | Runtime and migration tools |
| `.unfogy/` | Contract verification and tests |
