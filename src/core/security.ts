import { AppError } from './errors'
import type { OwnedResource, RequestContext } from '../types'

const encoder = new TextEncoder()

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return bytesToHex(new Uint8Array(digest))
}

export async function hashPassword(password: string, salt: string = crypto.randomUUID()): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 120_000 },
    key,
    256,
  )
  return `pbkdf2_sha256$120000$${salt}$${bytesToHex(new Uint8Array(bits))}`
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, iterations, salt, expected] = encoded.split('$')
  if (algorithm !== 'pbkdf2_sha256' || iterations !== '120000' || !salt || !expected) return false
  const actual = await hashPassword(password, salt)
  return timingSafeEqual(actual, encoded)
}

export function assertOwnedResource(context: RequestContext, resource: OwnedResource): void {
  if (resource.tenantId !== context.tenantId || resource.workspaceId !== context.workspaceId) {
    throw new AppError(403, 'FORBIDDEN', 'Resource is outside the authorized workspace boundary.')
  }
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return difference === 0
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
