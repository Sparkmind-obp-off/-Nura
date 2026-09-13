# Nura Implementation Plan

**Status:** Canonical implementation plan  
**Product:** Nura — one platform, two business dimensions: Digital and Vertical  
**Implementation principle:** Demand first → Product second → Execution always  

---

## 1. Purpose

This document converts the canonical Nura product, technical, UX, data/API, connector, and security contracts into an implementation sequence that can be executed incrementally.

The implementation target is the **smallest real Nura platform that proves the complete loop**:

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
(Digital / Vertical / Existing Tool / Service / No Action)
    ↓
Execution
    ↓
Verification
    ↓
Delivery
    ↓
Verified Business Outcome
    ↓
Learning
```

Nura is implemented as **one platform**. Digital and Vertical are business dimensions inside the same platform. They are not separate products.

---

## 2. Implementation Authority

Implementation decisions must follow this order of authority:

1. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
2. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
3. `docs/NURA_TECHNICAL_SPEC.md`
4. `docs/NURA_UX_UI_SPEC.md`
5. `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`
6. `docs/NURA_SECURITY_OWNERSHIP_CONTRACT.md`
7. This implementation plan

If an implementation idea conflicts with a higher-level canonical contract, the canonical contract wins and the implementation must be adjusted.

Older boundary/blueprint documents must not override the canonical architecture.

---

## 3. Core Implementation Principles

### 3.1 One platform

Build one Nura application and domain model.

Do not create separate Nura products merely because a workflow is Digital or Vertical.

### 3.2 Evidence before productization

A demand signal is not automatically an opportunity, and an opportunity is not automatically a product.

Use the evidence ladder:

```text
Observed
  ↓
Inferred
  ↓
Validated
  ↓
Paid / Adopted
  ↓
