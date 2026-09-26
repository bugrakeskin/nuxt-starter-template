export function useReleaseTag() {
  const config = useRuntimeConfig()

  const releaseTag = computed(() => {
    const version = String(config.public.appVersion).replace(/^v/, '')
    const channel = String(config.public.releaseChannel || 'development')

    return channel === 'production' ? `v${version}` : `v${version}-${channel}`
  })

  return { releaseTag }
}
