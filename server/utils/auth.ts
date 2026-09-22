import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export async function requireUser(event: H3Event) {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  return user
}

export async function requirePermission(event: H3Event, permission: string) {
  const user = await requireUser(event)
  const permissions = user.app_metadata?.permissions

  if (!Array.isArray(permissions) || !permissions.includes(permission)) {
    throw createError({ statusCode: 403, statusMessage: 'Permission required' })
  }

  return user
}
