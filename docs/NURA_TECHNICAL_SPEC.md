# Nura Technical Specification

**Status:** Canonical Technical Specification
**Version:** 1.0 MVP
**Product:** Nura

## 1. Purpose

This document translates the canonical Nura concept, architecture, and MVP product requirements into an implementation-oriented technical contract.

Nura is **one platform** with two business dimensions:

- **Digital** — digital solutions, websites, software, automation, integrations, dashboards, APIs, and digital operations.
- **Vertical** — validated solutions for real-world business verticals such as Barber, Cafe, and future verticals.

Digital and Vertical are not separate products. They use the same platform, data model, execution lifecycle, evidence model, verification model, and tenant boundaries.

Nura follows:

> Demand first → Product second → Execution always.

Core runtime flow:

```text
Demand Signal
  ↓
Opportunity
  ↓
Evidence + Scoring
  ↓
Validation
  ↓
Solution Selection
  ↓
Execution
  ↓
Verification
  ↓
Delivery
  ↓
Business Outcome
  ↓
Learning
```

Nuralabs is **not a dependency, subsystem, runtime, or architectural layer of Nura**.

---

## 2. Technical Goals

The MVP must technically prove that Nura can:

1. Capture a real demand signal.
2. Preserve source/evidence provenance.
3. Normalize a signal into an opportunity.
4. Score the opportunity using explainable criteria.
5. Record validation activity and evidence.
6. Select an appropriate solution type.
7. Create and track execution work.
8. Record execution events.
9. Verify delivered work or outcome evidence.
10. Record a business outcome without fabricating evidence.
11. Preserve the resulting learning.
12. Maintain tenant/workspace ownership and auditability.

The MVP should be small enough to implement quickly but complete enough to prove the entire loop.

---

## 3. Technical Non-Goals

The MVP does not require:

- autonomous unrestricted agents;
- automatic purchasing or financial transactions;
- automatic posting to every social platform;
- a marketplace architecture;
- separate Digital or Vertical applications;
- a separate NuraHub product;
- Nuralabs integration;
- guaranteed business outcomes without evidence;
- a giant workflow engine;
- custom model training;
- complex event streaming infrastructure;
- microservices;
- Kubernetes;
- premature multi-region infrastructure.

When a connector or existing tool is sufficient, Nura should use it rather than rebuilding the capability.

---

## 4. Platform Architecture

Nura is implemented as one modular application.

```text
┌─────────────────────────────────────────────────────────────┐
│                         NURA PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│ Experience Layer                                             │
│ Dashboard · Opportunities · Validation · Execution · Outcomes│
├─────────────────────────────────────────────────────────────┤
│ Application Layer                                            │
│ Demand · Opportunity · Scoring · Solution · Execution        │
│ Verification · Delivery · Learning                           │
├─────────────────────────────────────────────────────────────┤
│ Domain Layer                                                 │
│ Tenant · Evidence · Lifecycle · Rules · Policies · Audit     │
├─────────────────────────────────────────────────────────────┤
│ Integration Layer                                            │
│ Connectors · Adapters · Webhooks · External Services         │
├─────────────────────────────────────────────────────────────┤
│ Infrastructure Layer                                         │
│ Database · Object Storage · Secrets · Auth · Logs             │
└─────────────────────────────────────────────────────────────┘
```

The Digital/Vertical distinction is represented as a domain attribute and solution dimension, not as separate application stacks.

---

## 5. Runtime Model

Recommended MVP runtime:

- TypeScript;
- Hono or equivalent lightweight HTTP framework;
- Cloudflare Pages/Workers-compatible runtime;
- Cloudflare D1 or equivalent relational database;
- object storage for larger artifacts when required;
- external model providers through a provider abstraction;
- connector adapters for external data/action systems.

The architecture must remain portable enough that infrastructure choices do not become product identity.

### Runtime principle

```text
HTTP Request
   ↓
Authentication / Tenant Resolution
   ↓
Application Service
   ↓
Domain Rules
   ↓
Repository / Connector
   ↓
Audit Event
   ↓
Response
```

Long-running or external execution should use a job/task abstraction rather than blocking a normal HTTP request.

---

## 6. Core Modules

