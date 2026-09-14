# NURA — GENSPARK SESSION 04 / PHASE 04 IMPLEMENTATION PROMPT

**Repository:** `Sparkmind-obp-off/Nura`
**Phase:** Phase 04 — Workflow + Problem Discovery
**Execution mode:** Inspect → Implement → Verify → Commit → Report
**Canonical flow:** `Opportunity → BusinessContext → DomainCandidate → Workflow → ProblemPattern`
**Governing principle:** **Demand First → Context First → Solution Second → Execution Always**

---

## 0. EXECUTION COMMAND

> **Execute Nura Session 04 / Phase 04 according to this document. Inspect the existing repository first, preserve the completed Phase 01–03 foundation, read the canonical documents, implement the minimum complete Phase 04 capability, run verification, commit the changes, and return the required Phase 04 report with the exact final commit SHA. Do not stop at analysis. Do not merely describe code. Actually implement, verify, commit, and report.**

Phase 01, Phase 02, and Phase 03 are already implemented and deployed. **Do not rebuild them.**

The next causal Discovery Core step is:

```text
DemandSignal
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
Evidence / Scoring / Validation
```

Phase 04 stops at Workflow + Problem discovery. Do not silently implement later phases.

---

# 1. CANONICAL ARCHITECTURE — HARD LOCK

Nura is **one platform / one product identity**.

- Digital and Vertical are dimensions inside Nura.
- Discovery Core is an internal capability of Nura, not a separate product.
- NuraHub does not exist as a product/system.
- Vertical System does not exist.
- Nuralabs is not part of Nura.
- Do not create a fixed industry/vertical catalogue.
- Do not create a product merely because a workflow or problem is discovered.
- Do not select a solution in Phase 04.
- `solution = null` remains valid.
- A workflow is not automatically a problem.
- A requested solution is not automatically the root problem.
- A problem candidate is not automatically a validated problem.

Causal order is locked:

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

The Phase 04 target is exactly:

```text
Opportunity
   ↓
BusinessContext
   ↓
DomainCandidate
   ↓
Workflow
   ↓
ProblemPattern
```

Do not jump into Evidence/Scoring/Validation/Solution/Execution/Verification/Outcome/Learning.

---

# 2. READ THESE DOCUMENTS FIRST

Before changing code, inspect the current versions of:

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
14. `docs/GENSPARK_SESSION_03_PHASE_03_BUSINESS_CONTEXT_DOMAIN_DISCOVERY_IMPLEMENTATION_PROMPT.md`

Canonical precedence remains governed by the current context-first amendment and canonical architecture. If an older document conflicts with a newer canonical contract, the canonical contract wins.

Also inspect the actual Phase 01–03 implementation, migrations, tests, routes, auth/ownership helpers, audit infrastructure, and UI. **Do not assume filenames or abstractions. Reuse the repository's real conventions.**

---

# 3. PHASE 04 OBJECTIVE

Implement the smallest real, production-shaped capability that can take an existing opportunity/context/domain and create or maintain:

1. **Workflow** — a representation of how work actually happens.
2. **ProblemPattern** — a representation of an operational problem/friction pattern discovered from workflow/context/evidence.

The capability must preserve:

- tenant isolation
- workspace isolation
- server-side ownership
- traceability to Opportunity / BusinessContext / DomainCandidate
- observed vs inferred distinction where applicable
- unknown-first handling
- provenance
- uncertainty/confidence where useful
- auditability
- replay/idempotency conventions already used by Nura
- regression safety for Phase 01–03

The implementation must work without an LLM.

Manual/internal discovery is acceptable and preferred for Phase 04. External acquisition is not part of this phase.

---

# 4. WORKFLOW SEMANTICS

A `Workflow` represents how an operational task/process currently happens, as far as the available evidence supports.

A workflow is **not** a solution.

A workflow is **not** automatically a problem.

A workflow should preserve partial knowledge honestly.

Where available, capture:

- workflow name/label
- description
- actors
- trigger
- inputs
- actions/steps
- decisions
- handoffs
- outputs
- tools used
- bottlenecks
- frequency
- constraints
- provenance
- observed/inferred status where applicable
- confidence/uncertainty where useful
- opportunity/context/domain relationships
- creator/actor
- timestamps

Do not over-model. Reuse existing JSON/text/provenance patterns when they are sufficient.

### Unknown-first requirement

Unknown workflow details MUST be representable without fabrication.

Examples:

```text
actor = unknown
trigger = unknown
frequency = unknown
tool = unknown
handoff = unknown
```

