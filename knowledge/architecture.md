---
type: Architecture
title: Nuxt starter architecture
description: "Describes local building blocks, runtime flow, deployment boundaries and risks."
generated: { by: agent/codex, at: "2026-10-10T08:46:43Z" }
status: stable
code_refs: ["nuxt.config.ts", "docs/README.md", "Dockerfile", ".unfogy/contract.yaml", "app/", "layers/base/", "server/", "supabase/", "scripts/"]
sources:
  - resource: ../docs/README.md
    id: source-map
    title: Owning repository source map
---

# Architecture

app/ contains generic pages and assets; layers/base provides shared layouts/theme primitives. Nuxt server routing exposes health behavior. supabase/ and scripts/ carry schema/migration and runtime delivery foundations. nuxt.config.ts registers the base layer and framework modules.

Local development serves the generic application; build produces the runtime and migration artifact. Delivery declarations identify Woodpecker, immutable Harbor images and Coolify runtime roles. These declarations do not establish a deployed customer service or authorize provisioning.

After an admitted clone, bind project identity and review these generic claims before adding domain modules. Read [foundation](foundation.md), [initialization](initialization.md), [system contract](contracts/system.md) and [development](development.md).

Risks: stale schema/client contracts, exposed secrets and unsupported runtime claims. Review source and isolated checks; record live evidence separately under docs/.
