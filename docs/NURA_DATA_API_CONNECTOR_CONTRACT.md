# Nura Data, API & Connector Contract

**Status:** Canonical
**Version:** 2.0
**Date:** 2026-09-14

## 1. Purpose

This document defines the canonical data model, API boundaries, lifecycle persistence rules, connector contract, and integrity rules for Nura.

Nura is **one platform** with two solution dimensions:

- **Digital**
- **Vertical**

Discovery Core is a capability inside Nura, not a separate product or application.

Governing principle:

> **Demand First → Context First → Solution Second → Execution Always**

Canonical operating loop:

`Demand Signal → Opportunity → Business Context → Domain → Workflow → Problem → Evidence → Scoring → Validation → Solution Decision → Execution → Verification → Business Outcome → Learning`

The data contract must preserve this causal order. A weak or incomplete signal must never be silently converted into a validated problem, predetermined vertical, selected solution, or verified outcome.

---

## 2. Contract Principles

1. Tenant/workspace ownership is enforced server-side.
2. Every business record has an explicit ownership context.
3. Discovery entities are first-class domain records.
4. Evidence provenance is first-class data.
5. Domain discovery is dynamic; there is no fixed industry catalogue.
6. `solution = null` is valid while discovery or validation is incomplete.
7. State transitions are explicit and server-validated.
8. Validation is a gate before solution selection.
9. Execution completion never implies outcome verification.
10. External providers are accessed through connectors/adapters.
11. Provider-specific schemas do not leak into the Nura domain model.
12. Mutating operations support idempotency where retries can occur.
13. API errors are structured and machine-readable.
14. Security- and state-significant mutations generate audit events.
15. Secrets are referenced, never returned or persisted in plaintext domain records.
16. AI-generated values are marked as inferred/recommended, not facts.
17. No API may create a fake validated, delivered, or verified state.
18. Unknown domains and unknown workflows are valid inputs.
19. New domains must not require schema or architecture changes.
20. Human-in-the-loop remains available for consequential discovery, validation, solution, and execution decisions.

---

## 3. Canonical Entity Model

```text
Tenant
└── Workspace
    ├── User / Operator
    ├── DemandSignal
    │   └── Evidence
    ├── Opportunity
    │   ├── BusinessContext
    │   │   └── DomainCandidate
    │   │       └── Workflow
    │   │           └── ProblemPattern
    │   ├── Evidence
    │   ├── Score
    │   ├── Validation
    │   └── Solution (nullable until validated)
    │       └── Execution
    │           ├── ExecutionEvent
    │           ├── Artifact
    │           └── Verification
    │               └── Outcome
    ├── LearningRecord
    ├── Connector
    └── AuditEvent
```

Core discovery entities:

`DemandSignal, Opportunity, BusinessContext, DomainCandidate, Workflow, ProblemPattern, Evidence, Score, Validation`

Downstream entities:

`Solution, Execution, ExecutionEvent, Artifact, Verification, Outcome, LearningRecord, Connector, AuditEvent`

---

## 4. Tenant and Workspace Model

### Tenant

Top-level ownership and security boundary.

Required fields:

```text
id
name
status
created_at
updated_at
```

### Workspace

Operational context inside a tenant.

Required fields:

```text
id
tenant_id
name
status
created_at
updated_at
```

Every domain/API query must scope records by an authorized tenant/workspace context. Cross-tenant access is always denied by default.

---

## 5. DemandSignal

Represents an observed inbound signal before it becomes an opportunity.

Suggested fields:

```text
id
workspace_id
source_type
source_reference
captured_at
raw_content_reference
normalized_summary
status
created_by
created_at
updated_at
```

Statuses:

`CAPTURED | NORMALIZED | LINKED | DISMISSED`

A signal is not automatically a validated problem or opportunity.

External acquisition sources may include APIs, marketplaces, social/public sources, forms, imports, or manual capture. Source availability must never be assumed to be universal.

---

## 6. Opportunity

Represents a normalized demand/problem candidate worth evaluating.

Suggested fields:

```text
id
workspace_id
title
problem_statement
status
priority
source_signal_count
created_by
created_at
updated_at
```

An opportunity may be created before a domain or solution is known.

Canonical lifecycle:

```text
CAPTURED
  ↓
NORMALIZED
  ↓
CONTEXT_DISCOVERY
  ↓
WORKFLOW_DISCOVERY
  ↓
PROBLEM_DISCOVERY
  ↓
SCORING
  ↓
VALIDATING
  ├──→ REJECTED
  ├──→ PARKED
  └──→ VALIDATED
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

Clients cannot arbitrarily assign terminal, validated, or verified states.

---

## 7. BusinessContext

Represents the real-world business context discovered around an opportunity.

Suggested fields:

```text
id
workspace_id
opportunity_id
actors
business_model_summary
operating_environment
constraints_json
existing_tools_json
context_notes
confidence
status
created_by
created_at
updated_at
```

Business context may be incomplete during early discovery. AI-generated context must be marked as inferred until supported by evidence.

The context layer exists before solution selection.

---

## 8. DomainCandidate

Represents a domain/business context candidate discovered from evidence rather than selected from a fixed industry list.

Suggested fields:

```text
id
workspace_id
opportunity_id
business_context_id
name
status
description
evidence_count
confidence
validation_status
solution_id nullable
created_at
updated_at
```

Example:

```json
{
  "name": "Snack Distribution",
  "status": "OBSERVED",
  "evidence_count": 12,
  "validation_status": "IN_PROGRESS",
  "solution_id": null
}
```

Valid domain statuses may include:

`CANDIDATE | OBSERVED | IN_PROGRESS | VALIDATED | REJECTED | ARCHIVED`

A domain may exist with `solution_id = null`. This is expected and important.

There must be no hardcoded enum such as `BARBER | CAFE | ...` in the core domain model.

---

## 9. Workflow

Represents how work is actually performed inside a discovered domain/context.

Suggested fields:

```text
id
workspace_id
business_context_id
domain_candidate_id
name
trigger
actors
inputs
actions
decisions
handoffs
outputs
tools
frequency
bottlenecks
constraints_json
confidence
status
created_at
updated_at
```

Workflow status may include:

`DISCOVERED | MAPPED | CONFIRMED | REJECTED`

Workflow discovery must precede solution selection when workflow understanding is required to determine the appropriate intervention.

---

## 10. ProblemPattern

Represents a discovered operational problem or repeated friction.

Suggested fields:

```text
id
workspace_id
opportunity_id
business_context_id
domain_candidate_id
workflow_id
type
statement
root_cause_hypothesis
frequency
impact
affected_actors
confidence
status
created_at
updated_at
```

Problem types may include:

`SYMPTOM | REQUEST | OPERATIONAL_FRICTION | REPEATED_PROBLEM | ROOT_CAUSE_HYPOTHESIS | VALIDATED_PROBLEM`

A request must not automatically be treated as a validated problem.

---

## 11. Evidence

Evidence supports discovery, scoring, validation, execution, delivery, or outcome claims.

Suggested fields:

```text
id
workspace_id
entity_type
entity_id
evidence_level
source_type
source_reference
claim
observed_value
confidence
captured_at
created_by
created_at
```

Evidence levels:

- `OBSERVED`
- `INFERRED`
- `VALIDATED`
- `PAID_ADOPTED`
- `OUTCOME_VERIFIED`

`INFERRED` must never be presented as equivalent to observed or verified evidence.

Evidence must preserve lineage to its source whenever technically possible.

---

## 12. Score

Represents an explainable evaluation, never ground truth.

Suggested fields:

```text
id
opportunity_id
model_version
overall_score
score_dimensions_json
explanation
supporting_evidence_ids
created_at
created_by
```

Suggested dimensions:

- demand strength;
- repetition/frequency;
- pain severity;
- buyer relevance;
- reachability;
- willingness-to-pay evidence;
- outcome potential;
- execution feasibility;
- evidence quality.

Every material score must be explainable through dimensions and supporting evidence.

---

## 13. Validation

Represents a deliberate test of whether the identified problem/opportunity is real and worth acting on.

Suggested fields:

```text
id
opportunity_id
hypothesis
method
criteria
activity
observed_result
decision
supporting_evidence_ids
validated_by
validated_at
created_at
```

Decisions:

`VALIDATED | REJECTED | PARKED | NEEDS_MORE_EVIDENCE`

`VALIDATED` requires supporting evidence according to application policy and must not be created merely because an AI model recommends it.

---

## 14. Solution

Represents an intervention selected only after sufficient discovery and validation.

`solution_id` on a DomainCandidate is nullable until this stage.

Primary dimension:

`DIGITAL | VERTICAL`

Additional solution types may include:

`PRODUCTIZED_SERVICE | CUSTOM_SERVICE | AUTOMATION | SOFTWARE | INTEGRATION | EXISTING_TOOL | WORKFLOW_IMPROVEMENT | NO_ACTION`

Suggested fields:

```text
id
workspace_id
opportunity_id
domain_candidate_id nullable
dimension
solution_type
name
rationale
expected_outcome
status
created_at
updated_at
```

Digital and Vertical are dimensions inside Nura, not separate product identities.

A solution must reference the discovery/validation context that justified its selection.

---

## 15. Execution

Represents actual work performed against a selected solution.

Suggested fields:

```text
id
solution_id
status
goal
started_at
completed_at
created_by
created_at
updated_at
```

Statuses:

`READY | RUNNING | BLOCKED | FAILED | CANCELLED | COMPLETED`

Execution completion does not prove business outcome.

---

## 16. ExecutionEvent and Artifact

### ExecutionEvent

```text
id
execution_id
type
actor_type
actor_id
provider
summary
payload_reference
occurred_at
```

Events should be append-oriented and auditable.

### Artifact

```text
id
workspace_id
entity_type
entity_id
storage_reference
mime_type
name
checksum
created_at
created_by
```

Application records should store metadata/references while object storage owns binary content where applicable.

---

## 17. Verification

Represents a deliberate check of execution or delivery results.

Suggested fields:

```text
id
execution_id
criteria
actual_result
status
verification_evidence_ids
verified_by
verified_at
created_at
```

Statuses:

`PENDING | PASSED | FAILED | NEEDS_REVIEW`

Passing execution does not automatically create a verified business outcome.

---

## 18. Outcome

Represents a business result that can be recorded and explicitly verified.

Suggested fields:

```text
id
workspace_id
opportunity_id
execution_id
expected_outcome
actual_outcome
metric_name
baseline_value
actual_value
evidence_ids
status
recorded_at
verified_at
```

Statuses:

`RECORDED | VERIFIED | DISPUTED`

`VERIFIED` requires explicit outcome evidence and a valid verification action.

---

## 19. LearningRecord

Captures reusable knowledge after execution and outcome review.

Suggested fields:

```text
id
workspace_id
opportunity_id
hypothesis
result
what_worked
what_failed
repeatability_signal
productization_candidate
created_at
created_by
```

Productization must follow:

`Signal → Repeated Problem → Evidence → Validation → Pilot → Repeatable Outcome → Productization`

---

## 20. Connector

Represents an external provider integration.

Suggested fields:

```text
id
workspace_id
provider
connector_type
status
scopes_json
credential_reference
last_success_at
last_error_at
created_at
updated_at
```

`credential_reference` is an opaque secret-store reference and is never a plaintext credential.

---

## 21. AuditEvent

Represents security- and workflow-significant activity.

Suggested fields:

```text
id
tenant_id
workspace_id
actor_type
actor_id
action
target_type
target_id
request_id
correlation_id
result
metadata_json
occurred_at
```

Audit records are append-oriented and protected from ordinary user modification.

---

## 22. API Conventions

Base path:

`/api/v1`

JSON is the default representation.

Success envelope:

```json
{
  "data": {},
  "meta": {
    "request_id": "..."
  }
}
```

List envelope:

```json
{
  "data": [],
  "meta": {
    "request_id": "...",
    "next_cursor": "..."
  }
}
```

Errors:

```json
{
  "error": {
    "code": "VALIDATION_REQUIRED",
    "message": "The opportunity requires validation before solution selection.",
    "details": {},
    "request_id": "..."
  }
}
```

Recommended error codes:

`UNAUTHENTICATED | FORBIDDEN | NOT_FOUND | VALIDATION_ERROR | INVALID_STATE_TRANSITION | VALIDATION_REQUIRED | CONFLICT | IDEMPOTENCY_CONFLICT | CONNECTOR_UNAVAILABLE | CONNECTOR_AUTH_REQUIRED | EXTERNAL_PROVIDER_ERROR | RATE_LIMITED | INTERNAL_ERROR`

Clients must not use human-readable messages for control flow.

---

## 23. Core API Surface

### Demand

```text
POST   /api/v1/demand/signals
GET    /api/v1/demand/signals
GET    /api/v1/demand/signals/:id
```

### Opportunities

```text
POST   /api/v1/opportunities
GET    /api/v1/opportunities
GET    /api/v1/opportunities/:id
PATCH  /api/v1/opportunities/:id
POST   /api/v1/opportunities/:id/score
```

### Discovery

```text
POST   /api/v1/opportunities/:id/context
GET    /api/v1/opportunities/:id/context
POST   /api/v1/opportunities/:id/domains
GET    /api/v1/opportunities/:id/domains
PATCH  /api/v1/domains/:id
POST   /api/v1/domains/:id/workflows
GET    /api/v1/domains/:id/workflows
PATCH  /api/v1/workflows/:id
POST   /api/v1/workflows/:id/problems
GET    /api/v1/workflows/:id/problems
PATCH  /api/v1/problems/:id
```

### Evidence and validation

```text
POST   /api/v1/evidence
GET    /api/v1/evidence
POST   /api/v1/opportunities/:id/validations
GET    /api/v1/opportunities/:id/validations
POST   /api/v1/validations/:id/decision
```

### Solutions

```text
POST   /api/v1/opportunities/:id/solutions
GET    /api/v1/opportunities/:id/solutions
POST   /api/v1/solutions/:id/select
```

Solution selection must fail when required discovery/validation gates are not satisfied.

### Execution

```text
POST   /api/v1/solutions/:id/executions
GET    /api/v1/executions/:id
POST   /api/v1/executions/:id/start
POST   /api/v1/executions/:id/cancel
POST   /api/v1/executions/:id/retry
```

### Verification and outcome

```text
POST   /api/v1/executions/:id/verification
POST   /api/v1/executions/:id/deliver
POST   /api/v1/executions/:id/outcomes
POST   /api/v1/outcomes/:id/verify
```

### Learning

```text
POST   /api/v1/learning
GET    /api/v1/learning
```

### Connectors

```text
GET    /api/v1/connectors
POST   /api/v1/connectors
GET    /api/v1/connectors/:id
POST   /api/v1/connectors/:id/test
POST   /api/v1/connectors/:id/disable
```

### Audit

```text
GET    /api/v1/audit-events
```

Exact endpoint naming may evolve, but the domain boundaries and causal order are contractually stable.

---

## 24. Pagination, Filtering and Sorting

List endpoints should use cursor pagination.

Common parameters:

```text
limit
cursor
sort
order
status
created_after
created_before
```

Filters must be applied within authorized tenant/workspace scope.

---

## 25. Idempotency and Concurrency

Retryable mutating endpoints should accept:

`Idempotency-Key: <unique-key>`

The idempotency scope includes authenticated tenant/workspace and endpoint/action context.

Reusing a key with materially different request parameters returns `IDEMPOTENCY_CONFLICT`.

Where concurrent operators may update a record, support optimistic concurrency using a version or updated-at check:

```json
{
  "expected_version": 7
}
```

Stale writes return `CONFLICT` rather than silently overwriting newer state.

---

## 26. Connector Architecture

```text
Nura Domain
    ↓