Do not invent an ERP, spreadsheet, employee count, order frequency, approval chain, or other operational fact merely to make a workflow look complete.

---

# 5. WORKFLOW CONTRACT

The conceptual workflow structure is:

```text
Trigger
  ↓
Inputs
  ↓
Actions
  ↓
Decisions
  ↓
Handoffs
  ↓
Outputs
```

Additional operational metadata may include:

```text
Actors
Tools
Frequency
Bottlenecks
Constraints
```

The implementation does not need a heavyweight workflow-engine/BPMN system.

Phase 04 is discovery representation, not execution orchestration.

A simple ordered step representation is sufficient if it matches the repository's architecture.

Example conceptual record:

```json
{
  "name": "Reseller Order Intake",
  "trigger": "Reseller sends an order request",
  "steps": [
    "Receive request",
    "Check requested items",
    "Confirm availability",
    "Record order",
    "Prepare fulfillment"
  ],
  "actors": ["reseller", "operator"],
  "tools": ["unknown"],
  "frequency": "unknown"
}
```

This example is illustrative only. Do not hardcode this domain or workflow.

---

# 6. PROBLEM DISCOVERY SEMANTICS

`ProblemPattern` represents an operational problem/friction pattern associated with a workflow.

The system must distinguish:

```text
Stated Request
      ↓
Symptom
      ↓
Operational Friction
      ↓
Repeated Problem Pattern
      ↓
Root-Cause Hypothesis
      ↓
Validated Problem
```

Phase 04 can represent candidates through the earlier stages, but **must not claim validation**.

A user saying:

> "We need an app for orders."

does NOT automatically mean:

> "The validated problem is lack of an ordering application."

The system should instead be able to record a problem candidate such as:

```text
Operational friction:
Order requests arrive through multiple channels and are repeatedly re-entered manually.

Status:
Candidate / inferred

Solution:
null
```

Only evidence and later validation may establish whether this is a repeated, material problem.

---

# 7. OBSERVED VS INFERRED — HARD REQUIREMENT

Preserve the distinction between:

### Observed

Information directly captured from the demand signal, business context, user/manual input, or other traceable source.

### Inferred

An interpretation, hypothesis, clustering result, or derived statement based on observed information.

For example:

```text
Observed:
"Staff copy reseller orders into a separate record."

Inferred:
"Manual order re-entry may be an operational friction pattern."
```

The inferred statement must not overwrite the observed statement.

If the repository already has an evidence/provenance structure, reuse it rather than creating a second parallel evidence system.

Do not introduce autonomous AI classification merely to satisfy this distinction.

---

# 8. PROBLEM PATTERN REQUIREMENTS

A `ProblemPattern` should support, according to actual repository conventions:

- id
- tenant/workspace ownership
- workflow relationship
- opportunity relationship where appropriate
- business context/domain relationship where useful
- title/label
- description
- problem type/stage if canonical contracts require it
- observed symptom/friction
- inferred root-cause hypothesis where available
- recurrence/frequency information where known
- impact/pain information where known
- provenance/evidence references
- confidence/uncertainty where useful
- discovery status
- nullable solution reference/value
- creator/actor
- timestamps

Do not add every conceptual field if the canonical data contract does not require it. Prefer the smallest model that preserves the semantics.

### Critical rule

```text
ProblemPattern ≠ ValidatedProblem
ProblemPattern ≠ Solution
ProblemPattern ≠ Product
```

A candidate may remain unresolved.

---

# 9. DATA MODEL / MIGRATION

Adapt to the existing Phase 01–03 database conventions.

Expected conceptual additions:

```text
workflows
problem_patterns
```

At minimum, records must be tenant/workspace scoped and traceable through the canonical chain.

Conceptual relationships:

```text
Opportunity
   │
   └── BusinessContext
          │
          └── DomainCandidate
                 │
                 └── Workflow
                        │
                        └── ProblemPattern
```

Depending on the actual schema and canonical contract, Workflow may also reference Opportunity/BusinessContext directly for queryability. ProblemPattern should reference Workflow and retain enough upstream linkage for secure traceability.

Add only the minimum:

- primary keys
- foreign keys
- tenant/workspace ownership
- indexes for normal discovery queries
- ownership integrity constraints where appropriate
- uniqueness/idempotency constraints where appropriate

Do not redesign Phase 01–03 tables without a concrete compatibility reason.

Migration must be deterministic and safe.

---

# 10. OWNERSHIP INTEGRITY — HARD SECURITY GATE

