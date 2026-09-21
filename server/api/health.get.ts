export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  setResponseHeader(event, 'cache-control', 'no-store')

  return {
    status: 'ok',
    service: config.public.appName,
    contractVersion: 1
  }
})
