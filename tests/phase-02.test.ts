import { env, SELF } from 'cloudflare:test'
import { beforeEach, describe, expect, it } from 'vitest'

const schema = `
CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS tenant_memberships (tenant_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (tenant_id, user_id), FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS workspaces (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE (tenant_id, name), FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS workspace_memberships (workspace_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (workspace_id, user_id), FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, tenant_id TEXT, workspace_id TEXT, actor_type TEXT NOT NULL, actor_id TEXT, action TEXT NOT NULL, target_type TEXT NOT NULL, target_id TEXT, request_id TEXT NOT NULL, correlation_id TEXT NOT NULL, result TEXT NOT NULL, metadata_json TEXT NOT NULL DEFAULT '{}', occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS demand_signals (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, workspace_id TEXT NOT NULL, source_type TEXT NOT NULL, source_reference TEXT, external_id TEXT, raw_content TEXT NOT NULL, normalized_content TEXT NOT NULL, captured_at TEXT NOT NULL, captured_by TEXT, capture_mechanism TEXT NOT NULL DEFAULT 'manual', status TEXT NOT NULL DEFAULT 'CAPTURED', metadata_json TEXT NOT NULL DEFAULT '{}', idempotency_key TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE, UNIQUE (id, tenant_id, workspace_id), UNIQUE (tenant_id, workspace_id, source_type, external_id), UNIQUE (tenant_id, workspace_id, idempotency_key));
CREATE TABLE IF NOT EXISTS opportunities (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, workspace_id TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'NEW', created_by TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE, UNIQUE (id, tenant_id, workspace_id));
CREATE TABLE IF NOT EXISTS opportunity_signals (opportunity_id TEXT NOT NULL, signal_id TEXT NOT NULL UNIQUE, tenant_id TEXT NOT NULL, workspace_id TEXT NOT NULL, linked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (opportunity_id, signal_id), FOREIGN KEY (opportunity_id, tenant_id, workspace_id) REFERENCES opportunities(id, tenant_id, workspace_id) ON DELETE CASCADE, FOREIGN KEY (signal_id, tenant_id, workspace_id) REFERENCES demand_signals(id, tenant_id, workspace_id) ON DELETE CASCADE);
`

const tables = [
  'opportunity_signals', 'opportunities', 'demand_signals', 'audit_events', 'sessions',
  'workspace_memberships', 'workspaces', 'tenant_memberships', 'users', 'tenants',
]

beforeEach(async () => {
  for (const statement of schema.split(';').map((value) => value.trim()).filter(Boolean)) {
    await env.DB.prepare(statement).run()
  }
  for (const table of tables) await env.DB.prepare(`DELETE FROM ${table}`).run()
})

async function register(email: string, tenantName: string, workspaceName: string) {
  const response = await SELF.fetch('https://nura.test/api/v1/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'secure-password-123', tenant_name: tenantName, workspace_name: workspaceName }),
  })
  const body = await response.json<any>()
  return {
    response,
    data: body.data,
    cookie: response.headers.get('set-cookie')?.split(';')[0] || '',
  }
}

function headers(identity: Awaited<ReturnType<typeof register>>, workspaceId = identity.data.workspaceId) {
  return { cookie: identity.cookie, 'x-workspace-id': workspaceId, 'content-type': 'application/json' }
}

async function createSignal(
  identity: Awaited<ReturnType<typeof register>>,
  overrides: Record<string, unknown> = {},
  idempotencyKey?: string,
  workspaceId?: string,
) {
  const response = await SELF.fetch('https://nura.test/api/v1/signals', {
    method: 'POST',
    headers: { ...headers(identity, workspaceId), ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}) },
    body: JSON.stringify({
      source_type: 'MANUAL',
      source_reference: 'interview:customer-42',
      external_id: `event-${crypto.randomUUID()}`,
      raw_content: '  Distributor needs a faster way   to capture reseller orders.  ',
      capture_mechanism: 'operator-entry',
      metadata: { consent: 'recorded', collector_note: 'direct interview' },
      ...overrides,
    }),
  })
  return { response, body: await response.json<any>() }
}

async function formOpportunity(identity: Awaited<ReturnType<typeof register>>, signalId: string, workspaceId?: string) {
  const response = await SELF.fetch('https://nura.test/api/v1/opportunities/from-signal', {
    method: 'POST',
    headers: headers(identity, workspaceId),
    body: JSON.stringify({ signal_id: signalId }),
  })
  return { response, body: await response.json<any>() }
}

