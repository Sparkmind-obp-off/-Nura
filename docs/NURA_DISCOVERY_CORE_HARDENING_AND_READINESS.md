# Nura Discovery Core — Hardening & Readiness Contract

**Status:** Canonical — Implementation Readiness
**Scope:** Nura Discovery Core
**Authority:** This document hardens the implementation of `NURA_DISCOVERY_CORE_SPEC.md`. It does not introduce a new product, subsystem, or business line.

---

## 1. Purpose

Discovery Core is the foundational discovery capability inside **Nura**. Its job is to convert real-world demand signals into validated understanding of business context, domains, workflows, and repeated problems before Nura selects or builds a solution.

The governing rule is:

> **Demand First → Context First → Solution Second → Execution Always**

This document exists to prevent implementation drift when Discovery Core is implemented by humans, AI coding agents, Genspark, connectors, or future contributors.

---

## 2. Architectural Position

Nura remains **one platform**.

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

### Mandatory interpretation

- Discovery Core is a **capability/module of Nura**, not a separate product.
- Vertical is **not** a standalone Vertical System.
- Digital and Vertical are solution dimensions inside Nura.
- A newly discovered domain does not automatically create a new application, product, or vertical system.
- `NuraHub` is not a product or architectural dependency.
- `Nuralabs` is not part of Nura architecture and must not become a hidden dependency of Discovery Core.

---

## 3. Non-Negotiable Hardening Rules

### Rule 1 — No Solution Before Context

A demand signal must not be converted directly into a predetermined solution merely because its wording resembles an existing product or vertical.

Minimum causal order:

```text
Demand Signal
  → Opportunity
  → Business Context
  → Domain Candidate
  → Workflow
  → Problem Pattern
  → Evidence
  → Scoring
  → Validation
  → Solution Decision
```

### Rule 2 — No Fixed Vertical Catalogue

The implementation must not require a hardcoded industry enum such as `barber`, `cafe`, `clinic`, or `snack_distribution` as the mechanism for discovering domains.

Domains emerge from evidence and observed business context.

A domain may be represented as a candidate before it has a validated solution.

### Rule 3 — `solution = null` Is Valid

Incomplete discovery is a first-class state.

```json
{
  "domain": "Snack Distribution",
  "validation_status": "in_progress",
  "solution": null
}
```

The system must not manufacture a solution merely to complete a workflow or satisfy a UI state.

### Rule 4 — Evidence Lineage Is Mandatory

Every material discovery conclusion must be traceable to evidence.

At minimum, the system must preserve:

```text
Source → Evidence → Observation → Problem/Context Claim → Score → Validation Decision
```

Evidence must retain provenance such as source reference, capture time, collector/connector, and relevant raw/normalized content where permitted.

### Rule 5 — Scoring Must Be Explainable

Scores are decision support, not unexplained AI authority.

Every material score must be decomposable into its contributing factors and evidence references.

A consumer of the system must be able to answer:

- Why did this opportunity receive this score?
- Which evidence influenced it?
- Which factors are missing or uncertain?
- Who or what produced the score?

### Rule 6 — Validation Is a Gate

Solution selection and productization must respect validation state.

Validation should establish, as applicable:

1. the problem is real;
2. the problem is repeated or materially important;
3. credible evidence exists;
4. affected parties are identifiable;
5. a meaningful outcome exists;
6. willingness or ability to act can be established;
7. a pilot or next action is justified.

A low-confidence opportunity may remain in discovery. It must not be promoted as a validated opportunity without sufficient evidence.

### Rule 7 — No Fake Outcome

Nura must never represent an action, delivery, verification, customer response, business result, or external side effect as completed unless there is corresponding evidence or execution state.

The following states must remain distinguishable:

```text
planned ≠ started ≠ completed ≠ verified
```

### Rule 8 — Human-in-the-Loop at Decision Boundaries

Automation may collect, normalize, correlate, summarize, score, and recommend. High-impact validation, solution selection, external action, and outcome claims must remain reviewable and auditable.

The system must not silently turn an AI recommendation into a verified business decision.

### Rule 9 — Tenant and Workspace Isolation

All Discovery Core records must be scoped to the correct tenant/workspace boundary.

Cross-tenant leakage is a hard failure.

At minimum, isolation must apply to:

- demand signals;
- opportunities;
- evidence;
- business contexts;
- domain candidates;
- workflows;
- problem patterns;
- scores;
- validation records;
- solution decisions;
- audit events.

### Rule 10 — Auditability Is Required

Material state changes must be auditable.

At minimum, preserve:

```text
who/what → action → target → previous state → new state → timestamp → correlation/reference
```

This includes AI-assisted mutations and connector-driven ingestion.

### Rule 11 — Idempotency Is Required at Boundaries

Repeated ingestion, webhook delivery, connector retries, or client retries must not create uncontrolled duplicate opportunities/evidence/events.

External inputs should carry or derive a stable idempotency key where possible.

### Rule 12 — Unknown-First Must Be a Real Test

The implementation must prove that Nura can accept a genuinely new business situation without requiring the developer to add a new industry enum, product route, or special-case code first.

Example:

```text
Unknown Demand
    ↓
New Domain Candidate
    ↓
Observed Workflows
    ↓
Repeated Problem
    ↓
Evidence + Validation
    ↓
Solution Decision
```

If this flow requires modifying the application code merely to represent the new domain, Discovery Core is not sufficiently dynamic.

---

## 4. Canonical Discovery Objects

Discovery Core must treat these as first-class concepts:

- `DemandSignal`
- `Opportunity`
- `BusinessContext`
- `DomainCandidate`
- `Workflow`
- `ProblemPattern`
- `Evidence`
- `Score`
- `Validation`

Downstream concepts may include:

- `Solution`
- `Execution`
- `ExecutionEvent`
- `Verification`
- `Outcome`
- `LearningRecord`
- `Connector`
- `AuditEvent`

Discovery Core must not collapse all of these into one generic `opportunity` object if doing so destroys causal lineage or state semantics.

---

## 5. Domain Discovery Contract

A domain candidate is an observed business-context hypothesis, not a product category.

Recommended lifecycle:

```text
observed
   ↓
context_mapped
   ↓
workflow_mapped
   ↓
problem_identified
   ↓
evidence_accumulating
   ↓
validation_in_progress
   ↓
validated | rejected | parked
```

A validated domain does **not** automatically mean a product should be built.

The solution decision still occurs afterward.

---

## 6. Workflow Discovery Contract

Workflow discovery must capture enough operational context to understand how work actually happens.

Recommended fields include:

- actor(s);
- trigger;
- inputs;
- actions;
- decisions;
- handoffs;
- tools/systems currently used;
- outputs;
- bottlenecks;
- frequency/volume;
- constraints;
- evidence references.

The implementation should support workflows that are initially incomplete and progressively enriched.

---

## 7. Problem Discovery Contract

The system must distinguish between:

```text
request
→ symptom
→ operational friction
→ repeated problem
→ root-cause hypothesis
→ validated problem
```

A user request is not automatically a validated problem.

Likewise, an AI-generated hypothesis is not automatically evidence.

---

## 8. Evidence and Provenance Contract

Every evidence item should preserve enough provenance to support later review.

Recommended minimum metadata:

```json
{
  "source_type": "connector|manual|conversation|public_source|internal",
  "source_ref": "...",
  "captured_at": "...",
  "collector": "...",
  "content_ref": "...",
  "confidence": 0.0,
  "tenant_id": "...",
  "workspace_id": "..."
}
```

Sensitive source content must follow the security and ownership contract. Provenance must not become an excuse to retain data that Nura is not authorized to retain.

---

## 9. Validation Contract

Validation is not a single AI classification.

A validation record should make clear:

- what is being validated;
- which evidence supports it;
- what remains uncertain;
- the current validation state;
- who/what performed the assessment;
- the next validation action;
- the decision and rationale when a gate is crossed.

Possible states:

```text
unvalidated
→ investigating
→ evidence_sufficient
→ human_review
→ validated
```

Negative or incomplete states are also valid:

```text
rejected
parked
needs_more_evidence
```

---

## 10. Solution Routing Contract

Only after sufficient discovery/validation should Nura route toward a solution.

Permitted outcomes include:

- Digital;
- Vertical/contextual workflow;
- service;
- productized service;
- automation;
- software;
- integration;
- custom build;
- existing tool/connector;
- workflow improvement;
- no action.

The system must not force every validated problem into a software product.

Likewise, “Vertical” must describe contextual execution rather than a predefined industry bucket.

---

## 11. Productization Gate

Productization is downstream of validation.

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

The implementation must make it possible to stop before productization.

A domain with strong evidence but no repeatable outcome is still a discovery/validation asset, not automatically a product.

---

## 12. Data Integrity Rules

The following invariants are mandatory:

1. Every discovery record belongs to a tenant/workspace.
2. Every material claim has evidence or an explicit hypothesis status.
3. Every state transition is auditable.
4. A domain may exist without a solution.
5. A solution may not be represented as validated merely because it was generated.
6. Unknown domains must be representable without code changes.
7. Duplicate external inputs must be safely handled.
8. Deleted/restricted source data must follow the applicable retention/ownership policy.
9. AI-generated content must be distinguishable from externally verified evidence.
10. Verification is distinct from execution completion.

---

## 13. AI Boundary Contract

AI may assist with:

- extraction;
- normalization;
- clustering;
- summarization;
- entity/context suggestions;
- workflow reconstruction;
- problem hypotheses;
- evidence classification;
- scoring suggestions;
- validation recommendations;
- solution recommendations.

AI must not silently claim:

- a domain is validated without supporting evidence;
- a customer agreed to something without a recorded interaction;
- an external action occurred without execution evidence;
- a business outcome occurred without verification evidence;
- a solution is commercially proven without real-world validation.

AI output is an input to the decision system unless explicitly promoted through the appropriate validation/evidence path.

---

## 14. Connector Boundary Contract

Connectors are acquisition/execution boundaries, not sources of architectural truth.

A connector may provide:

```text
external source
    ↓
normalized input
    ↓
Discovery Core
```

or, after a validated solution decision:

```text
Nura execution
    ↓
connector
    ↓
external side effect
    ↓
execution evidence
```

Connector failure, unavailable APIs, rate limits, or temporary bridges must not cause the core domain model to become source-specific.

Make.com, MCP, E2B, Daytona, social APIs, or other tools may be implementation choices where appropriate; none defines the Nura domain model.

---

## 15. Readiness Gates Before Implementation

Discovery Core is implementation-ready only when all of the following are true:

### Gate A — Architecture

- [ ] One Nura platform is preserved.
- [ ] Discovery Core is a module/capability, not a separate product.
- [ ] Digital and Vertical remain solution dimensions.
- [ ] No NuraHub product dependency exists.
- [ ] No Nuralabs dependency exists.

### Gate B — Causal Model

- [ ] Demand precedes context.
- [ ] Context precedes workflow/problem discovery.
- [ ] Evidence precedes validation.
- [ ] Validation precedes productization.
- [ ] Solution may remain `null`.

### Gate C — Data

- [ ] Discovery objects are first-class.
- [ ] Tenant/workspace scoping is mandatory.
- [ ] Evidence provenance is retained.
- [ ] State transitions are explicit.
- [ ] Audit events are retained.

### Gate D — AI

- [ ] AI outputs are distinguishable from verified evidence.
- [ ] Explainable scoring exists.
- [ ] Human review boundaries exist.
- [ ] No fake outcome or external side-effect claims are possible by default.

### Gate E — Unknown-First

- [ ] A new domain can be discovered without adding a new hardcoded industry enum.
- [ ] A new domain can exist without a solution.
- [ ] A new workflow can be captured without application redesign.
- [ ] A new problem pattern can be recorded without special-case code.

### Gate F — Operational Reliability

- [ ] Idempotency exists at ingestion/event boundaries.
- [ ] Retries cannot silently duplicate material records.
- [ ] Connector failures are observable.
- [ ] Correlation IDs/audit references are available for material operations.

---

## 16. Required Implementation Tests

The MVP implementation must include tests for at least these scenarios.

### Test 1 — Unknown Domain

Input a demand from a domain never previously represented.

**Expected:** Nura creates a domain candidate without requiring a new enum or product module.

### Test 2 — No Premature Solution

Create a valid opportunity with incomplete context.

**Expected:** solution remains `null` and the opportunity remains discoverable/validatable.

### Test 3 — Evidence Lineage

Attach multiple evidence items to a problem pattern.

**Expected:** a reviewer can trace the problem claim back to its source evidence.

### Test 4 — Explainable Score

Calculate a score using multiple factors.

**Expected:** score factors and evidence references are inspectable.

### Test 5 — Validation Gate

Attempt to promote an opportunity to validated without sufficient evidence.

**Expected:** transition is rejected or routed to human review.

### Test 6 — Tenant Isolation

Attempt to read or mutate another tenant/workspace's discovery record.

**Expected:** request is denied and the event is auditable.

### Test 7 — Idempotent Ingestion

Submit the same external signal twice with the same idempotency key.

**Expected:** the system does not create an uncontrolled duplicate material record.

### Test 8 — No Fake Outcome

Create an execution plan without a completed execution event or verification evidence.

**Expected:** outcome cannot be marked verified.

### Test 9 — AI Boundary

Submit an AI-generated problem hypothesis without external evidence.

**Expected:** it remains a hypothesis/recommendation and cannot masquerade as verified evidence.

### Test 10 — Productization Gate

Attempt to productize an opportunity before validation and repeatable outcome evidence.

**Expected:** transition is blocked or explicitly marked as an unvalidated experiment.

---

## 17. Implementation Discipline

Implementation agents must follow this order:

```text
Read canonical docs
      ↓
Read this hardening contract
      ↓
Model discovery entities
      ↓
Implement persistence + tenant boundaries
      ↓
Implement APIs/state transitions
      ↓
Implement evidence/provenance
      ↓
Implement scoring/validation
      ↓
Implement UX for discovery
      ↓
Implement tests
      ↓
Verify unknown-first flow
      ↓
Only then connect downstream solution/execution capabilities
```

Do not begin by building a Vertical product because a sample domain appears in a demo.

Do not begin by creating a catalogue of industries.

Do not treat a successful mock UI as evidence that the discovery system works.

---

## 18. Definition of Done

Discovery Core is considered hardened for MVP implementation when:

- the causal model is enforced in code and data;
- the canonical discovery objects exist;
- unknown domains are supported dynamically;
- evidence lineage is preserved;
- scoring is explainable;
- validation is an explicit gate;
- `solution = null` is supported;
- tenant/workspace isolation is enforced;
- auditability exists;
- idempotency exists at relevant boundaries;
- AI recommendations cannot masquerade as verified facts;
- execution and verification remain distinct;
- the required unknown-first and negative-path tests pass.

---

## 19. Final Invariant

The single most important implementation invariant is:

> **Nura must be able to discover something it did not already know, understand it before deciding what to build, validate it before productizing it, and verify outcomes before claiming success.**

If implementation choices violate this invariant, the implementation must be reconsidered even if the resulting UI or code appears functional.
