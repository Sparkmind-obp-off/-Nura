# NURA — GENSPARK MASTER IMPLEMENTATION PROMPT

**Status:** Canonical implementation execution prompt
**Purpose:** Give Genspark AI one authoritative instruction set for implementing the Nura Discovery Core MVP in the existing repository.

---

## 0. EXECUTION DIRECTIVE

You are the implementation agent for the Nura repository.

Your job is to **implement**, not redesign the business architecture.

Before changing code:
1. Inspect the repository completely enough to understand the current runtime, package manager, framework, migrations, routes, tests, deployment configuration, and existing implementation state.
2. Read the canonical Nura documents listed in Section 2.
3. Determine what already exists and preserve working code.
4. Implement the smallest complete Discovery Core MVP vertical slice.
5. Run tests/typechecks/build/lint where available.
6. Never claim completion for anything you did not actually execute or verify.
7. Commit all implementation changes to Git.
8. Return a concise implementation report containing files changed, migrations, tests run/results, remaining blockers, and commit SHA.

**Do not stop at analysis or produce another architecture proposal. Start implementation after inspection.**

---

## 1. NURA ARCHITECTURE — NON-NEGOTIABLE

Nura is **ONE platform / ONE product identity**.

Its two primary business dimensions are:

- **Digital**
- **Vertical**

There is **NO separate Vertical System**.
There is **NO NuraHub product**.
There is **NO Nuralabs dependency or subsystem inside Nura**.

The canonical principle is:

> **Demand First → Context First → Solution Second → Execution Always**

Canonical causal flow:

```text
REAL WORLD
    ↓
DEMAND SIGNAL
    ↓
OPPORTUNITY
    ↓
BUSINESS CONTEXT
    ↓
DOMAIN DISCOVERY
    ↓
WORKFLOW DISCOVERY
    ↓
PROBLEM DISCOVERY
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

Discovery Core is an **internal core capability/module of Nura**, not a separate application or product.

---

## 2. CANONICAL DOCUMENT AUTHORITY

Read these files before implementation and obey them in this order:

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
11. `docs/NURA_IMPLEMENTATION_PLAN.md`

These documents are the architecture authority. Do not invent a competing architecture.

The following older documents are stale and must **not** override the canonical architecture:

- `docs/NURA_ECOSYSTEM_MASTER_BOUNDARY.md`
- `docs/NURA_HUB_BLUEPRINT.md`
- `docs/NURA_DIGITAL_BOUNDARY.md`
- `docs/NURA_VERTICAL_BOUNDARY.md`

If stale wording conflicts with the canonical documents, ignore the stale wording.

---

## 3. PRIMARY IMPLEMENTATION TARGET

Implement the smallest complete Discovery Core MVP loop:

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
Evidence
   ↓
Score
   ↓
Validation
```

Then establish the solution gate:

```text
Validation
   ↓
validated = true
   ↓
Solution may be selected
```

Before validation, a solution must remain unset/null.

The first implementation goal is **discovery correctness**, not a large feature count.

---

## 4. IMPLEMENTATION ORDER

Follow this order unless repository inspection proves an equivalent component already exists:

### Phase 0 — Runtime and repository baseline

- Identify framework/runtime.
- Identify package manager.
- Identify existing source tree.
- Identify database and migration mechanism.
- Identify test framework.
- Identify build/lint/typecheck commands.
- Identify Cloudflare configuration if present.
- Preserve existing infrastructure when valid.
- Add only missing baseline configuration.

### Phase 1 — Identity / Tenant / Workspace

Implement or verify:

- Tenant
- Workspace
- User/session boundary sufficient for MVP
- ownership fields
- tenant/workspace isolation
- request context propagation

Do not build a complex enterprise IAM system for the MVP.

### Phase 2 — Demand Signal / Opportunity

Implement:

- create demand signal
- list/get demand signals
- normalize/store source metadata
- idempotency where ingestion can repeat
- create opportunity from signal
- opportunity status
- traceability back to originating signal

A demand signal may be incomplete or ambiguous. Do not require a predefined industry or solution.

### Phase 3 — Business Context / Domain Discovery

Implement:

- BusinessContext
- DomainCandidate
- context capture/update
- domain candidate creation/update
- evidence/reference linkage
- dynamic domain naming
- domain status

**No fixed industry catalogue.**

Example:

```json
{
  "domain": "Snack Distribution",
  "status": "observed",
  "solution": null
}
```

A domain candidate is valid even when no solution exists yet.

### Phase 4 — Workflow / Problem Discovery

Implement:

- Workflow
- ProblemPattern
- actors
- triggers
- inputs
- actions
- decisions
- handoffs
- outputs
- tools
- bottlenecks
- frequency/impact where available
- symptom vs repeated problem distinction
- root-cause hypothesis where appropriate
- problem status