describe('Nura Phase 02 Demand Signal to Opportunity', () => {
  it('A/B — creates a scoped signal and preserves observed content and provenance', async () => {
    const owner = await register('phase2-a@example.com', 'Tenant A', 'Workspace A')
    const created = await createSignal(owner)
    expect(created.response.status).toBe(201)
    expect(created.body.data.tenant_id).toBe(owner.data.tenantId)
    expect(created.body.data.workspace_id).toBe(owner.data.workspaceId)
    expect(created.body.data.raw_content).toContain('  Distributor')
    expect(created.body.data.normalized_content).toBe('Distributor needs a faster way to capture reseller orders.')
    expect(created.body.data.source_reference).toBe('interview:customer-42')
    expect(created.body.data.capture_mechanism).toBe('operator-entry')
    expect(created.body.data.captured_at).toBeTruthy()
    expect(created.body.data.captured_by).toBe(owner.data.userId)
    expect(created.body.data.metadata.collector_note).toBe('direct interview')
  })

  it('C — rejects missing, invalid, and oversized signal input', async () => {
    const owner = await register('phase2-validation@example.com', 'Tenant', 'Workspace')
    const missing = await createSignal(owner, { raw_content: '' })
    expect(missing.response.status).toBe(400)
    const invalidSource = await createSignal(owner, { source_type: 'THREADS' })
    expect(invalidSource.response.status).toBe(400)
    const oversized = await createSignal(owner, { raw_content: 'x'.repeat(5_001) })
    expect(oversized.response.status).toBe(400)
  })

  it('D — deduplicates stable source events and request replays', async () => {
    const owner = await register('phase2-idempotency@example.com', 'Tenant', 'Workspace')
    const externalId = 'source-event-100'
    const first = await createSignal(owner, { external_id: externalId })
    const replay = await createSignal(owner, { external_id: externalId })
    expect(first.response.status).toBe(201)
    expect(replay.response.status).toBe(200)
    expect(replay.body.data.id).toBe(first.body.data.id)

    const requestKey = crypto.randomUUID()
    const requestFirst = await createSignal(owner, { external_id: null }, requestKey)
    const requestReplay = await createSignal(owner, { external_id: null }, requestKey)
    expect(requestReplay.response.status).toBe(200)
    expect(requestReplay.body.data.id).toBe(requestFirst.body.data.id)
    const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM demand_signals').first<{ count: number }>()
    expect(count?.count).toBe(2)
  })

  it('E/F — forms an unvalidated opportunity with traceable signal relationship', async () => {
    const owner = await register('phase2-form@example.com', 'Tenant', 'Workspace')
    const signal = await createSignal(owner)
    const formed = await formOpportunity(owner, signal.body.data.id)
    expect(formed.response.status).toBe(201)
    expect(formed.body.data.status).toBe('NEW')
    expect(formed.body.data.signal_ids).toEqual([signal.body.data.id])
    expect(formed.body.data.source_signal_count).toBe(1)
    expect(formed.body.data.solution).toBeUndefined()
    const replay = await formOpportunity(owner, signal.body.data.id)
    expect(replay.response.status).toBe(200)
    expect(replay.body.data.id).toBe(formed.body.data.id)
  })

  it('G — denies Tenant A reads, mutations, and relationship creation for Tenant B data', async () => {
    const tenantA = await register('phase2-tenant-a@example.com', 'Tenant A', 'Workspace A')
    const tenantB = await register('phase2-tenant-b@example.com', 'Tenant B', 'Workspace B')
    const signalB = await createSignal(tenantB)
    const opportunityB = await formOpportunity(tenantB, signalB.body.data.id)

    const signalRead = await SELF.fetch(`https://nura.test/api/v1/signals/${signalB.body.data.id}`, { headers: headers(tenantA) })
    expect([401, 403, 404]).toContain(signalRead.status)
    const opportunityRead = await SELF.fetch(`https://nura.test/api/v1/opportunities/${opportunityB.body.data.id}`, { headers: headers(tenantA) })
    expect([401, 403, 404]).toContain(opportunityRead.status)
    const attach = await formOpportunity(tenantA, signalB.body.data.id)
    expect(attach.response.status).toBe(404)
    const mutate = await SELF.fetch(`https://nura.test/api/v1/opportunities/${opportunityB.body.data.id}/status`, {
      method: 'PATCH', headers: headers(tenantA), body: JSON.stringify({ status: 'REVIEW' }),
    })
    expect(mutate.status).toBe(404)
  })

  it('H — isolates records between authorized workspaces in one tenant', async () => {
    const owner = await register('phase2-workspaces@example.com', 'Tenant', 'Workspace One')
    const workspaceResponse = await SELF.fetch('https://nura.test/api/v1/workspaces', {
      method: 'POST', headers: headers(owner), body: JSON.stringify({ name: 'Workspace Two' }),
    })
    const workspaceTwo = (await workspaceResponse.json<any>()).data
    const signalOne = await createSignal(owner)
    const signalTwo = await createSignal(owner, {}, undefined, workspaceTwo.id)
    const listOne = await SELF.fetch('https://nura.test/api/v1/signals', { headers: headers(owner) })
    const listTwo = await SELF.fetch('https://nura.test/api/v1/signals', { headers: headers(owner, workspaceTwo.id) })
    expect((await listOne.json<any>()).data.map((item: any) => item.id)).toEqual([signalOne.body.data.id])
    expect((await listTwo.json<any>()).data.map((item: any) => item.id)).toEqual([signalTwo.body.data.id])
    const crossRead = await SELF.fetch(`https://nura.test/api/v1/signals/${signalOne.body.data.id}`, { headers: headers(owner, workspaceTwo.id) })
    expect(crossRead.status).toBe(404)
  })

  it('I — ignores client-supplied tenant and workspace ownership', async () => {
    const owner = await register('phase2-owner@example.com', 'Tenant A', 'Workspace A')
    const other = await register('phase2-other@example.com', 'Tenant B', 'Workspace B')
    const signal = await createSignal(owner, { tenant_id: other.data.tenantId, workspace_id: other.data.workspaceId })
    expect(signal.body.data.tenant_id).toBe(owner.data.tenantId)
    expect(signal.body.data.workspace_id).toBe(owner.data.workspaceId)
  })

  it('J — enforces allowed opportunity lifecycle transitions', async () => {
    const owner = await register('phase2-lifecycle@example.com', 'Tenant', 'Workspace')
    const signal = await createSignal(owner)
    const formed = await formOpportunity(owner, signal.body.data.id)
    const invalid = await SELF.fetch(`https://nura.test/api/v1/opportunities/${formed.body.data.id}/status`, {
      method: 'PATCH', headers: headers(owner), body: JSON.stringify({ status: 'QUALIFIED' }),
    })
    expect(invalid.status).toBe(409)
    for (const status of ['REVIEW', 'QUALIFIED', 'DISMISSED']) {
      const response = await SELF.fetch(`https://nura.test/api/v1/opportunities/${formed.body.data.id}/status`, {
        method: 'PATCH', headers: headers(owner), body: JSON.stringify({ status }),
      })
      expect(response.status).toBe(200)
      expect((await response.json<any>()).data.status).toBe(status)
    }
  })

  it('K — records audit events for capture, deduplication, formation, and lifecycle', async () => {
    const owner = await register('phase2-audit@example.com', 'Tenant', 'Workspace')
    const signal = await createSignal(owner, { external_id: 'audit-event' })
    await createSignal(owner, { external_id: 'audit-event' })
    const formed = await formOpportunity(owner, signal.body.data.id)
    await SELF.fetch(`https://nura.test/api/v1/opportunities/${formed.body.data.id}/status`, {
      method: 'PATCH', headers: headers(owner), body: JSON.stringify({ status: 'DISMISSED' }),
    })
    const actions = await env.DB.prepare(`SELECT action FROM audit_events
      WHERE tenant_id = ? AND workspace_id = ? ORDER BY occurred_at`)
      .bind(owner.data.tenantId, owner.data.workspaceId)
      .all<{ action: string }>()
    const names = actions.results.map((event) => event.action)
    expect(names).toContain('DEMAND_SIGNAL_CREATED')
    expect(names).toContain('DEMAND_SIGNAL_DEDUPLICATED')
    expect(names).toContain('OPPORTUNITY_CREATED')
    expect(names).toContain('OPPORTUNITY_DISMISSED')
  })
})
