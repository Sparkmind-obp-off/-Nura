# Nura Vertical & Domain Discovery Specification

**Status:** Canonical
**Authority:** Extends the Nura Final Concept, PRD/MVP, Technical, Data/API, Security, UX, and Implementation specifications.

## 1. Purpose

Nura must not begin by assuming that a fixed industry is a product opportunity. A vertical/domain becomes meaningful only when Nura discovers a real business context, workflow, recurring problem, evidence pattern, and validated opportunity.

The governing principle is:

> **Demand First → Context First → Solution Second → Execution Always**

Vertical is therefore a **discovered contextual execution layer**, not a predefined industry catalogue.

## 2. Canonical Model

```text
REAL WORLD
    ↓
DEMAND SIGNAL
    ↓
OPPORTUNITY
    ↓
DOMAIN / BUSINESS CONTEXT DISCOVERY
    ↓
WORKFLOW DISCOVERY
    ↓
PROBLEM IDENTIFICATION
    ↓
EVIDENCE
    ↓
SCORING
    ↓
VALIDATION
    ↓
SOLUTION DECISION
    ├── Digital
    ├── Vertical
    ├── Existing Tool
    ├── Service
    ├── Automation
    ├── Integration
    └── No Action
    ↓
EXECUTION
    ↓
VERIFICATION
    ↓
BUSINESS OUTCOME
    ↓
LEARNING
    ↓
REPEAT / PRODUCTIZE
```

Nura does not select `Vertical` merely because an industry is large, popular, or technically interesting.

## 3. What Vertical Means

For Nura:

> **Vertical = contextual execution layer Nura untuk memahami dan menangani kebutuhan yang muncul dari domain bisnis nyata.**

A vertical is not synonymous with an industry name. It represents a sufficiently evidenced domain/workflow/problem pattern for which a repeatable contextual solution may eventually be justified.

Examples such as snack distribution, barber operations, cafes, workshops, clinics, logistics, education, farming, property, or manufacturing are **examples of possible discoveries**, not preinstalled Nura products.

## 4. Discovery Pipeline

### Stage 1 — Demand Signal

Capture a real signal from an allowed source:

- public business requests
- social discussions
- direct business conversations
- marketplace activity
- observed operational activity
- repeated customer requests
- permitted external data sources

Every signal must preserve provenance and evidence quality.

### Stage 2 — Opportunity

Normalize related signals into an opportunity without prematurely assigning a solution.

An opportunity should answer:

- What appears to be needed?
- Who appears to need it?
- What evidence supports the signal?
- What is still unknown?

### Stage 3 — Domain / Business Context Discovery

Nura observes the actual business context around the opportunity.

Context can include:

- actors and roles
- business model
- products/services
- channels
- operational constraints
- transaction patterns
- systems already in use
- dependencies
- geography where relevant
- frequency/volume of activity

The result is a **domain candidate**, not yet a product.

### Stage 4 — Workflow Discovery

Map how work actually happens.

Typical questions:

- What triggers the workflow?
- Who performs each step?
- What information is exchanged?
- Where are handoffs?
- Which steps are manual?
- Which systems are involved?
- Where do delays, errors, duplication, or lost opportunities occur?

### Stage 5 — Problem Identification

Cluster recurring operational problems discovered inside the workflow.

A problem should be distinguished from a requested solution. For example:

- `"Need an app"` is a request.
- `"Orders are copied manually from chat into a spreadsheet and stock is often outdated"` is an operational problem.

Nura should reason from the problem before selecting a solution.

### Stage 6 — Evidence and Scoring

Evidence is attached to the domain, workflow, and problem pattern.

Evidence levels remain:

1. Observed
2. Inferred
3. Validated
4. Paid/Adopted
5. Outcome Verified

Evidence must not be upgraded merely because an AI model predicts that an opportunity is promising.

### Stage 7 — Validation

Validation tests whether the problem is sufficiently real and valuable to justify action.

Validation can include:

- direct confirmation
- repeated occurrence
- workflow observation
- pilot commitment
- willingness to adopt
- willingness to pay
- measurable improvement
- successful execution

A domain may remain `in_progress`, `parked`, or `rejected`.

### Stage 8 — Solution Decision

Only after adequate validation does Nura select a solution path.

Possible outcomes:

```text
Digital
Vertical
Existing Tool
Service
Automation
Integration
Custom Software
No Action
```

