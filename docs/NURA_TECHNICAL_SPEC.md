# Nura Technical Specification

**Status:** Canonical Technical Specification — Discovery Core Ready  
**Version:** 2.0  
**Product:** Nura — one platform

## 1. Purpose

This document translates the canonical Nura architecture into an implementation contract.

Nura is **one platform** with two solution dimensions:

- **Digital** — digital interventions such as websites, software, automation, integrations, dashboards, APIs, and digital operations.
- **Vertical** — contextual execution for needs emerging from real business domains.

Digital and Vertical are not separate products. **Discovery Core is an internal core capability, not a separate application.** There is no Vertical System, NuraHub product, or Nuralabs dependency in Nura.

Governing principle:

> **Demand First → Context First → Solution Second → Execution Always**

Canonical runtime flow:

```text
Demand Signal
    ↓
Opportunity
    ↓
Business Context
    ↓
Domain Discovery
    ↓
Workflow Discovery
    ↓
Problem Identification
    ↓
Evidence + Scoring
    ↓
Validation
    ↓
Solution Decision
    ├── Digital
    ├── Vertical
    ├── Existing Tool
    ├── Service
    ├── Automation
    ├── Integration
    └── No Action
    ↓
Execution
    ↓
Verification
    ↓
Business Outcome
    ↓
Learning
```

`solution = null` is a valid state while discovery or validation is incomplete.

## 2. Technical Goals

MVP must prove that Nura can:

1. Capture an unknown demand signal.
2. Normalize it into an opportunity without assuming a domain or solution.
3. Capture business context.
4. Discover a domain candidate from evidence.
5. Map workflows and identify problem patterns.
6. Preserve evidence provenance.
7. Produce explainable scoring.
8. Run explicit validation.
9. Keep solution unset until the validation gate is satisfied.
10. Route a validated opportunity to an appropriate solution.
11. Execute permitted work.
12. Verify execution and outcome evidence.
13. Preserve auditability, tenant isolation, and learning.

## 3. Non-Goals

MVP does not require:

- a separate Digital or Vertical application;
- a fixed industry catalogue;
- a Vertical marketplace;
- NuraHub as a product;
- Nuralabs integration;
- unrestricted autonomous agents;
- microservices or Kubernetes;
- giant workflow infrastructure;
- guaranteed outcomes without evidence;
- automatic product creation from every discovered domain.

## 4. Platform Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         NURA PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│ Experience                                                   │
│ Onboarding · Discovery · Opportunities · Validation · Work  │
├─────────────────────────────────────────────────────────────┤
│ Discovery Core                                               │
│ Demand · Context · Domain · Workflow · Problem · Evidence  │
│ Scoring · Validation · Solution Handoff                     │
├─────────────────────────────────────────────────────────────┤
│ Execution                                                    │
│ Solution Registry · Tasks · Connectors · Verification      │
│ Outcomes · Learning                                          │
├─────────────────────────────────────────────────────────────┤
│ Platform Foundation                                          │
│ Identity · Tenant/Workspace · Audit · Observability        │
│ Database · Object Storage · Secrets                           │
└─────────────────────────────────────────────────────────────┘
```

One modular application is the default. Internal modules may evolve independently without becoming separate products.

## 5. Runtime Model

Recommended MVP runtime:

- TypeScript;
- Hono or equivalent lightweight HTTP framework;
- Cloudflare Workers/Pages-compatible runtime;
- D1 or equivalent relational database;
- object storage for larger artifacts;
- model-provider abstraction;
- connector/adaptor boundary for external systems.

Request path:

```text
HTTP Request
  ↓
Auth / Tenant Resolution
  ↓
Application Service
  ↓
Domain Rules / State Transition
  ↓
Repository or Connector
  ↓
Audit Event
  ↓
