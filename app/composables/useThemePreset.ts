import type { ThemeColorAlias, ThemeComponentVariant, ThemePresetId } from '~/utils/theme-presets'
import { getThemePreset, themePresets } from '~/utils/theme-presets'

interface ComponentTheme {
  defaultVariants?: {
    variant?: ThemeComponentVariant
    size?: 'md' | 'lg'
    color?: ThemeColorAlias
  }
  slots?: Record<string, string>
}

type ComponentThemes = Record<string, ComponentTheme | undefined>

const FIELD_COMPONENTS = ['input', 'select', 'textarea'] as const
const PANEL_COMPONENTS = ['card', 'alert'] as const

function serializeTokens(selector: string, tokens: Record<string, string> = {}) {
  const declarations = Object.entries(tokens)
    .map(([name, value]) => `${name}: ${value};`)
    .join(' ')

  return declarations ? `${selector} { ${declarations} }` : ''
}

export function useThemePreset() {
  const appConfig = useAppConfig()
  const persistedPreset = useCookie<ThemePresetId>('unfogy-theme-preset', {
    default: () => 'mono',
    sameSite: 'lax'
  })
  const activePresetId = useState<ThemePresetId>('theme-preset', () => getThemePreset(persistedPreset.value).id)
  const activePreset = computed(() => getThemePreset(activePresetId.value))

  function setComponentDefaults(component: string, defaults: ComponentTheme['defaultVariants']) {
    const ui = appConfig.ui as unknown as ComponentThemes
    const current = ui[component] ?? {}

    ui[component] = {
      ...current,
      defaultVariants: {
        ...current.defaultVariants,
        ...defaults
      }
    }
  }

  function setComponentSlots(component: string, slots: Record<string, string> = {}) {
    const ui = appConfig.ui as unknown as ComponentThemes
    const current = ui[component] ?? {}

    ui[component] = {
      ...current,
      slots
    }
  }

  function applyPreset(id: ThemePresetId) {
    const preset = getThemePreset(id)
    activePresetId.value = preset.id
    persistedPreset.value = preset.id

    const colors = appConfig.ui.colors as Record<ThemeColorAlias, string>
    const defaults: Record<ThemeColorAlias, string> = {
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    }

    for (const alias of Object.keys(defaults) as ThemeColorAlias[]) {
      colors[alias] = preset.colors[alias] ?? defaults[alias]
    }

    setComponentDefaults('button', { variant: preset.components.button, size: preset.components.size ?? 'md' })
    FIELD_COMPONENTS.forEach(component => setComponentDefaults(component, {
      variant: preset.components.field,
      size: preset.components.size ?? 'md',
      color: preset.components.fieldColor ?? 'neutral'
    }))
    PANEL_COMPONENTS.forEach(component => setComponentDefaults(component, { variant: preset.components.panel }))

    for (const component of ['button', 'input', 'select', 'selectMenu', 'inputMenu']) {
      setComponentSlots(component, preset.components.slots?.[component])
    }
  }

  const presetStyles = computed(() => {
    const preset = activePreset.value
    const font = preset.font
    const fontRules = [
      font?.sans ? `--font-sans: '${font.sans}', sans-serif;` : '',
      font?.serif ? `--font-serif: '${font.serif}', serif;` : '',
      font?.mono ? `--font-mono: '${font.mono}', monospace;` : '',
      font?.weights?.normal ? `--font-weight-normal: ${font.weights.normal};` : '',
      font?.weights?.medium ? `--font-weight-medium: ${font.weights.medium};` : '',
      font?.weights?.semibold ? `--font-weight-semibold: ${font.weights.semibold};` : '',
      font?.weights?.bold ? `--font-weight-bold: ${font.weights.bold};` : ''
    ].filter(Boolean).join(' ')
    const bodyRules = [
      font?.lineHeight ? `line-height: ${font.lineHeight};` : '',
      font?.letterSpacing ? `letter-spacing: ${font.letterSpacing}em;` : ''
    ].filter(Boolean).join(' ')

    return [
      `:root { --ui-radius: ${preset.radius}rem; }`,
      fontRules ? `:root { ${fontRules} }` : '',
      bodyRules ? `body { ${bodyRules} }` : '',
      serializeTokens(':root:not(.dark), .light', preset.tokens?.light),
      serializeTokens('.dark', preset.tokens?.dark)
    ].filter(Boolean).join(' ')
  })

  applyPreset(activePresetId.value)

  useHead({
    style: [{
      key: 'unfogy-theme-preset',
      innerHTML: presetStyles
    }]
  })

  return {
    activePreset,
    activePresetId: readonly(activePresetId),
    applyPreset,
    presets: themePresets
  }
}