Server-side ownership is mandatory.

A client must not be able to create:

```text
Tenant A workflow → Tenant B opportunity
Workspace A problem → Workspace B workflow
```

or any equivalent cross-scope association.

Validate the complete relationship chain server-side.

Do not trust client-provided:

- tenant_id
- workspace_id
- owner_id
- opportunity ownership
- context ownership
- domain ownership

Use the authenticated request context and existing authorization helpers.

Cross-scope association must fail safely with the repository's existing error envelope.

---

# 11. REQUIRED API CAPABILITY

Follow the existing Phase 01–03 route, validation, response, and error conventions.

Minimum conceptual API surface:

```text
POST /api/v1/workflows
GET  /api/v1/workflows
GET  /api/v1/workflows/:workflowId

POST /api/v1/problems
GET  /api/v1/problems
GET  /api/v1/problems/:problemId
```

If the existing architecture prefers nested routes, use those conventions instead. Do not create a parallel API style.

Optional formation routes may be added only when they materially simplify the canonical flow, for example:

```text
POST /api/v1/problems/from-workflow
```

Do not add routes for scoring, validation, solution selection, execution, or verification.

### API requirements

- authenticated access where required
- tenant/workspace scope derived server-side
- ownership enforced server-side
- malformed IDs rejected
- invalid cross-scope relationships rejected
- unknown/null values accepted where semantically valid
- observed/inferred semantics preserved
- consistent response/error envelope
- replay-safe mutations using existing idempotency conventions
- audit events for meaningful create/update/association actions

---

# 12. WORKFLOW DISCOVERY MUST NOT BECOME WORKFLOW EXECUTION

Phase 04 records how work happens.

It does NOT execute that work.

Do not build:

- job queues
- task runners
- workflow automation engine
- autonomous agents
- external actions
- browser automation
- connector execution
- scheduling engine
- approval automation

Those belong to later execution phases.

---

# 13. PROBLEM DISCOVERY MUST NOT BECOME SOLUTION SELECTION

The existence of a ProblemPattern must never automatically create:

- software
- dashboard
- automation
- CRM
- marketplace listing
- vertical product
- custom application
- service package

Keep:

```text
solution = null
```

unless a pre-existing field requires a null value.

Phase 05 will handle evidence, scoring, and validation. Later phases handle solution routing.

---

# 14. HUMAN-IN-THE-LOOP

Phase 04 is discovery, not autonomous judgment.

An operator/reviewer must be able to inspect:

```text
Opportunity
→ Context
→ Domain
→ Workflow
→ Problem Pattern
```

The UI/API must make uncertainty visible where it exists.

Do not label a candidate as:

- validated
- proven
- confirmed business truth
- product-ready

unless that state is genuinely supported by a later validation process.

---

# 15. AUDIT + TRACEABILITY

Reuse the existing Nura audit infrastructure.

A reviewer should be able to determine:

- which tenant/workspace owns the record
- which opportunity it belongs to
- which context/domain it derives from
- which workflow a problem belongs to
- who created/changed the record
- when it changed
- what provenance was available
- whether a claim is observed or inferred where supported

Do not create a second audit system.

The canonical trace should be queryable:

```text
Opportunity
   ↓
BusinessContext
   ↓
DomainCandidate
   ↓
Workflow
   ↓
ProblemPattern
```

---

# 16. MINIMAL UI

Extend the existing Discovery UI. Do not create a separate product surface.

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
  ↓
Workflows
  ↓
