# Nura — Product Requirements & MVP Specification

**Status:** Canonical working specification  
**Authority:** Follows `NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`  
**Product:** Nura — one platform  

---

## 1. Purpose

This document translates the final Nura concept and architecture into concrete product requirements and an MVP boundary.

Nura is **one platform** with two business dimensions:

- **Digital** — digital solutions such as websites, landing pages, apps, automation, integrations, dashboards, APIs, and digital operations.
- **Vertical** — solutions for real-world business contexts such as Barber, Cafe, and future validated verticals.

Digital and Vertical are not separate products. They use the same demand, validation, execution, verification, and learning foundation.

---

## 2. Product Principle

> **Demand first → Product second → Execution always.**

Nura must not assume that every observed request deserves a new software product.

For each opportunity, Nura should be able to recommend or execute the smallest appropriate solution:

- existing tool / connector
- service
- productized service
- automation
- integration
- custom digital build
- vertical workflow
- software product
- no action yet

---

## 3. Core Outcome

Nura exists to turn real demand into verified business outcomes.

Canonical lifecycle:

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
   ↙          ↘
Digital     Vertical
   \          /
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

---

## 4. Primary Users

### 4.1 Operator

The person using Nura to discover opportunities, validate them, coordinate work, and deliver outcomes.

### 4.2 Client / Business

A business or organization whose demand, problem, workflow, or desired outcome becomes an opportunity.

### 4.3 Internal Workspace / Tenant

A scoped environment containing opportunities, evidence, solutions, executions, outcomes, and audit records.

MVP does not require a complex multi-role organization model. Tenant/workspace boundaries must nevertheless exist in the data model so the platform can grow safely.

---

## 5. MVP Jobs To Be Done

Nura MVP must allow an operator to:

1. Capture a real demand signal.
2. Normalize it into an opportunity.
3. Attach evidence and source information.
4. Score the opportunity.
5. Decide whether it is worth validation.
6. Record validation results.
7. Select Digital, Vertical, existing-tool, service, or no-action path.
8. Create an execution/work item.
9. Track execution state.
10. Record verification evidence.
11. Mark the resulting business outcome.
12. Preserve the learning for future decisions.

---

## 6. Core Product Modules

These are **modules inside Nura**, not separate products.

### 6.1 Demand Intelligence

Responsibilities:

- ingest demand signals
- normalize source metadata
- classify signal type
- preserve provenance
- distinguish observed vs inferred information

Signal sources may include:

- social platforms
- public requests
- direct business conversations
- marketplaces
- real business operations
- repeated customer requests
- internal observations
- lawful/permitted data sources

### 6.2 Opportunity Management

Responsibilities:

- convert signals into opportunities
- group related signals
- define problem statement
- define affected business/customer
- track lifecycle
- maintain evidence lineage

### 6.3 Scoring & Validation

Responsibilities:

- score demand strength
- score recurrence
- score urgency
- score willingness-to-pay indicators
- score accessibility / ability to reach the customer
- record validation actions
- record validation outcomes

The scoring model is advisory, not an automatic truth engine.

### 6.4 Solution Registry

Responsibilities:

- represent candidate solution types
- map solutions to validated problems
- distinguish Digital vs Vertical
- allow existing tools/connectors
- track reusable solution patterns

### 6.5 Execution

Responsibilities:

- create work items
- assign execution path
- track state
- store inputs and outputs
- record blockers and retries
- maintain traceability

MVP does not require a general-purpose autonomous agent runtime.

### 6.6 Verification & Delivery

Responsibilities:

- define success criteria
- collect verification evidence
- mark outcome status
- record delivered artifact/service
- preserve before/after evidence where applicable

### 6.7 Learning

Responsibilities:

- record what worked
- record what failed
- link outcomes back to opportunities
- identify repeated validated patterns
- support future productization decisions

---

## 7. Opportunity Lifecycle

```text
CAPTURED
  ↓
NORMALIZED
  ↓
SCORING
  ↓
VALIDATING
  ↓
VALIDATED / REJECTED / PARKED
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

State transitions must be explicit and auditable.

No UI may imply that a solution is validated merely because an opportunity was captured.

---

## 8. Demand Evidence Model

Nura must distinguish evidence levels:

| Level | Meaning |
|---|---|
| Observed | Directly observed signal or request |
| Inferred | Reasonable interpretation derived from evidence |
| Validated | Evidence confirmed through a deliberate validation action |
| Paid/Adopted | Customer actually paid for or adopted the solution |
| Outcome Verified | Measurable business result has supporting evidence |

The product must never silently promote one level into another.

---

## 9. MVP Data Model

Minimum entities:

```text
Tenant
Workspace
User / Operator
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

### Core relationships

```text
DemandSignal ──→ Opportunity
Evidence ──────→ DemandSignal / Opportunity / Validation / Verification
Opportunity ───→ Score
Opportunity ───→ Validation
Opportunity ───→ Solution
Solution ──────→ Execution
Execution ─────→ Artifact
Execution ─────→ Verification
Verification ──→ Outcome
Outcome ───────→ LearningRecord
All critical transitions ──→ AuditEvent
```

