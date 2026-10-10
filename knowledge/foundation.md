---
type: Architecture
title: Generic Nuxt foundation
description: Framework and delivery sources without customer domain features.
generated: { by: agent/codex, at: "2026-10-10T06:03:47Z" }
status: stable
code_refs: [docs/development.md, docs/theme.md, nuxt.config.ts, .unfogy/contract.yaml]
---

This repository is a generic application starter. Read `docs/development.md`, `docs/theme.md` and the static `.unfogy/contract.yaml` before extending the foundation. `nuxt.config.ts` extends layers/base. Keep secrets outside public runtime config. Package and contract files own current tool versions and delivery checks. No Customer resolver or Customer-specific setup helper is established here. Do not copy App meeting or candidate features into generic knowledge.

Related: [development](development.md).