`solution = null` is valid before this decision.

## 5. Domain Candidate Lifecycle

```text
DISCOVERED
   ↓
OBSERVED
   ↓
CONTEXT_MAPPED
   ↓
WORKFLOW_MAPPED
   ↓
PROBLEMS_CLUSTERED
   ↓
EVIDENCE_ACCUMULATING
   ↓
VALIDATING
   ├── VALIDATED
   ├── PARKED
   └── REJECTED
          ↓
   SOLUTION_SELECTED
          ↓
      EXECUTING
          ↓
       VERIFIED
          ↓
     OUTCOME_RECORDED
          ↓
        LEARNED
```

Not every discovered domain reaches productization.

## 6. Dynamic Domain Registry

Nura should maintain a registry of observed domain candidates rather than a hardcoded industry menu.

Illustrative record:

```json
{
  "domain": "Snack Distribution",
  "status": "observed",
  "evidence_count": 12,
  "workflows": [
    "reseller_ordering",
    "stock_replenishment",
    "delivery"
  ],
  "repeated_problems": [
    "manual_order_capture",
    "stock_visibility"
  ],
  "validation_status": "in_progress",
  "solution": null
}
```

The important invariant is:

> **Nura may know the domain before it knows the solution.**

## 7. Example: Snack Distribution

Snack distribution is only an example of discovery.

Nura may observe a chain such as:

```text
Producer / Factory
      ↓
Packaging / Repackaging
      ↓
Inventory
      ↓
Distributor
      ↓
Reseller / Store / Warung
      ↓
Sales
      ↓
Repeat Demand
```

Nura may then discover problems around:

- order capture
- stock visibility
- replenishment
- distribution coordination
- reseller follow-up
- margins
- repeat ordering

Only after evidence and validation can Nura determine whether the right response is a dashboard, CRM, automation, integration, existing SaaS, service operation, custom software, or no software at all.

If the same validated problem/outcome pattern appears across multiple independent businesses, Nura may identify a repeatable vertical opportunity.

```text
Business A → recurring problem → validated outcome
Business B → recurring problem → validated outcome
Business C → recurring problem → validated outcome
                    ↓
             repeated pattern
                    ↓
          repeatable solution
                    ↓
             productization
```

## 8. Productization Gate

A discovered domain should not become a product merely because Nura has implemented one solution.

Canonical gate:

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

Productization should require evidence that the problem and outcome are repeatable enough to justify reusable capabilities.

## 9. Anti-Patterns

Nura must reject these patterns:

- `Industry → Build SaaS → Search for customers`
- hardcoded Barber/Cafe/Snack products before evidence
- assuming every problem needs software
- treating social mentions as validated demand
- treating AI-generated classifications as observed facts
- creating vertical branding solely for marketing
- building dozens of vertical modules before repeated demand exists
- using domain size as a substitute for customer evidence
- creating a solution before understanding the workflow

## 10. Architecture Implications

The canonical Nura architecture remains:

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
                Demand → Context → Solution
                           │
                    Execute → Verify
                           │
                    Business Outcome
```

Digital and Vertical remain the two business dimensions of one Nura platform.

Vertical Discovery is a shared platform capability that determines when a contextual/domain-specific execution path is justified.

There is no separate NuraHub product and no dependency on Nuralabs.

## 11. Acceptance Criteria

The discovery architecture is considered correct when:

1. Nura can ingest a demand signal without selecting a solution.
2. Nura can create an opportunity with evidence provenance.
3. Nura can discover and record business context.
4. Nura can map workflows and actors.
5. Nura can cluster recurring problems.
6. Nura can score and validate evidence.
7. Nura can leave `solution` unset until validation.
8. Nura can choose among Digital, Vertical, existing tool, service, automation, integration, custom software, or no action.
9. Nura can execute and verify the selected path.
10. Nura can record a business outcome.
11. Nura can learn from repeated outcomes.
12. Nura can identify a productization candidate only after repeatable evidence exists.
13. No fixed industry list is required for the architecture to function.
14. Example domains such as snack distribution remain examples, not hardcoded product categories.

## 12. Canonical References

- `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
- `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
- `docs/NURA_TECHNICAL_SPEC.md`
- `docs/NURA_UX_UI_SPEC.md`
- `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`
- `docs/NURA_SECURITY_OWNERSHIP_CONTRACT.md`
- `docs/NURA_IMPLEMENTATION_PLAN.md`
