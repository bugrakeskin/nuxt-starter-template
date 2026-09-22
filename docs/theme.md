# Theme Presets

## Purpose

Define the starter's theme contract as the smallest useful version of the Nuxt
UI Theme Studio method. One semantic Nuxt UI interface supports several presets
without copying or branching the application UI.

## Upstream reference

- Repository: `https://github.com/nuxt/ui`
- Branch: `v4`
- Commit inspected: `8b7f32888fbb13a751ad5069cc54513b1f7c05cc`
- Primary areas: `docs/app/composables/useTheme.ts`,
  `docs/app/composables/useThemeStudio.ts`, and
  `docs/app/utils/theme/engine/`

Nuxt UI is MIT licensed. See `THIRD_PARTY_NOTICES.md`.

## Implemented slice

The `/theme` route demonstrates three local presets. A preset changes:

- Nuxt UI semantic primary and neutral aliases through reactive `appConfig`;
- `--ui-radius` and a small number of semantic CSS tokens;
- selected Nuxt UI component default variants.

The page itself uses Nuxt UI components and semantic classes. It contains no
preset-specific template branch.

The active preset is initialized globally in `app.vue` and applies throughout
the current application session. It is intentionally not persisted. The
default preset therefore renders identically during SSR and hydration. Color
mode remains a separate user preference.

## What the upstream method actually adds

Nuxt UI already supplies the useful theme contract. A small preset only needs
to coordinate three extension points:

1. semantic color aliases in reactive `appConfig.ui.colors`;
2. CSS custom properties such as `--ui-radius` and semantic surface tokens;
3. global `defaultVariants` for selected Nuxt UI components.

Application templates then keep using normal Nuxt UI components and semantic
classes. They must not branch on preset IDs or encode preset-specific raw
colors. Layout is outside this contract and may vary by project.

The local code reimplements this narrow method after inspecting Nuxt UI; it
does not copy the complete Theme Studio source. This keeps the implementation easy
to replace if the Nuxt UI API changes.

## Theme scope

Keep presets as typed, reviewed configuration and start with a small supported
set. This gives customer choice with little additional runtime machinery. Do
not adopt the complete Theme Studio until a real requirement exists for
arbitrary palettes, fonts, icons, sharing or export.

If an authorized customer account must publish a theme for every user, treat
that as a later server-owned capability: validate the preset, persist one
canonical revision, resolve it during SSR, and invalidate caches on publish.
Client-only storage is not sufficient for that requirement.

## Added load

The minimal preset path adds:

- one small data table;
- one composable that applies aliases, tokens, radius and component defaults;
- one reactive `<style>` entry;
- one showcase page;
- no runtime dependency and no package dependency.

This is materially smaller than porting Theme Studio.

Measured against the starter's `main` branch with the same lockfile:

| Measure | Baseline | Theme | Difference |
| --- | ---: | ---: | ---: |
| Production output | 5,689,610 B | 6,186,156 B | +496,546 B |
| Public output | 866,379 B | 982,738 B | +116,359 B |
| Client JS + CSS, raw | 733,715 B | 848,318 B | +114,603 B |
| Client JS + CSS, gzip | 200,197 B | 232,713 B | +32,516 B |

The measured client difference includes the whole showcase route and its Nuxt
UI components/icons; it is not the cost of the preset engine alone. The preset
data and composable are 162 lines and 4,120 source bytes. The showcase page is
248 lines and 7,530 source bytes. No dependency or lockfile changed.

## Verification

- `pnpm typecheck`: passed
- `pnpm lint`: passed
- `pnpm build`: passed
- production HTTP smoke: `/`, `/theme`, and `/api/health` returned `200`
- SSR smoke: default `Unfogy` label and `--ui-radius: 0.375rem` were present
  in the `/theme` HTML
- interactive browser inspection: pending because no agent browser is exposed
  in the current execution environment

## Deferred load

The upstream implementation shows why full Theme Studio parity is a separate
product capability:

- persisted client choice needs pre-paint restore to prevent theme flash;
- SSR theme links need server/client coordination;
- custom palettes need generation, sanitization and export;
- font switching needs asset/loading policy;
- icon-pack switching needs a compiled catalog and hydration-safe remounting;
- component defaults need merge/reset logic across generated Nuxt UI themes;
- history, share links, import/export and editor controls add their own state;
- customer-wide publication needs authentication, authorization, storage,
  revisioning and cache invalidation.

Do not add these by copying the docs application. Add one capability only when
a demonstrated customer need justifies it.

## Review checklist

Inspect `/theme` with an agent browser after every theme-affecting change:

1. Switch among all presets without console or hydration errors.
2. Check light, dark and system modes.
3. Check phone, tablet and desktop widths.
4. Check forms, panels, badges, alerts and explicit component variants.
5. Check focus visibility, text contrast, overflow and long labels.
6. Reload and confirm the documented default preset returns without a flash.

If browser inspection is unavailable, report visual verification as pending.
