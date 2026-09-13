import type { RequestContext, Role } from '../types'

type BootstrapInput = {
  email: string
  passwordHash: string
  tenantName: string
  workspaceName: string
  requestId: string
  correlationId: string
}

type SessionIdentityRow = {
  user_id: string
  tenant_id: string
  workspace_id: string
  tenant_role: Role
  workspace_role: Role
}

export async function createBootstrap(db: D1Database, input: BootstrapInput) {
  const tenantId = crypto.randomUUID()
  const workspaceId = crypto.randomUUID()
  const userId = crypto.randomUUID()
  const auditId = crypto.randomUUID()

  await db.batch([
    db.prepare('INSERT INTO tenants (id, name) VALUES (?, ?)').bind(tenantId, input.tenantName),
    db.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)').bind(userId, input.email, input.passwordHash),
    db.prepare("INSERT INTO tenant_memberships (tenant_id, user_id, role) VALUES (?, ?, 'tenant_owner')").bind(tenantId, userId),
    db.prepare('INSERT INTO workspaces (id, tenant_id, name) VALUES (?, ?, ?)').bind(workspaceId, tenantId, input.workspaceName),
    db.prepare("INSERT INTO workspace_memberships (workspace_id, user_id, role) VALUES (?, ?, 'workspace_admin')").bind(workspaceId, userId),
    db.prepare(`INSERT INTO audit_events
      (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result)
      VALUES (?, ?, ?, 'user', ?, 'tenant.bootstrap', 'tenant', ?, ?, ?, 'success')`)
      .bind(auditId, tenantId, workspaceId, userId, tenantId, input.requestId, input.correlationId),
  ])

  return { tenantId, workspaceId, userId }
}

export async function findUserByEmail(db: D1Database, email: string) {
  return db.prepare('SELECT id, email, password_hash FROM users WHERE email = ? AND status = ?')
    .bind(email, 'active')
    .first<{ id: string; email: string; password_hash: string }>()
}

export async function createSession(db: D1Database, userId: string, tokenHash: string) {
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  await db.prepare('INSERT INTO sessions (id, token_hash, user_id, expires_at) VALUES (?, ?, ?, ?)')
    .bind(id, tokenHash, userId, expiresAt)
    .run()
  return { id, expiresAt }
}

export async function deleteSession(db: D1Database, tokenHash: string) {
  await db.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run()
}

export async function resolveSession(
  db: D1Database,
  tokenHash: string,
  requestedWorkspaceId?: string,
): Promise<Omit<RequestContext, 'requestId' | 'correlationId'> | null> {
  const workspaceClause = requestedWorkspaceId ? 'AND w.id = ?' : ''
  const query = `SELECT
      u.id AS user_id,
      t.id AS tenant_id,
      w.id AS workspace_id,
      tm.role AS tenant_role,
      wm.role AS workspace_role
    FROM sessions s
    JOIN users u ON u.id = s.user_id AND u.status = 'active'
    JOIN tenant_memberships tm ON tm.user_id = u.id
    JOIN tenants t ON t.id = tm.tenant_id AND t.status = 'active'
    JOIN workspaces w ON w.tenant_id = t.id AND w.status = 'active'
    JOIN workspace_memberships wm ON wm.workspace_id = w.id AND wm.user_id = u.id
    WHERE s.token_hash = ? AND s.expires_at > ? ${workspaceClause}
    ORDER BY w.created_at ASC
    LIMIT 1`
  const statement = db.prepare(query)
  const row = await (requestedWorkspaceId
    ? statement.bind(tokenHash, new Date().toISOString(), requestedWorkspaceId)
    : statement.bind(tokenHash, new Date().toISOString()))
    .first<SessionIdentityRow>()

  if (!row) return null
  return {
    userId: row.user_id,
    tenantId: row.tenant_id,
    workspaceId: row.workspace_id,
    tenantRole: row.tenant_role,
    workspaceRole: row.workspace_role,
  }
}

export async function currentIdentity(db: D1Database, context: RequestContext) {
  return db.prepare(`SELECT u.id AS user_id, u.email, t.id AS tenant_id, t.name AS tenant_name,
      w.id AS workspace_id, w.name AS workspace_name, tm.role AS tenant_role, wm.role AS workspace_role
    FROM users u
    JOIN tenant_memberships tm ON tm.user_id = u.id AND tm.tenant_id = ?
    JOIN tenants t ON t.id = tm.tenant_id
    JOIN workspaces w ON w.tenant_id = t.id AND w.id = ?
    JOIN workspace_memberships wm ON wm.workspace_id = w.id AND wm.user_id = u.id
    WHERE u.id = ?`)
    .bind(context.tenantId, context.workspaceId, context.userId)
    .first()
}

export async function listAuthorizedWorkspaces(db: D1Database, context: RequestContext) {
  const result = await db.prepare(`SELECT w.id, w.tenant_id, w.name, w.status, wm.role
    FROM workspaces w
    JOIN workspace_memberships wm ON wm.workspace_id = w.id AND wm.user_id = ?
    WHERE w.tenant_id = ? AND w.status = 'active'
    ORDER BY w.created_at ASC`)
    .bind(context.userId, context.tenantId)
    .all()
  return result.results
}

export async function findAuthorizedWorkspace(db: D1Database, context: RequestContext, workspaceId: string) {
  return db.prepare(`SELECT w.id, w.tenant_id, w.name, w.status, wm.role
    FROM workspaces w
    JOIN workspace_memberships wm ON wm.workspace_id = w.id AND wm.user_id = ?
    WHERE w.id = ? AND w.tenant_id = ? AND w.status = 'active'`)
    .bind(context.userId, workspaceId, context.tenantId)
    .first<{ id: string; tenant_id: string; name: string; status: string; role: Role }>()
}

export async function createWorkspace(db: D1Database, context: RequestContext, name: string) {
  const workspaceId = crypto.randomUUID()
  const auditId = crypto.randomUUID()
  await db.batch([
    db.prepare('INSERT INTO workspaces (id, tenant_id, name) VALUES (?, ?, ?)').bind(workspaceId, context.tenantId, name),
    db.prepare("INSERT INTO workspace_memberships (workspace_id, user_id, role) VALUES (?, ?, 'workspace_admin')")
      .bind(workspaceId, context.userId),
    db.prepare(`INSERT INTO audit_events
      (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result)
      VALUES (?, ?, ?, 'user', ?, 'workspace.create', 'workspace', ?, ?, ?, 'success')`)
      .bind(auditId, context.tenantId, workspaceId, context.userId, workspaceId, context.requestId, context.correlationId),
  ])
  return findAuthorizedWorkspace(db, { ...context, workspaceId }, workspaceId)
}
