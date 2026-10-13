import packageJson from '../../package.json' with { type: 'json' }
import { describe, expect, it } from 'vitest'
import { applicationVersion } from '../../shared/utils/release-version'

describe('immutable release version', () => {
  it('keeps the package version when a legacy runtime override is present', () => {
    const original = process.env.NUXT_PUBLIC_APP_VERSION
    process.env.NUXT_PUBLIC_APP_VERSION = '9.9.9'
    try {
      expect(applicationVersion).toBe(packageJson.version)
      expect(useReleaseTag().releaseTag.value).toContain(`v${packageJson.version}`)
    } finally {
      if (original === undefined) delete process.env.NUXT_PUBLIC_APP_VERSION
      else process.env.NUXT_PUBLIC_APP_VERSION = original
    }
  })
})
