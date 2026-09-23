export const themePresetIds = [
  'mono',
  'cobalt',
  'sky',
  'mint',
  'iris',
  'crimson',
  'coral',
  'sunset',
  'carbon',
  'bubblegum',
  'parchment'
] as const

export type ThemePresetId = typeof themePresetIds[number]
export type ThemeComponentVariant = 'solid' | 'outline' | 'soft' | 'subtle'
export type ThemeColorAlias = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type ThemeShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

export interface ThemePreset {
  id: ThemePresetId
  label: string
  description: string
  colors: Partial<Record<ThemeColorAlias, string>> & Pick<Record<ThemeColorAlias, string>, 'primary' | 'neutral'>
  palettes?: Record<string, Partial<Record<ThemeShade, string>>>
  radius: number
  font?: {
    sans?: string
    serif?: string
    mono?: string
    lineHeight?: number
    letterSpacing?: number
    weights?: Partial<Record<'normal' | 'medium' | 'semibold' | 'bold', number>>
  }
  components: {
    button: ThemeComponentVariant
    field: Exclude<ThemeComponentVariant, 'solid'>
    panel: ThemeComponentVariant
    size?: 'md' | 'lg'
    fieldColor?: ThemeColorAlias
    slots?: Record<string, Record<string, string>>
  }
  tokens?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
}

const tintedNeutralTokens = {
  light: {
    '--ui-bg': 'var(--ui-color-neutral-50)',
    '--ui-bg-muted': 'var(--ui-color-neutral-100)',
    '--ui-text-inverted': 'var(--ui-color-neutral-50)'
  },
  dark: {
    '--ui-text-highlighted': 'var(--ui-color-neutral-50)',
    '--ui-bg-inverted': 'var(--ui-color-neutral-50)',
    '--ui-border-inverted': 'var(--ui-color-neutral-50)'
  }
}

const cobaltPalettes = {
  'cobalt': {
    50: 'oklch(95.3% 0.022 260.723)', 100: 'oklch(90.8% 0.045 258.763)', 200: 'oklch(81.6% 0.091 257.776)',
    300: 'oklch(72.9% 0.14 258.068)', 400: 'oklch(64.7% 0.186 258.256)', 500: 'oklch(57.8% 0.228 260.025)',
    600: 'oklch(49.2% 0.19 259.799)', 700: 'oklch(40.2% 0.152 259.656)', 800: 'oklch(30.7% 0.109 258.934)',
    900: 'oklch(20.4% 0.063 257.52)', 950: 'oklch(14.7% 0.037 249.929)'
  },
  'cobalt-gray': {
    50: 'oklch(99.1% 0 0)', 100: 'oklch(98.2% 0.002 247.839)', 200: 'oklch(94.2% 0.005 247.879)',
    300: 'oklch(91.1% 0.007 247.901)', 400: 'oklch(86.7% 0.011 247.949)', 500: 'oklch(76.9% 0.015 248.017)',
    600: 'oklch(55.8% 0.016 244.893)', 700: 'oklch(42.8% 0.015 248.172)', 800: 'oklch(34.5% 0.013 248.212)',
    900: 'oklch(26.2% 0.009 248.19)', 950: 'oklch(20.7% 0.008 248.192)'
  }
} satisfies ThemePreset['palettes']

const carbonPalettes = {
  carbon: {
    50: 'oklch(98.5% 0.017 447.457)', 100: 'oklch(95.9% 0.036 438.639)', 200: 'oklch(92.6% 0.054 428.8)',
    300: 'oklch(87% 0.053 417.734)', 400: 'oklch(70.5% 0.032 405.184)', 500: 'oklch(55.3% 0.014 390.836)',
    600: 'oklch(44.7% 0.001 374.343)', 700: 'oklch(35.9% 0 0)', 800: 'oklch(28% 0 0)',
    900: 'oklch(20.8% 0 0)', 950: 'oklch(14.1% 0.005 285.805)'
  }
} satisfies ThemePreset['palettes']

