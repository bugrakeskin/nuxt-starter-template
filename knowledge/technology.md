---
type: Architecture
title: Nuxt starter technology sources
description: "Maps framework, tooling and integrations to their actual configuration files."
generated: { by: agent/codex, at: "2026-10-10T10:51:37Z" }
status: stable
code_refs: [package.json, pnpm-lock.yaml, nuxt.config.ts, knowledge/contracts/supabase.md, .unfogy/contract.yaml]
sources:
  - resource: ../knowledge/index.md
    id: source-map
    title: Owning repository source map
---

# Stack and source authority

Nuxt/Vue provide application and server routing. Nuxt UI and Tailwind provide the UI foundation; the Supabase module supplies auth integration. package.json owns dependency ranges, Node and package-manager requirements; pnpm-lock.yaml owns resolved versions. nuxt.config.ts owns registered modules and runtime configuration; do not duplicate version numbers in prose.

The starter extends layers/base and deliberately excludes App business integrations. The static .unfogy/contract.yaml describes starter compatibility and delivery expectations; it is not tenant authorization.

Keep runtime secrets out of public configuration. Read [architecture](architecture.md), [system](contracts/system.md), [development](development.md) (ordinary development reference) and [supabase](contracts/supabase.md) (auth/database reference). Configuration or dependency presence does not prove deployed availability.
