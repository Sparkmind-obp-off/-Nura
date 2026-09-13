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

export function requireEmail(input: Record<string, unknown>): string {
  const email = requireString(input, 'email', 3, 254).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError(400, 'VALIDATION_ERROR', 'email is invalid.', { field: 'email' })
  }
  return email
}
