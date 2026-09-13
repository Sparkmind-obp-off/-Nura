PRAGMA foreign_keys = ON;

CREATE TABLE demand_signals (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('MANUAL', 'WEB', 'SOCIAL', 'MARKETPLACE', 'REFERRAL', 'DIRECT', 'OTHER')),
  source_reference TEXT,
  external_id TEXT,
  raw_content TEXT NOT NULL,
  normalized_content TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  captured_by TEXT,
  capture_mechanism TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'CAPTURED' CHECK (status IN ('CAPTURED', 'NORMALIZED', 'LINKED', 'DISMISSED')),
  metadata_json TEXT NOT NULL DEFAULT '{}',
  idempotency_key TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (captured_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (id, tenant_id, workspace_id),
  UNIQUE (tenant_id, workspace_id, source_type, external_id),
  UNIQUE (tenant_id, workspace_id, idempotency_key)
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'REVIEW', 'QUALIFIED', 'DISMISSED')),
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (id, tenant_id, workspace_id)
);

CREATE TABLE opportunity_signals (
  opportunity_id TEXT NOT NULL,
  signal_id TEXT NOT NULL UNIQUE,
  tenant_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  linked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (opportunity_id, signal_id),
  FOREIGN KEY (opportunity_id, tenant_id, workspace_id) REFERENCES opportunities(id, tenant_id, workspace_id) ON DELETE CASCADE,
  FOREIGN KEY (signal_id, tenant_id, workspace_id) REFERENCES demand_signals(id, tenant_id, workspace_id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE INDEX idx_signals_scope_created ON demand_signals(tenant_id, workspace_id, created_at DESC);
CREATE INDEX idx_signals_scope_status ON demand_signals(tenant_id, workspace_id, status);
CREATE INDEX idx_signals_source_dedupe ON demand_signals(tenant_id, workspace_id, source_type, external_id);
CREATE INDEX idx_opportunities_scope_created ON opportunities(tenant_id, workspace_id, created_at DESC);
CREATE INDEX idx_opportunities_scope_status ON opportunities(tenant_id, workspace_id, status);
CREATE INDEX idx_opportunity_signals_scope_signal ON opportunity_signals(tenant_id, workspace_id, signal_id);
CREATE INDEX idx_opportunity_signals_opportunity ON opportunity_signals(opportunity_id);
