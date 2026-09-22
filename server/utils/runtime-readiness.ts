export interface RuntimeReadiness {
  status: 'ok' | 'error'
  missing: string[]
}

export function getRuntimeReadiness(config: {
  supabaseUrl?: string
  supabaseKey?: string
}): RuntimeReadiness {
  const missing = [
    !config.supabaseUrl && 'NUXT_PUBLIC_SUPABASE_URL',
    !config.supabaseKey && 'NUXT_PUBLIC_SUPABASE_KEY'
  ].filter((name): name is string => Boolean(name))

  return {
    status: missing.length === 0 ? 'ok' : 'error',
    missing
  }
}
