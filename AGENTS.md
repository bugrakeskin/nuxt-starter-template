# AGENTS.md

- Read `docs/development.md` before changing application code.
- Read `docs/theme.md` before changing theme or UI behavior.
- Read `docs/supabase.md` before changing auth, database or migrations.
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
