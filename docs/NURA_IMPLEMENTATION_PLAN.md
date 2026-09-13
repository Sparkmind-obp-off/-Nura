# Nura Implementation Plan

**Status:** Canonical implementation plan — Discovery Core Ready  
**Product:** Nura — one platform, two business dimensions: Digital and Vertical  
**Implementation principle:** **Demand First → Context First → Solution Second → Execution Always**  

---

## 1. Purpose

This document converts the canonical Nura product, Discovery Core, technical, UX, data/API, connector, and security contracts into an incremental implementation sequence.

The implementation target is the **smallest real Nura platform that proves the complete discovery-to-outcome loop** without forcing a predetermined industry, product, or solution:

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
Problem Discovery
    ↓
Evidence + Scoring
    ↓
Validation
    ↓
Solution Decision
 ┌────────┬──────────┬───────────────┐
Digital  Vertical  Existing Tool / Service / Automation / Integration / No Action
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
    ↓
Repeat / Productize when evidence supports it
```

Nura is implemented as **one platform**. Digital and Vertical are solution dimensions inside the same platform. **There is no separate Vertical System, NuraHub product, or Nuralabs dependency.**

Discovery Core is an internal foundational capability of Nura, not a separate product.

---

## 2. Implementation Authority

Implementation decisions must follow this order of authority:

1. `docs/NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md`
2. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
3. `docs/NURA_VERTICAL_DISCOVERY_SPEC.md`
4. `docs/NURA_DISCOVERY_CORE_SPEC.md`
5. `docs/NURA_DISCOVERY_CORE_HARDENING_AND_READINESS.md`
6. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
7. `docs/NURA_TECHNICAL_SPEC.md`
8. `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`
9. `docs/NURA_SECURITY_OWNERSHIP_CONTRACT.md`
10. `docs/NURA_UX_UI_SPEC.md`
11. This implementation plan

If an implementation idea conflicts with a higher-level canonical contract, the canonical contract wins and this plan must be adjusted.

Older boundary/blueprint documents must not override the canonical architecture.

---

## 3. Non-Negotiable Implementation Principles

### 3.1 One platform

Build one Nura application and domain model.

Do not create separate Nura products merely because a workflow is Digital or Vertical.

### 3.2 Discovery precedes solution

The implementation order is causal, not merely organizational:

```text
Demand → Context → Domain → Workflow → Problem → Evidence → Validation → Solution
```

No implementation phase may silently skip from a weak demand signal to a predetermined solution or industry product.

### 3.3 Dynamic domain discovery

Nura must be able to discover a domain it did not know beforehand.

There is **no fixed industry catalogue** that constrains `DomainCandidate`.

A domain is meaningful because evidence, context, workflows, and repeated problems make it meaningful.

### 3.4 `solution = null` is valid

A `DomainCandidate`, `Workflow`, `ProblemPattern`, or `Opportunity` may exist while the solution remains unset.

The absence of a solution is not an error; it is an expected state during discovery and validation.

### 3.5 Evidence before validation, validation before productization

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

A score is not validation. An AI recommendation is not validation. A single request is not automatically a repeated problem.

### 3.6 Execution is explicit

Nura must represent actual work rather than merely recommending work.

Every execution must have:

- owner
- state
- timestamps
- events/checkpoints
- artifacts where applicable
- verification boundary
- audit trail

### 3.7 Verification is separate from execution

Completing an execution step does not automatically mean the business outcome is verified.

### 3.8 AI is advisory unless explicitly authorized

AI-generated classifications, domain suggestions, workflow summaries, scores, recommendations, and predictions must not be presented as verified facts without supporting evidence and the required human/system gate.

### 3.9 External systems use connectors

Provider-specific behavior belongs behind connector/adaptor boundaries.

Core Nura domain logic must not become coupled to one external provider.

### 3.10 Tenant ownership is server-side

Tenant/workspace ownership and authorization must never depend on client-provided trust alone.

### 3.11 Auditability from the beginning

Important state changes, external actions, validation decisions, verification decisions, and security-sensitive events must be auditable from MVP onward.

### 3.12 Unknown-first is a first-class test

The MVP must prove that Nura can ingest something it did not already know and discover its context/domain/workflow/problem without a hardcoded industry or solution.

---

# 4. MVP Scope Boundary

The MVP must support one real workflow from demand capture through discovery, validation, solution routing, execution, and verified outcome.

### In scope

- Tenant/workspace isolation
- Authentication/session boundary
- Demand Signal capture
- Evidence/provenance
- Opportunity normalization
- Business Context discovery
- Dynamic Domain Candidate discovery
- Workflow discovery
- Problem Pattern discovery
- Explainable scoring
- Validation records and validation gate
- Nullable solution state
- Solution selection after validation
- Digital/Vertical dimension routing
- Existing-tool/service/automation/integration/no-action alternatives
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
- Separate Vertical System
- Separate NuraHub product
- Nuralabs dependency
- Fixed industry catalogue
- Automatic productization without validation
- Fake or simulated business outcomes presented as real

---

# 5. Phase 0 — Repository and Environment Foundation

## Goal

Create the technical skeleton required to implement Nura safely without prematurely building business features.

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

Establish the ownership boundary that all later discovery records depend on.

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

# 7. Phase 2 — Demand Signal and Opportunity Formation

## Goal

Make demand the first-class input to Nura and preserve the original evidence context.

## Core entities

- DemandSignal
- Evidence
- Opportunity

## Tasks

1. Create demand signal.
2. Attach source metadata.
3. Attach initial evidence/provenance.
4. Preserve observed vs inferred information.
5. Normalize signal into opportunity.
6. Support duplicate/related signal handling.
7. Preserve original source context where legally and technically appropriate.
8. Provide demand/opportunity list and detail views.

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

# 8. Phase 3 — Business Context and Domain Discovery

## Goal

Understand the business context behind an opportunity before deciding what solution should exist.

## Core entities

- BusinessContext
- DomainCandidate

## Domain discovery rule

The domain is **discovered from evidence**. It is not selected from a fixed Nura industry list.

```text
Evidence
   ↓