Response
```

Long-running external work uses a task/job abstraction rather than blocking normal HTTP requests.

## 6. Discovery Core Modules

### 6.1 Demand Intelligence

Ingest, normalize, classify, deduplicate/link, and preserve provenance for demand signals.

### 6.2 Opportunity Formation

Convert signals into opportunities while preserving uncertainty and source lineage.

### 6.3 Business Context Discovery

Capture actors, business setting, goals, constraints, systems, and relevant operating context.

### 6.4 Domain Discovery

Create `DomainCandidate` records from observed evidence. Domains are emergent, not selected from a fixed catalogue.

### 6.5 Workflow Discovery

Map the real workflow around the problem before selecting a solution.

Minimum workflow concepts:

- actors;
- trigger;
- inputs;
- actions;
- decisions;
- handoffs;
- tools/systems;
- outputs;
- bottlenecks;
- frequency;
- constraints.

### 6.6 Problem Discovery

Represent problem patterns separately from raw requests. Distinguish symptom, operational friction, repeated problem, root-cause hypothesis, and validated problem.

### 6.7 Evidence & Scoring

Every important claim is traceable to evidence. Scores are deterministic/explainable for MVP and are decision support, not proof.

### 6.8 Validation

Validation is a first-class gate. No opportunity becomes validated without a recorded validation basis.

### 6.9 Solution Handoff

Only after sufficient validation does Nura select or recommend the smallest appropriate intervention.

## 7. Canonical Entities

Discovery objects:

```text
Tenant
Workspace
User
DemandSignal
Opportunity
BusinessContext
DomainCandidate
Workflow
ProblemPattern
Evidence
Score
Validation
```

Downstream objects:

```text
Solution
Execution
ExecutionEvent
Artifact
Verification
Outcome
LearningRecord
Connector
AuditEvent
```

### DomainCandidate contract

A domain candidate must not require a solution.

```json
{
  "domain": "Snack Distribution",
  "status": "observed",
  "evidence_count": 12,
  "workflows": ["reseller_ordering", "stock_replenishment", "delivery"],
  "repeated_problems": ["manual_order_capture", "stock_visibility"],
  "validation_status": "in_progress",
  "solution": null
}
```

This is an example only; it does not create a predefined industry enum.

### Ownership

All tenant-owned records carry:

- `tenant_id`;
- `workspace_id` where applicable;
- opaque stable ID;
- UTC timestamps;
- actor/creator where relevant.

Cross-tenant access is denied by default.

## 8. Discovery State Machine

```text
SIGNAL_CAPTURED
      ↓
OPPORTUNITY_FORMED
      ↓
CONTEXT_DISCOVERED
      ↓
DOMAIN_CANDIDATE
      ↓
WORKFLOW_MAPPED
      ↓
PROBLEM_IDENTIFIED
      ↓
EVIDENCE / SCORING
      ↓
VALIDATING
   ┌──┴─────────┐
REJECTED     PARKED
      │
      └──────────────→ VALIDATED
                         ↓
                  SOLUTION_SELECTED
                         ↓
                     EXECUTING
                         ↓
                     VERIFYING
                         ↓
                      OUTCOME
                         ↓
                      LEARNING
```

Not every signal must reach every stage. Incomplete or terminated paths require explicit reasons.

## 9. Evidence and Provenance

Evidence levels:

```text
OBSERVED → INFERRED → VALIDATED → PAID/ADOPTED → OUTCOME VERIFIED
```

These are states, not automatic upgrades.

Minimum evidence fields:

- `id`;
- `tenant_id`;
- `workspace_id`;
- `type`;
- `source_type`;
- `source_ref`;
- `captured_at`;
- `content_hash` where applicable;
- `confidence`;
- `evidence_level`;
- `metadata`;
- `created_by`.

External source references must be preserved where lawful and technically possible.

## 10. Scoring

Suggested explainable dimensions:

| Dimension | Meaning |
|---|---|
| Problem Severity | Pain/materiality |
| Frequency | Recurrence |
| Evidence Strength | Credibility/quality |
| Willingness to Act/Pay | Adoption signal |
| Reachability | Ability to reach affected party |
| Feasibility | Ability to execute |
| Outcome Measurability | Ability to verify result |
| Repeatability | Potential for repeat demand |

Persist both component values and rationale. A high score means **worth investigating**, not guaranteed demand.

## 11. Validation Gate

A validation record contains:

- hypothesis;
- target customer/context;
- method;
- expected evidence;
- actual evidence;
- result;
- confidence;
- next action;
- actor;
- timestamp.

Validation should establish, where applicable:

1. Is the problem real?
2. Is it repeated/material?
3. Is evidence credible?
4. Is the affected party identifiable?
5. Is a meaningful outcome possible?
6. Is there willingness/ability to act?
7. Is a pilot worth testing?

`VALIDATED` requires recorded evidence and rationale.

## 12. Solution Registry

Allowed solution types include:

```text
SERVICE
PRODUCTIZED_SERVICE
AUTOMATION
SOFTWARE
INTEGRATION
VERTICAL_WORKFLOW
EXISTING_TOOL
CUSTOM_BUILD
NO_ACTION
```

A solution has at minimum:

- `id`;
- `tenant_id`;
- `name`;
- `dimension = DIGITAL | VERTICAL`;
- `type`;
- `description`;
- `capabilities`;
- `implementation_method`;
- `verification_method`;
- `status`.

Solution selection must not be treated as validation itself.

## 13. Execution

Execution is an abstraction over internal actions, connectors, external automation, human tasks, and existing tools.

```text
Execution Service
      ↓
Execution Adapter
 ├── Internal action
 ├── Connector action
 ├── External automation
 ├── Human task
 └── Existing tool
```

Statuses:

```text
PENDING → RUNNING → SUCCEEDED
                 ├→ FAILED
                 └→ CANCELLED
