export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const readiness = getRuntimeReadiness({
    supabaseUrl: config.public.supabase?.url,
    supabaseKey: config.public.supabase?.key
  })

  setResponseHeader(event, 'cache-control', 'no-store')
  if (readiness.status === 'error') setResponseStatus(event, 503)

  return {
    status: readiness.status,
    service: config.public.appName,
    contractVersion: 1,
    checks: {
      supabaseConfiguration: readiness.status === 'ok'
    },
    ...(readiness.missing.length > 0 && { missingConfiguration: readiness.missing })
  }
})