Workflow discovery must happen before solution selection.

### Phase 5 — Evidence / Scoring / Validation

Implement:

- Evidence
- provenance/source metadata
- evidence level/type
- Score
- explainable score factors
- Validation
- validation state transitions
- rationale
- validator/actor metadata where appropriate

Validation must answer, at minimum:

1. Is the problem real?
2. Is it repeated or materially important?
3. Is there credible evidence?
4. Is the affected party identifiable?
5. Is there a meaningful desired outcome?
6. Is there willingness/ability to act?
7. Is the opportunity worth testing?

---

## 5. CORE DOMAIN MODEL

At minimum, support these discovery entities:

```text
Tenant
Workspace
User
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

Downstream entities should be introduced only as needed for the solution/execution gate:

```text
Solution
Execution
ExecutionEvent
Verification
Outcome
LearningRecord
Connector
AuditEvent
```

Every tenant-scoped entity must have explicit ownership semantics.

Use stable IDs.

Use timestamps.

Use created/updated metadata where appropriate.

Use foreign keys/relationships that preserve the causal chain.

---

## 6. CRITICAL DATA INVARIANTS

These are hard rules.

### Rule 1 — No solution before context

Do not let an opportunity jump directly from signal to product/solution.

### Rule 2 — No fixed vertical catalogue

Do not create enums such as:

```text
BARBER
CAFE
PROPERTY
SCHOOL
```

as the definition of Nura Vertical.

Domains must emerge from evidence and context.

### Rule 3 — `solution = null` is valid

This is a first-class state.

Do not use fake placeholder solutions such as:

- `TBD_PRODUCT`
- `DEFAULT_VERTICAL`
- `NURA_APP`
- `GENERIC_AUTOMATION`

### Rule 4 — Evidence has lineage

Every evidence record must be traceable to its source/context/related discovery object.

### Rule 5 — Scores are explainable

Do not store only a mysterious final number.

Store enough factors/reasoning to explain why a score exists.

### Rule 6 — Validation is a gate

An opportunity cannot be treated as validated merely because it was created or scored.

### Rule 7 — No fake outcome

Do not mark work completed, verified, delivered, or successful without an actual recorded event/evidence.

### Rule 8 — Human-in-the-loop

AI may normalize, classify, summarize, suggest, or score advisory signals.

AI must not silently fabricate validation, execution, verification, or business outcomes.

### Rule 9 — Tenant isolation

A tenant must never be able to read/write another tenant's data through normal application paths.

### Rule 10 — Idempotency

Repeated ingestion with the same idempotency key/source identity must not silently create duplicates.

### Rule 11 — Unknown-first

The system must be able to receive a signal where the domain and solution are both unknown.

### Rule 12 — Productization gate

Productization only becomes legitimate after:

```text
Signal
→ Repeated Problem
→ Evidence
→ Validation
→ Pilot
→ Repeatable Outcome
→ Productization
```

---

## 7. DOMAIN DISCOVERY CONTRACT

`DomainCandidate` is an observation, not a predetermined product category.

Minimum conceptual fields:

```text
id
tenant_id
workspace_id
opportunity_id
name/status
description
evidence_count
confidence
workflows/problem references
solution (nullable)
created_at
updated_at
```

The implementation must allow:

```text
DomainCandidate exists
AND
solution IS NULL
```

This is normal, not an error.

A newly observed domain should not require a code deployment or database migration merely because its name is new.

---

## 8. WORKFLOW DISCOVERY CONTRACT

A workflow should capture enough structure to understand how work actually happens.

Minimum conceptual information:

```text
actors
trigger
inputs
actions
decisions
handoffs
outputs
tools
bottlenecks
frequency
constraints
```

Example:

```text
Reseller order
→ order captured manually
→ stock checked manually
→ confirmation sent
→ delivery scheduled
```

Do not infer a software solution simply because a workflow is inefficient.

---

## 9. PROBLEM DISCOVERY CONTRACT

Distinguish:

```text
symptom
request
operational friction
repeated problem
root-cause hypothesis
validated problem
```

A user saying “I need an app” is not sufficient evidence that an app is the right solution.

The implementation must preserve the actual observed problem/context.

---

## 10. EVIDENCE CONTRACT

Evidence should support claims made during discovery.

Capture, where applicable:

- source type
- source reference
- source identity
- observed timestamp
- captured timestamp
- quote/snippet/observation
- related entity
- provenance metadata
- confidence/quality

Never fabricate source URLs, conversations, customer statements, metrics, or validation results.

---

## 11. SCORING CONTRACT

Implement a transparent scoring model suitable for MVP.

A simple weighted score is acceptable.

For example:

```text
problem_frequency
problem_impact
strength_of_evidence
affected_party_clarity
willingness_to_act
repeatability
```

The exact weights can remain configurable or clearly documented.

The score must expose its factors/reasoning.

Do not present an arbitrary AI-generated number as objective truth.

---

## 12. VALIDATION STATE MACHINE

Use explicit states. A suitable MVP state model is:

```text
UNVALIDATED
    ↓
