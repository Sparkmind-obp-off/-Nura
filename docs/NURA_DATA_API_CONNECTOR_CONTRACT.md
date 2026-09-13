# Nura Data, API & Connector Contract

**Status:** Canonical
**Version:** 1.0
**Date:** 2026-09-14

## 1. Purpose

This document defines the canonical data model, API boundaries, lifecycle persistence rules, and connector contract for Nura.

Nura is one platform with two business dimensions:

- **Digital**
- **Vertical**

This contract exists to make the operating loop implementable and auditable:

`Demand Signal → Opportunity → Evidence + Scoring → Validation → Solution → Execution → Verification → Delivery → Outcome → Learning`

## 2. Contract Principles

1. Tenant ownership is enforced server-side.
2. Every business record has an explicit owner/workspace context.
3. Evidence provenance is first-class data.
4. State transitions are explicit and validated.
5. Execution completion never implies outcome verification.
6. External providers are accessed through connectors/adapters.
7. Provider-specific schemas do not leak into the Nura domain model.
8. Mutating operations support idempotency where retry can occur.
9. API errors are structured and machine-readable.
10. Audit events are generated for security- and state-significant mutations.
11. Secrets are referenced, not returned or persisted in plaintext application records.
12. AI-generated values are marked as inferred/recommended rather than facts.
13. No API creates a fake validated or verified state without required evidence.

## 3. Canonical Entity Model

Core entities:

```text
Tenant
 └── Workspace
      ├── User / Operator
      ├── DemandSignal
      │    └── Evidence
      │          └── Opportunity
      ├── Opportunity
      │    ├── Score
      │    ├── Validation
      │    └── Solution
      │          └── Execution
      │                ├── ExecutionEvent
      │                ├── Artifact
      │                └── Verification
      │                      └── Outcome
      ├── LearningRecord
      ├── Connector
      └── AuditEvent
```

## 4. Tenant and Workspace Model

### Tenant

Represents the top-level ownership boundary.

Required fields:

- `id`
- `name`
- `status`
- `created_at`
- `updated_at`

### Workspace

Represents an operational context inside a tenant.

Required fields:

- `id`
- `tenant_id`
- `name`
- `status`
- `created_at`
- `updated_at`

Every domain query must scope by authorized tenant/workspace context.

## 5. DemandSignal

Represents an observed inbound demand signal before it becomes an opportunity.

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

`raw_content_reference` may point to stored content or an external reference. Sensitive or restricted source data must follow the security contract.

Suggested statuses:

`CAPTURED | NORMALIZED | LINKED | DISMISSED`

A signal is not automatically validated demand.

## 6. Evidence

Evidence supports an interpretation, score, validation, delivery, or outcome.

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

`INFERRED` must never be presented as equivalent to `OBSERVED` or verified evidence.

## 7. Opportunity

Represents a normalized business problem worth evaluating.

Suggested fields:

```text
id
workspace_id
title
problem_statement
customer_context
status
priority
source_signal_count
created_by
created_at
updated_at
```

Canonical lifecycle:

```text
CAPTURED
  ↓
NORMALIZED
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

Transitions must be server-validated. Clients cannot arbitrarily assign terminal or verified states.

## 8. Score

Represents an explainable evaluation of an opportunity.

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
- frequency/repetition;
- pain severity;
- buyer relevance;
- reachability;
- willingness-to-pay evidence;
- outcome potential;
- execution feasibility.

Scores are decision support, not ground truth.

## 9. Validation

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

`VALIDATED` requires supporting evidence according to application policy.

## 10. Solution

Represents the chosen intervention.

Required classification:

`DIGITAL | VERTICAL`

Additional solution types may include:

`PRODUCTIZED_SERVICE | CUSTOM_SERVICE | AUTOMATION | SOFTWARE | INTEGRATION | EXISTING_TOOL | NO_ACTION`

Suggested fields:

```text
id
workspace_id
opportunity_id
dimension
solution_type
name
rationale
expected_outcome
status
created_at
updated_at
```

Digital and Vertical are dimensions within Nura, not separate product identities.

## 11. Execution

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

Execution may create artifacts and execution events.

## 12. ExecutionEvent

Represents an immutable or append-oriented record of meaningful execution activity.

Suggested fields:

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

Sensitive provider payloads should not be copied into general event data unless required and protected.

## 13. Artifact

Represents a produced or received deliverable.

Suggested fields:

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

The application stores references/metadata while object storage owns the actual binary content where applicable.

## 14. Verification

Represents a deliberate check of an execution/delivery result.

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

Passing execution does not automatically create `OUTCOME_VERIFIED`.

## 15. Outcome

Represents a business result.

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

Outcome statuses should distinguish at minimum:

`RECORDED | VERIFIED | DISPUTED`

A verified outcome requires explicit verification evidence.

## 16. LearningRecord

Captures reusable knowledge from completed workflows.

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

## 17. Connector

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

`credential_reference` is a secret-store reference or opaque identifier, never a plaintext credential.

## 18. AuditEvent

Represents security- and workflow-relevant activity.

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

Audit records should be append-oriented and protected from ordinary user modification.

## 19. API Conventions

Base path:

`/api/v1`

JSON is the default representation.

### Standard response envelope

Successful responses should use a consistent structure such as:

```json
{
  "data": {},
  "meta": {
    "request_id": "..."
  }
}
```

List responses:

```json
{
  "data": [],
  "meta": {
    "request_id": "...",
    "next_cursor": "..."
  }
}
```

## 20. API Error Contract

Errors should use:

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

- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `INVALID_STATE_TRANSITION`
- `CONFLICT`
- `IDEMPOTENCY_CONFLICT`
- `CONNECTOR_UNAVAILABLE`
- `CONNECTOR_AUTH_REQUIRED`
- `EXTERNAL_PROVIDER_ERROR`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

Clients should not depend on human-readable error messages for control flow.

## 21. Core API Surface

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

### Validation

```text
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

Exact endpoint implementation may evolve, but domain boundaries must remain consistent with this contract.

## 22. Pagination, Filtering and Sorting

List endpoints should use cursor pagination for scalable datasets.

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

## 23. Idempotency

Mutating endpoints that can safely be retried should accept:

`Idempotency-Key: <unique-key>`

The server should persist enough information to ensure the same key does not accidentally create duplicate business effects.

Idempotency scope should include the authenticated tenant/workspace and endpoint/action context.

If the same key is reused with materially different request parameters, return:

`IDEMPOTENCY_CONFLICT`.

## 24. Optimistic Concurrency

Where multiple operators may update the same record, the API should support a version or updated-at check.

Example:

```json
{
  "expected_version": 7
}
```

A stale mutation should return `CONFLICT` rather than silently overwriting newer state.

## 25. Connector Architecture

Nura uses a normalized connector boundary:

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

## 26. Normalized Connector Contract

Conceptual interface:

```ts
interface NuraConnector {
  id: string;
  provider: string;
  capabilities(): Promise<ConnectorCapability[]>;
  healthCheck(): Promise<ConnectorHealth>;
  execute(request: ConnectorRequest): Promise<ConnectorResult>;
}
```

Normalized request:

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

Normalized result:

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

Provider adapters may translate provider-specific requests/responses internally.

## 27. Connector Security Rules

1. Credentials belong to the tenant/workspace ownership boundary.
2. Credentials are stored in a secret mechanism, not ordinary domain rows in plaintext.
3. API responses never return secret values.
4. Logs must redact tokens, cookies, authorization headers, and sensitive payload fields.
5. Connector scopes should be least-privilege.
6. Connector actions must be auditable.
7. External destructive/consequential actions require policy/confirmation.
8. Connector failures must distinguish retryable from non-retryable errors.

## 28. External Data Ingestion