Outcome Verified
```

### 3.3 Execution is explicit

Nura must represent actual work rather than merely recommending work.

Every execution must have:

- owner
- state
- timestamps
- events/checkpoints
- artifacts where applicable
- verification boundary
- audit trail

### 3.4 Verification is separate from execution

Completing an execution step does not automatically mean the business outcome is verified.

### 3.5 AI is advisory unless explicitly authorized

AI-generated classifications, scores, recommendations, summaries, and predictions must not be presented as verified facts.

### 3.6 External systems use connectors

Provider-specific behavior belongs behind connector/adaptor boundaries.

Core Nura domain logic must not become coupled to one external provider.

### 3.7 Tenant ownership is server-side

Tenant/workspace ownership and authorization must never depend on client-provided trust alone.

### 3.8 Auditability from the beginning

Important state changes, external actions, verification decisions, and security-sensitive events must be auditable from MVP onward.

### 3.9 Smallest complete loop

Do not build a large platform surface before proving one complete end-to-end workflow.

---

## 4. MVP Scope Boundary

The MVP must support one real workflow from demand capture to verified outcome.

### In scope

- Tenant/workspace isolation
- Authentication/session boundary
- Demand Signal capture
- Evidence/provenance
- Opportunity normalization
- Explainable scoring
- Validation records
- Solution selection
- Digital/Vertical classification
- Existing-tool/service/no-action alternatives
- Execution work items
- Execution events
- Artifacts
- Verification
- Delivery record
- Outcome record
- Learning record
- Audit events
- Connector abstraction
- Minimum observability
- Minimum security controls

### Out of scope until evidence requires them

- Large multi-vertical SaaS suites
- Autonomous agents with unrestricted authority
- Complex enterprise IAM
- Marketplace-by-default architecture
- Large-scale data infrastructure
- Provider-specific core domain logic
- Separate NuraHub product
- Nuralabs dependency
- Automatic productization without validation
- Fake or simulated business outcomes presented as real

---

# 5. Phase 0 — Repository and Environment Foundation

## Goal

Create the technical skeleton required to implement the platform safely without prematurely building business features.

## Tasks

- Confirm repository structure.
- Establish TypeScript runtime.
- Establish Cloudflare-compatible application/runtime boundary.
- Establish Hono or equivalent API boundary.
- Establish environment configuration contract.
- Establish D1/equivalent database connection boundary.
- Establish object storage boundary where artifacts require it.
- Establish test runner.
- Establish lint/type-check/build commands.
- Establish request/correlation ID handling.
- Establish structured error envelope.
- Establish logging abstraction.
- Establish migration mechanism.
- Establish basic CI checks if appropriate.

## Security gate

No secrets committed to source control.

Environment-specific credentials must come from the deployment environment.

## Definition of Done

A clean environment can run the application, execute tests, type-check, build, and connect to the configured persistence boundary without implementing fake business behavior.

---

# 6. Phase 1 — Platform Shell, Authentication, Tenant and Workspace

## Goal

Establish the ownership boundary that all later domain records depend on.

## Core entities

- Tenant
- Workspace
- User/Operator
- Membership/role boundary
- AuditEvent

## Roles

- Tenant Owner
- Workspace Admin
- Operator
- Reviewer/Verifier
- Viewer

## Tasks

- Implement authenticated session boundary.
- Implement tenant creation/selection.
- Implement workspace creation/selection.
- Implement role-aware authorization.
- Enforce tenant isolation server-side.
- Enforce workspace access rules.
- Add audit events for security-sensitive changes.
- Add basic account/session error states.

## Acceptance

A user can authenticate, access an authorized tenant/workspace, and cannot read or mutate another tenant's records through manipulated client input.

---

# 7. Phase 2 — Demand Signal, Evidence and Opportunity

## Goal

Make demand the first-class input to Nura.

## Core entities

- DemandSignal
- Evidence
- Opportunity

## Tasks

1. Create demand signal.
2. Attach source metadata.
3. Attach evidence records.
4. Preserve provenance.
5. Normalize signal into opportunity.
6. Support duplicate/related signal handling.
7. Record observed vs inferred information.
8. Provide demand/opportunity list and detail views.
9. Preserve original source context where legally and technically appropriate.

## Minimum source categories

- Social/public request
- Direct business conversation
- Marketplace/request
- Existing business operation
- Internal observation
- Permitted external source

## Acceptance

A real demand signal can be captured, traced to evidence, normalized into an opportunity, and viewed with enough provenance for an operator to understand why the opportunity exists.

---

# 8. Phase 3 — Scoring and Validation

## Goal

Turn opportunities into explicit decisions rather than intuition-only decisions.

## Tasks

- Implement explainable score dimensions.
- Store score inputs and rationale.
- Separate score from final decision.
- Implement validation records.
- Support validation methods and evidence.
- Support outcomes: validated, rejected, parked.
- Record decision-maker and timestamp.
- Prevent AI-generated recommendations from being treated as verified validation.

## Suggested scoring dimensions

- Demand strength
- Frequency/repetition
- Pain/urgency
- Reachable customer potential
- Evidence quality
- Willingness-to-pay signal
- Execution feasibility
- Strategic fit

The exact weights must remain configurable and explainable.

## Acceptance

An operator can inspect an opportunity, understand its score, conduct validation, record evidence, and explicitly mark the validation result.

---

# 9. Phase 4 — Solution Registry and Digital/Vertical Selection

## Goal

Choose the right intervention based on validated demand instead of forcing every opportunity into software.

## Solution options

- Digital
- Vertical
- Existing tool
- Productized service
- Custom service
- Automation
- Integration
- No action

## Digital dimension examples

- Website
- Landing page
- Business application
- Automation
- API/integration
- Dashboard
- Digital asset
- Digital operations

## Vertical dimension examples

- Barber
- Cafe
- Other real-world business workflows validated by evidence

## Tasks

- Implement Solution entity.
- Link solution to validated opportunity.
- Record selected dimension.
- Record rationale.
- Support existing-tool/no-action choices.
- Prevent productization status from being implied by solution creation.

## Acceptance

A validated opportunity can receive an explicit solution decision with a recorded rationale and without requiring Nura to build software.

---

# 10. Phase 5 — Execution and Execution Events

## Goal

Turn selected solutions into trackable work.

## Tasks

- Create Execution records.
- Define execution state machine.
- Assign owner.
- Add execution events/checkpoints.
- Record dependencies and blockers.
- Attach artifacts.
- Support retry/error state where external work is involved.
- Add idempotency for mutation paths where appropriate.
- Preserve audit trail.

## Execution lifecycle

```text
CREATED
  ↓