Observed Business Context
   ↓
Domain Candidate
   ↓
Workflow Mapping
   ↓
Problem Clustering
   ↓
Validation
   ↓
Domain becomes meaningful
```

## Tasks

- Create/update BusinessContext records.
- Capture actors, organization/business characteristics, operating environment, constraints, goals, and relevant context.
- Create DomainCandidate from observed evidence/context.
- Support domain naming/description with confidence and provenance.
- Allow multiple candidate domains when evidence is ambiguous.
- Keep `solution` nullable.
- Record supporting evidence for domain claims.
- Prevent domain creation from automatically creating a product or solution.
- Expose domain confidence and discovery status to operators.

## Example

A signal about a distributor repeatedly struggling with reseller ordering may produce:

```json
{
  "domain": "Snack Distribution",
  "status": "observed",
  "evidence_count": 12,
  "solution": null
}
```

The system must not create a “Snack Distribution System” merely because the domain was discovered.

## Acceptance

A previously unknown domain can be created from evidence without a predefined industry enum, while the solution remains unset until later validation.

---

# 9. Phase 4 — Workflow and Problem Discovery

## Goal

Understand how work actually happens and identify repeated operational problems before solution selection.

## Core entities

- Workflow
- ProblemPattern

## Workflow contract

Capture, where available:

- actors
- trigger
- inputs
- actions
- decisions
- handoffs
- outputs
- tools
- bottlenecks
- frequency
- constraints

## Problem discovery contract

Distinguish:

```text
Symptom
  ↓
Request
  ↓
Operational Friction
  ↓
Repeated Problem
  ↓
Root-Cause Hypothesis
  ↓
