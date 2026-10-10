# AGENTS.md

- Read and apply the shared SDLC/PR flow in `docs/development.md` before writing any file.

- Read `docs/development.md` before changing application code.
- Read `docs/theme.md` before changing theme or UI behavior.
- Read `docs/supabase.md` before changing auth, database or migrations.
- When this repository is used inside the control-plane checkout, for Nuxt framework work read and apply `../../../.agents/skills/nuxt/SKILL.md` and only the relevant referenced file before editing; when standalone, use the equivalent installed `nuxt` skill from the upstream source.
- When this repository is used inside the control-plane checkout, for Nuxt UI work read and apply `../../../.agents/skills/nuxt-ui/SKILL.md` and the relevant `references/` file before editing; when standalone, use the equivalent installed `nuxt-ui` skill from the upstream source.
- Treat the local Nuxt UI skill as the v4 authority for component selection, semantic tokens, theming, forms, overlays and layout patterns; verify the installed `@nuxt/ui` version before using v3 guidance.
- Keep Nuxt framework decisions in the Nuxt skill and Nuxt UI component decisions in the Nuxt UI skill; do not duplicate or override their upstream rules in application files.
- Use Nuxt native directories, routing, runtime config and server APIs.
- Build UI with Nuxt UI components and semantic tokens.
- Keep project-specific domain code and layout out of the starter baseline.
- Never expose secret keys or database URLs to browser code.
- Use user-scoped Supabase clients and RLS by default.
- Add privileged database access only for a reviewed project requirement.
- Update declarative schemas before generating and reviewing migrations.
- Run contract, unit, Nuxt, lint, typecheck, build and smoke checks as applicable.
- Do not add browser E2E or screenshot tests to the baseline.
- Inspect theme changes with the built-in agent browser when available.

- Report missing identity, KB or reviewed Control skills; never substitute another repository or tenant bundle.

## Repository knowledge maintenance

- Verify admitted Git root/origin and task binding; read knowledge/index.md before concepts and resolve its pinned Control standard.
- Read overview for scope, technology for stack sources and architecture for affected boundaries; select only task-relevant concepts.
- Use unmodified official OKF v0.6.0; never patch, fork, wrap or add custom CLI flags.
- Pass the verified absolute knowledge bundle to every CLI command; search with --scope project, including upstream skill examples, then read matches with show.
- Keep Unfogy admission and approval rules here and in verified Control; use the unchanged upstream OKF skill for tool usage.
- Read contracts/system.md and the linked owning contract before changing interfaces, data, authorization or extensions.
- Update source-backed concepts and affected docs in the same task branch/PR as their source change; preserve existing IDs and provenance.
- Record local rationale in decisions.md and terms in glossary.md; let native OKF create/update maintain log.md.
- Distinguish approved target, source observation and dated runtime evidence; do not infer runtime success from documentation.
- Validate the explicit bundle with --strict --drift --json; inspect errors, warnings, links, orphans and gates, then verify source paths separately.
- Cite repository ID, concept ID and absolute source path; read shared Control rules through a separately verified binding.
- After an authorized clone, apply knowledge/initialization.md; replace template identity and review every minimum-profile document against the resulting project.
- Keep this KB generic; never copy Unfogy App candidate, meeting or live-provider facts into the starter.
