---
type: Architecture
title: Bind knowledge after cloning
description: Preserve starter provenance and replace identity after authorized admission.
generated: { by: agent/codex, at: "2026-10-17T18:47:29Z" }
status: stable
code_refs: [AGENTS.md, knowledge/development.md, .unfogy/contract.yaml]
---

## Automated technical installation — 2026-10-17

Factory may bind an approved exact starter release after canonical Customer/
Application admission and operator installation authorization. It binds both
installation manifests, package identity/version, Docker version, publication
marker, initial release notes and KB index. A provenance-only Git parent records
the starter source. The next commit starts an independent application at 0.1.0;
it is not a version decrease on the starter release line. Inherited starter
release history remains provenance.

Only declared YAML scalar substitutions and deterministic release metadata may
differ from the approved source. The installer checks the complete source tree
and initial migration checksums. CI contract tests accept the untouched generic
manifest or a valid bound identity. The generic starter keeps all placeholders.

Technical installation does not certify completed product/design discovery or
authorize Customer Task execution. Those project facts remain open until the
separate approved project workflow reviews them. This bounded technical stage
supersedes manual initialization steps only for the fields above. No Customer
identity or live runtime evidence is inserted into this generic bundle.

Precondition: the new repository has an authorized allocation/admission and an exact verified Git root/origin. This guide does not allocate a Customer or select an MWO.

1. Resolve a reviewed Control standard/skill package at standard_revision recorded in this index. Standalone clones must have that package or an explicitly verified Control location; relative workspace paths alone are insufficient.
2. Preserve this starter origin and source commit as provenance in the project documentation. Replace repository_id, remote and scope in the KB index with the verified project binding. Keep the reviewed standard version/revision; explicitly review an upgrade before changing either.
3. Review starter-specific claims and add source-backed project concepts through okf create/update. Preserve existing AGENTS and knowledge; do not run broad bootstrap over them.
4. Link root README to the local KB index and architecture source map. Validate the explicit root knowledge bundle with --strict --drift; search with --scope project. Check source paths and shared references separately.

Stop acceptance on unresolved identity, missing standard/skill, remaining starter-only claims, invalid sources or failing gates. This is an initialization procedure, not an automatic MWO dispatcher.

Related: [development](development.md).


The root bundle uses the unmodified official OKF v0.6.0 CLI and upstream skill; apply local admission/project-scope rules to examples. Review [overview](overview.md), [technology](technology.md), [architecture](architecture.md) and [system](contracts/system.md). Rebind every minimum-profile document after cloning; retain generic framework facts only where verified in the resulting project.

## Product and visual design binding

Review [product](product.md) and [design](design.md) during clone initialization.
Replace generic starter users/purpose and theme observations with approved project
facts and verified source mappings. Record unknown facts explicitly; never fabricate
users, brand, implemented capability or runtime evidence. Keep the same local concept
IDs and native OKF metadata. Add useful project screen/feature concepts only when
needed, without importing App candidate or meeting rules. Product/design live only in these local OKF concepts. Do not recreate root
PRODUCT.md or DESIGN.md during clone initialization or design-tool setup.
Update README/knowledge/AGENTS discovery with the local owners. Validate both native
conformance and document/source links before accepting initialization.


## Independent application release line

After actual Customer/MWO allocation and repository admission, retain starter repository/version/exact commit and the reviewed D-494 policy revision as provenance. Bind package/index identity and compatibility surface to the new owner, initialize package.json to 0.1.0, and add that initial release's notes (`impact: initial`, summary and runtime impact). Retain inherited starter notes as provenance, not new Customer releases. Run version:sync and version:verify before the first admitted baseline commit; compare subsequent PRs against that baseline/current main. Test standalone discovery and reject unresolved identity, metadata mismatch or missing release notes. This procedure does not implement an allocator, automatic template upgrade or Customer executor.

## Bind Factory installation metadata

After authorized project creation, fill every __PLACEHOLDER__ in `.unfogy/repository.yaml` and `.unfogy/provision.yaml`: explicit repository owner, ID/remote, maintainer/purpose, Coolify project, registry image and each environment's App/API/private Studio domains. Do not use the starter's Git remote or infer a Customer owner from a GitHub account. The untouched template must fail Factory identity/manifest validation before provider mutation. The one project owns preview/production; only environment-specific names/domains/variables vary. Add and review real SQL migrations; this template has no ready deployment/migration chain. The old config.yaml generation contract does not apply to Factory. Rebind KB identity and the copied build/CI checks as part of the same admission. See [development](development.md#factory-provision-template).

The manifest and CI both use the Unfogy-managed registry host registry.unfogy.com; only the repository image path is rebound. A different registry/platform requires an explicit reviewed update to both provision and CI definitions, not only manifest substitution.
