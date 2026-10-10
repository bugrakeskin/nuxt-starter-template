---
type: Evidence
title: Historical theme measurement baseline
description: Preserves inherited theme size and verification observations without claiming current runtime success.
generated: { by: agent/codex, at: "2026-10-10T10:51:37Z" }
status: stable
code_refs: [app/utils/theme-presets.ts, app/composables/useThemePreset.ts]
---

# Historical theme baseline

These inherited measurements and test results predate this documentation migration. They are not current build size, browser or hosted evidence. The old document does not establish a complete measurement revision; retain its limitations.

## Recorded measurement

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

## Recorded verification

The following results are inherited observations, not verification of this documentation migration.

- `pnpm typecheck`: passed
- `pnpm lint`: passed
- `pnpm build`: passed
- production HTTP smoke: `/`, `/theme`, all six `/dashboard/*` routes and
  `/api/health` returned `200`
- SSR smoke: default `Unfogy` label and `--ui-radius: 0.375rem` were present
  in the `/theme` HTML
- interactive browser inspection: showcase header, theme dropdown, wireframe
  dropdown, route navigation, reload persistence and console were verified in
  the local browser; no hydration mismatch, error or warning was observed

## Migration provenance

Human approved root docs consolidation and removal on 2026-10-10. Original source: docs/theme.md at d5bec342f07c533bd245c60ad54a562200ff3b9e. Preserved intent and source observations do not establish fresh runtime success. Shared governance remains in the separately admitted Control repository.
