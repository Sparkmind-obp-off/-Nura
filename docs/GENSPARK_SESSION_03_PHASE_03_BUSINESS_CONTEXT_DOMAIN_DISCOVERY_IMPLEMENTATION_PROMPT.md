# NURA — GENSPARK SESSION 03 / PHASE 03 IMPLEMENTATION PROMPT

**Repository:** `Sparkmind-obp-off/Nura`  
**Phase:** Phase 03 — Business Context + Dynamic Domain Discovery  
**Execution mode:** Implement, verify, commit, report  
**Canonical flow:** `Opportunity → BusinessContext → DomainCandidate`

---

## 0. EXECUTION COMMAND

> **Execute Nura Session 03 / Phase 03 according to this document. Inspect the existing repository first, preserve the working Phase 01 and Phase 02 foundation, read the canonical documents, implement the minimum complete Phase 03 capability, run verification, commit the changes, and return the required Phase 03 report with the exact final commit SHA. Do not stop at analysis.**

Phase 01 and Phase 02 are already implemented. Do not rebuild them.

The Phase 03 objective is to make the next real Discovery Core step operational:

```text
DemandSignal
     ↓
Opportunity
     ↓
BusinessContext
     ↓
DomainCandidate
     ↓
solution = null
```

---

# 1. CANONICAL ARCHITECTURE — HARD LOCK

Nura is **one platform / one product identity**.

- Digital and Vertical are dimensions inside Nura.
- Discovery Core is an internal capability/module, not a separate product.
- **NuraHub does not exist as a product/system.**
- **Vertical System does not exist.**
- **Nuralabs is not part of Nura.**
- Do not create a fixed industry/vertical catalogue.
- Do not select a solution during Phase 03.
- A `DomainCandidate` is a candidate, not a validated domain, vertical, problem, or solution.
- `solution = null` is valid and expected in this phase.

The governing principle remains:

**Demand First → Context First → Solution Second → Execution Always**

The causal order is locked:

```text
Demand Signal
→ Opportunity
→ Business Context
→ Domain Discovery
→ Workflow Discovery
→ Problem Discovery
→ Evidence
→ Scoring
→ Validation
→ Solution
→ Execution
→ Verification
→ Outcome
→ Learning
```

Phase 03 stops at:

```text
Opportunity → BusinessContext → DomainCandidate
```

Do not jump into Workflow, Problem, Evidence/Scoring, Validation, Solution, or Execution.

---

# 2. READ THESE DOCUMENTS FIRST

Before changing code, inspect the repository and read the current versions of:

1. `README.md`
2. `docs/NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md`
3. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
4. `docs/NURA_DISCOVERY_CORE_SPEC.md`
5. `docs/NURA_DISCOVERY_CORE_HARDENING_AND_READINESS.md`
6. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
7. `docs/NURA_TECHNICAL_SPEC.md`
8. `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`
9. `docs/NURA_SECURITY_OWNERSHIP_CONTRACT.md`
10. `docs/NURA_UX_UI_SPEC.md`
11. `docs/NURA_IMPLEMENTATION_PLAN.md`
12. `docs/GENSPARK_SESSION_01_PHASE_01_DISCOVERY_CORE_IMPLEMENTATION_PROMPT.md`
13. `docs/GENSPARK_SESSION_02_PHASE_02_DEMAND_SIGNAL_OPPORTUNITY_IMPLEMENTATION_PROMPT.md`

Canonical precedence is governed by the existing context-first amendment and current architecture documents. If an older document conflicts with them, preserve the canonical context-first architecture.

Also inspect the actual Phase 01 and Phase 02 implementation. Do not assume filenames, schema names, helper names, or API conventions. Reuse the existing implementation patterns.

---

# 3. PHASE 03 OBJECTIVE

Implement the smallest real, production-shaped capability that can take an existing `Opportunity` and create/maintain:

1. **BusinessContext**
2. **DomainCandidate**

with:

- tenant isolation
- workspace isolation
- server-side ownership enforcement
- provenance/traceability
- unknown-first handling
- dynamic domain values
- explicit uncertainty where applicable
- auditability
- idempotent/replay-safe mutations where appropriate
- regression safety for Phase 01 + Phase 02

The implementation must work without an LLM.

Manual/internal context capture is acceptable and preferred for this phase. External acquisition is not part of Phase 03.

---

# 4. BUSINESS CONTEXT SEMANTICS

`BusinessContext` represents the business/operational context surrounding an opportunity.

It is **not** a solution.

It is **not** a validated problem.

It is **not** a fixed industry classification.

It should be possible to represent partial knowledge honestly.

The model should be able to preserve, according to the existing repository conventions:

- observed facts
- business characteristics
- operating context
- channels
- actors/stakeholders when known
- constraints when known
- current process/context clues
- unknowns
- provenance/source information
- creator/actor
- timestamps
- confidence/uncertainty where useful