All modules are internal modules of Nura.

### 6.1 Demand Intelligence

Responsibilities:

- ingest demand signals;
- normalize source metadata;
- classify signal type;
- preserve provenance;
- detect duplicates or related signals;
- create candidate opportunities.

### 6.2 Opportunity Management

Responsibilities:

- maintain opportunity records;
- lifecycle transitions;
- attach evidence;
- maintain scores;
- maintain validation history;
- link selected solutions and execution.

### 6.3 Scoring & Validation

Responsibilities:

- calculate explainable scores;
- expose score components;
- define validation requirements;
- record validation activity;
- distinguish observed, inferred, validated, paid/adopted, and outcome-verified evidence.

### 6.4 Solution Registry

Responsibilities:

- describe available solution types;
- classify Digital/Vertical dimension;
- record implementation method;
- support service, productized service, automation, software, integration, existing tool, custom work, or no-action decisions.

### 6.5 Execution

Responsibilities:

- create execution work items;
- assign owner;
- maintain status;
- record execution events;
- attach artifacts;
- call permitted connectors.

### 6.6 Verification & Delivery

Responsibilities:

- verify execution output;
- capture verification evidence;
- mark delivery state;
- record outcome evidence;
- explicitly support `UNVERIFIED` states.

### 6.7 Learning

Responsibilities:

- record what happened;
- record failed assumptions;
- capture repeatable patterns;
- inform future scoring and productization decisions.

---

## 7. Opportunity Lifecycle

Canonical state machine:

```text
CAPTURED
   ↓
NORMALIZED
   ↓
SCORING
   ↓
VALIDATING
   ├──→ REJECTED
   └──→ PARKED
          
VALIDATING → VALIDATED
                  ↓
           SOLUTION_SELECTED
                  ↓
              EXECUTING
                  ↓
              VERIFYING
                  ↓
               DELIVERED
                  ↓
           OUTCOME_RECORDED
                  ↓
               LEARNED
```

### Transition rules

- `CAPTURED → NORMALIZED` requires minimum signal fields.
- `NORMALIZED → SCORING` requires a valid opportunity identity.
- `SCORING → VALIDATING` requires a completed score.
- `VALIDATING → VALIDATED` requires defined validation evidence.
- `VALIDATING → REJECTED` requires an explicit rejection reason.
- `VALIDATING → PARKED` requires a park reason.
- `VALIDATED → SOLUTION_SELECTED` requires a solution decision.
- `SOLUTION_SELECTED → EXECUTING` requires an execution plan or work item.
- `EXECUTING → VERIFYING` requires execution completion evidence.
- `VERIFYING → DELIVERED` requires delivery verification.
- `DELIVERED → OUTCOME_RECORDED` requires an outcome record, including `UNVERIFIED` when appropriate.
- `OUTCOME_RECORDED → LEARNED` requires a learning record or explicit `NO_LEARNING` decision.

No transition may silently skip required evidence.

---

## 8. Evidence and Provenance

Every important claim should be traceable to evidence.

Evidence levels:

```text
OBSERVED
  ↓
INFERRED
  ↓
VALIDATED
  ↓
PAID / ADOPTED
  ↓
OUTCOME VERIFIED
```

These are evidence states, not automatic upgrades. A signal does not become validated merely because an AI model predicts it is likely.

### Evidence fields

Minimum fields:

- `id`
- `tenant_id`
- `workspace_id`
- `type`
- `source_type`
- `source_ref`
- `captured_at`
- `content_hash` where applicable
- `confidence`
- `evidence_level`
- `metadata`
- `created_by`

External content should preserve the original source reference where lawful and technically possible.

---

## 9. Demand Signal Ingestion

A connector or manual input produces a normalized signal.

```text
External Source / Manual Input
          ↓
       Connector
          ↓
 Raw Payload + Provenance
          ↓
 Normalization Adapter
          ↓
 DemandSignal
          ↓
 Deduplication / Linking
          ↓
 Opportunity Candidate
```

The ingestion layer must not assume that every signal represents genuine demand.

Examples of source types:

- social request;
- marketplace request;
- direct business conversation;
- customer request;
- business operation event;
- public request;
- internal observation;
- imported research data.

