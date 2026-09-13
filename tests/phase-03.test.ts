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
CREATE TABLE IF NOT EXISTS business_contexts (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, workspace_id TEXT NOT NULL, opportunity_id TEXT NOT NULL, observed_facts_json TEXT NOT NULL DEFAULT '{}', business_characteristics_json TEXT NOT NULL DEFAULT '{}', operating_context TEXT, channels_json TEXT NOT NULL DEFAULT '[]', actors_json TEXT NOT NULL DEFAULT '[]', constraints_json TEXT NOT NULL DEFAULT '[]', process_clues_json TEXT NOT NULL DEFAULT '[]', unknowns_json TEXT NOT NULL DEFAULT '[]', source_type TEXT NOT NULL, source_reference TEXT, interpretation_type TEXT NOT NULL DEFAULT 'OBSERVED', confidence REAL, provenance_json TEXT NOT NULL DEFAULT '{}', idempotency_key TEXT, created_by TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (opportunity_id, tenant_id, workspace_id) REFERENCES opportunities(id, tenant_id, workspace_id) ON DELETE CASCADE, UNIQUE (id, tenant_id, workspace_id), UNIQUE (opportunity_id), UNIQUE (tenant_id, workspace_id, idempotency_key));
CREATE TABLE IF NOT EXISTS domain_candidates (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, workspace_id TEXT NOT NULL, opportunity_id TEXT NOT NULL, business_context_id TEXT NOT NULL, label TEXT NOT NULL, normalized_label TEXT NOT NULL, description TEXT, rationale TEXT, status TEXT NOT NULL DEFAULT 'CANDIDATE', interpretation_type TEXT NOT NULL DEFAULT 'INFERRED', confidence REAL, source_type TEXT NOT NULL, source_reference TEXT, provenance_json TEXT NOT NULL DEFAULT '{}', solution TEXT, idempotency_key TEXT, created_by TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (opportunity_id, tenant_id, workspace_id) REFERENCES opportunities(id, tenant_id, workspace_id) ON DELETE CASCADE, FOREIGN KEY (business_context_id, tenant_id, workspace_id) REFERENCES business_contexts(id, tenant_id, workspace_id) ON DELETE CASCADE, UNIQUE (id, tenant_id, workspace_id), UNIQUE (business_context_id, normalized_label), UNIQUE (tenant_id, workspace_id, idempotency_key));
`

const tables = [
  'domain_candidates', 'business_contexts', 'opportunity_signals', 'opportunities', 'demand_signals',
  'audit_events', 'sessions', 'workspace_memberships', 'workspaces', 'tenant_memberships', 'users', 'tenants',
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
  return { data: body.data, cookie: response.headers.get('set-cookie')?.split(';')[0] || '' }
}

function headers(identity: Awaited<ReturnType<typeof register>>, workspaceId = identity.data.workspaceId, idempotencyKey?: string) {
  return {
    cookie: identity.cookie,
    'x-workspace-id': workspaceId,
    'content-type': 'application/json',
    ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}),
  }
}

async function opportunity(identity: Awaited<ReturnType<typeof register>>, workspaceId = identity.data.workspaceId) {
  const signalResponse = await SELF.fetch('https://nura.test/api/v1/signals', {
    method: 'POST',
    headers: headers(identity, workspaceId),
    body: JSON.stringify({ source_type: 'MANUAL', raw_content: 'A specialist operator coordinates uncommon cold-chain returns.' }),
  })
  const signal = await signalResponse.json<any>()
  const response = await SELF.fetch('https://nura.test/api/v1/opportunities/from-signal', {
    method: 'POST',
    headers: headers(identity, workspaceId),
    body: JSON.stringify({ signal_id: signal.data.id }),
  })
  return (await response.json<any>()).data
}

async function createContext(
  identity: Awaited<ReturnType<typeof register>>,
  opportunityId: string,
  overrides: Record<string, unknown> = {},
  workspaceId = identity.data.workspaceId,
  key?: string,
) {
  const response = await SELF.fetch('https://nura.test/api/v1/contexts', {
    method: 'POST',
    headers: headers(identity, workspaceId, key),
    body: JSON.stringify({
      opportunity_id: opportunityId,
      observed_facts: { note: 'Returns require temperature-controlled handling.' },
      business_characteristics: {},
      operating_context: null,
      channels: [],
      actors: [],
      constraints: ['temperature must remain controlled'],
      process_clues: [],
      unknowns: ['business size', 'monthly return volume', 'exact operating process'],
      source_type: 'MANUAL_INTERVIEW',
      source_reference: 'interview:return-operator-7',
      interpretation_type: 'OBSERVED',
      confidence: null,
      provenance: { captured_by_role: 'operator', source_signal: true },
      ...overrides,
    }),
  })
  return { response, body: await response.json<any>() }
}

async function createDomain(
  identity: Awaited<ReturnType<typeof register>>,
  opportunityId: string,
  contextId: string,
  label = 'Specialist Cold-Chain Returns Coordination',
  workspaceId = identity.data.workspaceId,
  key?: string,
) {
  const response = await SELF.fetch('https://nura.test/api/v1/domains/from-context', {
    method: 'POST',
    headers: headers(identity, workspaceId, key),
    body: JSON.stringify({
      opportunity_id: opportunityId,
      business_context_id: contextId,
      label,
      rationale: 'Candidate interpretation based on the observed context.',
      interpretation_type: 'INFERRED',
      confidence: 0.42,
      source_type: 'MANUAL_REVIEW',
      source_reference: 'review:phase-03',
      provenance: { based_on_context_id: contextId },
      tenant_id: 'attacker-controlled',
      workspace_id: 'attacker-controlled',
      solution: 'must-be-ignored',
    }),
  })
  return { response, body: await response.json<any>() }
}

describe('Nura Phase 03 Business Context and dynamic Domain Discovery', () => {
  it('creates unknown-first context and preserves observed provenance without fabricated values', async () => {
    const owner = await register('phase3-context@example.com', 'Tenant A', 'Workspace A')
    const formed = await opportunity(owner)
    const created = await createContext(owner, formed.id)

    expect(created.response.status).toBe(201)
    expect(created.body.data.opportunity_id).toBe(formed.id)
    expect(created.body.data.operating_context).toBeNull()
    expect(created.body.data.business_characteristics).toEqual({})
    expect(created.body.data.actors).toEqual([])
    expect(created.body.data.unknowns).toEqual(['business size', 'monthly return volume', 'exact operating process'])
    expect(created.body.data.source_reference).toBe('interview:return-operator-7')
    expect(created.body.data.interpretation_type).toBe('OBSERVED')
    expect(created.body.data.confidence).toBeNull()
    expect(created.body.data.provenance.captured_by_role).toBe('operator')
    expect(JSON.stringify(created.body.data)).not.toContain('50 employees')
    expect(JSON.stringify(created.body.data)).not.toContain('1,000 orders')
    expect(JSON.stringify(created.body.data)).not.toContain('ERP')
  })

  it('supports replay-safe context and domain mutations with conflicts for changed payloads', async () => {
    const owner = await register('phase3-replay@example.com', 'Tenant', 'Workspace')
    const formed = await opportunity(owner)
    const contextKey = crypto.randomUUID()
    const firstContext = await createContext(owner, formed.id, {}, owner.data.workspaceId, contextKey)
    const replayContext = await createContext(owner, formed.id, {}, owner.data.workspaceId, contextKey)
    expect(replayContext.response.status).toBe(200)
    expect(replayContext.body.data.id).toBe(firstContext.body.data.id)
    const changedContext = await createContext(owner, formed.id, { unknowns: ['different unknown'] }, owner.data.workspaceId, contextKey)
    expect(changedContext.response.status).toBe(409)

    const domainKey = crypto.randomUUID()
    const firstDomain = await createDomain(owner, formed.id, firstContext.body.data.id, undefined, owner.data.workspaceId, domainKey)
    const replayDomain = await createDomain(owner, formed.id, firstContext.body.data.id, undefined, owner.data.workspaceId, domainKey)
    expect(replayDomain.response.status).toBe(200)
    expect(replayDomain.body.data.id).toBe(firstDomain.body.data.id)
    const changedDomain = await createDomain(owner, formed.id, firstContext.body.data.id, 'A Different Dynamic Domain', owner.data.workspaceId, domainKey)
    expect(changedDomain.response.status).toBe(409)
  })

  it('accepts a previously unknown dynamic domain and preserves solution = null with full lineage', async () => {
    const owner = await register('phase3-domain@example.com', 'Tenant', 'Workspace')
    const formed = await opportunity(owner)
    const context = await createContext(owner, formed.id)
    const domain = await createDomain(owner, formed.id, context.body.data.id)

    expect(domain.response.status).toBe(201)
    expect(domain.body.data.label).toBe('Specialist Cold-Chain Returns Coordination')
    expect(domain.body.data.opportunity_id).toBe(formed.id)
    expect(domain.body.data.business_context_id).toBe(context.body.data.id)
    expect(domain.body.data.interpretation_type).toBe('INFERRED')
    expect(domain.body.data.status).toBe('CANDIDATE')
    expect(domain.body.data.solution).toBeNull()
    expect(domain.body.data.tenant_id).toBe(owner.data.tenantId)
    expect(domain.body.data.workspace_id).toBe(owner.data.workspaceId)

    const detail = await SELF.fetch(`https://nura.test/api/v1/domains/${domain.body.data.id}`, { headers: headers(owner) })
    expect((await detail.json<any>()).data.business_context_id).toBe(context.body.data.id)
  })

  it('does not force a domain candidate when context remains insufficient', async () => {
    const owner = await register('phase3-no-domain@example.com', 'Tenant', 'Workspace')
    const formed = await opportunity(owner)
    const context = await createContext(owner, formed.id, {
      observed_facts: {}, constraints: [], unknowns: ['exact domain', 'business model', 'operating process'],
      source_reference: null, provenance: {},
    })
    expect(context.response.status).toBe(201)
    const domains = await SELF.fetch('https://nura.test/api/v1/domains', { headers: headers(owner) })
    expect((await domains.json<any>()).data).toEqual([])
  })

  it('enforces tenant/workspace isolation, server-owned scope, and matching context relationships', async () => {
    const tenantA = await register('phase3-a@example.com', 'Tenant A', 'Workspace A')
    const tenantB = await register('phase3-b@example.com', 'Tenant B', 'Workspace B')
    const opportunityA = await opportunity(tenantA)
    const opportunityB = await opportunity(tenantB)
    const contextB = await createContext(tenantB, opportunityB.id, {
      tenant_id: tenantA.data.tenantId,
      workspace_id: tenantA.data.workspaceId,
    })
    expect(contextB.body.data.tenant_id).toBe(tenantB.data.tenantId)
    expect(contextB.body.data.workspace_id).toBe(tenantB.data.workspaceId)

    const crossTenantRead = await SELF.fetch(`https://nura.test/api/v1/contexts/${contextB.body.data.id}`, { headers: headers(tenantA) })
    expect(crossTenantRead.status).toBe(404)
    const crossTenantCreate = await createContext(tenantA, opportunityB.id)
    expect(crossTenantCreate.response.status).toBe(404)
    const mismatchedDomain = await createDomain(tenantA, opportunityA.id, contextB.body.data.id)
    expect(mismatchedDomain.response.status).toBe(404)

    const workspaceResponse = await SELF.fetch('https://nura.test/api/v1/workspaces', {
      method: 'POST', headers: headers(tenantA), body: JSON.stringify({ name: 'Workspace A2' }),
    })
    const workspaceTwo = (await workspaceResponse.json<any>()).data
    const workspaceRead = await SELF.fetch(`https://nura.test/api/v1/contexts/${contextB.body.data.id}`, {
      headers: headers(tenantA, workspaceTwo.id),
    })
    expect(workspaceRead.status).toBe(404)
  })

  it('records append-oriented context/domain create and replay audit events', async () => {
    const owner = await register('phase3-audit@example.com', 'Tenant', 'Workspace')
    const formed = await opportunity(owner)
    const contextKey = crypto.randomUUID()
    const context = await createContext(owner, formed.id, {}, owner.data.workspaceId, contextKey)
    await createContext(owner, formed.id, {}, owner.data.workspaceId, contextKey)
    const domainKey = crypto.randomUUID()
    await createDomain(owner, formed.id, context.body.data.id, undefined, owner.data.workspaceId, domainKey)
    await createDomain(owner, formed.id, context.body.data.id, undefined, owner.data.workspaceId, domainKey)

    const events = await env.DB.prepare(`SELECT action, actor_id, request_id, correlation_id, metadata_json
      FROM audit_events WHERE tenant_id = ? AND workspace_id = ?`)
      .bind(owner.data.tenantId, owner.data.workspaceId)
      .all<{ action: string; actor_id: string; request_id: string; correlation_id: string; metadata_json: string }>()
    const actions = events.results.map((event) => event.action)
    expect(actions).toContain('BUSINESS_CONTEXT_CREATED')
    expect(actions).toContain('BUSINESS_CONTEXT_DEDUPLICATED')
    expect(actions).toContain('DOMAIN_CANDIDATE_CREATED')
    expect(actions).toContain('DOMAIN_CANDIDATE_DEDUPLICATED')
    expect(events.results.every((event) => event.actor_id && event.request_id && event.correlation_id)).toBe(true)
  })
})
