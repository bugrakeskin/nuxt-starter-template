import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

process.env.NUXT_PUBLIC_SUPABASE_URL ||= 'https://staging-api.unfogy.com'
process.env.NUXT_PUBLIC_SUPABASE_KEY ||= 'test-publishable-key'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          hookTimeout: 30000
        }
      })
    ]
  }
})
