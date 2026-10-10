---
type: Architecture
title: Nuxt starter design foundation
description: Maps generic Nuxt UI theme sources and defines project design rebinding without copying App identity.
generated: { by: agent/codex, at: "2026-10-10T10:40:14Z" }
status: stable
code_refs: [app/utils/theme-presets.ts, app/composables/useThemePreset.ts, app/assets/css/main.css, docs/theme.md]
---

# Nuxt starter design foundation

## Scope

This concept owns generic visual foundation and source discovery. [Product](product.md)
owns starter purpose; [foundation](foundation.md) owns framework boundaries.
It is a reusable content model for project design knowledge, not the Unfogy App
visual identity or the shared SDLC Design stage.

## Native styling and source authority

Use native Nuxt UI components and semantic classes. Extend appConfig, component
UI props and semantic tokens rather than branch page templates on preset IDs.
[Theme catalog](../app/utils/theme-presets.ts) owns available themes, colors,
fonts, radius and variants. [Preset application](../app/composables/useThemePreset.ts)
owns reactive aliases, cookie restoration and generated CSS.
[CSS](../app/assets/css/main.css) owns compiled palettes. `docs/theme.md`
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
existing theme catalog, composable, CSS and docs/theme.md. Canonical design lives here;
root PRODUCT.md and DESIGN.md were removed with human approval on 2026-10-10. Stop affected claims on unresolved
source or project identity. This document establishes no Customer brand or deployed UI.