Connectors must comply with applicable platform terms, permissions, and laws.

---

## 10. Scoring Engine

The scoring engine must be deterministic and explainable for MVP purposes.

Suggested dimensions:

| Dimension | Purpose |
|---|---|
| Problem Severity | How painful is the problem? |
| Frequency | How often does it occur? |
| Evidence Strength | How strong is the evidence? |
| Willingness to Pay | Is payment/adoption signal present? |
| Reachability | Can the potential customer be reached? |
| Solution Feasibility | Can Nura realistically solve it? |
| Outcome Measurability | Can the result be verified? |
| Repeatability | Is the problem likely to recur? |

The implementation should store both:

- final score;
- component scores and reasons.

A score is decision support, not proof of demand.

---

## 11. Validation Engine

Validation is a first-class workflow.

A validation record should contain:

- hypothesis;
- target customer/context;
- validation method;
- expected evidence;
- actual evidence;
- result;
- confidence;
- next action;
- timestamp;
- operator/actor.

Example validation methods:

- direct interview;
- response to offer;
- landing-page test;
- paid pilot;
- existing business data;
- customer request repetition;
- manual observation;
- marketplace demand evidence.

The system must not label an opportunity `VALIDATED` without a recorded validation basis.

---

## 12. Solution Registry

A solution is selected after validation, not before.

Minimum solution types:

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

Each solution has:

- `id`
- `tenant_id`
- `name`
- `dimension` = `DIGITAL | VERTICAL`
- `type`
- `description`
- `capabilities`
- `implementation_method`
- `estimated_effort`
- `verification_method`
- `status`

The registry can later support productization, but MVP should not assume every solution becomes a product.

---

## 13. Execution Abstraction

Nura needs an execution abstraction without coupling itself to one execution engine.

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

Every execution must have:

- intent;
- owner/actor;
- input reference;
- action type;
- status;
- timestamps;
- output reference;
- error state;
- audit events.

Execution status:

```text
PENDING → RUNNING → SUCCEEDED
                 ├→ FAILED
                 └→ CANCELLED
```

No execution should be represented as successful solely because a request was accepted.

---

## 14. Verification and Outcome Model

Verification is separate from execution.

```text
Execution Success
      ↓
Verification Check
      ↓
Evidence
      ↓
Delivery Status
      ↓
Outcome Status
```

Minimum verification statuses:

- `PENDING`
- `VERIFIED`
- `FAILED`
- `UNVERIFIED`

Minimum outcome statuses:

- `PENDING`
- `PARTIAL`
- `ACHIEVED`
- `NOT_ACHIEVED`
- `UNVERIFIED`

Nura must never infer `ACHIEVED` from `EXECUTION = SUCCEEDED` alone.

---

## 15. Tenant and Workspace Isolation

Every business-owned record must be scoped by:

- `tenant_id`;
- optionally `workspace_id`.

Authorization must be evaluated before returning or mutating tenant-owned data.

Recommended ownership hierarchy:

```text
Tenant
  └── Workspace
       ├── Users / Operators
       ├── Demand Signals
       ├── Opportunities
       ├── Evidence
       ├── Solutions
       ├── Executions
       ├── Artifacts
       ├── Outcomes
       └── Audit Events
```

Cross-tenant queries are prohibited by default.

---

## 16. Authentication and Authorization

MVP requires authenticated access for protected tenant operations.

The authorization model should distinguish at minimum:

- `OWNER`
- `ADMIN`
- `OPERATOR`
- `VIEWER`

Permissions should be capability-oriented rather than hardcoded into UI routes.

Sensitive operations should require explicit authorization checks at the server/application layer.

---

## 17. Core Data Model

Minimum entities:

```text
Tenant
Workspace
User
DemandSignal
Evidence
Opportunity
Score
Validation
Solution
Execution
ExecutionEvent
Verification
Outcome
Artifact
LearningRecord
Connector
AuditEvent
```

### Key relationships