READY
  ↓
IN_PROGRESS
  ↓
BLOCKED ──→ IN_PROGRESS
  ↓
COMPLETED
  ↓
VERIFYING
```

Execution completion must not itself create a verified outcome.

## Acceptance

A selected solution can become an explicit execution work item with observable progress, artifacts/events, ownership, and blockers.

---

# 11. Phase 6 — Verification, Delivery and Business Outcome

## Goal

Close the loop with evidence-backed verification.

## Tasks

- Implement Verification entity.
- Define verification criteria.
- Record verifier/reviewer.
- Record evidence used for verification.
- Implement Delivery record.
- Implement Outcome record.
- Distinguish delivered artifact from business outcome.
- Record outcome evidence and timestamp.
- Prevent unsupported outcomes from being marked verified.

## Required distinction

```text
Execution completed
        ≠
Artifact delivered
        ≠
Business outcome verified
```

## Acceptance

A completed execution can be reviewed, verified against explicit criteria, delivered, and only then produce a verified business outcome when supporting evidence exists.

---

# 12. Phase 7 — Learning and Productization Gate

## Goal

Turn repeated verified outcomes into learning and possible reusable products.

## Tasks

- Implement LearningRecord.
- Capture what worked/failed.
- Link learning to opportunities and executions.
- Track repeated problem patterns.
- Detect candidate productization opportunities.
- Keep productization explicitly gated.

## Productization gate

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
Productization
```

## Acceptance

Nura can show why a solution is becoming repeatable without automatically declaring a new product merely because a similar request occurred once.

---

# 13. Phase 8 — Connector Hardening and Real Acquisition Sources

## Goal

Connect Nura to real demand sources and execution systems only after the core domain loop works.

## Connector principles

- Normalize external data at the boundary.
- Keep provider-specific logic inside adapters.
- Use explicit credentials/ownership.
- Apply rate limits.
- Support retries and idempotency.
- Log external actions.
- Never trust external content as system instructions.
- Treat external data as untrusted input.

## Acquisition strategy

Prefer official APIs where practical.

Where access/approval is slow, a temporary bridge such as an approved automation layer may be used, provided the connector boundary remains clean and the bridge does not become a hidden core dependency.

Potential sources include:

- Threads
- X
- Other social platforms
- Marketplaces
- Direct business intake
- Public request sources
- Internal business operations

The source is secondary to the canonical Nura demand/evidence model.

## Acceptance

At least one real acquisition source can feed normalized DemandSignal records without coupling core domain logic to the provider.

---

# 14. Database Migration Sequence

Migrations should follow dependency order:

```text
Tenant
  ↓
Workspace
  ↓
User / Membership
  ↓
DemandSignal
  ↓
Evidence
  ↓
Opportunity
  ↓
Score
  ↓
Validation
  ↓
Solution
  ↓
Execution
  ↓
ExecutionEvent
  ↓
Artifact
  ↓
Verification
  ↓
Outcome
  ↓
LearningRecord
  ↓
Connector
  ↓
AuditEvent
```

Migration rules:

- Small reversible migrations where practical.
- Stable IDs.
- Explicit foreign keys/ownership relationships.
- Tenant/workspace ownership available on domain records where required for secure querying.
- No destructive migration without a migration/recovery plan.
- Seed data must be clearly marked as development/demo data.

---

# 15. API Implementation Sequence

Implement API boundaries in the same order as domain dependencies.

### Foundation

- health/readiness
- auth/session
- tenant/workspace context

### Demand

- `POST /demand-signals`
- `GET /demand-signals`
- `GET /demand-signals/:id`
- `POST /demand-signals/:id/evidence`

### Opportunity

- `POST /opportunities`
- `GET /opportunities`
- `GET /opportunities/:id`
- scoring/decision endpoints

### Validation

- validation create/update/read endpoints

