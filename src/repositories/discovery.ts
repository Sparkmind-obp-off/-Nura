import { AppError } from '../core/errors'
import type { RequestContext } from '../types'

export const SIGNAL_SOURCE_TYPES = ['MANUAL', 'WEB', 'SOCIAL', 'MARKETPLACE', 'REFERRAL', 'DIRECT', 'OTHER'] as const
export type SignalSourceType = typeof SIGNAL_SOURCE_TYPES[number]

export const OPPORTUNITY_STATUSES = ['NEW', 'REVIEW', 'QUALIFIED', 'DISMISSED'] as const
export type OpportunityStatus = typeof OPPORTUNITY_STATUSES[number]

export type CreateSignalInput = {
  sourceType: SignalSourceType
  sourceReference: string | null
  externalId: string | null
  rawContent: string
  normalizedContent: string
  captureMechanism: string
  metadata: Record<string, unknown>
  idempotencyKey: string | null
}

type SignalRow = {
  id: string
  tenant_id: string
  workspace_id: string
  source_type: SignalSourceType
  source_reference: string | null
  external_id: string | null
  raw_content: string
  normalized_content: string
  captured_at: string
  captured_by: string | null
  capture_mechanism: string
  status: 'CAPTURED' | 'NORMALIZED' | 'LINKED' | 'DISMISSED'
  metadata_json: string
  idempotency_key: string | null
  created_at: string
  updated_at: string
}

type OpportunityRow = {
  id: string
  tenant_id: string
  workspace_id: string
  title: string
  summary: string
  status: OpportunityStatus
  created_by: string | null
  created_at: string
  updated_at: string
  source_signal_count?: number
}

const transitions: Record<OpportunityStatus, OpportunityStatus[]> = {
  NEW: ['REVIEW', 'DISMISSED'],
  REVIEW: ['QUALIFIED', 'DISMISSED'],
  QUALIFIED: ['REVIEW', 'DISMISSED'],
  DISMISSED: ['REVIEW'],
}

