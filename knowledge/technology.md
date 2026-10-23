---
type: Architecture
title: Nuxt starter technology sources
description: "Maps framework, tooling and integrations to their actual configuration files."
generated: { by: agent/codex, at: "2026-10-21T16:09:59Z" }
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

## Factory source map

Installation: `.unfogy/application.yaml`. Explicit owner/purpose: the repository metadata in `.unfogy/application.yaml`. Build-only CI: `.unfogy/woodpecker/validate.yaml` and `publish.yaml`. Build/runtime compatibility checks: `.unfogy/contract.yaml`. The historical config.yaml installation input is removed for Factory; runtime Nuxt/Supabase code is unchanged. Generated projects must bind the manifest placeholders, review their actual files and provide migrations; no hosted readiness is claimed.

Current config boundary: one application.yaml replaces both old declarations. Fill all template placeholders before execution. Customer execution remains unavailable; this template does not grant admission or publication authority.
