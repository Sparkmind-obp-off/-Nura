import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { AppError } from './core/errors'
import { appShell } from './core/html'
import { clearSessionCookie, readCookie, SESSION_COOKIE, sessionCookie } from './core/cookies'
import { requireDiscoveryWrite, requireWorkspaceCreate } from './core/permissions'
import { success } from './core/responses'
import { hashPassword, sha256, verifyPassword } from './core/security'
import {
  optionalConfidence,
  optionalMetadata,
  optionalObject,
  optionalString,
  optionalStringArray,
  requireEmail,
  requireEnum,
  requireObject,
  requireObservedContent,
  requireString,
  requireUuid,
} from './core/validation'
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
import {
  createDemandSignal,
  formOpportunity,
  getDemandSignal,
  getOpportunity,
  listDemandSignals,
  listOpportunities,
  OPPORTUNITY_STATUSES,
  SIGNAL_SOURCE_TYPES,
  updateOpportunityStatus,
} from './repositories/discovery'
import {
  createBusinessContext,
  createDomainCandidate,
  getBusinessContext,
  getDomainCandidate,
  INTERPRETATION_TYPES,
  listBusinessContexts,
  listDomainCandidates,
} from './repositories/context-domain'
import type { AppEnv } from './types'

const app = new Hono<AppEnv>()