Connector Interface
    ↓
Provider Adapter
    ↓
External System
```

The domain layer must not contain provider-specific HTTP details.

Normalized interface:

```ts
interface NuraConnector {
  id: string;
  provider: string;
  capabilities(): Promise<ConnectorCapability[]>;
  healthCheck(): Promise<ConnectorHealth>;
  execute(request: ConnectorRequest): Promise<ConnectorResult>;
}
```

Request:

```ts
interface ConnectorRequest {
  action: string;
  input: unknown;
  context: {
    tenantId: string;
    workspaceId: string;
    requestId: string;
    idempotencyKey?: string;
  };
}
```

Result:

```ts
interface ConnectorResult {
  success: boolean;
  provider: string;
  action: string;
  output?: unknown;
  externalReference?: string;
  retryable: boolean;
  error?: {
    code: string;
    message: string;
  };
}
```

Provider adapters translate provider-specific schemas internally.

---

## 27. External Data Ingestion

External sources enter through an ingestion boundary:

```text
External Source
      ↓
Connector / Ingestion Adapter
      ↓
Raw Source Reference
      ↓
Normalization
      ↓
DemandSignal
      ↓
Evidence
      ↓
Opportunity
      ↓
Discovery Core
```

The ingestion layer must preserve provenance and must not silently convert source content into business facts.

Temporary bridges such as automation platforms are implementation choices, not architectural entities in the Nura domain model.

---

## 28. Webhooks and Async Events

Webhook processing should:

1. authenticate/verify the incoming event;
2. record provider event identity;
3. enforce idempotency;
4. normalize payload;
5. persist relevant state/event;
6. emit internal events when required;
7. audit the processing result.

Duplicate delivery must be safe.

---

## 29. Internal Domain Events

Examples:

```text
DemandSignalCaptured
OpportunityCreated
ContextDiscovered
DomainCandidateCreated
WorkflowDiscovered
ProblemPatternIdentified
EvidenceRecorded
OpportunityScored
ValidationRecorded
SolutionSelected
ExecutionStarted
ExecutionCompleted
ExecutionFailed
VerificationPassed
DeliveryRecorded
OutcomeRecorded
OutcomeVerified
LearningRecorded
```

Events should carry stable IDs and correlation context where asynchronous processing is used.

---

## 30. State Transition Contract

Discovery transitions:

```text
CAPTURED → NORMALIZED
NORMALIZED → CONTEXT_DISCOVERY
CONTEXT_DISCOVERY → WORKFLOW_DISCOVERY
WORKFLOW_DISCOVERY → PROBLEM_DISCOVERY
PROBLEM_DISCOVERY → SCORING
SCORING → VALIDATING
VALIDATING → VALIDATED | REJECTED | PARKED
```

Solution/execution transitions:

```text
VALIDATED → SOLUTION_SELECTED
SOLUTION_SELECTED → EXECUTING
EXECUTING → VERIFYING
VERIFYING → DELIVERED | EXECUTING
DELIVERED → OUTCOME_RECORDED
OUTCOME_RECORDED → LEARNED
```

The API must reject invalid jumps such as:

```text
CAPTURED → SOLUTION_SELECTED
NORMALIZED → LEARNED
UNVALIDATED → EXECUTING
EXECUTION_COMPLETED → OUTCOME_VERIFIED
```

A solution may remain absent after validation if no appropriate intervention exists; `NO_ACTION` is a valid explicit decision.

---

## 31. AI Boundary Contract

AI may assist with:

- normalization;
- clustering;
- context summarization;
- domain candidate suggestions;
- workflow extraction;
- problem-pattern hypotheses;
- evidence classification;
- scoring recommendations;
- validation experiment suggestions;
- solution recommendations.

AI must not silently:

- invent evidence;
- mark a problem validated without required evidence;
- assign a fixed industry merely to satisfy a schema;
- select a solution solely because a model prefers it;
- claim execution happened when it did not;
- claim a business outcome was verified without verification evidence.

AI-generated values must carry provenance/status such as `INFERRED` or `RECOMMENDED` until accepted or supported.

---

## 32. Integrity and Security Rules

- All reads/writes are authorization-scoped.
- Tenant isolation is enforced server-side.
- Workspace isolation is enforced server-side.
- Secrets are never returned in ordinary API responses.
- Sensitive connector payloads are redacted from logs.
- Evidence records are protected from ordinary mutation after verification where policy requires immutability.
- Audit events are append-oriented.
- Consequential external actions require explicit policy/confirmation where applicable.
- API state transitions are validated on the server.
- Unknown-first inputs are accepted.

---

## 33. Minimum Discovery Core Data Contract

The smallest implementation that qualifies as Discovery Core must persist:

```text
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

