import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { AppError } from './core/errors'
import { appShell } from './core/html'
import { clearSessionCookie, readCookie, SESSION_COOKIE, sessionCookie } from './core/cookies'
import { requireWorkspaceCreate } from './core/permissions'
import { success } from './core/responses'
import { hashPassword, sha256, verifyPassword } from './core/security'
import { requireEmail, requireObject, requireString } from './core/validation'
import { requestTracing, requireAuth } from './middleware/request-context'
import {
  createBootstrap,
  createSession,
  createWorkspace,
  currentIdentity,
  deleteSession,
  findAuthorizedWorkspace,
  findUserByEmail,
  listAuthorizedWorkspaces,
  resolveSession,
} from './repositories/identity'
import type { AppEnv } from './types'

const app = new Hono<AppEnv>()

app.use('*', requestTracing)
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/api/v1/tenants/*', requireAuth)
app.use('/api/v1/workspaces', requireAuth)
app.use('/api/v1/workspaces/*', requireAuth)
app.use('/api/v1/auth/session', requireAuth)

app.get('/health', (c) => c.json({ status: 'ok', service: 'nura', phase: '01', request_id: c.get('requestId') }))

app.post('/api/v1/auth/register', async (c) => {
  if (c.env.ALLOW_PUBLIC_SIGNUP === 'false') {
    throw new AppError(403, 'FORBIDDEN', 'Public tenant registration is disabled.')
  }
  const body = requireObject(await safeJson(c))
  const email = requireEmail(body)
  const password = requireString(body, 'password', 12, 128)
  const tenantName = requireString(body, 'tenant_name', 2, 100)
  const workspaceName = requireString(body, 'workspace_name', 2, 100)
  const passwordHash = await hashPassword(password)

  let identity: Awaited<ReturnType<typeof createBootstrap>>
  try {
    identity = await createBootstrap(c.env.DB, {
      email,
      passwordHash,
      tenantName,
      workspaceName,
      requestId: c.get('requestId'),
      correlationId: c.get('correlationId'),
    })
  } catch (error) {
    if (String(error).includes('UNIQUE')) throw new AppError(409, 'CONFLICT', 'Email or workspace already exists.')
    throw error
  }

  const rawToken = `${crypto.randomUUID()}${crypto.randomUUID()}`
  await createSession(c.env.DB, identity.userId, await sha256(rawToken))
  c.header('Set-Cookie', sessionCookie(rawToken, new URL(c.req.url).protocol === 'https:'))
  return success(c, { ...identity, email }, 201)
})

app.post('/api/v1/auth/login', async (c) => {
  const body = requireObject(await safeJson(c))
  const email = requireEmail(body)
  const password = requireString(body, 'password', 1, 128)
  const user = await findUserByEmail(c.env.DB, email)
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Email or password is invalid.')
  }
  const rawToken = `${crypto.randomUUID()}${crypto.randomUUID()}`
  await createSession(c.env.DB, user.id, await sha256(rawToken))
  c.header('Set-Cookie', sessionCookie(rawToken, new URL(c.req.url).protocol === 'https:'))
  return success(c, { authenticated: true })
})

app.post('/api/v1/auth/logout', async (c) => {
  const token = readCookie(c.req.header('cookie'), SESSION_COOKIE)
  if (token) await deleteSession(c.env.DB, await sha256(token))
  c.header('Set-Cookie', clearSessionCookie(new URL(c.req.url).protocol === 'https:'))
  return success(c, { authenticated: false })
})

app.get('/api/v1/auth/status', async (c) => {
  const token = readCookie(c.req.header('cookie'), SESSION_COOKIE)
  if (!token) return success(c, { authenticated: false })
  const identity = await resolveSession(c.env.DB, await sha256(token), c.req.header('x-workspace-id'))
  return success(c, { authenticated: Boolean(identity) })
})

app.get('/api/v1/auth/session', async (c) => {
  const identity = await currentIdentity(c.env.DB, c.get('auth'))
  if (!identity) throw new AppError(404, 'NOT_FOUND', 'Authorized identity context was not found.')
  return success(c, identity)
})

app.get('/api/v1/tenants/current', async (c) => {
  const identity = await currentIdentity(c.env.DB, c.get('auth'))
  if (!identity) throw new AppError(404, 'NOT_FOUND', 'Tenant was not found.')
  return success(c, {
    id: identity.tenant_id,
    name: identity.tenant_name,
    role: identity.tenant_role,
  })
})

app.get('/api/v1/workspaces', async (c) => success(c, await listAuthorizedWorkspaces(c.env.DB, c.get('auth'))))

app.post('/api/v1/workspaces', async (c) => {
  const auth = c.get('auth')
  requireWorkspaceCreate(auth)
  const body = requireObject(await safeJson(c))
  const name = requireString(body, 'name', 2, 100)
  try {
    return success(c, await createWorkspace(c.env.DB, auth, name), 201)
  } catch (error) {
    if (String(error).includes('UNIQUE')) throw new AppError(409, 'CONFLICT', 'Workspace name already exists in this tenant.')
    throw error
  }
})

app.get('/api/v1/workspaces/:workspaceId', async (c) => {
  const workspace = await findAuthorizedWorkspace(c.env.DB, c.get('auth'), c.req.param('workspaceId'))
  if (!workspace) throw new AppError(404, 'NOT_FOUND', 'Workspace was not found in the authorized tenant context.')
  return success(c, workspace)
})

app.get('/', (c) => c.html(appShell()))

app.notFound((c) => c.json({
  error: {
    code: 'NOT_FOUND',
    message: 'Route not found.',
    details: {},
    request_id: c.get('requestId'),
  },
}, 404))

app.onError((error, c) => {
  const known = error instanceof AppError
    ? error
    : new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.')
  console.error(JSON.stringify({
    level: 'error',
    request_id: c.get('requestId'),
    correlation_id: c.get('correlationId'),
    code: known.code,
    status: known.status,
    message: known.status === 500 ? 'internal_error' : known.message,
  }))
  return c.json({
    error: {
      code: known.code,
      message: known.message,
      details: known.details,
      request_id: c.get('requestId'),
    },
  }, known.status)
})

async function safeJson(c: Parameters<typeof requireObject>[0] extends never ? never : any): Promise<unknown> {
  try {
    return await c.req.json()
  } catch {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body must be valid JSON.')
  }
}

export default app
