# Nura Discovery Core Specification

**Status:** Canonical — Core Capability
**Product:** Nura
**Scope:** Discovery before solution selection

## 1. Purpose

Nura Discovery Core is the foundational discovery capability of Nura. It converts real-world demand signals into validated understanding of business context, domains, workflows, and repeated problems before Nura selects or builds a solution.

The core rule is:

> **Demand First → Context First → Solution Second → Execution Always**

Discovery Core is not a separate product and does not create a separate Vertical System. It is an internal core capability of the single Nura platform.

## 2. Canonical Position

```text
                         NURA
                          │
              ┌───────────┴───────────┐
              │                       │
          DISCOVERY                 EXECUTION
              │                       │
              ↓                       ↓
      Demand → Context          Solution
          → Workflow              │
          → Problem          ┌─────┴─────┐
          → Evidence         │           │
          → Validation    DIGITAL     VERTICAL
```

Digital and Vertical are solution dimensions inside Nura. Vertical is not a predefined industry catalogue and is not a standalone subsystem.

## 3. Discovery Lifecycle

```text
1. Demand Signal
       ↓
2. Opportunity
       ↓
3. Business Context Discovery
       ↓
4. Domain Discovery
       ↓
5. Workflow Discovery
       ↓
6. Problem Identification
       ↓
7. Evidence Collection
       ↓
8. Scoring
       ↓
9. Validation
       ↓
10. Solution Decision
       ↓
11. Execution
       ↓
12. Verification
       ↓
13. Business Outcome
       ↓
14. Learning
```

No stage may silently skip from a weak signal directly to a predetermined product or vertical solution.

## 4. Core Discovery Objects

### DemandSignal
A raw indication that a need, request, pain, opportunity, or change exists.

Examples:
- public request
- business conversation
- marketplace activity
- social discussion
- operational observation
- inbound lead
- repeated customer complaint

### Opportunity
A normalized, traceable unit representing a potentially valuable demand signal.

### BusinessContext
The observed business setting surrounding an opportunity: actors, goals, constraints, operating environment, customer/user relationships, and relevant business processes.

### DomainCandidate
A domain/context pattern emerging from evidence. It may exist before any solution is selected.

Minimum invariant:

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

`solution: null` is valid and expected before validation.

### Workflow
A repeatable business activity discovered inside a context/domain.

### ProblemPattern
A repeated, evidence-backed problem observed across one or more workflows.

### Evidence
A source-backed observation supporting context, workflow, problem, scoring, or validation.

### Score
An explainable assessment of opportunity/problem strength based on evidence and explicit criteria.

### Validation
A recorded decision process determining whether a discovered problem is sufficiently real, valuable, and actionable to justify solution selection.

## 5. Domain Discovery

Nura does not begin with a mandatory list such as Barber, Cafe, Property, or Education.

Instead:

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
Meaningful Domain Pattern
```

A domain becomes strategically meaningful through repeated evidence and validated patterns, not because it was hardcoded into the product.

## 6. Workflow Discovery

For each meaningful business context, Nura should identify:

- actors/roles
- trigger
- inputs
- actions
- decisions
- handoffs
- outputs
- tools currently used
- bottlenecks
- frequency
- operational constraints

Workflow discovery must remain evidence-linked so later solution decisions can be traced back to observed operations.

## 7. Problem Discovery

Nura should distinguish:

- symptom
- request
- operational friction
- repeated problem
- root cause hypothesis
- validated problem

A single request is not automatically a validated problem.

Repeated evidence should increase confidence, while contradictory evidence must remain visible.

## 8. Evidence and Scoring

Every meaningful discovery claim should be traceable to evidence where practical.

Scoring must be explainable and should consider dimensions such as:

- frequency
- recurrence
- impact
- urgency
- evidence quality
- affected actors
- willingness/ability to act
- solution feasibility
- strategic fit

Scores are decision support, not fabricated certainty.

## 9. Validation Gate

A solution should not become the default outcome merely because it is technically easy to build.

Minimum validation questions:

1. Is the problem real?
2. Is it repeated or materially significant?
3. Is there credible evidence?
4. Is the affected party identifiable?
5. Is there a meaningful outcome to improve?
6. Is there sufficient willingness or ability to act?
7. Is the proposed intervention worth testing?

If validation is insufficient, Nura may keep discovering, request more evidence, run a validation activity, defer, or choose **No Action**.

## 10. Solution Routing

Only after adequate discovery and validation should Nura select a solution path.

Possible outcomes include:

- Digital solution
- Vertical solution
- service
- productized service
- automation
- software
- integration
- custom build
- existing tool/connector
- workflow improvement
- no action

The solution type is an outcome of discovery, not an input assumption.

## 11. Vertical Semantics

In Nura, **Vertical** means:

> contextual execution layer Nura untuk memahami dan menangani kebutuhan yang muncul dari domain bisnis nyata.

A vertical solution can emerge when validated discovery shows that a domain-specific workflow or operating model warrants a dedicated contextual solution.

Nura must not create a new system/product for every discovered domain.

## 12. Productization Gate

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

A domain may remain an observed or validated pattern without becoming a product.

## 13. Example: Snack Distribution

Suppose Nura discovers repeated signals from snack distributors.

Nura should first record the business context and workflows. It may discover reseller ordering, stock replenishment, and delivery as recurring workflows. It may then identify manual order capture and poor stock visibility as repeated problems.

At this point Nura does **not** create a Snack Distribution System automatically.

It gathers evidence, scores the opportunity/problem, validates the need, and then decides whether the right intervention is an automation, existing tool, service, software, integration, vertical workflow, or no action.

## 14. Discovery Core Responsibilities

Discovery Core owns or coordinates:

- demand normalization
- opportunity formation
- context mapping
- domain candidate formation
- workflow discovery
- problem pattern discovery
- evidence lineage
- explainable scoring inputs
- validation state
- discovery-to-solution handoff

Execution systems consume validated decisions; they do not redefine discovery truth silently.

## 15. Non-Goals

Discovery Core is not:

- a separate Nura product
- NuraHub
- a fixed industry catalogue
- a vertical marketplace
- an automatic product generator
- a replacement for human validation
- permission to claim outcomes without evidence
- a reason to build software before demand validation

## 16. Architecture Invariants

1. Nura remains one platform.
2. Digital and Vertical remain dimensions, not separate products.
3. Context discovery precedes solution selection.
4. Workflow discovery precedes solution selection.
5. Problem validation precedes productization.
6. A domain may exist without a solution.
7. `solution = null` is a valid state.
8. Evidence must remain traceable.
9. No fake execution or fake business outcome.
10. A new domain must be discoverable without changing the core architecture.

## 17. MVP Acceptance Criteria

Discovery Core is considered structurally ready when the system can:

- ingest an unknown demand signal;
- create or update an opportunity;
- capture business context;
- create a domain candidate without a predefined industry enum;
- map one or more workflows;
- record repeated problem patterns;
- attach evidence to discovery claims;
- calculate explainable scores;
- record validation state and rationale;
- keep the solution unset when validation is incomplete;
- route a validated opportunity to Digital, Vertical, another solution type, or No Action;
- preserve auditability from signal through outcome.

## 18. Canonical Summary

> **Nura does not start by asking, “What product should we build?”**
>
> **Nura starts by asking, “What demand is real, what business context does it belong to, what workflow is involved, what problem is repeated, what evidence proves it, and what outcome matters?”**
>
> Only then does Nura decide what solution should exist.