External demand sources enter Nura through an ingestion boundary:

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
```

The ingestion layer must preserve provenance and avoid silently converting source content into business facts.

## 29. Webhooks and Async Events

When supported by a provider, webhook processing should:

1. authenticate/verify the incoming event;
2. record provider event identity;
3. enforce idempotency;
4. normalize payload;
5. persist relevant state/event;
6. emit an internal domain/application event where needed;
7. audit the processing result.

Webhook handlers must be safe against duplicate delivery.

## 30. Internal Domain Events

Examples:

```text
DemandSignalCaptured
OpportunityCreated
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

## 31. State Transition Contract

The API must enforce meaningful transitions.

Examples:

```text
CAPTURED → NORMALIZED
NORMALIZED → SCORING
SCORING → VALIDATING
VALIDATING → VALIDATED | REJECTED | PARKED
VALIDATED → SOLUTION_SELECTED
SOLUTION_SELECTED → EXECUTING
EXECUTING → VERIFYING
VERIFYING → DELIVERED | EXECUTING
DELIVERED → OUTCOME_RECORDED
OUTCOME_RECORDED → LEARNED
```

A transition endpoint should reject invalid jumps such as:

```text
CAPTURED → OUTCOME_VERIFIED
NORMALIZED → LEARNED
EXECUTING → OUTCOME_VERIFIED
```

unless the server explicitly determines that required intermediary evidence already exists.

## 32. Search and Retrieval

Search should operate within tenant/workspace authorization.

Minimum searchable objects:

- DemandSignal
- Opportunity
- Solution
- Execution
- Artifact
- LearningRecord

Search results should return enough type/context metadata to prevent ambiguous references.

## 33. Data Retention and Deletion Boundary

Retention rules are policy-driven and belong in the security/ownership contract.

The data layer must nevertheless support:

- soft deletion where required;
- explicit deletion state;
- artifact reference cleanup;
- audit preservation where legally/operationally required;
- tenant-level export/deletion workflows.

Deleting a business record must not accidentally expose or orphan another tenant's data.

## 34. API Ownership Rules

The server is authoritative for:

- tenant/workspace scope;
- role authorization;
- state transitions;
- validation requirements;
- evidence requirements;
- connector permission checks;
- audit creation;
- secret references;
- outcome verification.

The client is responsible for presentation, interaction, local validation, and confirmation UX—not for enforcing security or business truth.

## 35. MVP Data Persistence

The smallest implementation should persist enough state to prove one complete real workflow.

Minimum viable persistent path:

```text
DemandSignal
  → Evidence
  → Opportunity
  → Score
  → Validation
  → Solution
  → Execution
  → Verification
  → Outcome
  → Learning
```

Do not implement a giant schema merely for theoretical future modules.

## 36. API Acceptance Criteria

The implementation is acceptable when:

1. All core records are tenant/workspace scoped.
2. An opportunity can be traced to its originating demand/evidence.
3. Scores retain explainability metadata.
4. Validation decisions retain evidence.
5. Solution selection is persisted.
6. Execution produces auditable state/events.
7. Verification is a separate persisted operation.
8. Outcomes require evidence before verification.
9. Connector calls use a normalized adapter boundary.
10. Retryable mutations support idempotency where appropriate.
11. API errors are structured and stable.
12. Invalid lifecycle transitions are rejected server-side.
13. Secrets never appear in API responses or ordinary logs.
14. Audit events preserve consequential mutations.
15. The complete MVP path can be exercised end-to-end without fake state.

## 37. Explicit Non-Goals

This contract does not require:

- a microservice architecture;
- event sourcing for every table;
- a large message-bus deployment;
- a marketplace architecture;
- a separate NuraHub API;
- a Nuralabs API or runtime dependency;
- provider-specific schemas in the core domain;
- autonomous execution without policy and confirmation.

The implementation should prefer the smallest architecture that satisfies this contract.

## 38. Canonical References

This contract must be implemented together with:

1. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
2. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
3. `docs/NURA_TECHNICAL_SPEC.md`
4. `docs/NURA_UX_UI_SPEC.md`

If an older document conflicts with these references, these canonical documents take precedence.