Validated Problem
```

## Tasks

- Map workflows to BusinessContext/DomainCandidate.
- Capture workflow steps and actors.
- Identify bottlenecks and operational friction.
- Cluster repeated problem patterns.
- Record evidence supporting each problem pattern.
- Track confidence and discovery state.
- Prevent a requested solution from being treated as the validated problem automatically.
- Keep solution selection blocked until the required validation gate is satisfied.

## Acceptance

Nura can represent a real workflow and distinguish a stated request from a repeated/validated problem without prematurely selecting a product.

---

# 10. Phase 5 — Evidence, Scoring and Validation Gate

## Goal

Turn discovered opportunities/problems into explicit, explainable decisions.

## Tasks

- Implement explainable score dimensions.
- Store score inputs, rationale, source evidence, and scorer.
- Separate score from final decision.
- Implement validation records and state transitions.
- Support validation methods and evidence.
- Support outcomes: pending, validated, rejected, parked.
- Record decision-maker and timestamp.
- Prevent AI-generated recommendations from being treated as verified validation.
- Require sufficient evidence before productization/pilot decisions.

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

## Validation questions

1. Is the problem real?
2. Is it repeated or materially important?
3. Is the evidence credible?
4. Is the affected party identifiable?
5. Is there a meaningful desired outcome?
6. Is there willingness/ability to act?
7. Is the opportunity worth testing?

## Acceptance

An operator can inspect an opportunity, context, workflow, problem, evidence, and score; conduct validation; and explicitly record the validation result. A score alone cannot unlock solution selection.

---

# 11. Phase 6 — Solution Routing: Digital / Vertical / Alternatives

## Goal

Choose the right intervention **after context and validation**, instead of forcing every opportunity into software or a predefined vertical.

## Solution options

- `SERVICE`
- `PRODUCTIZED_SERVICE`
- `AUTOMATION`
- `SOFTWARE`
- `INTEGRATION`
- `VERTICAL_WORKFLOW`
- `EXISTING_TOOL`
- `CUSTOM_BUILD`
- `NO_ACTION`

## Solution dimensions

- `DIGITAL`
- `VERTICAL`

Vertical means the contextual execution layer Nura uses to understand and handle needs emerging from a real business domain. It is not a standalone product/system.

## Tasks

- Implement Solution entity/registry.
- Link solution to a validated opportunity/problem.
- Record selected dimension and solution type.
- Record rationale and supporting evidence.
- Support existing-tool/no-action choices.
- Allow solution to remain null when validation is incomplete.
- Prevent solution creation from being interpreted as productization.
- Do not require Nura to build software when an existing tool, service, workflow change, or no-action decision is more appropriate.

## Acceptance

A validated opportunity can receive an explicit solution decision with rationale, including Digital, Vertical, existing tool, service, automation, integration, or No Action, without creating a separate product boundary.

---

# 12. Phase 7 — Execution and Execution Events

## Goal

Turn a selected solution into trackable, authorized work.

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

# 13. Phase 8 — Verification, Delivery and Business Outcome

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

# 14. Phase 9 — Learning and Productization Gate

## Goal

Turn repeated verified outcomes into learning and possible reusable products without prematurely hardcoding a new domain/product.

## Tasks

- Implement LearningRecord.
- Capture what worked/failed.
- Link learning to opportunities, domains, workflows, problems, executions, and outcomes.
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

# 15. Phase 10 — Connector Hardening and Real Acquisition Sources

## Goal

Connect Nura to real demand sources and execution systems only after the core discovery loop works.

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

At least one real acquisition source can feed normalized `DemandSignal` records without coupling core domain logic to the provider.

---

# 16. Database Migration Sequence

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
BusinessContext
  ↓
DomainCandidate
  ↓
Workflow
  ↓
ProblemPattern
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
- Do not use seed data to fake validated demand or business outcomes.

---

# 17. API Implementation Sequence

Implement API boundaries in dependency order.

### Foundation

- health/readiness
- auth/session
- tenant/workspace context

### Discovery intake

- `POST /signals`
- `GET /signals`
- `GET /signals/:id`
- `POST /signals/:id/evidence`
- `POST /opportunities`
- `GET /opportunities`
- `GET /opportunities/:id`

### Context and domain

- `POST /contexts`
- `GET /contexts/:id`
- `POST /domains`
- `GET /domains`
- `GET /domains/:id`
- domain evidence/relationship endpoints as defined by the API contract

### Workflow and problems

- `POST /workflows`
- `GET /workflows`
- `GET /workflows/:id`
- `POST /problems`
- `GET /problems`
- `GET /problems/:id`

### Evidence/scoring/validation

- evidence read/attach endpoints
- score create/read/recalculate endpoints
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

# 18. UI Implementation Sequence

Build UI only as the domain becomes executable.

1. Application shell
2. Authentication/session states
3. Tenant/workspace selector
4. Overview dashboard
5. Discovery entry/onboarding
6. Demand Signals
7. Opportunity detail/workspace
8. Business Context
9. Domains
10. Workflows
11. Problems
12. Evidence/provenance
13. Scoring
14. Validation
15. Solution selection
16. Execution workspace
17. Verification & Delivery
18. Outcome
19. Learning/Productization
20. Connectors
21. Audit/administration

The primary user journey must preserve:

```text
Capture Demand
 → Understand Context
 → Discover Domain
 → Discover Workflow
 → Identify Problem
 → Review Evidence
 → Validate
 → Decide Solution
 → Execute
 → Verify
