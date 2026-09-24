import { describe, expect, it } from 'vitest'

describe('Nuxt starter runtime', () => {
  it('loads the Supabase module configuration in Nuxt context', () => {
    const config = useRuntimeConfig()

    expect(config.public.supabase.url).toBe('https://preview-api.unfogy.com')
    expect(config.public.supabase.key).toBe('test-publishable-key')
  })
})
