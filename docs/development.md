# Development rules

## Scope

This repository is an opinionated base for customer web applications. Keep
shared infrastructure here; add business concepts, project layouts and domain
UI only after provisioning creates the customer repository.

## Nuxt conventions

- Prefer Nuxt file routing, middleware, runtime config, server routes,
  composables, error handling and auto-imports.
- Keep browser-safe values under `runtimeConfig.public`; keep secrets out of
  public runtime config and client bundles.
- Use `app/error.vue` for page 403, 404 and unexpected failures.
- Return structured 401/403 errors from server APIs; never redirect API calls.
- Keep pages protected by default when authentication is enabled. Add public
  routes only to the explicit Supabase redirect allowlist.

## UI conventions

- Use Nuxt UI components before introducing a custom primitive.
- Use semantic classes such as `text-muted`, `bg-elevated` and `text-primary`.
- Never branch application templates on a theme preset ID.
- Layout may change in a customer project without changing the theme contract.

## Dependency rule

Reuse Nuxt, Vue and platform capabilities first. Pin tool dependencies that
affect automation. Add state, i18n, ORM, validation or form libraries only for
a demonstrated requirement and document the resulting contract.

## Completion

Run contract verification, tests, lint, typecheck and production build. Run
HTTP smoke against the built application. For UI changes, follow the browser
inspection checklist in `docs/theme.md` when an agent browser is available.