```

Execution success means the execution completed; it does **not** prove a business outcome.

## 14. Verification and Outcome

```text
Execution
  ↓
Verification Check
  ↓
Verification Evidence
  ↓
Delivery
  ↓
Outcome
```

Verification statuses:

- `PENDING`
- `VERIFIED`
- `FAILED`
- `UNVERIFIED`

Outcome statuses:

- `PENDING`
- `PARTIAL`
- `ACHIEVED`
- `NOT_ACHIEVED`
- `UNVERIFIED`

`ACHIEVED` must never be inferred solely from execution success.

## 15. API Boundary

The MVP remains a modular monolith.

```text
/auth/*
/tenants/*
/workspaces/*
/signals/*
/opportunities/*
/contexts/*
/domains/*
/workflows/*
/problems/*
/evidence/*
/scores/*
/validations/*
/solutions/*
/executions/*
/verifications/*
/outcomes/*
/learnings/*
/connectors/*
/audit/*
```

Core operations include:

```text
POST /signals
POST /opportunities
POST /opportunities/:id/context
POST /opportunities/:id/domain
POST /opportunities/:id/workflows
POST /opportunities/:id/problems
POST /opportunities/:id/evidence
POST /opportunities/:id/score
POST /opportunities/:id/validate
POST /opportunities/:id/select-solution
POST /opportunities/:id/execute
POST /opportunities/:id/verify
POST /opportunities/:id/outcome
```

Handlers remain thin; domain/application services own state transitions and business rules.

## 16. Connector Contract

Connectors are adapters, never product identities.

```ts
interface Connector {
  id: string;
  provider: string;
  capabilities: string[];
  authenticate(): Promise<AuthResult>;
  healthCheck(): Promise<HealthResult>;
  execute(input: ConnectorInput): Promise<ConnectorResult>;
}
```

Provider-specific payloads stay inside adapters. Credentials are owned and scoped explicitly. External acquisition must comply with provider permissions, terms, and applicable law.

## 17. Idempotency and Reliability

Mutating/external operations require, where applicable:

- request/correlation ID;
- idempotency key;
- bounded retries;
- retry classification;
- normalized errors;
- audit events;
- concurrency/conflict handling.

Error classes:

```text
VALIDATION_ERROR
AUTH_ERROR
PERMISSION_ERROR
NOT_FOUND
CONFLICT
RATE_LIMITED
PROVIDER_ERROR
TIMEOUT
INTERNAL_ERROR
UNSUPPORTED
```

## 18. AI Boundary

AI may assist with normalization, classification, extraction, clustering, summarization, hypothesis generation, scoring suggestions, and workflow/problem analysis.

AI must not silently:

- invent evidence;
- upgrade evidence level;
- declare validation without basis;
- fabricate execution;
- fabricate delivery;
- declare business outcomes without verification;
- bypass tenant/permission rules.

AI-generated claims require provenance and appropriate human review.

## 19. Security and Audit

Required MVP controls:

- tenant/workspace isolation;
- server-side secrets;
- authenticated protected operations;
- capability-based authorization;
- least-privilege connectors;
- evidence provenance;
- critical mutation audit events;
- correlation IDs;
- redacted sensitive logs;
- explicit artifact ownership.

Security claims must match implemented and tested controls.

## 20. Technical Acceptance Tests

The implementation is not Discovery Core-ready until these pass:

1. **Unknown Domain** — a signal can enter without a predefined industry.
2. **No Premature Solution** — context/workflow/problem discovery can proceed while `solution = null`.
3. **Evidence Lineage** — claims link to source evidence.
4. **Explainable Score** — score components and rationale are persisted.
5. **Validation Gate** — `VALIDATED` requires recorded validation evidence.
6. **Tenant Isolation** — tenant A cannot read tenant B records.
7. **Idempotent Ingestion** — duplicate ingestion does not create uncontrolled duplicates.
8. **No Fake Outcome** — execution success cannot create `ACHIEVED` automatically.
9. **AI Boundary** — AI cannot bypass evidence/validation/authorization rules.
10. **Productization Gate** — repeated validated problems are required before productization.

## 21. Definition of Done

Discovery Core implementation is considered technically ready when:

- the canonical entities exist;
- state transitions are explicit;
- discovery can start from unknown demand;
- domain/workflow/problem discovery is supported;
- evidence is traceable;
- scoring is explainable;
- validation is a real gate;
- solution remains nullable until appropriate;
- tenant isolation is enforced;
- critical mutations are audited;
- unknown-first and no-premature-solution tests pass;
- no UI or API claims an unverified business outcome as fact.

**Final invariant:**

> Nura must be able to discover something it did not already know, understand it before deciding what to build, validate it before productizing it, and verify outcomes before claiming success.
