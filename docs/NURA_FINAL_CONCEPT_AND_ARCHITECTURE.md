# Nura — Final Concept & Architecture

## 1. Canonical Product Definition

**Nura is one platform.**

Nura is a demand-to-outcome business platform that discovers real business context, identifies validated problems, selects the right solution path, and coordinates execution toward a measurable business outcome.

Nura is **not** a collection of separate products called NuraHub, NuraDigital, and NuraVertical.

Those names are not separate master products. Hub may only be used as internal UX/navigation terminology where useful.

---

## 2. Product Hierarchy

```text
NURA
│
├── Digital
│   └── digital products, services, automation, software, web, API, etc.
│
└── Vertical
    └── contextual execution for validated real-world business domains/workflows
```

The commercial and product identity is simply **Nura**.

### Important naming rule

- **Nura** = the platform and product identity.
- **Digital** = one business dimension inside Nura.
- **Vertical** = another business dimension inside Nura.
- **Hub** = optional UX/navigation terminology only; it must not become a separate product.
- **Nuralabs** = removed from the Nura product architecture and must not appear as a Nura subsystem, brand layer, or dependency.

Nuralabs may remain as a completely separate repository/project if maintained independently, but it is **not part of Nura's canonical product architecture**.

---

## 3. Core Business Idea

Nura does not begin by assuming which product should be built.

The canonical causal order is:

```text
Demand
  ↓
Context
  ↓
Workflow
  ↓
Problem
  ↓
Evidence
  ↓
Validation
  ↓
Solution
  ↓
Execution
  ↓
Verification
  ↓
Business Outcome
  ↓
Learning
```

### Governing principle

> **Demand First → Context First → Solution Second → Execution Always**

This is the core protection against building products before real demand is understood.

---

## 4. Two Business Dimensions

Nura has two primary solution dimensions.

### A. Digital

Digital covers problems that can primarily be addressed through digital products, services, automation, software, integrations, APIs, dashboards, or digital operations.

Examples:

- websites and landing pages
- business applications
- automation
- software development
- API and system integration
- dashboards
- digital assets/design
- digital operations

Digital is a solution dimension, not a separate brand.

### B. Vertical

Vertical is a contextual execution dimension for needs that emerge from a specific real-world business domain or workflow.

**Verticals are discovered; they are not preinstalled as a fixed industry catalogue.**

Barber, cafe, snack distribution, logistics, workshops, clinics, education, farming, property, manufacturing, and similar domains are examples only. They become meaningful to Nura when real evidence shows a recurring domain/workflow/problem pattern.

---

## 5. Canonical Nura Discovery Flow

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
DELIVERY / OUTCOME
    ↓
LEARNING
```

The user does not need to understand this internal sequence. Nura may present a simple entry such as:

> **"Apa yang ingin kamu selesaikan?"**

The complexity belongs inside the platform, not in the user's mental model.

---

## 6. Demand Intelligence

Demand intelligence is a platform capability, not a separate public product identity.

Potential demand sources include:

- social platforms
- public requests
- direct business conversations
- marketplace activity
- existing business operations
- repeated customer requests
- internal observations
- other lawful and permitted data sources

The platform converts raw signals into structured opportunities while preserving provenance:

```text
Source Signal
    ↓
Demand Record
    ↓
Opportunity
    ↓
Business Context
    ↓
Workflow
    ↓
Problem
    ↓
Evidence
    ↓
Score
    ↓
Validation
    ↓
Action
```

The system must distinguish between:

- observed demand
- inferred demand
- validated demand
- paid/adopted demand
- outcome-verified demand

These must never be represented as equivalent evidence.

---

## 7. Domain / Vertical Discovery

Nura maintains **domain candidates**, not a hardcoded list of vertical products.

A domain candidate becomes meaningful through:

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
Validated Contextual Opportunity
```

A domain may exist in the system while its solution remains unknown.

Illustrative state:

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

The critical invariant is:

> **Nura may know the domain before it knows the solution.**

See `docs/NURA_VERTICAL_DISCOVERY_SPEC.md` for the detailed discovery contract.

---

## 8. Solution Selection

Only after adequate evidence and validation does Nura choose the smallest useful solution.

Possible outcomes include:

```text
Digital
Vertical
Service
Productized Service
Automation
Software
Integration
Custom Build
Existing Tool / Connector
No Action
```

Nura should not automatically build software for every opportunity.

The best solution is the one that produces the strongest verified business outcome with appropriate cost and complexity.

---

## 9. Architecture

Nura is architected as one platform with explicit internal modules.

```text
┌──────────────────────────────────────────────────┐
│                      NURA                        │
│                                                  │
│  Experience / Entry                              │
│          ↓                                       │
│  Identity + Workspace                            │
│          ↓                                       │
│  Demand Intelligence                             │
│          ↓                                       │
│  Opportunity Database                            │
│          ↓                                       │
│  Context + Domain Discovery                      │
│          ↓                                       │
│  Workflow + Problem Discovery                   │
│          ↓                                       │
│  Scoring + Validation                            │
│          ↓                                       │
│  Solution Routing                                │
│       ┌───────────────┐                          │
│       │               │                          │
│    Digital         Vertical                      │
│       │               │                          │
│       └───────┬───────┘                          │
│               ↓                                  │
│        Execution / Workflow                      │
│               ↓                                  │
│        Verification / Evidence                   │
│               ↓                                  │
│        Delivery / Outcome                        │
│               ↓                                  │
│        Feedback / Learning                       │
└──────────────────────────────────────────────────┘
```

### Architectural rule

**One platform, modular internals.**

Do not split the architecture into artificial products merely because a module has a different responsibility.

---

## 10. Data Model — Minimum Conceptual Entities

The context-first model adds explicit discovery concepts:

```text
Tenant / Workspace
User
DemandSignal
Evidence
Opportunity
BusinessContext
DomainCandidate
Workflow
ProblemPattern
Score
Validation
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

Relationships should preserve provenance and causal lineage:

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

This lineage is critical to preventing unsupported claims of demand, completion, or business value.

---

## 11. Deployment Architecture

Nura should initially be capable of serving multiple surfaces without duplicating the core platform.

```text
                 NURA CODEBASE
                      │
          ┌───────────┼───────────┐
          │           │           │
       Nura Web    Nura App   Future Surface
          │           │           │
          └───────────┼───────────┘
                      │
              Shared Platform Core
```

The exact deployment strategy may be one repository with multiple deployments or another structure if justified by real operational needs.

The architecture must not require multiple separate products merely to support presentation surfaces.

---

## 12. What Nura Is Not

Nura is not:

- a website builder only
- a chatbot only
- a marketplace by default
- a collection of unrelated micro-products
- a giant vertical SaaS suite before validation
- an AI wrapper whose success is measured by generated text
- a fake autonomous operator that claims work it did not execute
- dependent on a product named Nuralabs

---

## 13. Productization Gate

A new Nura product/workflow should pass this progression:

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

A domain may be observed long before it qualifies for productization.

Productization requires repeated evidence that a problem, solution, and outcome are sufficiently repeatable to justify reusable capabilities.

---

## 14. Final Architecture Decision

The canonical architecture is:

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

**There is one Nura platform.**

**Digital and Vertical are the two primary business dimensions.**

**Verticals are discovered from real demand, real business context, real workflows, recurring problems, and evidence. They are not a hardcoded industry menu.**

**Hub is UX/navigation terminology only, not a separate product.**

**Nuralabs is not part of Nura's architecture.**

This document is the final conceptual and architectural boundary for the Nura repository unless explicitly superseded by a later architecture decision.