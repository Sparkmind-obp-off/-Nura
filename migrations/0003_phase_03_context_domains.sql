PRAGMA foreign_keys = ON;

CREATE TABLE business_contexts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL,
  observed_facts_json TEXT NOT NULL DEFAULT '{}',
  business_characteristics_json TEXT NOT NULL DEFAULT '{}',
  operating_context TEXT,
  channels_json TEXT NOT NULL DEFAULT '[]',
  actors_json TEXT NOT NULL DEFAULT '[]',
  constraints_json TEXT NOT NULL DEFAULT '[]',
  process_clues_json TEXT NOT NULL DEFAULT '[]',
  unknowns_json TEXT NOT NULL DEFAULT '[]',
  source_type TEXT NOT NULL,
  source_reference TEXT,
  interpretation_type TEXT NOT NULL DEFAULT 'OBSERVED' CHECK (interpretation_type IN ('OBSERVED', 'INFERRED')),
  confidence REAL CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  provenance_json TEXT NOT NULL DEFAULT '{}',
  idempotency_key TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (opportunity_id, tenant_id, workspace_id) REFERENCES opportunities(id, tenant_id, workspace_id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (id, tenant_id, workspace_id),
  UNIQUE (opportunity_id),
  UNIQUE (tenant_id, workspace_id, idempotency_key)
);

CREATE TABLE domain_candidates (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL,
  business_context_id TEXT NOT NULL,
  label TEXT NOT NULL,
  normalized_label TEXT NOT NULL,
  description TEXT,
  rationale TEXT,
  status TEXT NOT NULL DEFAULT 'CANDIDATE' CHECK (status IN ('CANDIDATE', 'OBSERVED')),
  interpretation_type TEXT NOT NULL DEFAULT 'INFERRED' CHECK (interpretation_type IN ('OBSERVED', 'INFERRED')),
  confidence REAL CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  source_type TEXT NOT NULL,
  source_reference TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  solution TEXT,
  idempotency_key TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (opportunity_id, tenant_id, workspace_id) REFERENCES opportunities(id, tenant_id, workspace_id) ON DELETE CASCADE,
  FOREIGN KEY (business_context_id, tenant_id, workspace_id) REFERENCES business_contexts(id, tenant_id, workspace_id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (id, tenant_id, workspace_id),
  UNIQUE (business_context_id, normalized_label),
  UNIQUE (tenant_id, workspace_id, idempotency_key)
);

CREATE INDEX idx_business_contexts_scope_created ON business_contexts(tenant_id, workspace_id, created_at DESC);
CREATE INDEX idx_business_contexts_scope_opportunity ON business_contexts(tenant_id, workspace_id, opportunity_id);
CREATE INDEX idx_domain_candidates_scope_created ON domain_candidates(tenant_id, workspace_id, created_at DESC);
CREATE INDEX idx_domain_candidates_scope_opportunity ON domain_candidates(tenant_id, workspace_id, opportunity_id);
CREATE INDEX idx_domain_candidates_scope_context ON domain_candidates(tenant_id, workspace_id, business_context_id);
