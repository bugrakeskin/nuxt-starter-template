---
type: Architecture
title: Bind knowledge after cloning
description: Preserve starter provenance and replace identity after authorized admission.
generated: { by: agent/codex, at: "2026-10-10T06:03:47Z" }
status: stable
code_refs: [AGENTS.md, docs/development.md, .unfogy/contract.yaml]
---

Precondition: the new repository has an authorized allocation/admission and an exact verified Git root/origin. This guide does not allocate a Customer or select an MWO.

1. Resolve a reviewed Control standard/skill package at standard_revision recorded in this index. Standalone clones must have that package or an explicitly verified Control location; relative workspace paths alone are insufficient.
2. Preserve this starter origin and source commit as provenance in the project documentation. Replace repository_id, remote and scope in the KB index with the verified project binding. Keep standard_version and the reviewed standard_revision.
3. Review starter-specific claims and add source-backed project concepts through okf create/update. Preserve existing AGENTS and knowledge; do not run broad bootstrap over them.
4. Link root README to docs/README and the local KB. Validate the explicit bundle with --repo-root and strict/drift. Check source paths and shared references separately.

Stop acceptance on unresolved identity, missing standard/skill, remaining starter-only claims, invalid sources or failing gates. This is an initialization procedure, not an automatic MWO dispatcher.

Related: [development](development.md).