function signalView(row: SignalRow) {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    workspace_id: row.workspace_id,
    source_type: row.source_type,
    source_reference: row.source_reference,
    external_id: row.external_id,
    raw_content: row.raw_content,
    normalized_content: row.normalized_content,
    captured_at: row.captured_at,
    captured_by: row.captured_by,
    capture_mechanism: row.capture_mechanism,
    status: row.status,
    metadata: JSON.parse(row.metadata_json) as Record<string, unknown>,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function opportunityView(row: OpportunityRow, signalIds: string[] = []) {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    workspace_id: row.workspace_id,
    title: row.title,
    summary: row.summary,
    status: row.status,
    source_signal_count: row.source_signal_count ?? signalIds.length,
    signal_ids: signalIds,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

async function audit(
  db: D1Database,
  context: RequestContext,
  action: string,
  targetType: string,
  targetId: string,
  metadata: Record<string, unknown> = {},
) {
  await db.prepare(`INSERT INTO audit_events
    (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
    VALUES (?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, 'success', ?)`) 
    .bind(
      crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId,
      action, targetType, targetId, context.requestId, context.correlationId, JSON.stringify(metadata),
    )
    .run()
}

export async function createDemandSignal(db: D1Database, context: RequestContext, input: CreateSignalInput) {
  const duplicate = await findDuplicateSignal(db, context, input)
  if (duplicate) {
    if (input.idempotencyKey && duplicate.idempotency_key === input.idempotencyKey && (
      duplicate.source_type !== input.sourceType
      || duplicate.raw_content !== input.rawContent
      || duplicate.source_reference !== input.sourceReference
      || duplicate.external_id !== input.externalId
    )) {
      throw new AppError(409, 'CONFLICT', 'Idempotency-Key was already used with different signal data.')
    }
    await audit(db, context, 'DEMAND_SIGNAL_DEDUPLICATED', 'demand_signal', duplicate.id, {
      source_type: input.sourceType,
      external_id: input.externalId,
      idempotency_key_present: Boolean(input.idempotencyKey),
    })
    return { signal: signalView(duplicate), created: false }
  }

  const id = crypto.randomUUID()
  const capturedAt = new Date().toISOString()
  try {
    await db.batch([
      db.prepare(`INSERT INTO demand_signals
        (id, tenant_id, workspace_id, source_type, source_reference, external_id, raw_content, normalized_content,
         captured_at, captured_by, capture_mechanism, status, metadata_json, idempotency_key)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NORMALIZED', ?, ?)`) 
        .bind(
          id, context.tenantId, context.workspaceId, input.sourceType, input.sourceReference, input.externalId,
          input.rawContent, input.normalizedContent, capturedAt, context.userId, input.captureMechanism,
          JSON.stringify(input.metadata), input.idempotencyKey,
        ),
      db.prepare(`INSERT INTO audit_events
        (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
        VALUES (?, ?, ?, 'user', ?, 'DEMAND_SIGNAL_CREATED', 'demand_signal', ?, ?, ?, 'success', ?)`) 
        .bind(
          crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId, id,
          context.requestId, context.correlationId,
          JSON.stringify({ source_type: input.sourceType, external_id: input.externalId, capture_mechanism: input.captureMechanism }),
        ),
    ])
  } catch (error) {
    if (String(error).includes('UNIQUE')) {
      const replay = await findDuplicateSignal(db, context, input)
      if (replay) return { signal: signalView(replay), created: false }
    }
    throw error
  }

  const signal = await getDemandSignal(db, context, id)
  if (!signal) throw new AppError(500, 'INTERNAL_ERROR', 'Demand signal could not be retrieved after creation.')
  return { signal, created: true }
}

async function findDuplicateSignal(db: D1Database, context: RequestContext, input: CreateSignalInput) {
  if (input.externalId) {
    return db.prepare(`SELECT * FROM demand_signals
      WHERE tenant_id = ? AND workspace_id = ? AND source_type = ? AND external_id = ?`)
      .bind(context.tenantId, context.workspaceId, input.sourceType, input.externalId)
      .first<SignalRow>()
  }
  if (input.idempotencyKey) {
    return db.prepare(`SELECT * FROM demand_signals
      WHERE tenant_id = ? AND workspace_id = ? AND idempotency_key = ?`)
      .bind(context.tenantId, context.workspaceId, input.idempotencyKey)
      .first<SignalRow>()
  }
  return null
}

export async function listDemandSignals(db: D1Database, context: RequestContext) {
  const result = await db.prepare(`SELECT * FROM demand_signals
    WHERE tenant_id = ? AND workspace_id = ? ORDER BY created_at DESC, id DESC LIMIT 100`)
    .bind(context.tenantId, context.workspaceId)
    .all<SignalRow>()
  return result.results.map(signalView)
}

export async function getDemandSignal(db: D1Database, context: RequestContext, id: string) {
  const row = await db.prepare(`SELECT * FROM demand_signals WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(id, context.tenantId, context.workspaceId)
    .first<SignalRow>()
  return row ? signalView(row) : null
}

export async function formOpportunity(
  db: D1Database,
  context: RequestContext,
  signalId: string,
  overrides: { title?: string; summary?: string },
) {
  const signal = await db.prepare(`SELECT * FROM demand_signals WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(signalId, context.tenantId, context.workspaceId)
    .first<SignalRow>()
  if (!signal) throw new AppError(404, 'NOT_FOUND', 'Demand signal was not found in the authorized workspace.')
  if (signal.status === 'DISMISSED') throw new AppError(409, 'CONFLICT', 'A dismissed signal cannot form an opportunity.')

  const existing = await db.prepare(`SELECT o.*, 1 AS source_signal_count FROM opportunities o
    JOIN opportunity_signals os ON os.opportunity_id = o.id
    WHERE os.signal_id = ? AND o.tenant_id = ? AND o.workspace_id = ?`)
    .bind(signalId, context.tenantId, context.workspaceId)
    .first<OpportunityRow>()
  if (existing) return { opportunity: opportunityView(existing, [signalId]), created: false }

  const id = crypto.randomUUID()
  const title = overrides.title || conservativeTitle(signal.normalized_content)
  const summary = overrides.summary || signal.normalized_content.slice(0, 500)
  await db.batch([
    db.prepare(`INSERT INTO opportunities (id, tenant_id, workspace_id, title, summary, status, created_by)
      VALUES (?, ?, ?, ?, ?, 'NEW', ?)`) 
      .bind(id, context.tenantId, context.workspaceId, title, summary, context.userId),
    db.prepare(`INSERT INTO opportunity_signals (opportunity_id, signal_id, tenant_id, workspace_id)
      VALUES (?, ?, ?, ?)`) 
      .bind(id, signalId, context.tenantId, context.workspaceId),
    db.prepare(`UPDATE demand_signals SET status = 'LINKED', updated_at = ?
      WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
      .bind(new Date().toISOString(), signalId, context.tenantId, context.workspaceId),
    db.prepare(`INSERT INTO audit_events
      (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
      VALUES (?, ?, ?, 'user', ?, 'OPPORTUNITY_CREATED', 'opportunity', ?, ?, ?, 'success', ?)`) 
      .bind(
        crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId, id,
        context.requestId, context.correlationId, JSON.stringify({ source_signal_id: signalId }),
      ),
  ])

  const opportunity = await getOpportunity(db, context, id)
  if (!opportunity) throw new AppError(500, 'INTERNAL_ERROR', 'Opportunity could not be retrieved after creation.')
  return { opportunity, created: true }
}

export async function listOpportunities(db: D1Database, context: RequestContext) {
  const result = await db.prepare(`SELECT o.*, COUNT(os.signal_id) AS source_signal_count
    FROM opportunities o LEFT JOIN opportunity_signals os ON os.opportunity_id = o.id
    WHERE o.tenant_id = ? AND o.workspace_id = ?
    GROUP BY o.id ORDER BY o.created_at DESC, o.id DESC LIMIT 100`)
    .bind(context.tenantId, context.workspaceId)
    .all<OpportunityRow>()
  return result.results.map((row) => opportunityView(row))
}

export async function getOpportunity(db: D1Database, context: RequestContext, id: string) {
  const row = await db.prepare(`SELECT o.*, COUNT(os.signal_id) AS source_signal_count
    FROM opportunities o LEFT JOIN opportunity_signals os ON os.opportunity_id = o.id
    WHERE o.id = ? AND o.tenant_id = ? AND o.workspace_id = ? GROUP BY o.id`)
    .bind(id, context.tenantId, context.workspaceId)
    .first<OpportunityRow>()
  if (!row) return null
  const links = await db.prepare(`SELECT signal_id FROM opportunity_signals
    WHERE opportunity_id = ? AND tenant_id = ? AND workspace_id = ? ORDER BY linked_at`)
    .bind(id, context.tenantId, context.workspaceId)
    .all<{ signal_id: string }>()
  return opportunityView(row, links.results.map((link) => link.signal_id))
}

export async function updateOpportunityStatus(
  db: D1Database,
  context: RequestContext,
  id: string,
  status: OpportunityStatus,
) {
  const current = await db.prepare(`SELECT * FROM opportunities WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(id, context.tenantId, context.workspaceId)
    .first<OpportunityRow>()
  if (!current) throw new AppError(404, 'NOT_FOUND', 'Opportunity was not found in the authorized workspace.')
  if (current.status === status) return getOpportunity(db, context, id)
  if (!transitions[current.status].includes(status)) {
    throw new AppError(409, 'CONFLICT', `Opportunity cannot transition from ${current.status} to ${status}.`)
  }
  const now = new Date().toISOString()
  const action = status === 'DISMISSED' ? 'OPPORTUNITY_DISMISSED' : 'OPPORTUNITY_UPDATED'
  await db.batch([
    db.prepare(`UPDATE opportunities SET status = ?, updated_at = ?
      WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
      .bind(status, now, id, context.tenantId, context.workspaceId),
    db.prepare(`INSERT INTO audit_events
      (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
      VALUES (?, ?, ?, 'user', ?, ?, 'opportunity', ?, ?, ?, 'success', ?)`) 
      .bind(
        crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId, action, id,
        context.requestId, context.correlationId, JSON.stringify({ from: current.status, to: status }),
      ),
  ])
  return getOpportunity(db, context, id)
}

function conservativeTitle(content: string) {
  const firstLine = content.split(/[.!?\n]/, 1)[0].trim()
  const title = firstLine || content.trim()
  return title.length > 100 ? `${title.slice(0, 97)}...` : title
}
