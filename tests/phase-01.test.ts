import { env, SELF } from 'cloudflare:test'
import { beforeEach, describe, expect, it } from 'vitest'
import { assertOwnedResource } from '../src/core/security'
import type { RequestContext } from '../src/types'

const migration = `
CREATE TABLE IF NOT EXISTS tenants (id TEXT PRIMARY KEY, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS tenant_memberships (tenant_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (tenant_id, user_id), FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS workspaces (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE (tenant_id, name), FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS workspace_memberships (workspace_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (workspace_id, user_id), FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, tenant_id TEXT, workspace_id TEXT, actor_type TEXT NOT NULL, actor_id TEXT, action TEXT NOT NULL, target_type TEXT NOT NULL, target_id TEXT, request_id TEXT NOT NULL, correlation_id TEXT NOT NULL, result TEXT NOT NULL, metadata_json TEXT NOT NULL DEFAULT '{}', occurred_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`

beforeEach(async () => {
  for (const statement of migration.split(';').map((value) => value.trim()).filter(Boolean)) {
    await env.DB.prepare(statement).run()
  }
  for (const table of ['audit_events', 'sessions', 'workspace_memberships', 'workspaces', 'tenant_memberships', 'users', 'tenants']) {
    await env.DB.prepare(`DELETE FROM ${table}`).run()
  }
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

function authHeaders(cookie: string, workspaceId?: string) {
  return {
    cookie,
    ...(workspaceId ? { 'x-workspace-id': workspaceId } : {}),
  }
}

describe('Nura Phase 01 identity and ownership foundation', () => {
  it('A — initializes a tenant, owner, and workspace', async () => {
    const created = await register('owner-a@example.com', 'Tenant A', 'Discovery A')
    expect(created.response.status).toBe(201)
    expect(created.data.tenantId).toBeTruthy()
    expect(created.data.workspaceId).toBeTruthy()
    const tenant = await env.DB.prepare('SELECT name FROM tenants WHERE id = ?').bind(created.data.tenantId).first()
    expect(tenant?.name).toBe('Tenant A')
  })

  it('B — keeps each workspace attached to its expected tenant', async () => {
    const created = await register('owner-b@example.com', 'Tenant B', 'Discovery B')
    const workspace = await env.DB.prepare('SELECT tenant_id FROM workspaces WHERE id = ?').bind(created.data.workspaceId).first()
    expect(workspace?.tenant_id).toBe(created.data.tenantId)
  })

  it('C — denies cross-tenant workspace access', async () => {
    const tenantA = await register('a@example.com', 'Tenant A', 'Workspace A')
    const tenantB = await register('b@example.com', 'Tenant B', 'Workspace B')
    const response = await SELF.fetch(`https://nura.test/api/v1/workspaces/${tenantB.data.workspaceId}`, {
      headers: authHeaders(tenantA.cookie, tenantB.data.workspaceId),
    })
    expect([401, 403, 404]).toContain(response.status)
  })

  it('D — denies an unauthorized workspace context inside a tenant', async () => {
    const owner = await register('owner@example.com', 'Tenant', 'Authorized')
    const unauthorizedWorkspaceId = crypto.randomUUID()
    await env.DB.prepare('INSERT INTO workspaces (id, tenant_id, name) VALUES (?, ?, ?)')
      .bind(unauthorizedWorkspaceId, owner.data.tenantId, 'Unauthorized')
      .run()
    const response = await SELF.fetch('https://nura.test/api/v1/auth/session', {
      headers: authHeaders(owner.cookie, unauthorizedWorkspaceId),
    })
    expect(response.status).toBe(401)
  })

  it('E — ignores client-supplied ownership fields when creating a workspace', async () => {
    const owner = await register('owner@example.com', 'Tenant A', 'Workspace A')
    const other = await register('other@example.com', 'Tenant B', 'Workspace B')
    const response = await SELF.fetch('https://nura.test/api/v1/workspaces', {
      method: 'POST',
      headers: { ...authHeaders(owner.cookie, owner.data.workspaceId), 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Workspace A2', tenant_id: other.data.tenantId, workspace_id: other.data.workspaceId }),
    })
    const body = await response.json<any>()
    expect(response.status).toBe(201)
    expect(body.data.tenant_id).toBe(owner.data.tenantId)
    expect(body.data.tenant_id).not.toBe(other.data.tenantId)
  })

  it('F — resolves request context to the selected authorized workspace', async () => {
    const owner = await register('owner@example.com', 'Tenant A', 'Workspace A')
    const createResponse = await SELF.fetch('https://nura.test/api/v1/workspaces', {
      method: 'POST',
      headers: { ...authHeaders(owner.cookie, owner.data.workspaceId), 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Workspace A2' }),
    })
    const created = await createResponse.json<any>()
    const response = await SELF.fetch('https://nura.test/api/v1/auth/session', {
      headers: authHeaders(owner.cookie, created.data.id),
    })
    const body = await response.json<any>()
    expect(response.status).toBe(200)
    expect(body.data.workspace_id).toBe(created.data.id)
    expect(body.data.tenant_id).toBe(owner.data.tenantId)
  })

  it('G — exposes a safe runtime health check and request ID', async () => {
    const response = await SELF.fetch('https://nura.test/health')
    const body = await response.json<any>()
    expect(response.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.request_id).toBeTruthy()
    expect(response.headers.get('x-request-id')).toBe(body.request_id)
  })

  it('H — provides a reusable ownership assertion for future Discovery objects', () => {
    const context: RequestContext = {
      userId: 'user-a', tenantId: 'tenant-a', workspaceId: 'workspace-a',
      tenantRole: 'tenant_owner', workspaceRole: 'workspace_admin',
      requestId: 'request-a', correlationId: 'correlation-a',
    }
    expect(() => assertOwnedResource(context, { tenantId: 'tenant-a', workspaceId: 'workspace-a' })).not.toThrow()
    expect(() => assertOwnedResource(context, { tenantId: 'tenant-a', workspaceId: 'workspace-b' })).toThrow(/outside/)
    expect(() => assertOwnedResource(context, { tenantId: 'tenant-b', workspaceId: 'workspace-a' })).toThrow(/outside/)
  })
})
