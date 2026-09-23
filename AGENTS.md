# AGENTS.md

- Read `docs/development.md` before changing application code.
- Read `docs/theme.md` before changing theme or UI behavior.
- Read `docs/supabase.md` before changing auth, database or migrations.
- When this repository is used inside the control-plane checkout, for Nuxt framework work read and apply `../../.agents/skills/nuxt/SKILL.md` and only the relevant referenced file before editing; when standalone, use the equivalent installed `nuxt` skill from the upstream source.
- When this repository is used inside the control-plane checkout, for Nuxt UI work read and apply `../../.agents/skills/nuxt-ui/SKILL.md` and the relevant `references/` file before editing; when standalone, use the equivalent installed `nuxt-ui` skill from the upstream source.
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