const bubblegumPalettes = {
  'saturated-mauve': {
    50: 'oklch(96.1% 0.021 325.68)', 100: 'oklch(92.4% 0.039 325.829)', 200: 'oklch(88% 0.057 325.83)',
    300: 'oklch(81.2% 0.073 325.398)', 400: 'oklch(66.1% 0.084 323.292)', 500: 'oklch(52.4% 0.079 322.443)',
    600: 'oklch(42.7% 0.064 322.128)', 700: 'oklch(34.6% 0.048 322.004)', 800: 'oklch(27.4% 0.034 321.983)',
    900: 'oklch(20.7% 0.02 322.028)', 950: 'oklch(14.5% 0.008 322.12)'
  }
} satisfies ThemePreset['palettes']

const parchmentPalettes = {
  clay: {
    50: 'oklch(97.4% 0.009 48.308)', 100: 'oklch(94.2% 0.019 52.207)', 200: 'oklch(88.5% 0.036 51.142)',
    300: 'oklch(82.1% 0.058 50.392)', 400: 'oklch(74.1% 0.094 47.255)', 500: 'oklch(67.2% 0.131 38.798)',
    600: 'oklch(58.9% 0.138 37.63)', 700: 'oklch(51.4% 0.123 37.45)', 800: 'oklch(44.4% 0.103 36.916)',
    900: 'oklch(38.8% 0.086 36.46)', 950: 'oklch(25.9% 0.054 38.197)'
  },
  parchment: {
    50: 'oklch(98% 0.006 100)', 100: 'oklch(96.5% 0.011 99)', 200: 'oklch(93.6% 0.014 97.348)',
    300: 'oklch(85.8% 0.018 100)', 400: 'oklch(72.1% 0.015 102.54)', 500: 'oklch(57.8% 0.008 88.877)',
    600: 'oklch(43.2% 0.006 91.526)', 700: 'oklch(38.2% 0.003 84.572)', 800: 'oklch(29.3% 0.003 106.588)',
    900: 'oklch(21.7% 0.002 106.561)', 950: 'oklch(14.6% 0 0)'
  }
} satisfies ThemePreset['palettes']

