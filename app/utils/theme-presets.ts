export type ThemePresetId = 'unfogy' | 'mono' | 'iris'

export type ThemeComponentVariant = 'solid' | 'outline' | 'soft' | 'subtle'

export interface ThemePreset {
  id: ThemePresetId
  label: string
  description: string
  colors: {
    primary: string
    neutral: string
  }
  radius: number
  components: {
    button: ThemeComponentVariant
    field: Exclude<ThemeComponentVariant, 'solid'>
    panel: ThemeComponentVariant
  }
  tokens?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
}

export const themePresets: readonly ThemePreset[] = [
  {
    id: 'unfogy',
    label: 'Unfogy',
    description: 'Balanced green, calm slate surfaces and familiar controls.',
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    radius: 0.375,
    components: {
      button: 'solid',
      field: 'outline',
      panel: 'outline'
    }
  },
  {
    id: 'mono',
    label: 'Mono',
    description: 'Quiet neutral surfaces, compact corners and subtle fields.',
    colors: {
      primary: 'neutral',
      neutral: 'neutral'
    },
    radius: 0.125,
    components: {
      button: 'solid',
      field: 'subtle',
      panel: 'subtle'
    },
    tokens: {
      light: {
        '--ui-primary': 'black'
      },
      dark: {
        '--ui-primary': 'white',
        '--ui-bg': 'var(--ui-color-neutral-950)'
      }
    }
  },
  {
    id: 'iris',
    label: 'Iris',
    description: 'Violet actions, softer mauve neutrals and generous rounding.',
    colors: {
      primary: 'violet',
      neutral: 'mauve'
    },
    radius: 0.75,
    components: {
      button: 'outline',
      field: 'soft',
      panel: 'soft'
    }
  }
] as const

export function getThemePreset(id: ThemePresetId): ThemePreset {
  return themePresets.find(preset => preset.id === id) ?? themePresets[0]!
}