The following must be true:

1. A new signal can enter without a predefined industry.
2. An opportunity can exist without a solution.
3. A domain candidate can exist with `solution_id = null`.
4. A workflow can be recorded before solution selection.
5. A problem can remain a hypothesis until validated.
6. Evidence can be traced to a source.
7. Scores expose their reasoning/evidence.
8. Validation is an explicit state and action.
9. Solution selection is blocked until required validation.
10. A validated opportunity may still choose `NO_ACTION`.

---

## 34. Required Acceptance Tests

### Unknown Domain

Input a real signal from a domain not known by the schema. The system must create a domain candidate without schema modification or a fixed catalogue match.

### No Premature Solution

Create a signal/opportunity with incomplete context. The system must keep `solution = null` and reject premature solution selection.

### Context Before Solution

An opportunity cannot select a solution before required context/workflow/problem discovery has completed according to policy.

### Evidence Lineage

Every material validation/scoring claim must reference supporting evidence or explicitly state that it is an inference.

### Explainable Score

A score must expose dimensions, explanation, model/version metadata, and supporting evidence references.

### Validation Gate

An unvalidated opportunity cannot transition into solution selection or execution.

### Tenant Isolation

A tenant/workspace cannot read or mutate another tenant/workspace's discovery or execution records.

### Idempotent Ingestion

Repeated ingestion of the same external event must not create duplicate business effects.

### No Fake Outcome

Execution completion without business evidence must not create `Outcome.status = VERIFIED`.

### AI Boundary

AI recommendations cannot silently mutate authoritative validation/evidence/outcome states.

### Productization Gate

A single weak signal cannot automatically become a productized vertical. Repeatability and validated outcomes are required.

---

## 35. Non-Goals

This contract does not define:

- a separate Vertical System;
- a NuraHub product;
- a fixed list of industries;
- a Nuralabs dependency;
- a marketplace of prebuilt vertical products;
- a requirement to integrate every external source before Discovery Core works;
- autonomous authority for AI to declare business truth;
- fake or simulated production outcomes.

---

## 36. Contract Invariant

> **Nura must be able to receive an unknown demand signal, discover its real context and domain, map the workflow, identify the problem, preserve evidence, validate the opportunity, and only then select and execute an appropriate solution.**

The data/API/connector layer exists to preserve that causal chain, tenant ownership, evidence lineage, and verifiable outcome integrity.
