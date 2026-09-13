import type { Context } from 'hono'
import type { AppEnv } from '../types'

export function success(c: Context<AppEnv>, data: unknown, status: 200 | 201 = 200) {
  return c.json({ data, meta: { request_id: c.get('requestId') } }, status)
}