Do not over-model. Reuse existing JSON/text/provenance patterns when they are sufficient.

### Unknown-first requirement

The system MUST NOT require fabricated values merely to create a context record.

If something is unknown, represent it as unknown/null/empty according to the existing schema conventions.

Examples of acceptable unknowns:

- business size unknown
- order volume unknown
- exact process unknown
- exact domain unknown
- stakeholder unknown

Unknown information is preferable to invented information.

---

# 5. DOMAIN CANDIDATE SEMANTICS

`DomainCandidate` represents a dynamically discovered candidate domain/category/operational area associated with an opportunity and its business context.

Examples are illustrative only, not a catalogue:

- `Snack Distribution Operations`
- `Property Lead Management`
- `Clinic Appointment Operations`
- `Wholesale Inventory Coordination`

The implementation MUST NOT restrict domains to a predefined industry enum.

A new domain value must be storable without a database migration or architecture change.

A domain candidate may contain, following repository conventions:

- label/name
- description
- rationale/interpretation
- relationship to opportunity
- relationship to business context
- provenance/source
- confidence/uncertainty where useful
- actor/creator
- timestamps
- audit information
- nullable solution reference/value

Most importantly:

```text
solution = null
```

must be valid.

Do not implement solution selection in Phase 03.

---

# 6. OBSERVATION VS INTERPRETATION

Preserve the distinction between:

### Observed context

Facts directly captured from the opportunity/source/user/manual input.

### Interpretation

A derived description, hypothesis, or candidate domain inferred from available context.

If the existing implementation later supports AI-generated interpretation, it MUST NOT overwrite raw/observed information.

AI-generated or inferred content must remain identifiable as interpretation/inference rather than being presented as verified fact.

Phase 03 itself does **not** require autonomous AI discovery.

A deterministic/manual implementation is sufficient.

---

# 7. REQUIRED DATA MODEL

Adapt to the existing Phase 01/02 database conventions rather than inventing a parallel persistence pattern.

At minimum, implement persistence for:

### `business_contexts`

Must be tenant/workspace scoped and traceable to an opportunity.

Recommended conceptual fields, adapted to existing conventions:

- `id`
- `tenant_id`
- `workspace_id`
- `opportunity_id`
- context payload/facts
- unknowns if represented separately
- provenance/source metadata
- confidence/uncertainty if supported
- actor/creator
- timestamps

### `domain_candidates`

Must be tenant/workspace scoped and traceable to both opportunity and business context where appropriate.

Recommended conceptual fields, adapted to existing conventions:

- `id`
- `tenant_id`
- `workspace_id`
- `opportunity_id`
- `business_context_id`
- dynamic domain label/name
- description/rationale if useful
- provenance/source metadata
- confidence/uncertainty if supported
- nullable `solution`
- actor/creator
- timestamps

Do not add unnecessary fields merely because they appear in this prompt. The existing canonical contracts and actual Phase 01/02 code are authoritative for implementation details.

### Ownership integrity

Use database constraints and/or server-side checks consistent with Phase 02 so that a record from tenant/workspace A cannot be attached to an opportunity/context belonging to tenant/workspace B.

Cross-scope association MUST fail safely.

---

# 8. REQUIRED MIGRATION

Create the smallest migration required for Phase 03.

Expected conceptual additions:

```text
business_contexts
 domain_candidates
```

Add appropriate:

- primary keys
- foreign keys
- tenant/workspace ownership columns
- indexes for normal discovery queries
- composite ownership constraints where required
- uniqueness/idempotency constraints where appropriate

Do not redesign existing Phase 02 tables unless a concrete compatibility issue requires it.

If a relationship table is required by the existing architecture, implement only the minimum necessary relationship structure.

Migration must be safe and deterministic.

---

# 9. REQUIRED API CAPABILITY

Follow the existing Phase 01/02 route and response conventions.

The implementation should expose the minimum useful API surface, conceptually including:

```text
POST /api/v1/contexts
GET  /api/v1/contexts
GET  /api/v1/contexts/:contextId

POST /api/v1/domains
GET  /api/v1/domains
GET  /api/v1/domains/:domainId
```

A helper/formation route such as:

```text
POST /api/v1/domains/from-context
```

may be added if it materially simplifies the canonical flow and matches the existing API design.

Do not add routes that belong to later phases.

### API requirements

- tenant/workspace scope derived server-side
- ownership enforced server-side
- client cannot select another tenant/workspace arbitrarily
- malformed IDs rejected
- invalid cross-scope relationships rejected
- request validation consistent with existing code
- errors consistent with existing API conventions
- idempotency/replay safety for mutations where appropriate
- audit events for meaningful create/update/association actions

---

# 10. CONTEXT → DOMAIN FORMATION

