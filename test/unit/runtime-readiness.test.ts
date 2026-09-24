import { describe, expect, it } from 'vitest'
import { getRuntimeReadiness } from '../../server/utils/runtime-readiness'

describe('runtime readiness', () => {
  it('fails closed when public Supabase configuration is incomplete', () => {
    expect(getRuntimeReadiness({ supabaseUrl: 'https://preview-api.unfogy.com' })).toEqual({
      status: 'error',
      missing: ['NUXT_PUBLIC_SUPABASE_KEY']
    })
  })

  it('is ready when URL and publishable key are present', () => {
    expect(getRuntimeReadiness({
      supabaseUrl: 'https://preview-api.unfogy.com',
      supabaseKey: 'publishable-key'
    })).toEqual({ status: 'ok', missing: [] })
  })
})
