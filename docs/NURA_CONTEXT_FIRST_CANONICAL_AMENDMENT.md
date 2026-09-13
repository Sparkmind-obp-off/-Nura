# Nura — Context-First Canonical Amendment

**Status:** Canonical amendment
**Authority:** This amendment supersedes any earlier wording in Nura documents that treats Vertical as a predefined industry catalogue or places solution selection before business-context and workflow discovery.

## 1. Why This Amendment Exists

Nura's canonical model is refined from:

> Demand first → Product second → Execution always

to:

> **Demand First → Context First → Solution Second → Execution Always**

Nura must understand the real business context before deciding whether the appropriate response is Digital, Vertical, an existing tool, a service, automation, integration, custom software, or no action.

## 2. Canonical Causal Order

```text
REAL WORLD
    ↓
DEMAND SIGNAL
    ↓
OPPORTUNITY
    ↓
DOMAIN / BUSINESS CONTEXT
    ↓
WORKFLOW
    ↓
PROBLEM
    ↓
EVIDENCE
    ↓
SCORING
    ↓
VALIDATION
    ↓
SOLUTION DECISION
    ↓
EXECUTION
    ↓
VERIFICATION
    ↓
BUSINESS OUTCOME
    ↓
LEARNING
```

This order is mandatory for the architecture, product behavior, data model, UX, API, and implementation plan.

## 3. Vertical Discovery

Vertical is **not** a hardcoded list of industries.

> **Vertical = contextual execution layer Nura untuk memahami dan menangani kebutuhan yang muncul dari domain bisnis nyata.**

A domain becomes a meaningful vertical candidate only when Nura has evidence of a real business context, workflow, recurring problem, and sufficient validation.

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
Contextual Solution
```

Barber, Cafe, Snack Distribution, Logistics, Clinics, Workshops, Education, Farming, Property, Manufacturing, and similar domains are examples of possible discoveries—not predefined Nura products.

## 4. Solution Must Remain Unselected Until Justified

The platform must support:

```json
{
  "domain": "Snack Distribution",
  "validation_status": "in_progress",
  "solution": null
}
```

`solution = null` is a valid and expected state before validation.

Nura must never force a software solution merely because the discovered problem is operational.

## 5. Productization Gate

A domain/problem pattern may become reusable only after:

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

One business is evidence for an opportunity. Multiple independent businesses with a repeated validated problem and repeatable outcome provide stronger evidence for productization.

## 6. Canonical Architecture

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

There is one Nura platform.

Digital and Vertical are two business/solution dimensions inside that platform.

There is no separate NuraHub product and no Nuralabs dependency.

## 7. Required Platform Capabilities

The canonical platform must be able to represent at least:

- `DemandSignal`
- `Evidence`
- `Opportunity`
- `BusinessContext`
- `DomainCandidate`
- `Workflow`
- `ProblemPattern`
- `Score`
- `Validation`
- `Solution`
- `Execution`
- `ExecutionEvent`
- `Verification`
- `Outcome`
- `LearningRecord`
- `Connector`
- `AuditEvent`

The lineage should remain:

```text
DemandSignal
 → Opportunity
 → BusinessContext
 → DomainCandidate
 → Workflow
 → ProblemPattern
 → Evidence
 → Score
 → Validation
 → Solution
 → Execution
 → Verification
 → Outcome
 → Learning
```

## 8. Document Precedence

For any conflict, apply this precedence:

1. `NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md`
2. `NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
3. `NURA_VERTICAL_DISCOVERY_SPEC.md`
4. `NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
5. `NURA_TECHNICAL_SPEC.md`
6. `NURA_DATA_API_CONNECTOR_CONTRACT.md`
7. `NURA_SECURITY_OWNERSHIP_CONTRACT.md`
8. `NURA_UX_UI_SPEC.md`
9. `NURA_IMPLEMENTATION_PLAN.md`

Older boundary documents that describe NuraHub/NuraDigital/NuraVertical as separate products are stale and must not be used as architectural authority.

## 9. Implementation Rule

Do not implement a fixed catalogue such as:

```text
Barber
Cafe
Snack
Laundry
Clinic
...
```

as Nura's initial vertical architecture.

Implement **domain discovery and contextual workflow mapping** instead.

The first real domain may be anything supported by evidence. The architecture must be capable of discovering another domain later without redesigning the platform.

## 10. Canonical Acceptance Test

The architecture passes this test if a new demand signal can enter Nura with no predetermined industry or solution, move through context/workflow/problem discovery, accumulate evidence, be validated, and only then select an appropriate solution path.