Implement a minimal deterministic mechanism for creating a `DomainCandidate` from an existing opportunity/context.

It may be manual-first.

It must NOT pretend to have discovered a domain when the available context is insufficient.

Valid outcomes include:

```text
Context is sufficient → create candidate
Context is insufficient → preserve unknowns / no candidate yet
```

Do not fabricate a domain just to make the workflow complete.

Do not require an LLM.

Do not call external social/search APIs.

Do not introduce Make.com, Apify, Threads, X, Instagram, TikTok, marketplace acquisition, or other external acquisition systems in this phase.

---

# 11. DOMAIN DISCOVERY IS DYNAMIC

This is a hard requirement.

Do NOT create:

```text
IndustryEnum
VerticalEnum
PredefinedIndustryTable
FixedVerticalCatalogue
```

unless an existing canonical contract already requires a generic registry mechanism—and even then, do not use it as a closed catalogue.

The system must support a future candidate such as:

```text
"Traditional Snack Distribution Operations"
```

without a code change or migration merely because the domain was not previously known.

Domain discovery is evidence/context-led, not catalogue lookup.

---

# 12. HUMAN-IN-THE-LOOP

Phase 03 discovery is candidate formation, not validation.

A human must be able to inspect the context and candidate domain.

Do not automatically mark a domain as validated, confirmed business truth, or solution-ready merely because the record was created.

Do not create fake certainty.

If the implementation includes a status field, use only the minimum lifecycle consistent with the canonical contract and avoid implying that Phase 03 performs validation.

---

# 13. AUDIT + PROVENANCE

Reuse the existing Phase 01/02 audit infrastructure.

At minimum, meaningful Phase 03 mutations should be traceable:

```text
Opportunity
   ↓
BusinessContext
   ↓
DomainCandidate
```

A reviewer should be able to determine:

- which tenant/workspace owns the record
- which opportunity it belongs to
- who created/changed it
- when it was created/changed
- what source/provenance was available
- whether a value was observed or inferred where that distinction exists

Do not introduce a second audit system.

---

# 14. MINIMAL UI

Extend the existing Discovery UI rather than creating a new product surface.

Target flow:

```text
Discovery
  ↓
Opportunities
  ↓
Opportunity Detail
  ↓
Business Context
  ↓
Domain Candidates
```

The UI should allow a reviewer to:

1. open an opportunity
2. inspect existing demand/opportunity information
3. view or create business context
4. see unknown/undetermined fields honestly
5. create/view a domain candidate
6. see that solution is still `null`
7. understand the relationship back to the opportunity

Keep it minimal and responsive.

Do not build a dashboard redesign.

Do not build a separate NuraHub interface.

---

# 15. REQUIRED SECURITY TESTS

Implement or extend automated tests for at least:

1. BusinessContext can be created for an owned Opportunity.
2. BusinessContext preserves provenance/source metadata.
3. Unknown/null context values are accepted without fabricated defaults.
4. Tenant isolation prevents cross-tenant context access.
5. Workspace isolation prevents cross-workspace context access.
6. Server-side ownership is enforced even if client input attempts to override scope.
7. DomainCandidate can be formed from valid Opportunity/BusinessContext data.
8. Dynamic domain labels are accepted without a fixed industry catalogue.
9. `solution = null` is accepted and preserved.
10. Opportunity → BusinessContext → DomainCandidate traceability is queryable.
11. Cross-scope opportunity/context/domain relationships are rejected.
12. Phase 03 mutations create the expected audit events.
13. Existing Phase 01 tests remain green.
14. Existing Phase 02 tests remain green.

Also add any focused regression test required by the actual implementation.

---

# 16. UNKNOWN-FIRST TEST

Include at least one test where the system receives incomplete context.

Example:

```text
Opportunity exists.
Business size = unknown.
Order volume = unknown.
Exact operating process = unknown.
```

The system must preserve those unknowns.

It must not invent:

```text
50 employees
1,000 orders/month
ERP system
```

or similar fabricated facts.

If there is insufficient basis for a domain candidate, no candidate should be forced.

---

# 17. IDEMPOTENCY / REPLAY SAFETY

Reuse the Phase 02 idempotency conventions.

Repeated requests with the same idempotency key or equivalent replay mechanism must not silently create duplicate records when the API contract says the operation is idempotent.

Do not introduce a second idempotency framework.

---

# 18. NO LATER-PHASE IMPLEMENTATION

Do NOT implement these in Session 03:

- Workflow discovery
- ProblemPattern discovery
- Evidence collection system
- Scoring engine
- Validation engine
- Solution registry/selection
- Execution engine
- Execution events
- Verification
- Outcome tracking
- Learning records
- Productization
- external connector acquisition
- social APIs
- Threads/X/Instagram/Facebook/TikTok integrations
- Make.com ingestion
- Apify ingestion
- marketplace ingestion
- autonomous AI agent
- autonomous solution selection
- billing/subscription system
- NuraHub
- Vertical System
- Nuralabs integration
- fixed industry/vertical catalogue

