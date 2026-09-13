# Nura — Product Requirements & MVP Specification

**Status:** Canonical working specification  
**Product:** Nura — one platform  
**Authority:** `NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md` → `NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md` → `NURA_DISCOVERY_CORE_SPEC.md` → this document

## 1. Purpose

Nura turns real-world demand into validated solutions and verified business outcomes.

Nura is **one platform** with two solution dimensions:

- **Digital** — websites, apps, automation, integrations, dashboards, APIs, digital operations, and other digital interventions.
- **Vertical** — a contextual execution layer for needs emerging from real business domains.

Digital and Vertical are not separate products. A domain is discovered from evidence; it is not selected from a fixed industry catalogue.

## 2. Governing Principle

> **Demand First → Context First → Solution Second → Execution Always**

Nura must understand the business context, workflow, and problem before selecting a solution whenever the evidence is sufficient to do so.

`solution = null` is valid while discovery or validation is incomplete.

## 3. Canonical Product Loop

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

## 4. MVP Jobs To Be Done

An operator must be able to:

1. Capture an unknown demand signal.
2. Normalize it into an opportunity without prematurely choosing a solution.
3. Capture business/context information.
4. Create a domain candidate from evidence when a domain emerges.
5. Map the relevant workflow.
6. Identify problem patterns and distinguish requests, symptoms, friction, hypotheses, and validated problems.
7. Attach evidence with provenance.
8. Score the opportunity explainably.
9. Record validation and its evidence.
10. Leave the solution unset when validation is incomplete.
11. Route a validated opportunity to the smallest appropriate intervention.
12. Execute, verify, record outcome, and learn.

## 5. Core Modules

All are modules inside Nura, not separate products:

### Discovery Core

- Demand Intelligence
- Opportunity formation
- Business/context discovery
- Domain discovery
- Workflow discovery
- Problem discovery
- Evidence/provenance
- Explainable scoring
- Validation gate
- Solution handoff

### Execution

- Solution registry
- Execution/work items
- Connectors
- Verification and delivery
- Outcome recording
- Learning/productization

## 6. Canonical Discovery Objects

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

### DomainCandidate rule

A domain candidate may exist without a solution:

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

The example is illustrative, not a predefined Nura industry catalogue.

## 7. Discovery Lifecycle

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
  ├── REJECTED
  ├── PARKED
  └── VALIDATED
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

Not every signal must reach every stage. A stage may remain incomplete or terminate with an explicit reason.

## 8. Evidence Model

Evidence levels:

| Level | Meaning |
|---|---|
| Observed | Directly observed source signal or fact |
| Inferred | Interpretation derived from evidence |
| Validated | Confirmed through deliberate validation |
| Paid/Adopted | Customer paid for or adopted the intervention |
| Outcome Verified | Business result has supporting verification evidence |

Evidence must never silently upgrade itself.

## 9. Scoring & Validation

Suggested scoring dimensions:

- demand strength
- recurrence
- pain/urgency
- evidence strength
- reachability
- willingness-to-act/pay evidence
- outcome potential
- execution feasibility

Every score stores rationale and supporting evidence. A high score means **worth investigating**, not guaranteed demand.

Validation must answer, where applicable:

1. Is the problem real?
2. Is it repeated/material?
3. Is evidence credible?
4. Is the affected party identifiable?
5. Is a meaningful outcome possible?
6. Is there willingness/ability to act?
7. Is a pilot worth testing?

## 10. Solution Selection

A solution may be selected only after the validation gate is satisfied, unless the operator is explicitly recording a provisional/non-committed candidate.

Supported choices:

- Digital
- Vertical
- service
- productized service
- automation
- software
- integration
- custom build
- existing tool/connector
- workflow improvement
- no action

Creating a solution record does not imply productization.

## 11. Productization Gate

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

## 12. UX Requirements

Nura must feel like one workspace. The UI must expose the causal discovery path:

`Demand → Context → Domain → Workflow → Problem → Evidence → Validation → Solution → Execution → Verification → Outcome`.

Onboarding is an entry experience into Discovery Core, not a separate product:

```text
Onboarding → Workspace → Discovery → Capture Demand → Context → Workflow → Problem → Evidence → Validation → Solution
```

“Hub” may be an internal navigation label only; it is not a product identity.

## 13. Security & Ownership

MVP requires:

- tenant/workspace isolation
- server-side authorization
- provenance for external evidence
- secure secret handling
- audit trail for critical mutations
- explicit artifact ownership
- least-privilege connectors
- redacted error logging

## 14. Non-Goals

- separate Digital/Vertical products
- fixed industry catalogue
- separate Vertical System
- NuraHub product
- Nuralabs dependency
- automatic product creation from weak signals
- unrestricted autonomous execution
- universal connector marketplace
- fake validation or outcomes

## 15. Acceptance Criteria

MVP is acceptable when a previously unknown signal can enter Nura and, without a predetermined industry or solution, move through:

```text
Signal
→ Opportunity
→ Context
→ Domain Candidate
→ Workflow
→ Problem
→ Evidence
→ Score
→ Validation
→ Solution
→ Execution
→ Verification
→ Outcome
→ Learning
```

The system must preserve lineage, tenant ownership, explicit state transitions, provenance, auditability, and truthful outcome states.

## 16. North Star

> **Verified Business Outcomes per Active Tenant per Month**

Supporting metrics include validated opportunities, time to validated decision, pilot conversion, execution completion, verification completion, paid/adopted solutions, repeatable patterns, and outcome verification rate.

## 17. Implementation Rule

Build the smallest complete loop. Do not create a new product/system when discovery reveals a new domain. Extend the shared Nura domain model and routing capability instead.