Problem Patterns
```

The reviewer should be able to:

1. open an existing opportunity
2. inspect context/domain information
3. create/view a workflow
4. inspect workflow steps, actors, tools, bottlenecks, and unknowns
5. create/view a problem pattern
6. distinguish observed information from inferred interpretation where supported
7. see that validation has not yet occurred
8. see that solution remains unset/null
9. navigate back to the originating opportunity

Keep the UI minimal, responsive, and consistent with the current Nura design.

Do not redesign the dashboard.

Do not create NuraHub.

---

# 17. REQUIRED TEST MATRIX

Implement or extend automated tests for at least:

### Workflow

1. Workflow can be created for an owned opportunity/context/domain chain.
2. Workflow preserves provenance/source metadata where supplied.
3. Unknown workflow values are accepted without fabricated defaults.
4. Workflow can represent ordered steps.
5. Workflow retrieval is tenant/workspace scoped.

### ProblemPattern

6. ProblemPattern can be created for an owned workflow.
7. ProblemPattern preserves observed/inferred distinction where supported.
8. ProblemPattern can remain a candidate/unvalidated state.
9. `solution = null` is accepted and preserved.
10. A requested solution cannot automatically become the validated problem.

### Security

11. Cross-tenant workflow access is denied.
12. Cross-workspace workflow access is denied.
13. Cross-scope problem/workflow associations are rejected.
14. Client-supplied ownership fields cannot override server-side scope.
15. Invalid upstream references fail safely.

### Traceability

16. Opportunity → BusinessContext → DomainCandidate → Workflow → ProblemPattern is queryable.
17. Phase 04 mutations produce expected audit events.

### Regression

18. Phase 01 tests remain green.
19. Phase 02 tests remain green.
20. Phase 03 tests remain green.

Add focused regression tests for any implementation-specific edge case.

---

# 18. UNKNOWN-FIRST TEST

Include at least one end-to-end incomplete-data scenario.

Example:

```text
Opportunity exists.
BusinessContext exists.
DomainCandidate exists.
Actor = unknown.
Frequency = unknown.
Tools = unknown.
Exact handoff = unknown.
Root cause = unknown.
```

Expected behavior:

- the workflow may still be recorded with unknown fields;
- no facts are fabricated;
- a problem candidate may be recorded only when there is enough basis;
- if there is insufficient basis, the system preserves the unknown state instead of inventing a problem;
- solution remains null.

Never fabricate operational details merely to complete a demo.

---

# 19. REPEATED-PROBLEM SAFETY

Phase 04 must not turn one occurrence into a repeated problem automatically.

If recurrence/frequency is modeled, distinguish:

```text
Observed once
Observed multiple times
Inferred recurring pattern
Validated recurring problem
```

Only the first three are potentially representable in Phase 04, subject to available evidence. **Validated recurring problem belongs to the later validation phase.**

Do not implement a scoring engine here.

Do not implement automatic problem clustering that claims validation.

A deterministic/manual candidate formation mechanism is enough.

---

# 20. IDEMPOTENCY / REPLAY SAFETY

Reuse the existing Phase 02/03 conventions.

Do not introduce a second idempotency framework.

Repeated mutation requests using the repository's established idempotency mechanism must not silently create duplicates where the operation is defined as idempotent.

Pay particular attention to:

- repeated workflow creation
- repeated problem creation
- duplicate association requests
- replay after network failure

---

# 21. NO LATER-PHASE IMPLEMENTATION

Do NOT implement in Session 04:

- Evidence collection engine
- Scoring engine
- Validation engine
- Solution registry/selection
- Digital/Vertical solution routing
- Existing-tool decision engine
- Execution engine
- Execution events/checkpoints
- External execution connectors
- Verification engine
- Delivery records
- Business outcome verification
- Learning records
- Productization gate
- Autonomous AI agent
- social APIs
- Threads/X/Instagram/Facebook/TikTok ingestion
- Make.com ingestion
- Apify ingestion
- marketplace acquisition
- billing/subscriptions
- NuraHub
- Vertical System
- Nuralabs
- fixed industry catalogue
- automatic product creation

Those belong to later phases or separate systems.

---

# 22. IMPLEMENTATION ORDER

Use this exact order unless the actual repository requires a small adaptation:

### Step 1 — Inspect

Inspect:

- repository tree
- package scripts
- current README
- Phase 01–03 migrations
- database helpers
- API routes
- auth/session helpers
- ownership/authorization helpers
- audit helpers
- validation utilities
- idempotency implementation
- existing Discovery UI
- tests
- current deployment configuration

### Step 2 — Reconcile

Determine the actual conventions for:

- IDs
- tenant/workspace scope
- request context
- auth
- API envelopes
- errors
- migrations
- persistence
- timestamps
- audit events
- UI routing/components
- tests

Do not invent new conventions when an existing one works.

### Step 3 — Data layer

Add the minimum `workflows` and `problem_patterns` persistence required by the canonical contracts.

### Step 4 — Domain/service layer

Implement:

- workflow creation/retrieval
- workflow-to-upstream association
- problem candidate creation/retrieval
- problem-to-workflow association
- minimal deterministic/manual discovery behavior

### Step 5 — API

Expose the minimum Phase 04 routes using existing conventions.

### Step 6 — UI

Extend the existing Discovery surface minimally.

### Step 7 — Security + audit

Verify ownership, scope isolation, traceability, audit, and replay safety.

### Step 8 — Tests

Run all existing Phase 01–03 tests plus the new Phase 04 tests.

### Step 9 — Quality verification

Run all applicable:

- tests
- typecheck
- lint
- build
- migration validation
- local runtime checks
- deployment/runtime checks if available

Do not claim success for a check that was not actually run.

### Step 10 — Commit

Commit all Phase 04 implementation changes with a clear message such as:

```text
feat: implement Nura Phase 04 workflow problem discovery
```

### Step 11 — Report

Return:

1. exact implementation summary
2. files changed
3. migration name(s)
4. API routes added/changed
5. UI changes
6. tests added/updated
7. verification commands and real results
8. security/ownership verification
9. known limitations
10. exact final commit SHA
11. whether deployment was performed and the resulting URL if actually verified

Never fabricate a commit SHA, test result, deployment status, or URL.

---

# 23. DEFINITION OF DONE

Phase 04 is complete only when all of the following are true:

- [ ] Existing Phase 01–03 functionality remains intact.
- [ ] Workflow persistence exists and is tenant/workspace scoped.
- [ ] ProblemPattern persistence exists and is tenant/workspace scoped.
- [ ] Workflow is traceable to the upstream discovery chain.
- [ ] ProblemPattern is traceable to Workflow and upstream context.
- [ ] Workflow supports ordered operational steps or equivalent canonical representation.
- [ ] Unknown workflow details are representable without fabrication.
- [ ] ProblemPattern distinguishes candidate/problem discovery from validation.
- [ ] Observed vs inferred information is preserved where applicable.
- [ ] `solution = null` remains valid.
- [ ] No fixed industry catalogue is introduced.
- [ ] No solution/product is auto-created.
- [ ] Server-side tenant/workspace ownership is enforced.
- [ ] Cross-scope associations are rejected.
- [ ] Audit events exist for meaningful Phase 04 mutations.
- [ ] Replay/idempotency follows existing conventions.
- [ ] UI supports inspection and creation of Workflow + ProblemPattern.
- [ ] Security tests pass.
- [ ] Phase 01 tests pass.
- [ ] Phase 02 tests pass.
- [ ] Phase 03 tests pass.
- [ ] Phase 04 tests pass.
- [ ] Typecheck/lint/build pass where configured.
- [ ] The changes are committed.
- [ ] The exact final commit SHA is reported.

---

# 24. FINAL RESPONSE FORMAT FOR GENSPARK

After implementation, verification, and commit, return exactly this structure:

```text
NURA SESSION 04 / PHASE 04 — COMPLETE

