import { applicationVersion } from '~~/shared/utils/release-version'

export function useReleaseTag() {
  const config = useRuntimeConfig()
  const releaseTag = computed(() => {
    const channel = String(config.public.releaseChannel || 'development')
    return channel === 'production' ? `v${applicationVersion}` : `v${applicationVersion} · ${channel}`
  })
  return { releaseTag }
}