```text
Tenant 1──N Workspace
Workspace 1──N DemandSignal
DemandSignal N──N Evidence
DemandSignal N──1 Opportunity
Opportunity 1──N Score
Opportunity 1──N Validation
Opportunity 1──1 Solution
Opportunity 1──N Execution
Execution 1──N ExecutionEvent
Execution 1──N Artifact
Execution 1──1 Verification
Opportunity 1──N Outcome
Opportunity 1──N LearningRecord
All important mutations 1──N AuditEvent
```

IDs should be opaque, unique, and stable. Prefer UUID/ULID-style identifiers.

Timestamps should be stored in UTC.

---

## 18. API Boundary

The MVP API can remain a modular monolith.

Suggested endpoint groups:

```text
/auth/*
/tenants/*
/workspaces/*
/signals/*
/evidence/*
/opportunities/*
/scores/*
/validations/*
/solutions/*
/executions/*
/verifications/*
/outcomes/*
/artifacts/*
/learnings/*
/connectors/*
/audit/*
```

Example opportunity operations:

```text
POST   /opportunities
GET    /opportunities
GET    /opportunities/:id
PATCH  /opportunities/:id
POST   /opportunities/:id/score
POST   /opportunities/:id/validate
POST   /opportunities/:id/select-solution
POST   /opportunities/:id/execute
POST   /opportunities/:id/verify
POST   /opportunities/:id/outcome
```

API handlers should remain thin. Domain/application services own business rules.

---

## 19. Connector Architecture

Connectors are adapters, not product identities.

```text
Nura Core
   ↓
Connector Contract
   ↓
Provider Adapter
   ↓
External API / Automation / Source
```

A connector should expose normalized operations rather than leaking provider-specific payloads into core domain logic.

Minimum connector contract:

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

Provider-specific data belongs inside the adapter.

Connectors must support explicit ownership and credential boundaries.

---

## 20. Idempotency, Retries, and Errors

External actions must support idempotency where technically possible.

Minimum requirements:

- request id / correlation id;
- idempotency key for repeatable mutations;
- bounded retries;
- retry classification;
- normalized error model;
- audit trail for retry attempts.

Suggested error categories:

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

Retries must never turn a non-idempotent action into accidental duplicate execution.

---

## 21. Audit Model

Important mutations should produce immutable audit events.

Minimum audit fields:

- `id`
- `tenant_id`
- `workspace_id`
- `actor_id`
- `action`
- `entity_type`
- `entity_id`
- `before`
- `after`
- `correlation_id`
- `created_at`

Audit logs should avoid storing raw secrets or unnecessary sensitive payloads.

---

## 22. Secrets and Credential Ownership

Credentials must never be stored in normal application records or source code.

Examples:

- OAuth tokens;
- API keys;
- webhook secrets;
- provider credentials.

Secrets should be stored using the deployment platform's secret mechanism or an appropriate secret manager.

Nura must distinguish:

- Nura-owned credentials;
- tenant-owned credentials;
- operator-provided temporary credentials;
- connector authorization state.

The system must make ownership visible in configuration metadata.

---

## 23. Observability

MVP observability requires:

- structured logs;
- request/correlation IDs;
- execution IDs;
- connector/provider identifiers;
- error classification;
- execution duration;
- validation and verification status;
- audit events.

Minimum operational questions must be answerable:

1. What happened?
2. For which tenant/workspace?
3. Who triggered it?
4. Which opportunity was involved?
5. Which connector/provider was used?
6. Did execution succeed?
7. Was the result verified?
8. What evidence supports the outcome?

---

## 24. Security Requirements

MVP security baseline:

- server-side authorization;
- tenant isolation;
- secure session handling;
- CSRF protection where applicable;
- input validation;
- output encoding;
- secret redaction;
- rate limiting for exposed mutation endpoints;
- safe webhook verification;
- audit logging;
- least-privilege connector access;
- no credentials in logs;
- no trust in client-supplied tenant IDs without authorization checks.

---

## 25. UI-to-API Boundary

The UI must not contain business-critical authorization or lifecycle logic.

UI responsibilities:

- display state;
- collect user input;
- present evidence;
- show scoring explanations;
- trigger permitted actions;
- show execution/verification status.

Server responsibilities:

- authorization;
- validation;
- state transitions;
- scoring calculation;
- connector execution;
- evidence persistence;
- audit;
- outcome classification.

---

## 26. Recommended MVP Screens