Repository:
Sparkmind-obp-off/Nura

Phase:
Phase 04 — Workflow + Problem Discovery

Implemented:
- ...
- ...
- ...

Files changed:
- ...
- ...

Database:
- Migration: ...
- Tables: workflows, problem_patterns (or actual names used)

API:
- ...

UI:
- ...

Tests:
- ...

Verification:
- Test: PASS/FAIL
- Typecheck: PASS/FAIL
- Lint: PASS/FAIL
- Build: PASS/FAIL
- Migration/runtime: PASS/FAIL

Security:
- Tenant isolation: PASS/FAIL
- Workspace isolation: PASS/FAIL
- Server-side ownership: PASS/FAIL
- Cross-scope rejection: PASS/FAIL

Known limitations:
- ...

Deployment:
- Performed: YES/NO
- Verified URL: ... / N/A

Final commit SHA:
<exact SHA>
```

If a check cannot be run, explicitly say `NOT RUN` and explain why. Do not substitute an assumption for evidence.

---

# 25. SESSION 04 STOP CONDITION

When Phase 04 is complete, **STOP**.

Do not automatically continue into Phase 05.

The next phase will be planned and executed separately after the Phase 04 implementation has been inspected and verified.

The next canonical step is:

```text
Workflow + ProblemPattern
        ↓
Evidence + Explainable Scoring
        ↓
Validation Gate
```

But that is **Phase 05**, not Session 04.

---

# 26. MASTER EXECUTION REMINDER

Nura is not a generic app builder.

It is a demand-first discovery-to-outcome system.

Never optimize for the appearance of completeness by inventing:

- demand
- context
- workflows
- problems
- evidence
- validation
- customers
- outcomes
- product-market fit

The system must preserve uncertainty honestly.

The implementation target is not:

> "Build something that looks complete."

The implementation target is:

> **"Build the smallest real capability that preserves the causal chain from observed demand to discoverable workflow and problem, while keeping evidence, ownership, uncertainty, and future validation explicit."**

Execute accordingly.