Every tenant-owned record must carry an explicit tenant/workspace scope.

---

## 10. Connector Boundary

Connectors are adapters to external capabilities or data sources.

A connector must expose a normalized contract rather than leaking provider-specific behavior throughout the core platform.

Conceptual contract:

```text
Connector
├── identity
├── capabilities
├── authentication reference
├── input schema
├── output schema
├── rate/usage constraints
├── provenance
└── error normalization
```

Examples may include social-source acquisition, marketplace research, web research, communication channels, storage, deployment, or external execution providers.

MVP should implement only connectors required by the first validated workflow.

---

## 11. Security & Ownership Requirements

MVP requirements:

- tenant isolation
- server-side secret handling
- no provider secret exposed to browser clients
- authenticated or signed workspace access
- audit trail for critical mutations
- provenance for external evidence
- explicit ownership of generated artifacts
- least-privilege connector access
- normalized and redacted error logging where secrets may appear

Nura must not claim enterprise-grade security controls that have not been implemented and tested.

---

## 12. UX Requirements

The primary experience should feel like **one Nura workspace**.

The user should not need to understand internal module boundaries.

Primary navigation may expose concepts such as:

- Opportunities
- Evidence
- Validation
- Solutions
- Execution
- Outcomes
- Learning

“Hub” may be used as an internal navigation concept if useful, but it is not a product identity.

Digital and Vertical should be selectable dimensions/solution paths, not separate applications.

---

## 13. MVP Screens

Minimum useful UI:

1. **Workspace / Overview**
   - active opportunities
   - validation queue
   - active executions
   - verified outcomes

2. **Opportunity List**
   - filters by status, score, source, Digital/Vertical path

3. **Opportunity Detail**
   - problem
   - evidence
   - score
   - validation history
   - selected solution
   - execution
   - outcome

4. **Capture Signal**
   - source
   - raw signal
   - context
   - timestamp
   - provenance

5. **Validation Workspace**
   - hypothesis
   - validation action
   - evidence collected
   - result
   - decision

6. **Solution / Execution View**
   - selected path
   - work items
   - status
   - artifacts
   - blockers

7. **Outcome View**
   - success criteria
   - verification evidence
   - result
   - learning

---

## 14. Scoring MVP

The first scoring model should be transparent and explainable.

Suggested dimensions:

```text
Demand Strength
Recurrence
Urgency
Willingness-to-Pay Evidence
Reachability
Outcome Potential
Execution Feasibility
```

Each score must retain:

- value
- rationale
- evidence references
- scorer / scoring method
- timestamp

A high score means **worth investigating**, not “guaranteed business opportunity.”

---

## 15. Productization Gate

A problem may become a repeatable Nura solution only after:

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

The MVP must preserve the evidence required to make this decision later.

---

## 16. MVP Non-Goals

The following are explicitly outside MVP unless a validated opportunity requires them:

- building a giant all-in-one vertical SaaS
- fully autonomous agent execution
- universal connector marketplace
- complex enterprise RBAC
- every social-platform integration
- custom AI model training
- automatic product creation from weak signals
- separate Nura products for Digital and Vertical
- Nuralabs as a Nura dependency
- NuraHub as a separate product

---

## 17. Acceptance Criteria

MVP is acceptable when an operator can complete one end-to-end real workflow:

```text
Real Signal
→ Opportunity
→ Evidence
→ Score
→ Validation
→ Solution Selection
→ Execution
→ Verification
→ Outcome
→ Learning
```

The system must preserve the lineage between these stages.

### Minimum technical acceptance

- data is persisted
- tenant/workspace scope is enforced
- state transitions are explicit
- evidence has provenance
- critical actions are auditable
- execution errors are normalized
- artifacts are traceable
- verification cannot be skipped silently
- no fake success state is generated

### Minimum business acceptance

At least one real opportunity should progress far enough to demonstrate that Nura can connect demand to a delivered and verifiable business outcome.

---

## 18. North Star

> **Verified Business Outcomes per Active Tenant per Month**

Supporting metrics:

- qualified opportunities
- validation rate
- validated opportunity rate
- pilot conversion
- execution completion rate
- verification completion rate
- paid/adopted solutions
- repeatable solution patterns
- time from signal to validated decision
- time from validated decision to outcome

---

## 19. Implementation Rule

Build the smallest platform that can prove the complete loop.

Do not build infrastructure merely because the architecture allows it.

The implementation sequence should follow:

```text
Core Data Model
→ Signal Capture
→ Opportunity
→ Evidence + Scoring
→ Validation
→ Solution Selection
→ Execution
→ Verification
→ Outcome
→ Learning
→ First Real Pilot
→ Expand Only From Evidence
```

This document is the product requirements baseline for implementation. Future technical specifications must refine these requirements without violating the final Nura architecture.
