export type Role = 'tenant_owner' | 'workspace_admin' | 'operator' | 'reviewer' | 'viewer'

export type Bindings = {
  DB: D1Database
  ALLOW_PUBLIC_SIGNUP?: string
}

export type RequestContext = {
  requestId: string
  correlationId: string
  userId: string
  tenantId: string
  workspaceId: string
  tenantRole: Role
  workspaceRole: Role
}

export type Variables = {
  requestId: string
  correlationId: string
  auth: RequestContext
}

export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}

export type OwnedResource = {
  tenantId: string
  workspaceId: string
}
