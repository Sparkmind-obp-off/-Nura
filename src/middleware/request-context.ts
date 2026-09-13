import type { MiddlewareHandler } from 'hono'
import { AppError } from '../core/errors'
import { readCookie, SESSION_COOKIE } from '../core/cookies'
import { sha256 } from '../core/security'
import { resolveSession } from '../repositories/identity'
import type { AppEnv } from '../types'

export const requestTracing: MiddlewareHandler<AppEnv> = async (c, next) => {
  const requestId = c.req.header('x-request-id') || crypto.randomUUID()
  const correlationId = c.req.header('x-correlation-id') || requestId
  c.set('requestId', requestId)
  c.set('correlationId', correlationId)
  c.header('x-request-id', requestId)
  c.header('x-correlation-id', correlationId)
  await next()
}

export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const token = readCookie(c.req.header('cookie'), SESSION_COOKIE)
  if (!token) throw new AppError(401, 'UNAUTHENTICATED', 'Authentication is required.')

  const identity = await resolveSession(c.env.DB, await sha256(token), c.req.header('x-workspace-id'))
  if (!identity) throw new AppError(401, 'UNAUTHENTICATED', 'Session is invalid or the workspace is unauthorized.')

  c.set('auth', {
    ...identity,
    requestId: c.get('requestId'),
    correlationId: c.get('correlationId'),
  })
  await next()
}
