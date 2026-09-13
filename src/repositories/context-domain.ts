import { AppError } from '../core/errors'
import type { RequestContext } from '../types'

export const INTERPRETATION_TYPES = ['OBSERVED', 'INFERRED'] as const
export type InterpretationType = typeof INTERPRETATION_TYPES[number]

export type CreateBusinessContextInput = {
  opportunityId: string
  observedFacts: Record<string, unknown>
  businessCharacteristics: Record<string, unknown>
  operatingContext: string | null
  channels: string[]
  actors: string[]
  constraints: string[]
  processClues: string[]
  unknowns: string[]
  sourceType: string
  sourceReference: string | null
  interpretationType: InterpretationType
  confidence: number | null
  provenance: Record<string, unknown>
  idempotencyKey: string | null
}

export type CreateDomainCandidateInput = {
  opportunityId: string
  businessContextId: string
  label: string
  description: string | null
  rationale: string | null
  interpretationType: InterpretationType
  confidence: number | null
  sourceType: string
  sourceReference: string | null
  provenance: Record<string, unknown>
  idempotencyKey: string | null
}

type BusinessContextRow = {
  id: string
  tenant_id: string
  workspace_id: string
  opportunity_id: string
  observed_facts_json: string
  business_characteristics_json: string
  operating_context: string | null
  channels_json: string
  actors_json: string
  constraints_json: string
  process_clues_json: string
  unknowns_json: string
  source_type: string
  source_reference: string | null
  interpretation_type: InterpretationType
  confidence: number | null
  provenance_json: string
  idempotency_key: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

type DomainCandidateRow = {
  id: string
  tenant_id: string
  workspace_id: string
  opportunity_id: string
  business_context_id: string
  label: string
  normalized_label: string
  description: string | null
  rationale: string | null
  status: 'CANDIDATE' | 'OBSERVED'
  interpretation_type: InterpretationType
  confidence: number | null
  source_type: string
  source_reference: string | null
  provenance_json: string
  solution: string | null
  idempotency_key: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

function parseObject(value: string): Record<string, unknown> {
  return JSON.parse(value) as Record<string, unknown>
}

function parseStrings(value: string): string[] {
  return JSON.parse(value) as string[]
}

function contextView(row: BusinessContextRow) {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    workspace_id: row.workspace_id,
    opportunity_id: row.opportunity_id,
    observed_facts: parseObject(row.observed_facts_json),
    business_characteristics: parseObject(row.business_characteristics_json),
    operating_context: row.operating_context,
    channels: parseStrings(row.channels_json),
    actors: parseStrings(row.actors_json),
    constraints: parseStrings(row.constraints_json),
    process_clues: parseStrings(row.process_clues_json),
    unknowns: parseStrings(row.unknowns_json),
    source_type: row.source_type,
    source_reference: row.source_reference,
    interpretation_type: row.interpretation_type,
    confidence: row.confidence,
    provenance: parseObject(row.provenance_json),
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function domainView(row: DomainCandidateRow) {
  return {
    id: row.id,
    tenant_id: row.tenant_id,
    workspace_id: row.workspace_id,
    opportunity_id: row.opportunity_id,
    business_context_id: row.business_context_id,
    label: row.label,
    description: row.description,
    rationale: row.rationale,
    status: row.status,
    interpretation_type: row.interpretation_type,
    confidence: row.confidence,
    source_type: row.source_type,
    source_reference: row.source_reference,
    provenance: parseObject(row.provenance_json),
    solution: row.solution,
    created_by: row.created_by,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

function contextMatches(row: BusinessContextRow, input: CreateBusinessContextInput): boolean {
  return row.opportunity_id === input.opportunityId
    && row.observed_facts_json === JSON.stringify(input.observedFacts)
    && row.business_characteristics_json === JSON.stringify(input.businessCharacteristics)
    && row.operating_context === input.operatingContext
    && row.channels_json === JSON.stringify(input.channels)
    && row.actors_json === JSON.stringify(input.actors)
    && row.constraints_json === JSON.stringify(input.constraints)
    && row.process_clues_json === JSON.stringify(input.processClues)
    && row.unknowns_json === JSON.stringify(input.unknowns)
    && row.source_type === input.sourceType
    && row.source_reference === input.sourceReference
    && row.interpretation_type === input.interpretationType
    && row.confidence === input.confidence
    && row.provenance_json === JSON.stringify(input.provenance)
}

async function audit(
  db: D1Database,
  context: RequestContext,
  action: string,
  targetType: string,
  targetId: string,
  metadata: Record<string, unknown>,
) {
  await db.prepare(`INSERT INTO audit_events
    (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
    VALUES (?, ?, ?, 'user', ?, ?, ?, ?, ?, ?, 'success', ?)`) 
    .bind(
      crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId, action, targetType,
      targetId, context.requestId, context.correlationId, JSON.stringify(metadata),
    )
    .run()
}

async function ownedOpportunityExists(db: D1Database, context: RequestContext, opportunityId: string) {
  return Boolean(await db.prepare(`SELECT id FROM opportunities WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(opportunityId, context.tenantId, context.workspaceId)
    .first())
}

export async function createBusinessContext(
  db: D1Database,
  context: RequestContext,
  input: CreateBusinessContextInput,
) {
  if (!(await ownedOpportunityExists(db, context, input.opportunityId))) {
    throw new AppError(404, 'NOT_FOUND', 'Opportunity was not found in the authorized workspace.')
  }

  const replay = await findContextReplay(db, context, input)
  if (replay) {
    if (!contextMatches(replay, input)) {
      throw new AppError(409, 'CONFLICT', input.idempotencyKey && replay.idempotency_key === input.idempotencyKey
        ? 'Idempotency-Key was already used with different business context data.'
        : 'This opportunity already has a different business context. Update the existing context instead.')
    }
    await audit(db, context, 'BUSINESS_CONTEXT_DEDUPLICATED', 'business_context', replay.id, {
      opportunity_id: input.opportunityId,
      idempotency_key_present: Boolean(input.idempotencyKey),
    })
    return { context: contextView(replay), created: false }
  }

  const id = crypto.randomUUID()
  try {
    await db.batch([
      db.prepare(`INSERT INTO business_contexts
        (id, tenant_id, workspace_id, opportunity_id, observed_facts_json, business_characteristics_json,
         operating_context, channels_json, actors_json, constraints_json, process_clues_json, unknowns_json,
         source_type, source_reference, interpretation_type, confidence, provenance_json, idempotency_key, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`) 
        .bind(
          id, context.tenantId, context.workspaceId, input.opportunityId, JSON.stringify(input.observedFacts),
          JSON.stringify(input.businessCharacteristics), input.operatingContext, JSON.stringify(input.channels),
          JSON.stringify(input.actors), JSON.stringify(input.constraints), JSON.stringify(input.processClues),
          JSON.stringify(input.unknowns), input.sourceType, input.sourceReference, input.interpretationType,
          input.confidence, JSON.stringify(input.provenance), input.idempotencyKey, context.userId,
        ),
      db.prepare(`INSERT INTO audit_events
        (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
        VALUES (?, ?, ?, 'user', ?, 'BUSINESS_CONTEXT_CREATED', 'business_context', ?, ?, ?, 'success', ?)`) 
        .bind(
          crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId, id,
          context.requestId, context.correlationId,
          JSON.stringify({ opportunity_id: input.opportunityId, interpretation_type: input.interpretationType, source_type: input.sourceType }),
        ),
    ])
  } catch (error) {
    if (String(error).includes('UNIQUE')) {
      const concurrentReplay = await findContextReplay(db, context, input)
      if (concurrentReplay && contextMatches(concurrentReplay, input)) {
        return { context: contextView(concurrentReplay), created: false }
      }
    }
    throw error
  }

  const created = await getBusinessContext(db, context, id)
  if (!created) throw new AppError(500, 'INTERNAL_ERROR', 'Business context could not be retrieved after creation.')
  return { context: created, created: true }
}

async function findContextReplay(db: D1Database, context: RequestContext, input: CreateBusinessContextInput) {
  if (input.idempotencyKey) {
    const byKey = await db.prepare(`SELECT * FROM business_contexts
      WHERE tenant_id = ? AND workspace_id = ? AND idempotency_key = ?`)
      .bind(context.tenantId, context.workspaceId, input.idempotencyKey)
      .first<BusinessContextRow>()
    if (byKey) return byKey
  }
  return db.prepare(`SELECT * FROM business_contexts
    WHERE opportunity_id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(input.opportunityId, context.tenantId, context.workspaceId)
    .first<BusinessContextRow>()
}

export async function listBusinessContexts(db: D1Database, context: RequestContext) {
  const result = await db.prepare(`SELECT * FROM business_contexts
    WHERE tenant_id = ? AND workspace_id = ? ORDER BY created_at DESC, id DESC LIMIT 100`)
    .bind(context.tenantId, context.workspaceId)
    .all<BusinessContextRow>()
  return result.results.map(contextView)
}

export async function getBusinessContext(db: D1Database, context: RequestContext, id: string) {
  const row = await db.prepare(`SELECT * FROM business_contexts WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(id, context.tenantId, context.workspaceId)
    .first<BusinessContextRow>()
  return row ? contextView(row) : null
}

export async function createDomainCandidate(
  db: D1Database,
  context: RequestContext,
  input: CreateDomainCandidateInput,
) {
  const linked = await db.prepare(`SELECT id FROM business_contexts
    WHERE id = ? AND opportunity_id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(input.businessContextId, input.opportunityId, context.tenantId, context.workspaceId)
    .first()
  if (!linked) {
    throw new AppError(404, 'NOT_FOUND', 'The opportunity and business context relationship was not found in the authorized workspace.')
  }

  const normalizedLabel = normalizeDomainLabel(input.label)
  const replay = await findDomainReplay(db, context, input, normalizedLabel)
  if (replay) {
    const same = replay.opportunity_id === input.opportunityId
      && replay.business_context_id === input.businessContextId
      && replay.normalized_label === normalizedLabel
      && replay.description === input.description
      && replay.rationale === input.rationale
      && replay.interpretation_type === input.interpretationType
      && replay.confidence === input.confidence
      && replay.source_type === input.sourceType
      && replay.source_reference === input.sourceReference
      && replay.provenance_json === JSON.stringify(input.provenance)
    if (!same) {
      throw new AppError(409, 'CONFLICT', input.idempotencyKey && replay.idempotency_key === input.idempotencyKey
        ? 'Idempotency-Key was already used with different domain candidate data.'
        : 'This domain candidate already exists with different data.')
    }
    await audit(db, context, 'DOMAIN_CANDIDATE_DEDUPLICATED', 'domain_candidate', replay.id, {
      opportunity_id: input.opportunityId,
      business_context_id: input.businessContextId,
      idempotency_key_present: Boolean(input.idempotencyKey),
    })
    return { domain: domainView(replay), created: false }
  }

  const id = crypto.randomUUID()
  try {
    await db.batch([
      db.prepare(`INSERT INTO domain_candidates
        (id, tenant_id, workspace_id, opportunity_id, business_context_id, label, normalized_label,
         description, rationale, status, interpretation_type, confidence, source_type, source_reference,
         provenance_json, solution, idempotency_key, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CANDIDATE', ?, ?, ?, ?, ?, NULL, ?, ?)`) 
        .bind(
          id, context.tenantId, context.workspaceId, input.opportunityId, input.businessContextId,
          input.label, normalizedLabel, input.description, input.rationale, input.interpretationType,
          input.confidence, input.sourceType, input.sourceReference, JSON.stringify(input.provenance),
          input.idempotencyKey, context.userId,
        ),
      db.prepare(`INSERT INTO audit_events
        (id, tenant_id, workspace_id, actor_type, actor_id, action, target_type, target_id, request_id, correlation_id, result, metadata_json)
        VALUES (?, ?, ?, 'user', ?, 'DOMAIN_CANDIDATE_CREATED', 'domain_candidate', ?, ?, ?, 'success', ?)`) 
        .bind(
          crypto.randomUUID(), context.tenantId, context.workspaceId, context.userId, id,
          context.requestId, context.correlationId,
          JSON.stringify({ opportunity_id: input.opportunityId, business_context_id: input.businessContextId, interpretation_type: input.interpretationType }),
        ),
    ])
  } catch (error) {
    if (String(error).includes('UNIQUE')) {
      const concurrentReplay = await findDomainReplay(db, context, input, normalizedLabel)
      if (concurrentReplay) return { domain: domainView(concurrentReplay), created: false }
    }
    throw error
  }

  const created = await getDomainCandidate(db, context, id)
  if (!created) throw new AppError(500, 'INTERNAL_ERROR', 'Domain candidate could not be retrieved after creation.')
  return { domain: created, created: true }
}

async function findDomainReplay(
  db: D1Database,
  context: RequestContext,
  input: CreateDomainCandidateInput,
  normalizedLabel: string,
) {
  if (input.idempotencyKey) {
    const byKey = await db.prepare(`SELECT * FROM domain_candidates
      WHERE tenant_id = ? AND workspace_id = ? AND idempotency_key = ?`)
      .bind(context.tenantId, context.workspaceId, input.idempotencyKey)
      .first<DomainCandidateRow>()
    if (byKey) return byKey
  }
  return db.prepare(`SELECT * FROM domain_candidates
    WHERE business_context_id = ? AND normalized_label = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(input.businessContextId, normalizedLabel, context.tenantId, context.workspaceId)
    .first<DomainCandidateRow>()
}

export async function listDomainCandidates(db: D1Database, context: RequestContext) {
  const result = await db.prepare(`SELECT * FROM domain_candidates
    WHERE tenant_id = ? AND workspace_id = ? ORDER BY created_at DESC, id DESC LIMIT 100`)
    .bind(context.tenantId, context.workspaceId)
    .all<DomainCandidateRow>()
  return result.results.map(domainView)
}

export async function getDomainCandidate(db: D1Database, context: RequestContext, id: string) {
  const row = await db.prepare(`SELECT * FROM domain_candidates WHERE id = ? AND tenant_id = ? AND workspace_id = ?`)
    .bind(id, context.tenantId, context.workspaceId)
    .first<DomainCandidateRow>()
  return row ? domainView(row) : null
}

function normalizeDomainLabel(label: string): string {
  return label.replace(/\s+/g, ' ').trim().toLocaleLowerCase('en-US')
}