```

Do not create empty navigation surfaces solely to make the application look complete.

---

# 19. Testing Strategy

Each phase must include tests before being considered complete.

## Unit tests

Cover:

- domain rules
- state transitions
- dynamic domain handling
- workflow/problem rules
- scoring calculations
- authorization decisions
- validation rules
- solution gating
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
- evidence lineage
- audit generation

## End-to-end tests

At minimum, prove the canonical loop:

```text
Create Demand
 → Attach Evidence
 → Create Opportunity
 → Create Business Context
 → Discover Domain
 → Map Workflow
 → Identify Problem
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

## Mandatory unknown-first tests

### Test 1 — Unknown Domain

Input a demand signal whose domain is not present in any predefined catalogue.

Expected:

- signal accepted
- context created
- domain candidate created
- workflow/problem can be discovered
- no fixed-industry enum blocks the record
- solution remains null until the validation gate

### Test 2 — No Premature Solution

Input a strong-looking demand signal with incomplete context.

Expected:

- opportunity may exist
- domain/workflow/problem discovery can remain incomplete
- solution cannot be treated as validated merely because AI suggested one

### Test 3 — Evidence Lineage

Every material discovery/score/validation decision can be traced to supporting evidence.

### Test 4 — Explainable Score

Every score can be decomposed into inputs and rationale.

### Test 5 — Validation Gate

Unvalidated opportunities cannot pass into productization/execution as though they were validated.

### Test 6 — Tenant Isolation

Cross-tenant reads/writes fail server-side.

### Test 7 — Idempotent Ingestion

The same external signal cannot create unintended duplicates when the same idempotency key is retried.

### Test 8 — No Fake Outcome

Completed execution without sufficient verification evidence cannot produce a verified business outcome.

### Test 9 — AI Boundary

AI output is stored/marked as advisory and cannot silently become verified evidence or validation.

### Test 10 — Productization Gate

One similar request does not automatically become a reusable product.

---

# 20. Observability and Audit Requirements

Every production-relevant request should have a correlation/request ID.

At minimum observe:

- request success/failure
- latency
- domain mutation outcome
- discovery state transition
- connector invocation outcome
- retry count
- blocked execution
- validation result
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

# 21. Security Gates by Phase

No phase is complete if it weakens tenant ownership, evidence integrity, or secret boundaries.

### Gate A — Foundation

- no secrets in repository
- environment separation
- structured error handling
- request IDs

### Gate B — Ownership

- authenticated access
- server-side tenant/workspace checks
- role enforcement

### Gate C — Discovery integrity

- provenance preserved
- external content treated as untrusted input
- prompt injection defenses
- AI suggestions clearly separated from verified facts

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

# 22. Genspark Implementation Protocol

Genspark is an **implementation environment**, not the Nura architecture authority.

Any implementation prompt sent to Genspark must:

1. Read the canonical Nura docs before changing code.
2. Treat `NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md` as the highest-priority product rule.
3. Implement the smallest next phase only.
4. Preserve tenant/workspace isolation.
5. Preserve evidence lineage and auditability.
6. Never introduce a separate Vertical System.
7. Never introduce NuraHub as a product dependency.
8. Never introduce Nuralabs as a Nura dependency.
9. Never hardcode a fixed industry catalogue as the only path to domain discovery.
10. Keep `solution = null` valid until the solution gate is satisfied.
11. Add tests with each meaningful domain/state change.
12. Do not claim production readiness, real execution, or verified outcomes without actual evidence.
13. Report changed files, migrations, tests, known blockers, and commit SHA.