app.use('*', requestTracing)
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/api/v1/tenants/*', requireAuth)
app.use('/api/v1/workspaces', requireAuth)
app.use('/api/v1/workspaces/*', requireAuth)
app.use('/api/v1/auth/session', requireAuth)
app.use('/api/v1/signals', requireAuth)
app.use('/api/v1/signals/*', requireAuth)
app.use('/api/v1/opportunities', requireAuth)
app.use('/api/v1/opportunities/*', requireAuth)
app.use('/api/v1/contexts', requireAuth)
app.use('/api/v1/contexts/*', requireAuth)
app.use('/api/v1/domains', requireAuth)
app.use('/api/v1/domains/*', requireAuth)

app.get('/health', (c) => c.json({ status: 'ok', service: 'nura', phase: '03', request_id: c.get('requestId') }))

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

app.post('/api/v1/signals', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const body = requireObject(await safeJson(c))
  const sourceType = requireEnum(body, 'source_type', SIGNAL_SOURCE_TYPES)
  const rawContent = requireObservedContent(body, 'raw_content', 5_000)
  const sourceReference = optionalString(body, 'source_reference', 1_000)
  const externalId = optionalString(body, 'external_id', 200)
  const captureMechanism = optionalString(body, 'capture_mechanism', 80) || 'manual'
  const headerIdempotencyKey = c.req.header('idempotency-key')
  if (headerIdempotencyKey && headerIdempotencyKey.length > 200) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Idempotency-Key must contain at most 200 characters.')
  }
  const result = await createDemandSignal(c.env.DB, auth, {
    sourceType,
    sourceReference,
    externalId,
    rawContent,
    normalizedContent: normalizeSignal(rawContent),
    captureMechanism,
    metadata: optionalMetadata(body),
    idempotencyKey: headerIdempotencyKey?.trim() || null,
  })
  return success(c, result.signal, result.created ? 201 : 200)
})

app.get('/api/v1/signals', async (c) => success(c, await listDemandSignals(c.env.DB, c.get('auth'))))

app.get('/api/v1/signals/:signalId', async (c) => {
  const signal = await getDemandSignal(c.env.DB, c.get('auth'), requireUuid(c.req.param('signalId'), 'signalId'))
  if (!signal) throw new AppError(404, 'NOT_FOUND', 'Demand signal was not found in the authorized workspace.')
  return success(c, signal)
})

app.post('/api/v1/opportunities/from-signal', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const body = requireObject(await safeJson(c))
  const signalId = requireUuid(requireString(body, 'signal_id', 36, 36), 'signal_id')
  const title = optionalString(body, 'title', 100) || undefined
  const summary = optionalString(body, 'summary', 500) || undefined
  const result = await formOpportunity(c.env.DB, auth, signalId, { title, summary })
  return success(c, result.opportunity, result.created ? 201 : 200)
})

app.post('/api/v1/opportunities', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const body = requireObject(await safeJson(c))
  const signalId = requireUuid(requireString(body, 'signal_id', 36, 36), 'signal_id')
  const title = optionalString(body, 'title', 100) || undefined
  const summary = optionalString(body, 'summary', 500) || undefined
  const result = await formOpportunity(c.env.DB, auth, signalId, { title, summary })
  return success(c, result.opportunity, result.created ? 201 : 200)
})

app.get('/api/v1/opportunities', async (c) => success(c, await listOpportunities(c.env.DB, c.get('auth'))))

app.get('/api/v1/opportunities/:opportunityId', async (c) => {
  const opportunity = await getOpportunity(
    c.env.DB,
    c.get('auth'),
    requireUuid(c.req.param('opportunityId'), 'opportunityId'),
  )
  if (!opportunity) throw new AppError(404, 'NOT_FOUND', 'Opportunity was not found in the authorized workspace.')
  return success(c, opportunity)
})

app.patch('/api/v1/opportunities/:opportunityId/status', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const id = requireUuid(c.req.param('opportunityId'), 'opportunityId')
  const body = requireObject(await safeJson(c))
  const status = requireEnum(body, 'status', OPPORTUNITY_STATUSES)
  return success(c, await updateOpportunityStatus(c.env.DB, auth, id, status))
})

app.post('/api/v1/contexts', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const body = requireObject(await safeJson(c))
  const idempotencyKey = readIdempotencyKey(c.req.header('idempotency-key'))
  const interpretationType = body.interpretation_type === undefined
    ? 'OBSERVED'
    : requireEnum(body, 'interpretation_type', INTERPRETATION_TYPES)
  const result = await createBusinessContext(c.env.DB, auth, {
    opportunityId: requireUuid(requireString(body, 'opportunity_id', 36, 36), 'opportunity_id'),
    observedFacts: optionalObject(body, 'observed_facts'),
    businessCharacteristics: optionalObject(body, 'business_characteristics'),
    operatingContext: optionalString(body, 'operating_context', 2_000),
    channels: optionalStringArray(body, 'channels'),
    actors: optionalStringArray(body, 'actors'),
    constraints: optionalStringArray(body, 'constraints'),
    processClues: optionalStringArray(body, 'process_clues'),
    unknowns: optionalStringArray(body, 'unknowns'),
    sourceType: optionalString(body, 'source_type', 80) || 'UNKNOWN',
    sourceReference: optionalString(body, 'source_reference', 1_000),
    interpretationType,
    confidence: optionalConfidence(body),
    provenance: optionalObject(body, 'provenance'),
    idempotencyKey,
  })
  return success(c, result.context, result.created ? 201 : 200)
})

app.get('/api/v1/contexts', async (c) => success(c, await listBusinessContexts(c.env.DB, c.get('auth'))))

app.get('/api/v1/contexts/:contextId', async (c) => {
  const context = await getBusinessContext(
    c.env.DB,
    c.get('auth'),
    requireUuid(c.req.param('contextId'), 'contextId'),
  )
  if (!context) throw new AppError(404, 'NOT_FOUND', 'Business context was not found in the authorized workspace.')
  return success(c, context)
})

app.post('/api/v1/domains/from-context', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const body = requireObject(await safeJson(c))
  const idempotencyKey = readIdempotencyKey(c.req.header('idempotency-key'))
  const interpretationType = body.interpretation_type === undefined
    ? 'INFERRED'
    : requireEnum(body, 'interpretation_type', INTERPRETATION_TYPES)
  const result = await createDomainCandidate(c.env.DB, auth, {
    opportunityId: requireUuid(requireString(body, 'opportunity_id', 36, 36), 'opportunity_id'),
    businessContextId: requireUuid(requireString(body, 'business_context_id', 36, 36), 'business_context_id'),
    label: requireString(body, 'label', 2, 160),
    description: optionalString(body, 'description', 2_000),
    rationale: optionalString(body, 'rationale', 2_000),
    interpretationType,
    confidence: optionalConfidence(body),
    sourceType: optionalString(body, 'source_type', 80) || 'UNKNOWN',
    sourceReference: optionalString(body, 'source_reference', 1_000),
    provenance: optionalObject(body, 'provenance'),
    idempotencyKey,
  })
  return success(c, result.domain, result.created ? 201 : 200)
})

app.post('/api/v1/domains', async (c) => {
  const auth = c.get('auth')
  requireDiscoveryWrite(auth)
  const body = requireObject(await safeJson(c))
  const idempotencyKey = readIdempotencyKey(c.req.header('idempotency-key'))
  const interpretationType = body.interpretation_type === undefined
    ? 'INFERRED'
    : requireEnum(body, 'interpretation_type', INTERPRETATION_TYPES)
  const result = await createDomainCandidate(c.env.DB, auth, {
    opportunityId: requireUuid(requireString(body, 'opportunity_id', 36, 36), 'opportunity_id'),
    businessContextId: requireUuid(requireString(body, 'business_context_id', 36, 36), 'business_context_id'),
    label: requireString(body, 'label', 2, 160),
    description: optionalString(body, 'description', 2_000),
    rationale: optionalString(body, 'rationale', 2_000),
    interpretationType,
    confidence: optionalConfidence(body),
    sourceType: optionalString(body, 'source_type', 80) || 'UNKNOWN',
    sourceReference: optionalString(body, 'source_reference', 1_000),
    provenance: optionalObject(body, 'provenance'),
    idempotencyKey,
  })
  return success(c, result.domain, result.created ? 201 : 200)
})

app.get('/api/v1/domains', async (c) => success(c, await listDomainCandidates(c.env.DB, c.get('auth'))))

app.get('/api/v1/domains/:domainId', async (c) => {
  const domain = await getDomainCandidate(c.env.DB, c.get('auth'), requireUuid(c.req.param('domainId'), 'domainId'))
  if (!domain) throw new AppError(404, 'NOT_FOUND', 'Domain candidate was not found in the authorized workspace.')
  return success(c, domain)
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

function normalizeSignal(content: string): string {
  return content.replace(/\s+/g, ' ').trim()
}

function readIdempotencyKey(value: string | undefined): string | null {
  if (!value) return null
  if (value.length > 200) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Idempotency-Key must contain at most 200 characters.')
  }
  return value.trim() || null
}

async function safeJson(c: Parameters<typeof requireObject>[0] extends never ? never : any): Promise<unknown> {
  try {
    return await c.req.json()
  } catch {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body must be valid JSON.')
  }
}

export default app
