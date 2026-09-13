import { AppError } from './errors'

export function requireObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'A JSON object is required.')
  }
  return value as Record<string, unknown>
}

export function requireString(input: Record<string, unknown>, field: string, min = 1, max = 120): string {
  const value = input[field]
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new AppError(400, 'VALIDATION_ERROR', `${field} must contain ${min}-${max} characters.`, { field })
  }
  return value.trim()
}

export function requireObservedContent(input: Record<string, unknown>, field: string, max = 5_000): string {
  const value = input[field]
  if (typeof value !== 'string' || value.trim().length < 1 || value.length > max) {
    throw new AppError(400, 'VALIDATION_ERROR', `${field} must contain 1-${max} characters.`, { field })
  }
  return value
}

export function requireEmail(input: Record<string, unknown>): string {
  const email = requireString(input, 'email', 3, 254).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'email is invalid.', { field: 'email' })
  }
  return email
}

export function optionalString(input: Record<string, unknown>, field: string, max = 500): string | null {
  const value = input[field]
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || value.trim().length > max) {
    throw new AppError(400, 'VALIDATION_ERROR', `${field} must contain at most ${max} characters.`, { field })
  }
  return value.trim()
}

export function requireEnum<T extends string>(
  input: Record<string, unknown>,
  field: string,
  values: readonly T[],
): T {
  const value = input[field]
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new AppError(400, 'VALIDATION_ERROR', `${field} is invalid.`, { field, allowed: values })
  }
  return value as T
}

export function requireUuid(value: string, field = 'id'): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', `${field} must be a valid UUID.`, { field })
  }
  return value
}

export function optionalMetadata(input: Record<string, unknown>): Record<string, unknown> {
  const value = input.metadata
  if (value === undefined || value === null) return {}
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'metadata must be a JSON object.', { field: 'metadata' })
  }
  const serialized = JSON.stringify(value)
  if (serialized.length > 4_000) {
    throw new AppError(400, 'VALIDATION_ERROR', 'metadata is too large.', { field: 'metadata' })
  }
  return value as Record<string, unknown>
}
