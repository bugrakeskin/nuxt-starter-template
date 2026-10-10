---
type: Architecture
title: Nuxt starter purpose and scope
description: "Defines repository users, purpose, owned features and exclusions."
generated: { by: agent/codex, at: "2026-10-10T07:50:50Z" }
status: stable
code_refs: ["README.md", "docs/README.md", "AGENTS.md"]
sources:
  - resource: ../docs/README.md
    id: source-map
    title: Owning repository source map
---

# Purpose and scope

This repository owns generic Nuxt application foundation, theme/auth conventions and delivery contract. Developers clone this baseline into an authorized project and add its business requirements there.

Customer identity, business layouts, Jitsi meetings and Unfogy candidate features are not baseline features. Shared governance belongs to verified Control; local implementation facts belong here.

Quality priorities: protected secrets, server authorization, source-backed contracts and reproducible checks. Preserve generic framework primitives and require identity rebinding after cloning.

Read [technology](technology.md), [architecture](architecture.md), [development](development.md) and [system contract](contracts/system.md).