### Solutions

- solution registry/list/create/select endpoints

### Execution

- execution create/read/update
- execution event append
- artifact attach/read

### Verification

- verification create/read
- delivery record
- outcome record

### Learning

- learning record/read
- productization candidate view

Every mutation must apply authorization, ownership checks, validation, audit behavior, and idempotency/concurrency rules where defined by the API contract.

---

# 16. UI Implementation Sequence

Build UI only as the domain becomes executable.

1. Application shell
2. Authentication/session states
3. Tenant/workspace selector
4. Overview dashboard
5. Demand Signals
6. Opportunity detail/workspace
7. Evidence/provenance
8. Scoring
9. Validation
10. Solution selection
11. Execution workspace
12. Verification & Delivery
13. Outcome
14. Learning/Productization
15. Connectors
16. Audit/administration

Do not create empty navigation surfaces solely to make the application look complete.

---

# 17. Testing Strategy

Each phase must include tests before being considered complete.

## Unit tests

Cover:

- domain rules
- state transitions
- scoring calculations
- authorization decisions
- validation rules
- connector normalization
- error mapping

## Integration tests

Cover:

- database persistence
- tenant isolation
- API authorization
- idempotent mutations
- optimistic concurrency
- connector boundaries
- audit generation

## End-to-end tests

At minimum, prove:

```text
Create Demand
 → Attach Evidence
 → Create Opportunity
 → Score
 → Validate
 → Select Solution
 → Create Execution
 → Complete Execution
 → Verify
 → Deliver
 → Record Outcome
 → Create Learning Record
```

## Negative tests

Explicitly test:

- cross-tenant access
- unauthorized mutation
- missing ownership
- invalid state transition
- duplicate mutation
- stale version update
- unsupported outcome verification
- malformed connector response
- external content attempting prompt/instruction injection
- missing credentials
- provider timeout

---

# 18. Observability and Audit Requirements

Every production-relevant request should have a correlation/request ID.

At minimum observe:

- request success/failure
- latency
- domain mutation outcome
- connector invocation outcome
- retry count
- blocked execution
- verification result
- authorization failures
- unexpected errors

Audit events must capture, where applicable:

- actor
- tenant
- workspace
- action
- entity type
- entity ID
- timestamp
- request/correlation ID
- relevant before/after state summary
- source/system

Do not log secrets or unnecessary sensitive payloads.

---

# 19. Security Gates by Phase

No phase is complete if it weakens tenant ownership or secret boundaries.

### Gate A — Foundation

- no secrets in repository
- environment separation
- structured error handling
- request IDs

### Gate B — Ownership

- authenticated access
- server-side tenant/workspace checks
- role enforcement

### Gate C — External input

- untrusted external content handling
- provenance preservation
- prompt injection defenses

### Gate D — External actions

- explicit authorization
- connector credentials isolated
- audit trail
- retries bounded

### Gate E — Outcomes

- verification criteria required
- evidence required
- verifier/reviewer boundary
- no unsupported verified outcomes

---

# 20. End-to-End Acceptance Scenario

The MVP is considered functionally meaningful when the following scenario works with real data:

### Scenario

A real business request is captured from a permitted source.

### Expected flow

1. Operator captures DemandSignal.
2. Nura preserves source/provenance.
3. Evidence is attached.
4. Signal becomes Opportunity.
5. Opportunity receives explainable Score.
6. Operator validates the opportunity.
7. Operator selects Digital, Vertical, existing tool, service, automation, integration, or no action.
8. A Solution is recorded.
9. Execution is created.
10. Work progresses through explicit states.
11. Execution artifacts/events are recorded.
12. Execution reaches verification.
13. Verification uses explicit criteria/evidence.
14. Delivery is recorded.
15. A business Outcome is recorded only when evidence supports it.
16. LearningRecord captures the result.
17. The opportunity becomes eligible for future productization analysis if repetition/evidence justify it.

This scenario is the primary MVP acceptance test.

---

# 21. Production Readiness Gate

Nura is not production-ready merely because the UI loads.

Minimum production readiness requires:

- complete authenticated flow
- tenant/workspace isolation
- migration reliability
- API validation
- meaningful test coverage for core state transitions
- connector error handling
- secret management
- audit trail
- observability
- backup/recovery plan appropriate to deployment
- verified outcome boundary
- no demo data presented as production truth
- no fake autonomous execution

If an external dependency is unavailable, the system must show a truthful blocked/degraded state rather than fabricate success.

---

# 22. Genspark Implementation Protocol

Genspark or another implementation agent must execute this plan incrementally.

For every phase:

1. Inspect the existing repository before changing files.
2. Read the canonical docs relevant to the phase.
3. Implement only the phase scope.
4. Do not invent missing secrets, providers, APIs, credentials, or production results.
5. Add/update tests with the implementation.
6. Run type-check/build/tests where available.
7. Update relevant documentation if implementation changes a contract.
8. Commit the completed phase separately.
9. Report:
   - files changed
   - migration changes
   - API changes
   - UI changes
   - tests run
   - test results
   - commit SHA
   - remaining blockers
10. Stop at a real blocker instead of bypassing it with fake behavior.

### Implementation-agent rule

The agent must not redesign Nura's product architecture while implementing a phase. Architecture changes require an explicit decision and corresponding canonical-document update.

---

# 23. Recommended Execution Order

```text
PHASE 0
Foundation
   ↓
PHASE 1
Auth + Tenant + Workspace
   ↓
PHASE 2
Demand + Evidence + Opportunity
   ↓
PHASE 3
Scoring + Validation
   ↓
PHASE 4
Solution Registry
Digital / Vertical / Alternatives
   ↓
PHASE 5
Execution
   ↓
PHASE 6
Verification + Delivery + Outcome
   ↓
PHASE 7
Learning + Productization Gate
   ↓
PHASE 8
Real Connectors + Acquisition Hardening
```

The first major milestone is the end-to-end loop through **Phase 6**.

Phase 7 proves the learning/productization loop.

Phase 8 expands real-world acquisition and integration capability only after the core loop is reliable.

---

# 24. Definition of Done — Platform MVP

Nura MVP is done when all of the following are true:

- [ ] One Nura platform is implemented.
- [ ] Digital and Vertical remain dimensions inside the same platform.
- [ ] Tenant/workspace isolation is enforced.
- [ ] Demand signals can be captured with provenance.
- [ ] Evidence can be attached and inspected.
- [ ] Opportunities can be normalized.
- [ ] Scoring is explainable.
- [ ] Validation is explicit.
- [ ] Solutions are not forced to be software.
- [ ] Execution is explicit and auditable.
- [ ] Verification is separate from execution completion.
- [ ] Delivery is explicit.
- [ ] Outcomes require evidence.
- [ ] Learning is captured.
- [ ] Connector boundaries are provider-neutral.
- [ ] Security gates pass.
- [ ] Core tests pass.
- [ ] One real end-to-end scenario succeeds without fabricated results.

---

# 25. Explicit Architecture Guardrails

The implementation must never silently reintroduce:

- NuraHub as a separate product
- Nuralabs as a Nura dependency
- NuraDigital as a separate product identity
- NuraVertical as a separate product identity
- marketplace-by-default architecture
- website-only positioning
- chatbot-only positioning
- autonomous claims without actual execution infrastructure
- productization without evidence
- verified outcomes without verification evidence

Nura remains:

```text
                         NURA
                           │
              ┌────────────┴────────────┐
              │                         │
           DIGITAL                   VERTICAL
              │                         │
              └────────────┬────────────┘
                           │
                    SHARED PLATFORM
                           │
             Demand → Validate → Execute
                           │
                    Verify → Deliver
                           │
                    Business Outcome
```

---

# 26. Canonical References

- `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
- `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
- `docs/NURA_TECHNICAL_SPEC.md`
- `docs/NURA_UX_UI_SPEC.md`
- `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`
- `docs/NURA_SECURITY_OWNERSHIP_CONTRACT.md`

This file is an implementation sequencing document. It does not replace the canonical product, technical, UX, data/API, connector, or security contracts.