Those belong to later phases or separate projects.

---

# 19. IMPLEMENTATION ORDER

Use this order:

### Step 1 — Inspect

Inspect the current repository, Phase 01, Phase 02, migrations, API handlers, auth/ownership helpers, audit helpers, tests, and UI.

### Step 2 — Reconcile

Identify the exact existing conventions for:

- tenant/workspace IDs
- request context
- authentication
- authorization
- API response/error format
- migrations
- idempotency
- audit events
- IDs
- tests
- UI routing/components

### Step 3 — Data layer

Add the minimum BusinessContext + DomainCandidate persistence.

### Step 4 — Domain/service layer

Implement creation, retrieval, association, and minimal context-to-domain formation.

### Step 5 — API

Expose the required Phase 03 routes using existing conventions.

### Step 6 — UI

Extend the existing Discovery surface minimally.

### Step 7 — Security and audit

Verify ownership, scope isolation, provenance, audit, and replay safety.

### Step 8 — Tests

Run all Phase 01 + Phase 02 tests plus Phase 03 tests.

### Step 9 — Verification

Run the repository's applicable:

- tests
- typecheck
- lint
- build
- migration validation
- deployment/runtime checks if available

Do not claim success for checks that were not actually run.

### Step 10 — Commit

Commit the complete Phase 03 implementation with a clear commit message.

---

# 20. ACCEPTANCE CRITERIA

Phase 03 is complete only if all of the following are true:

- [ ] Existing Phase 01 foundation remains intact.
- [ ] Existing Phase 02 implementation remains intact.
- [ ] Opportunity can lead to BusinessContext.
- [ ] BusinessContext is tenant/workspace scoped.
- [ ] BusinessContext supports incomplete/unknown information.
- [ ] Provenance is preserved.
- [ ] Opportunity → BusinessContext relationship is traceable.
- [ ] DomainCandidate can be created from valid context/opportunity data.
- [ ] DomainCandidate is tenant/workspace scoped.
- [ ] Domain values are dynamic, not a fixed industry enum/catalogue.
- [ ] `solution = null` is valid and preserved.
- [ ] No solution is selected in Phase 03.
- [ ] No validation claim is made merely because a candidate exists.
- [ ] Cross-tenant and cross-workspace access is blocked.
- [ ] Cross-scope associations are rejected.
- [ ] Auditability is preserved.
- [ ] Idempotency/replay safety follows existing conventions.
- [ ] Minimal UI supports Opportunity → Context → Domain Candidate.
- [ ] Unknown-first test passes.
- [ ] Phase 01 regression tests pass.
- [ ] Phase 02 regression tests pass.
- [ ] Phase 03 tests pass.
- [ ] Typecheck/lint/build pass where configured.
- [ ] No later-phase systems were introduced.
- [ ] No NuraHub was introduced.
- [ ] No Vertical System was introduced.
- [ ] No Nuralabs dependency was introduced.
- [ ] No fixed vertical/industry catalogue was introduced.

---

# 21. REQUIRED FINAL REPORT

After implementation, return a structured report containing exactly these sections:

```text
## Phase 03 Implementation Report

### 1. Final Status
- COMPLETE / BLOCKED

### 2. What Was Implemented
- ...

### 3. Files Changed
- ...

### 4. Database / Migration Changes
- ...

### 5. API Changes
- ...

### 6. UI Changes
- ...

### 7. Security / Ownership Verification
- ...

### 8. Provenance / Audit Verification
- ...

### 9. Tests Run
- ...

### 10. Build / Typecheck / Lint
- ...

### 11. Known Limitations
- ...

### 12. Explicit Non-Goals Preserved
- ...

### 13. Final Commit SHA
- <exact SHA>
```

If anything is blocked, report the exact blocker and do not fabricate completion.

---

# 22. FINAL ARCHITECTURE CHECK

Before committing, verify that the implementation still expresses:

```text
Demand First
      ↓
Opportunity
      ↓
Business Context
      ↓
Dynamic Domain Candidate
      ↓
solution = null
```

and does NOT express:

```text
Opportunity → predefined industry → solution
```

or:

```text
Opportunity → Vertical System
```

or:

```text
Nura → NuraHub → Vertical System
```

Those architectures are invalid.

---

# 23. EXECUTION PRINCIPLE

**Do not redesign Nura. Do not speculate about future architecture. Do not stop at documentation. Implement the smallest complete Phase 03 capability, verify it against the existing foundation, commit it, and report the exact result.**

**GAS Phase 03:**

```text
Opportunity → BusinessContext → DomainCandidate
```
