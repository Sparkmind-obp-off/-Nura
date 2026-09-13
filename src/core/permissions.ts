import { AppError } from './errors'
import type { RequestContext, Role } from '../types'

const workspaceCreators: Role[] = ['tenant_owner']

export function requireWorkspaceCreate(context: RequestContext): void {
  if (!workspaceCreators.includes(context.tenantRole)) {
    throw new AppError(403, 'FORBIDDEN', 'Tenant owner permission is required.')
  }
}