UNDER_REVIEW
    ↓
VALIDATED
```

Possible negative/terminal states may include:

```text
REJECTED
DEFERRED
INSUFFICIENT_EVIDENCE
```

Do not allow an invalid state transition merely because a frontend button was clicked.

Record transition rationale/audit information where practical.

---

## 13. SOLUTION ROUTING

Only after validation may the system route an opportunity toward a solution.

Supported solution categories:

```text
SERVICE
PRODUCTIZED_SERVICE
AUTOMATION
SOFTWARE
INTEGRATION
VERTICAL_WORKFLOW
EXISTING_TOOL
CUSTOM_BUILD
NO_ACTION
```

Solution dimension may be:

```text
DIGITAL
VERTICAL
```

A solution can also remain unset when validation is incomplete or evidence is insufficient.

Do not assume that every validated problem requires software.

---

## 14. API EXPECTATIONS

Where the runtime supports HTTP APIs, implement coherent route groups aligned with the canonical technical specification:

```text
/auth/*
/tenants/*
/workspaces/*
/signals/*
/opportunities/*
/contexts/*
/domains/*
/workflows/*
/problems/*
/evidence/*
/scores/*
/validations/*
/solutions/*
/executions/*
/verifications/*
/outcomes/*
/learnings/*
/connectors/*
/audit/*
```

For the first vertical slice, prioritize:

```text
signals
opportunities
contexts
 domains
workflows
problems
evidence
scores
validations
```

Do not implement every downstream endpoint if it would delay the working Discovery Core loop.

---

## 15. UI / UX MVP

Build a minimal but usable Nura discovery experience.

The primary UX should make the causal order obvious:

```text
Capture Demand
→ Understand Context
→ Discover Domain
→ Map Workflow
→ Identify Problem
→ Attach Evidence
→ Score
→ Validate
→ Decide Solution
```

Required UX principles:

- unknown-first entry
- no forced industry selector
- no forced product selector
- visible discovery state
- visible evidence
- visible score factors
- visible validation state
- clear indication when `solution = null`
- no fake success/completion states
- tenant/workspace context visible where appropriate

Onboarding is an entry experience into Discovery Core, not a separate system.

---

## 16. TESTS — MANDATORY

Add automated tests for at least these cases:

### Test 1 — Unknown Domain

Create a demand signal without specifying a known industry.

Expected:

```text
signal created
opportunity created
context can be captured
new domain candidate can be created
```

### Test 2 — No Premature Solution

Create signal → opportunity → context → domain → workflow → problem.

Do not validate.

Expected:

```text
solution == null
```

### Test 3 — Evidence Lineage

Attach evidence to a discovery object.

Expected:

```text
evidence remains traceable to its source and related object
```

### Test 4 — Explainable Score

Create a score.

Expected:

```text
score has factors/reasoning
```

### Test 5 — Validation Gate

Attempt solution selection before validation.

Expected:

```text
rejected / blocked
```

After valid validation:

```text
solution selection allowed
```

### Test 6 — Tenant Isolation

Tenant A must not access Tenant B's discovery objects.

### Test 7 — Idempotent Ingestion

Repeat the same demand ingestion with the same idempotency identity.

Expected: no accidental duplicate.

### Test 8 — No Fake Outcome

Do not allow an outcome to become verified without supporting execution/verification evidence.

### Test 9 — AI Boundary

AI-generated suggestions must be distinguishable from confirmed human/verified facts.

### Test 10 — Productization Gate

A weak/unvalidated signal must not be marked productizable.

---

## 17. SECURITY REQUIREMENTS

Minimum MVP security:

- tenant isolation
- workspace isolation
- server-side authorization checks
- no client-controlled ownership bypass
- validated input
- safe error responses
- secret values never committed
- connector credentials isolated
- audit important state changes
- correlation/request IDs where practical
- rate limiting or abuse protection where appropriate
- no sensitive data leakage in logs

Never commit `.env` secrets or provider API keys.

---

## 18. AI BOUNDARY

AI is an advisory/assistive layer.

AI may:

- normalize demand
- summarize context
- suggest domain candidates
- suggest workflows
- cluster problem patterns
- propose evidence classification
- propose score factors
- suggest validation questions
- suggest solution options

AI must not silently claim:

- a customer exists when none was observed
- demand is validated when it is not
- a workflow was executed when it was not
- a business outcome occurred when it was not verified
- a source exists when it does not

Keep AI output distinguishable from confirmed facts.

---

## 19. CONNECTORS

Do not make external data acquisition a blocker for the first MVP.

Use a connector abstraction where the technical spec requires it, but begin with manual/internal demand capture if needed.

Later acquisition sources may include official APIs, Make.com bridges, marketplaces, public web sources, social platforms, or direct business inputs.

The first MVP should prove that Nura can reason over demand **after acquisition**, not prove every acquisition connector simultaneously.

Never fake external acquisition.

---

## 20. DEPLOYMENT

Prefer the repository's existing deployment architecture.

If the repository is currently documentation-only, establish the smallest production-capable application foundation consistent with the canonical technical specification.

Expected target characteristics where applicable:

- TypeScript
- Hono or existing equivalent HTTP runtime
- Cloudflare-compatible runtime
- D1-compatible persistence
- object storage abstraction when needed
- model-provider abstraction
- connector abstraction

Do not introduce infrastructure merely for theoretical future scale.

---

## 21. IMPLEMENTATION STYLE

Use boring, maintainable engineering.

Prefer:

- small modules
- explicit types
- explicit state transitions
- service/domain boundaries
- repository/data access boundaries
- deterministic validation logic
- clear error codes
- migration files
- testable functions
- minimal dependencies

Avoid:

- giant files
- hidden global state
- hardcoded business domains
- hardcoded customer assumptions
- magic AI decisions
- fake integrations
- fake completion screens
- premature microservices
- unnecessary queues
- unnecessary event buses
- separate products for Digital/Vertical

---

## 22. GIT DISCIPLINE

Work directly in the repository's current branch unless the repository state clearly requires another safe approach.

Before implementation:

```bash
git status
git log -5 --oneline
```

After implementation:

```bash
git status
git diff
git diff --check
```

Then run available verification commands:

```text
install dependencies if needed
lint
 typecheck
unit/integration tests
build
```

Commit with a clear message, for example:

```text
feat: implement Nura Discovery Core MVP foundation
```

Do not claim a test passed unless it actually ran and passed.

---

## 23. REQUIRED FINAL REPORT FROM GENSPARK

At the end of the implementation session, report exactly these sections:

### A. Repository State

- branch
- base commit
- final commit

### B. Implemented

List concrete features implemented.

### C. Files Changed

List paths and one-line purpose.

### D. Database

List migrations/tables/indexes created or changed.

### E. API

List routes implemented.

### F. UI

List discovery screens/flows implemented.

### G. Tests

For every required test:

```text
PASS / FAIL / NOT RUN
```

Include the command used.

### H. Build / Typecheck / Lint

State actual result.

### I. Blockers

Only real blockers. Do not hide missing credentials, unavailable services, or unverified integrations.

### J. Architecture Compliance

Explicitly confirm:

```text
[ ] One Nura platform
[ ] Digital + Vertical are dimensions
[ ] No Vertical System product
[ ] No NuraHub product
[ ] No Nuralabs dependency
[ ] Dynamic domain discovery
[ ] Context before solution
[ ] Workflow before solution
[ ] Problem validation before productization
[ ] solution=null supported
[ ] Evidence traceable
[ ] Score explainable
[ ] Tenant isolation
[ ] No fake outcome
[ ] Unknown-first test exists
```

### K. Commit SHA

Return the exact Git commit SHA.

---

## 24. STOP CONDITIONS

Stop implementation and report a blocker if:

- the repository's existing architecture makes the canonical model impossible without destructive migration;
- credentials are required for a real external integration and are unavailable;
- a destructive database change would be required without authorization;
- an external service cannot be truthfully verified;
- an existing feature conflicts with the canonical architecture and cannot safely be reconciled.

Do **not** stop merely because optional integrations are unavailable. Build the local/manual MVP path first.

---

## 25. FINAL EXECUTION COMMAND

Now execute this prompt.

**Do not create another conceptual blueprint.**

**Do not redesign Nura.**

**Do not create Vertical System, NuraHub, or Nuralabs integration.**

**Do not hardcode an industry catalogue.**

**Do not select a solution before context/workflow/problem/evidence/validation.**

**Do not fabricate demand, customers, evidence, execution, verification, or outcomes.**

Start by inspecting the repository, then implement the smallest complete Discovery Core MVP and verify it end-to-end.

The definition of success is:

> **Nura can receive a previously unknown demand signal, form an opportunity, understand its business context, discover a domain, map a workflow, identify a problem, attach traceable evidence, calculate an explainable score, validate the opportunity, and only then allow solution selection — all within one Nura platform.**
