const INTERNAL_ORIGIN = 'https://internal.invalid'

export function safeReturnTarget(value: unknown, fallback = '/') {
  if (typeof value !== 'string') return fallback

  const target = value.trim()
  if (!target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return fallback
  }

  try {
    const url = new URL(target, INTERNAL_ORIGIN)
    return url.origin === INTERNAL_ORIGIN
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback
  } catch {
    return fallback
  }
}