Minimum application surfaces:

1. Dashboard.
2. Demand Signals.
3. Opportunity List.
4. Opportunity Detail.
5. Validation Workspace.
6. Solution Selection.
7. Execution Detail.
8. Verification / Delivery.
9. Outcomes.
10. Learning.
11. Connector Settings.
12. Audit View.

Digital and Vertical should use the same screens. Filtering or context may identify the selected dimension.

---

## 27. Productization Gate in Technical Terms

Nura may recommend productization only when sufficient evidence exists.

```text
Signal
 ↓
Repeated Problem
 ↓
Evidence
 ↓
Validation
 ↓
Pilot
 ↓
Repeatable Outcome
 ↓
Productization Candidate
```

A productization candidate should store:

- problem pattern;
- target segment;
- evidence count/strength;
- validation history;
- successful solution pattern;
- execution effort;
- outcome evidence;
- repeatability assessment.

The system should allow `NO_PRODUCTIZATION` explicitly.

---

## 28. Technical Acceptance Criteria

The MVP is technically acceptable when one real workflow can complete:

```text
Create Demand Signal
      ↓
Attach Evidence
      ↓
Create Opportunity
      ↓
Calculate Explainable Score
      ↓
Record Validation
      ↓
Select Digital or Vertical Solution
      ↓
Create Execution
      ↓
Record Execution Events
      ↓
Attach Output Artifact
      ↓
Verify Result
      ↓
Record Outcome
      ↓
Create Learning Record
      ↓
Show Complete Audit Trail
```

Additional acceptance criteria:

- unauthorized tenant access is rejected;
- lifecycle transitions are enforced server-side;
- failed execution cannot appear as verified delivery;
- unverified outcomes remain explicitly unverified;
- connector failures are normalized and auditable;
- repeated requests can be safely handled where idempotency is supported;
- no Nuralabs dependency exists;
- Digital and Vertical share the same core platform;
- no separate NuraHub product is required.

---

## 29. Implementation Order

Recommended implementation sequence:

### Phase 1 — Foundation

- project scaffold;
- environment configuration;
- database;
- tenant/workspace model;
- authentication;
- authorization;
- audit foundation.

### Phase 2 — Demand & Opportunity

- demand signal ingestion;
- evidence;
- opportunity CRUD;
- lifecycle state machine;
- scoring.

### Phase 3 — Validation & Solution

- validation records;
- solution registry;
- solution selection;
- productization metadata.

### Phase 4 — Execution

- execution records;
- execution events;
- connector abstraction;
- bounded retry/error handling;
- artifacts.

### Phase 5 — Verification & Outcome

- verification;
- delivery state;
- outcome records;
- learning records.

### Phase 6 — UX and Hardening

- dashboard;
- opportunity workspace;
- execution visibility;
- audit view;
- observability;
- security hardening;
- end-to-end testing.

Do not start with broad connector coverage. Prove one complete workflow first.

---

## 30. Implementation Rules

1. One Nura platform.
2. Digital and Vertical are dimensions, not separate products.
3. Demand evidence precedes productization.
4. Execution is always explicit.
5. Verification is separate from execution.
6. Outcomes require evidence.
7. AI predictions are not automatically treated as facts.
8. External systems are accessed through connectors.
9. Provider-specific logic stays inside adapters.
10. Tenant ownership is enforced server-side.
11. Auditability is built in from the beginning.
12. Secrets never enter source code or normal data records.
13. Do not build infrastructure merely for architectural appearance.
14. Do not create a dependency on Nuralabs.
15. Do not create a separate NuraHub product.
16. Prefer the smallest implementation that proves the complete demand-to-outcome loop.

---

## 31. Final Technical Principle

Nura's technical moat is not a collection of AI features.

It is the ability to preserve a trustworthy chain from:

```text
REAL DEMAND
   ↓
EVIDENCE
   ↓
DECISION
   ↓
SOLUTION
   ↓
EXECUTION
   ↓
VERIFICATION
   ↓
BUSINESS OUTCOME
   ↓
LEARNING
```

The implementation must therefore optimize for **traceability, evidence, repeatability, tenant ownership, and verified outcomes** before optimizing for autonomous complexity.
