import type { ThemeComponentVariant, ThemePresetId } from '~/utils/theme-presets'
import { getThemePreset, themePresets } from '~/utils/theme-presets'

interface ComponentTheme {
  defaultVariants?: {
    variant?: ThemeComponentVariant
  }
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
  const activePresetId = useState<ThemePresetId>('theme-preset', () => 'unfogy')
  const activePreset = computed(() => getThemePreset(activePresetId.value))

  function setComponentVariant(component: string, variant: ThemeComponentVariant) {
    const ui = appConfig.ui as unknown as ComponentThemes
    const current = ui[component] ?? {}

    ui[component] = {
      ...current,
      defaultVariants: {
        ...current.defaultVariants,
        variant
      }
    }
  }

  function applyPreset(id: ThemePresetId) {
    const preset = getThemePreset(id)
    activePresetId.value = preset.id

    appConfig.ui.colors.primary = preset.colors.primary
    appConfig.ui.colors.neutral = preset.colors.neutral

    setComponentVariant('button', preset.components.button)
    FIELD_COMPONENTS.forEach(component => setComponentVariant(component, preset.components.field))
    PANEL_COMPONENTS.forEach(component => setComponentVariant(component, preset.components.panel))
  }

  const presetStyles = computed(() => {
    const preset = activePreset.value

    return [
      `:root { --ui-radius: ${preset.radius}rem; }`,
      serializeTokens(':root, .light', preset.tokens?.light),
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
