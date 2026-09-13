import { AppError } from './errors'
import type { RequestContext, Role } from '../types'

const workspaceCreators: Role[] = ['tenant_owner']
const discoveryWriters: Role[] = ['tenant_owner', 'workspace_admin', 'operator']

export function requireWorkspaceCreate(context: RequestContext): void {
  if (!workspaceCreators.includes(context.tenantRole)) {
    throw new AppError(403, 'FORBIDDEN', 'Tenant owner permission is required.')
  }
}

export function requireDiscoveryWrite(context: RequestContext): void {
  if (!discoveryWriters.includes(context.tenantRole) && !discoveryWriters.includes(context.workspaceRole)) {
    throw new AppError(403, 'FORBIDDEN', 'Discovery write permission is required.')
  }
}