Recommended implementation loop:

```text
Read Canonical Docs
      ↓
Inspect Current Repo State
      ↓
Implement One Phase
      ↓
Run Typecheck / Tests / Build
      ↓
Run Unknown-First / Relevant Acceptance Tests
      ↓
Inspect Diff
      ↓
Commit
      ↓
Report Exact Changes + SHA + Blockers
```

---

# 23. Phase Gates and Definition of Done

A phase is complete only when:

- code exists for the intended scope
- persistence/migrations are correct
- API behavior matches the canonical contract
- UI supports the actual state where UI is in scope
- tests cover happy and negative paths
- authorization/ownership is enforced
- auditability is preserved
- observability is sufficient for the phase
- no fake execution/outcome is introduced
- documentation remains synchronized
- the change is committed with a traceable SHA

## Discovery Core readiness gate

Before building broad execution features, Nura must pass:

```text
✓ Demand can enter
✓ Opportunity can form
✓ Context can be captured
✓ Unknown domain can be discovered
✓ Workflow can be mapped
✓ Problem can be identified
✓ Evidence is traceable
✓ Score is explainable
✓ Validation is explicit
✓ Solution can remain null
✓ Validated opportunity can route to a solution
✓ Tenant isolation works
✓ Audit trail works
✓ Unknown-first test passes
```

Only after this gate should broad execution/connector work be expanded.

---

# 24. Recommended Implementation Order

The canonical implementation order is:

```text
Phase 0  Repository / Environment
   ↓
Phase 1  Identity / Tenant / Workspace
   ↓
Phase 2  Demand Signal / Opportunity
   ↓
Phase 3  Business Context / Domain Discovery
   ↓
Phase 4  Workflow / Problem Discovery
   ↓
Phase 5  Evidence / Scoring / Validation
   ↓
Phase 6  Solution Routing
   ↓
Phase 7  Execution
   ↓
Phase 8  Verification / Delivery / Outcome
   ↓
Phase 9  Learning / Productization
   ↓
Phase 10 Connector Hardening / Real Acquisition
```

This order is intentional. It prevents Nura from returning to the previous anti-pattern of **building a product first and searching for demand afterward**.

---

# 25. Canonical End-to-End Acceptance Scenario

The MVP is functionally meaningful when the following scenario works with real or explicitly labelled test data.

### Scenario

A previously unknown demand arrives:

```text
A business operator reports that reseller orders are repeatedly being captured manually and stock visibility is poor.
```

Nura must be able to:

1. capture the DemandSignal;
2. attach source/evidence provenance;
3. form an Opportunity;
4. capture BusinessContext;
5. create a DomainCandidate such as `Snack Distribution` without requiring a predefined industry enum;
6. map the reseller-ordering and stock-replenishment workflows;
7. identify repeated problem patterns such as manual order capture and stock visibility;
8. attach evidence to the claims;
9. calculate an explainable score;
10. run an explicit validation process;
11. keep `solution = null` if validation is incomplete;
12. after validation, route the opportunity to the most appropriate solution type/dimension;
13. create and execute authorized work;
14. verify completion against explicit criteria;
15. record delivery separately from business outcome;
16. record a verified outcome only when evidence supports it;
17. create a LearningRecord;
18. preserve an audit trail from signal to outcome.

### Failure conditions

The MVP fails this scenario if:

- a fixed industry catalogue is required to enter the domain;
- a solution is automatically created before context/workflow/problem discovery;
- `solution = null` cannot be represented;
- evidence cannot be traced to discovery/validation decisions;
- AI output is treated as verified validation without the required gate;
- cross-tenant access is possible;
- execution completion automatically becomes a verified business outcome;
- the system claims an outcome without supporting evidence;
- a new domain requires creating a new Nura product/system.

---

# 26. Final Implementation Invariant

> **Nura must be able to discover something it did not already know, understand the business context before deciding what to build, discover workflows and repeated problems before selecting a solution, validate with traceable evidence, execute only through explicit authorized work, and verify outcomes before claiming success.**

**One platform. Dynamic discovery. Evidence before productization. Execution with verification.**