export const themePresets: readonly ThemePreset[] = [
  {
    id: 'mono', label: 'Mono', description: 'Black on a pure gray neutral, with quiet surfaces.',
    colors: { primary: 'neutral', neutral: 'neutral' }, radius: 0.5,
    font: { sans: 'Geist', mono: 'Geist Mono' },
    components: { button: 'solid', field: 'subtle', panel: 'outline' },
    tokens: { light: { '--ui-primary': 'black', '--ui-text-highlighted': 'var(--ui-color-neutral-950)' }, dark: { '--ui-primary': 'white', '--ui-bg': 'var(--ui-color-neutral-950)' } }
  },
  {
    id: 'cobalt', label: 'Cobalt', description: 'Utility blue on cool grays, tight corners and flat borders.',
    colors: { primary: 'cobalt', secondary: 'cobalt-gray', info: 'cyan', warning: 'amber', neutral: 'cobalt-gray' },
    palettes: cobaltPalettes, radius: 0.125, font: { sans: 'Roboto' },
    components: { button: 'solid', field: 'outline', panel: 'outline' },
    tokens: { light: { '--ui-secondary': 'var(--ui-color-secondary-600)', '--ui-bg': 'var(--ui-color-neutral-100)', '--ui-bg-muted': 'var(--ui-color-neutral-200)', '--ui-bg-elevated': 'var(--ui-color-neutral-200)', '--ui-bg-accented': 'var(--ui-color-neutral-300)', '--ui-text': 'var(--ui-color-neutral-800)', '--ui-text-toned': 'var(--ui-color-neutral-700)', '--ui-text-muted': 'var(--ui-color-neutral-600)', '--ui-text-dimmed': 'var(--ui-color-neutral-600)', '--ui-border': 'var(--ui-color-neutral-400)', '--ui-border-muted': 'var(--ui-color-neutral-300)' }, dark: { '--ui-primary': 'var(--ui-color-primary-500)', '--ui-secondary': 'var(--ui-color-secondary-500)', '--ui-bg': 'var(--ui-color-neutral-900)', '--ui-bg-muted': 'var(--ui-color-neutral-700)', '--ui-text': 'var(--ui-color-neutral-300)' } }
  },
  {
    id: 'sky', label: 'Sky', description: 'Sky blue on a mist neutral, pastel fills and airy type.',
    colors: { primary: 'sky', neutral: 'mist' }, radius: 0.75, font: { sans: 'Figtree', lineHeight: 1.6 },
    components: { button: 'soft', field: 'soft', panel: 'soft' }, tokens: tintedNeutralTokens
  },
  {
    id: 'mint', label: 'Mint', description: 'Teal on an olive neutral, pill controls and chunky rounded type.',
    colors: { primary: 'teal', neutral: 'olive' }, radius: 0.75,
    font: { sans: 'Nunito', weights: { normal: 500, medium: 600, semibold: 700, bold: 800 } },
    components: { button: 'soft', field: 'soft', panel: 'outline', size: 'lg', slots: { button: { base: 'rounded-full' }, input: { base: 'rounded-full' }, select: { base: 'rounded-full' }, selectMenu: { base: 'rounded-full' }, inputMenu: { base: 'rounded-full' } } },
    tokens: tintedNeutralTokens
  },
  {
    id: 'iris', label: 'Iris', description: 'Violet outlines on a mauve neutral with tinted fields.',
    colors: { primary: 'violet', secondary: 'fuchsia', neutral: 'mauve' }, radius: 0.5,
    font: { sans: 'Manrope', letterSpacing: -0.01 },
    components: { button: 'outline', field: 'subtle', panel: 'soft' }, tokens: tintedNeutralTokens
  },
  {
    id: 'crimson', label: 'Crimson', description: 'Cinema red on pure gray, square corners and filled fields.',
    colors: { primary: 'red', neutral: 'neutral' }, radius: 0, font: { sans: 'Inter', weights: { semibold: 700, bold: 800 } },
    components: { button: 'solid', field: 'soft', panel: 'outline' },
    tokens: { light: { '--ui-primary': 'var(--ui-color-primary-600)', '--ui-bg': 'var(--ui-color-neutral-50)', '--ui-bg-muted': 'var(--ui-color-neutral-100)' }, dark: { '--ui-primary': 'var(--ui-color-primary-500)', '--ui-bg': 'var(--ui-color-neutral-950)', '--ui-bg-muted': 'var(--ui-color-neutral-900)', '--ui-bg-elevated': 'var(--ui-color-neutral-900)', '--ui-bg-accented': 'var(--ui-color-neutral-800)' } }
  },
  {
    id: 'coral', label: 'Coral', description: 'Rose on warm stone, floating cards and teal success states.',
    colors: { primary: 'rose', success: 'teal', neutral: 'stone' }, radius: 0.5, font: { sans: 'Plus Jakarta Sans' },
    components: { button: 'solid', field: 'outline', panel: 'outline', fieldColor: 'neutral' }, tokens: tintedNeutralTokens
  },
  {
    id: 'sunset', label: 'Sunset', description: 'Orange on a warm taupe neutral with subtle panels.',
    colors: { primary: 'orange', secondary: 'yellow', neutral: 'taupe' }, radius: 0.625, font: { sans: 'Bricolage Grotesque' },
    components: { button: 'solid', field: 'outline', panel: 'subtle' },
    tokens: { light: { ...tintedNeutralTokens.light, '--ui-primary': 'var(--ui-color-primary-600)' }, dark: tintedNeutralTokens.dark }
  },
  {
    id: 'carbon', label: 'Carbon', description: 'Amber on a warm carbon neutral with ink-dark borders.',
    colors: { primary: 'amber', secondary: 'yellow', neutral: 'carbon' }, palettes: carbonPalettes, radius: 0.5, font: { sans: 'Outfit' },
    components: { button: 'solid', field: 'subtle', panel: 'subtle' },
    tokens: { light: { '--ui-bg': 'var(--ui-color-neutral-50)', '--ui-bg-muted': 'var(--ui-color-neutral-300)', '--ui-bg-elevated': 'var(--ui-color-neutral-300)', '--ui-bg-accented': 'var(--ui-color-neutral-400)', '--ui-bg-inverted': 'var(--ui-color-neutral-900)', '--ui-text-inverted': 'var(--ui-color-neutral-50)', '--ui-text-dimmed': 'var(--ui-color-neutral-500)', '--ui-text-muted': 'var(--ui-color-neutral-800)', '--ui-text-toned': 'var(--ui-color-neutral-900)', '--ui-text': 'var(--ui-color-neutral-900)', '--ui-text-highlighted': 'var(--ui-color-neutral-950)', '--ui-border': 'var(--ui-color-neutral-950)', '--ui-border-muted': 'var(--ui-color-neutral-400)', '--ui-border-accented': 'var(--ui-color-neutral-950)', '--ui-border-inverted': 'var(--ui-color-neutral-500)' }, dark: { '--ui-bg': 'var(--ui-color-neutral-800)', '--ui-bg-muted': 'var(--ui-color-neutral-700)', '--ui-bg-elevated': 'var(--ui-color-neutral-700)', '--ui-bg-accented': 'var(--ui-color-neutral-600)', '--ui-bg-inverted': 'var(--ui-color-neutral-50)', '--ui-text': 'var(--ui-color-neutral-300)', '--ui-text-highlighted': 'var(--ui-color-neutral-100)', '--ui-text-dimmed': 'var(--ui-color-neutral-400)', '--ui-text-muted': 'var(--ui-color-neutral-300)', '--ui-border': 'var(--ui-color-neutral-600)', '--ui-border-accented': 'var(--ui-color-neutral-500)', '--ui-border-inverted': 'var(--ui-color-neutral-50)' } }
  },
  {
    id: 'bubblegum', label: 'Bubblegum', description: 'Pastel pink softness with mauve-tinted grays.',
    colors: { primary: 'pink', secondary: 'violet', neutral: 'saturated-mauve' }, palettes: bubblegumPalettes, radius: 0.375, font: { sans: 'Poppins' },
    components: { button: 'soft', field: 'soft', panel: 'soft' }, tokens: { light: { '--ui-bg': 'var(--ui-color-neutral-50)', '--ui-text-inverted': 'var(--ui-color-neutral-50)', '--ui-bg-muted': 'var(--ui-color-neutral-100)' }, dark: { '--ui-bg-inverted': 'var(--ui-color-neutral-50)', '--ui-text-highlighted': 'var(--ui-color-neutral-50)', '--ui-border-inverted': 'var(--ui-color-neutral-50)' } }
  },
  {
    id: 'parchment', label: 'Parchment', description: 'Warm paper neutrals with a book-cloth clay primary.',
    colors: { primary: 'clay', neutral: 'parchment' }, palettes: parchmentPalettes, radius: 0.375, font: { sans: 'DM Sans', serif: 'Source Serif 4' },
    components: { button: 'solid', field: 'outline', panel: 'outline' },
    tokens: { light: { '--ui-bg': 'var(--ui-color-neutral-100)', '--ui-bg-muted': 'var(--ui-color-neutral-200)', '--ui-bg-elevated': 'var(--ui-color-neutral-200)', '--ui-bg-accented': 'var(--ui-color-neutral-300)', '--ui-border': 'var(--ui-color-neutral-300)', '--ui-border-muted': 'var(--ui-color-neutral-300)', '--ui-border-accented': 'var(--ui-color-neutral-400)' }, dark: { '--ui-primary': 'var(--ui-color-primary-500)' } }
  }
] as const

export function getThemePreset(id: ThemePresetId): ThemePreset {
  return themePresets.find(preset => preset.id === id) ?? themePresets[0]!
}
