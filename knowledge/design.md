---
type: Architecture
title: Nuxt starter design foundation
description: Maps generic Nuxt UI theme sources and defines project design rebinding without copying App identity.
generated: { by: agent/codex, at: "2026-10-10T10:55:54Z" }
status: stable
code_refs: [app/utils/theme-presets.ts, app/composables/useThemePreset.ts, app/assets/css/main.css, knowledge/design.md]
---

# Nuxt starter design foundation

## Scope

This concept owns generic visual foundation and source discovery. [product](product.md)
owns starter purpose; [foundation](foundation.md) owns framework boundaries.
It is a reusable content model for project design knowledge, not the Unfogy App
visual identity or the shared SDLC Design stage.

## Native styling and source authority

Use native Nuxt UI components and semantic classes. Extend appConfig, component
UI props and semantic tokens rather than branch page templates on preset IDs.
[Theme catalog](../app/utils/theme-presets.ts) owns available themes, colors,
fonts, radius and variants. [Preset application](../app/composables/useThemePreset.ts)
owns reactive aliases, cookie restoration and generated CSS.
[CSS](../app/assets/css/main.css) owns compiled palettes. [design](design.md)
owns the engine explanation and inspection checklist; package.json owns versions.

Source observation on 2026-10-10: eleven presets; default Mono, with choice stored
in the SSR-readable unfogy-theme-preset cookie. Color mode is separate. The
getThemePreset fallback resolves unknown IDs to the first catalog entry.
Keep layout independent from this theme contract. Preserve native focus, validation,
loading/disabled behavior and readable responsive controls; inspect long labels,
light/dark/system modes and hydration when changing presentation.

## Binding project design after cloning

Retain this source map only where verified in the admitted clone. Replace starter
observations with the project's reviewed visual direction, semantic source mappings,
brand assets, typography, spacing, component treatment and accessibility requirements.
Record existing intent separately from current source and dated runtime evidence.
Keep screen rules with their own local owner when the project has distinct flows.
Do not create blank concept scaffolds, copy App colors or invent a viewport rule.
See [initialization](initialization.md) for identity and provenance acceptance.

## Provenance and entry points

Human approved this generic design knowledge structure on 2026-10-10. Sources:
existing theme catalog, composable, CSS and knowledge/design.md. Canonical design lives here;
root PRODUCT.md and DESIGN.md were removed with human approval on 2026-10-10. Stop affected claims on unresolved
source or project identity. This document establishes no Customer brand or deployed UI.

## Theme implementation and extension

- Repository: `https://github.com/nuxt/ui`
- Branch: `v4`
- Commit inspected: `8b7f32888fbb13a751ad5069cc54513b1f7c05cc`
- Primary areas: `docs/app/composables/useTheme.ts`,
  `docs/app/composables/useThemeStudio.ts`, and
  `docs/app/utils/theme/engine/`

Nuxt UI is MIT licensed. See `THIRD_PARTY_NOTICES.md`.

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

Keep presets as typed, reviewed configuration and start with a small supported
set. This gives customer choice with little additional runtime machinery. Do
not adopt the complete Theme Studio until a real requirement exists for
arbitrary palettes, fonts, icons, sharing or export.

If an authorized customer account must publish a theme for every user, treat
that as a later server-owned capability: validate the preset, persist one
canonical revision, resolve it during SSR, and invalidate caches on publish.
Client-only storage is not sufficient for that requirement.

## Deferred theme capabilities

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

## Theme review checklist

Inspect `/theme` with an agent browser after every theme-affecting change:

1. Switch among all presets without console or hydration errors.
2. Check light, dark and system modes.
3. Check phone, tablet and desktop widths.
4. Check forms, panels, badges, alerts and explicit component variants.
5. Check focus visibility, text contrast, overflow and long labels.
6. Reload and confirm the selected preset persists without a flash.

If browser inspection is unavailable in a future run, report visual verification
as unverified rather than inferring it from HTTP or build output.

## Adding a preset

Yeni bir preset oluşturmak için starter'ın mevcut typed theme kataloğu
genişletilir; dropdown, anasayfa ve `/theme` rotasına ayrıca kayıt eklenmez.

1. `app/utils/theme-presets.ts` içindeki `themePresetIds` listesine yeni,
   benzersiz bir ID eklenir.
2. Aynı dosyadaki `themePresets` listesine preset tanımı eklenir.
3. Mevcut Nuxt UI palette'leri kullanılabilir. Yeni renk palette/shade
   gerekiyorsa `app/assets/css/main.css` içinde build-time `@theme static`
   tanımı eklenir.
4. Yeni font kullanılacaksa `nuxt.config.ts` içindeki `fonts.families`
   listesine Nuxt Fonts kaydı eklenir; preset içindeki `font` alanı aynı aile
   adını kullanır.
5. Preset için `colors`, `radius`, `font`, `components` ve gerekiyorsa
   `tokens.light` / `tokens.dark` değerleri tanımlanır.
6. Preset ID ve label beklentileri `test/unit/dashboard-showcase.test.ts`
   içinde güncellenir.

Historical theme measurements: [theme-baseline](evidence/theme-baseline.md).

## Migration provenance

Human approved root docs consolidation and removal on 2026-10-10. Original source: docs/theme.md and docs/starter/README.md at d5bec342f07c533bd245c60ad54a562200ff3b9e. Preserved intent and source observations do not establish fresh runtime success. Shared governance remains in the separately admitted Control repository.
