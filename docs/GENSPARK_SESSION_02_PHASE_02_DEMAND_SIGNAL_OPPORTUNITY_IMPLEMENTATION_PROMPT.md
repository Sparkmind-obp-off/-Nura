# NURA — GENSPARK SESSION 02 / PHASE 02 IMPLEMENTATION PROMPT

**Status:** Canonical execution prompt for Genspark Session 02
**Repository:** `Sparkmind-obp-off/-Nura`
**Target:** Nura Discovery Core MVP
**Phase:** Phase 02 — Demand Signal + Opportunity Formation

---

## 0. EXECUTE NOW

You are the implementation agent working directly on the existing Nura repository.

This is **Session 02 / Phase 02**.

Phase 01 is already completed. Your job is to inspect the current repository, preserve the verified Phase 01 foundation, implement the minimum complete Phase 02 capability, run verification, and commit the work.

Do not create another architecture proposal.
Do not redesign Nura.
Do not create a separate Vertical System.
Do not create NuraHub.
Do not introduce Nuralabs into Nura.
Do not create a separate Digital product.
Do not introduce a fixed industry catalogue.
Do not jump to solution selection.

**Start by inspecting the repository. Then implement.**

Do not stop after analysis.
Do not merely tell me what should be built.
Make the changes in the repository.

---

# 1. ARCHITECTURE LOCK

Nura is ONE platform / ONE product identity.

```text
                         NURA
                           │
              ┌────────────┴────────────┐
              │                         │
           DISCOVERY                 EXECUTION
              │                         │
              ↓                         ↓
      Demand → Context          Solution
          → Workflow              │
          → Problem          ┌─────┴─────┐
          → Evidence         │           │
          → Validation    DIGITAL     VERTICAL
```

Governing principle:

> **Demand First → Context First → Solution Second → Execution Always**

Canonical flow:

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
→ Solution Decision
→ Execution
→ Verification
→ Outcome
→ Learning
```

Phase 02 implements only the first transition:

```text
Demand Signal → Opportunity
```

Discovery Core is an internal capability of Nura.

Vertical is a contextual execution/solution dimension, NOT a separate application.

---

# 2. CANONICAL DOCUMENTS — READ FIRST

Before modifying implementation, read these files in order:

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
12. `docs/NURA_GENSPARK_MASTER_IMPLEMENTATION_PROMPT.md`
13. `docs/GENSPARK_SESSION_01_PHASE_01_DISCOVERY_CORE_IMPLEMENTATION_PROMPT.md`

Use the repository implementation and canonical documents as the source of truth.

These files are stale and must not override the canonical architecture:

- `docs/NURA_ECOSYSTEM_MASTER_BOUNDARY.md`
- `docs/NURA_HUB_BLUEPRINT.md`
- `docs/NURA_DIGITAL_BOUNDARY.md`
- `docs/NURA_VERTICAL_BOUNDARY.md`

If implementation conflicts with stale documents, follow the canonical documents.

---

# 3. PHASE 02 OBJECTIVE

Build the smallest real, tenant/workspace-safe Demand Intelligence foundation that converts captured demand signals into explicit opportunities.

Target:

```text
Tenant / Workspace
        ↓
  Demand Signal
        ↓
 Normalize / classify basic metadata
        ↓
 Deduplicate / idempotency
        ↓
 Opportunity formation
        ↓
 Opportunity lifecycle
```

The implementation must establish a trustworthy foundation for Phase 03:

```text
Business Context → Domain Discovery
```

Do not implement later phases prematurely.

---

# 4. CORE PHASE 02 ENTITIES

Implement or verify the minimum data model for:

```text
DemandSignal
Opportunity
```

A DemandSignal represents an observed/requested indication of demand.

An Opportunity represents a normalized, trackable candidate created from one or more demand signals.

The relationship must support:

```text
DemandSignal 1 ──────┐
                     ├──→ Opportunity
DemandSignal 2 ──────┘
```

MVP may begin with one signal creating one opportunity, but the schema and service boundary must not make future many-signals-to-one-opportunity impossible.

Every object must be tenant/workspace scoped through the Phase 01 ownership boundary.

---

# 5. DEMAND SIGNAL SEMANTICS

A DemandSignal should contain only information necessary to preserve and work with the observed signal.

At minimum support concepts equivalent to:

```text
id
tenant_id
workspace_id
source_type
source_reference (nullable)
external_id / source_event_id (nullable)
raw_content or normalized content
captured_at
created_at
updated_at
status
metadata / provenance
```

Adapt exact field names to the existing repository conventions.

Do not store credentials or secrets in signal records.

Do not require a specific external source such as Threads, X, Instagram, TikTok, Make.com, marketplace scraping, or social APIs.

The system must support manual/internal capture first.

Possible source types may include:

```text
MANUAL
WEB
SOCIAL
MARKETPLACE
REFERRAL
DIRECT
OTHER
```

Use an extensible representation rather than hardcoding a single source.

Do not claim that external acquisition is implemented unless it actually is.

---

# 6. RAW SIGNAL VS NORMALIZED SIGNAL

Preserve evidence of what was actually observed.

Where practical, distinguish:

```text
raw/original content
        ↓
normalized representation
        ↓
internal interpretation
```

Do not silently overwrite the original observed content with an AI-generated interpretation.

If normalization is implemented, it must be deterministic/simple enough to test and must not fabricate facts.

AI may be used later for interpretation, but Phase 02 must not depend on autonomous AI reasoning to create a valid record.

---

# 7. PROVENANCE

Demand signals must retain enough provenance to answer:

```text
WHAT was observed?
WHERE did it come from?
WHEN was it captured?
WHO/WHAT captured it?
```

At minimum provide fields or metadata for:

- source type
- source reference when available
- capture timestamp
- capture actor or mechanism when available
- external/source event identifier when available

Do not fabricate provenance.

If provenance is unknown, represent it as unknown/null rather than inventing a source.

---

# 8. OPPORTUNITY SEMANTICS

An Opportunity is not a confirmed sale, customer, solution, or business outcome.

It is a candidate created from demand evidence.

At minimum support:

```text
id
tenant_id
workspace_id
title/label
summary
demand_signal relationship
status
created_at
updated_at
```

Use a small lifecycle appropriate for MVP, for example:

```text
NEW
REVIEW
QUALIFIED
DISMISSED
```

If the existing canonical data contract specifies a different compatible lifecycle, follow that contract.

Do not create `WON`, `REVENUE`, `DELIVERED`, or equivalent outcome claims in this phase unless they are clearly outside the opportunity state and already belong to a later outcome model.

---

# 9. OPPORTUNITY FORMATION RULE

Create a deterministic MVP formation path:

```text
DemandSignal
   ↓
 basic validation
   ↓
 normalized signal
   ↓
 Opportunity
```

The opportunity may initially use a conservative generated title/summary from the signal data.

Do not pretend that an opportunity is validated merely because it exists.

Important distinction:

```text
Signal exists ≠ Opportunity validated
Opportunity exists ≠ Problem validated
Opportunity exists ≠ Solution selected
```

Validation remains a later gate.

---

# 10. DEDUPLICATION / IDEMPOTENCY

Phase 02 must prevent accidental duplicate ingestion where a stable source identifier exists.

Support an idempotency strategy based on available fields such as:

```text
tenant_id
workspace_id
source_type
external_id/source_event_id
```

For requests without an external identifier, support request-level idempotency where appropriate.

The exact implementation may use a unique constraint, idempotency key, deterministic hash, or equivalent mechanism suitable for the existing database/runtime.

Required invariant:

```text
same logical source event
        ↓
replayed ingestion
        ↓
no unintended duplicate DemandSignal
```

Do not make deduplication depend on unreliable fuzzy matching in this phase.

---

# 11. TENANT / WORKSPACE ISOLATION

Every DemandSignal and Opportunity must be owned by the current authorized tenant/workspace context.

Never trust client-supplied ownership IDs without server-side authorization.

Required invariants:

```text
signal.tenant_id == current_tenant.id
signal.workspace_id == current_workspace.id

opportunity.tenant_id == current_tenant.id
opportunity.workspace_id == current_workspace.id
```

Cross-tenant access must fail safely.

Cross-workspace access must fail safely.

Do not duplicate Phase 01 authorization logic if reusable middleware/services already exist.

Reuse the existing ownership boundary.

---

# 12. API CONTRACT

Implement the smallest useful API surface for Phase 02.

Preferred conceptual routes:

```text
POST   /signals
GET    /signals
GET    /signals/:id

POST   /opportunities
GET    /opportunities
GET    /opportunities/:id

POST   /opportunities/from-signal
```

The exact route structure may follow existing repository conventions.

If opportunity creation is automatically coupled to signal creation, expose a clear service boundary rather than forcing clients to duplicate business logic.

At minimum the API must support:

1. capture a DemandSignal
2. retrieve/list signals within current scope
3. retrieve a signal by ID within current scope
4. form an Opportunity from a signal
5. retrieve/list opportunities within current scope
6. retrieve an opportunity by ID within current scope

Do not expose unauthorized records.

Use consistent validation and error semantics.

---

# 13. INPUT VALIDATION

Validate all externally supplied fields.

At minimum reject:

- missing required content
- malformed IDs
- invalid source types
- invalid lifecycle states
- oversized content beyond reasonable MVP limits
- unauthorized ownership context

Do not trust client-provided timestamps or ownership fields without validation.

If a timestamp is server-generated, prefer the server timestamp.

---

# 14. ERROR SEMANTICS

Preserve the Phase 01 error strategy.

At minimum distinguish:

```text
400 — invalid input
401 — unauthenticated
403 — unauthorized
404 — resource not found within authorized scope
409 — duplicate/idempotency conflict where appropriate
500 — internal error
```

Do not leak database details, secrets, or stack traces.

---

# 15. AUDITABILITY

Demand capture and opportunity formation are important discovery events.

Where the Phase 01 audit mechanism exists, record sufficient audit information for events equivalent to:

```text
DEMAND_SIGNAL_CREATED
DEMAND_SIGNAL_DEDUPLICATED
OPPORTUNITY_CREATED
OPPORTUNITY_UPDATED
OPPORTUNITY_DISMISSED
```

Use existing audit conventions.

Do not create a giant event platform.

At minimum ensure later debugging can answer:

```text
who/what created it
when
for which tenant/workspace
from which source
what resource was affected
```

---

# 16. UI — MINIMAL DISCOVERY ENTRY

If a frontend exists, implement only the minimal usable Phase 02 interface.

Suggested flow:

```text
Discovery
  ↓
Signals
  ↓
Capture Signal
  ↓
Signal Detail
  ↓
Create / Form Opportunity
  ↓
Opportunity Detail
```

Minimum UI capabilities:

- list signals
- create a manual signal
- inspect signal provenance/content
- form an opportunity
- list opportunities
- inspect opportunity detail/status

Keep the UI intentionally simple.

Do not build advanced analytics.
Do not build a marketplace.
Do not build a vertical catalogue.
Do not build autonomous AI controls.

If the repository has no frontend or frontend work would violate the existing architecture, prioritize the API/domain/data layer and document the limitation honestly.

---

# 17. TESTS — REQUIRED FOR PHASE 02

Add or update automated tests appropriate to the existing framework.

At minimum verify:

### Test A — Create DemandSignal

A valid tenant/workspace can create a DemandSignal.

### Test B — Signal provenance

Source metadata/reference and capture information are preserved correctly.

### Test C — Signal validation

Invalid required input is rejected safely.

### Test D — Signal idempotency

Replaying the same logical source event does not create an unintended duplicate.

### Test E — Form Opportunity

A valid DemandSignal can form an Opportunity.

### Test F — Signal → Opportunity relationship

The Opportunity retains a traceable relationship to the originating DemandSignal.

### Test G — Tenant isolation

Tenant A cannot read or mutate Tenant B signals/opportunities.

### Test H — Workspace isolation

A workspace cannot access another workspace's signals/opportunities.

### Test I — Server-side ownership

Client-supplied tenant/workspace identifiers cannot bypass Phase 01 authorization.

### Test J — Opportunity lifecycle

Allowed lifecycle transitions work and invalid transitions are rejected.

### Test K — Existing tests

All pre-existing tests continue to pass unless a failure is demonstrably unrelated.

---

# 18. DATA INTEGRITY TEST

Include a test proving the intended ownership chain:

```text
Tenant
 ↓
Workspace
 ↓
DemandSignal
 ↓
Opportunity
```

The test must verify that an Opportunity cannot be attached to a signal from another tenant/workspace through normal API/service paths.

Do not bypass authorization inside tests merely to manufacture passing data.

---

# 19. MIGRATIONS

Inspect existing migration history before modifying the schema.

Do not rewrite historical migrations unnecessarily.

Create the minimum new migration(s) required for:

```text
DemandSignal
Opportunity
Signal ↔ Opportunity relationship
indexes / unique constraints required for ownership and idempotency
```

Use foreign keys where supported and consistent with the existing database strategy.

Index fields used for:

- tenant/workspace lookup
- source deduplication
- signal → opportunity lookup
- lifecycle filtering

Do not create schemas for later phases just because they are listed in architecture documents.

Do not prematurely implement:

```text
BusinessContext
DomainCandidate
Workflow
ProblemPattern
Evidence
Score
Validation
Solution
Execution
Outcome
LearningRecord
```

unless the existing repository already contains compatible placeholders that should simply remain untouched.

---

# 20. SECURITY HARD RULES

Never:

- commit secrets
- expose API keys
- trust client-controlled tenant ownership
- trust client-controlled workspace ownership
- bypass Phase 01 authorization
- fabricate source provenance
- fabricate demand evidence
- fabricate opportunity outcomes
- claim external acquisition exists when it does not
- introduce autonomous decisions as if they were verified

Use environment variables for secrets.

Unknown source information must remain unknown/null.

---

# 21. EXTERNAL ACQUISITION — EXPLICITLY DEFERRED

Do NOT make external social/API acquisition a required Phase 02 dependency.

Do not implement Threads, Instagram, Facebook, TikTok, X, marketplace scraping, Make.com, Apify, or similar acquisition integrations in this phase unless an existing connector already exists and a minimal compatibility change is genuinely required.

Phase 02 must work using:

```text
manual/internal signal capture
```

This keeps the core Demand Intelligence model independent from acquisition providers.

Future architecture may connect:

```text
External Source
   ↓
Connector
   ↓
DemandSignal ingestion boundary
```

but that is not the Phase 02 deliverable.

---

# 22. AI BOUNDARY

Do not require an LLM to make the Phase 02 data model work.

AI may later help with:

- normalization
- clustering
- summarization
- candidate opportunity grouping
- extraction

But AI output must remain distinguishable from observed evidence.

Never allow an AI-generated summary to become the only record of what was actually observed.

No autonomous solution selection belongs in Phase 02.

---

# 23. DO NOT OVERBUILD

Explicitly out of scope for Session 02:

- Business Context discovery
- Domain discovery
- fixed vertical catalogue
- Workflow discovery
- Problem discovery
- evidence scoring
- validation engine
- solution routing
- Digital/Vertical solution selection
- solution marketplace
- execution engine
- verification engine
- business outcome automation
- productization engine
- billing/subscriptions
- enterprise IAM
- external social acquisition as a required dependency
- autonomous agents
- autonomous opportunity qualification
- fake revenue/ROI claims

The objective is a trustworthy first Discovery Core slice.

---

# 24. NEXT PHASE CONTRACT

At the end of Phase 02, the repository must be ready for:

```text
PHASE 03
Business Context → Domain Discovery
```

Phase 03 must be able to start from a real Opportunity and discover:

```text
Opportunity
   ↓
BusinessContext
   ↓
DomainCandidate
```

without redesigning DemandSignal or Opportunity ownership.

Then:

```text
PHASE 04
Workflow → Problem Discovery
```

Then:

```text
PHASE 05
Evidence → Scoring → Validation
```

Only after those gates:

```text
PHASE 06
Solution Routing
```

---

# 25. IMPLEMENTATION DISCIPLINE

Follow this exact operational loop:

```text
INSPECT
  ↓
READ CANONICAL CONTRACTS
  ↓
VERIFY PHASE 01 FOUNDATION
  ↓
PLAN MINIMUM CHANGE
  ↓
IMPLEMENT
  ↓
MIGRATE
  ↓
TEST
  ↓
TYPECHECK
  ↓
BUILD
  ↓
LINT
  ↓
VERIFY
  ↓
COMMIT
```

Do not skip verification.

If a command does not exist, report that fact instead of pretending it ran.

If a test fails:

1. diagnose it
2. fix it if within Phase 02 scope
3. rerun it
4. report remaining failures honestly

Do not hide failures by weakening or deleting tests.

---

# 26. GIT REQUIREMENTS

Commit all actual Phase 02 implementation changes.

Suggested commit message:

```text
feat: implement Nura Phase 02 demand signal opportunity foundation
```

Do not rewrite unrelated history.

Do not modify canonical architecture documents unless a concrete implementation contradiction is discovered and explicitly justified.

---

# 27. FINAL REPORT — REQUIRED OUTPUT FROM GENSPARK

At the end of execution, return exactly this structure:

```text
NURA SESSION 02 — PHASE 02 REPORT

Status: PASS / PARTIAL / BLOCKED

Repository:
<repo>

Base Commit:
<pre-implementation SHA>

Commit SHA:
<final implementation SHA>

Runtime:
<framework/runtime>

Database:
<database/migration system>

Implemented:
- DemandSignal model/service
- Opportunity model/service
- Signal → Opportunity relationship
- provenance
- normalization/validation
- deduplication/idempotency
- tenant/workspace isolation
- lifecycle
- API
- UI, if applicable
- audit events, if applicable

Files changed:
- <path>
- <path>

Migrations:
- <migration>

Tests:
- <command> — PASS/FAIL

Required Phase 02 tests:
- create signal: PASS/FAIL
- provenance: PASS/FAIL
- validation: PASS/FAIL
- idempotency: PASS/FAIL
- form opportunity: PASS/FAIL
- signal→opportunity traceability: PASS/FAIL
- tenant isolation: PASS/FAIL
- workspace isolation: PASS/FAIL
- server-side ownership: PASS/FAIL
- opportunity lifecycle: PASS/FAIL
- existing tests: PASS/FAIL

Typecheck:
- <command> — PASS/FAIL/N/A

Build:
- <command> — PASS/FAIL/N/A

Lint:
- <command> — PASS/FAIL/N/A

Security checks:
- tenant isolation: PASS/FAIL
- workspace isolation: PASS/FAIL
- ownership authorization: PASS/FAIL
- provenance integrity: PASS/FAIL
- idempotency: PASS/FAIL
- secrets safety: PASS/FAIL

External acquisition:
<not implemented / exact implementation if an existing connector was required>

Known blockers:
- <none or exact blocker>

Next phase:
PHASE 03 — Business Context → Domain Discovery
```

Never report PASS when required work was not actually verified.

Never invent a commit SHA, test result, migration, endpoint, or completed integration.

---

# 28. FINAL NON-NEGOTIABLES

Remember:

```text
NURA = ONE PLATFORM

Digital + Vertical = dimensions

Discovery Core = internal capability

Vertical System = DOES NOT EXIST
NuraHub = DOES NOT EXIST
Nuralabs = NOT PART OF NURA

Demand First
→ Context First
→ Solution Second
→ Execution Always
```

Phase 02 is successful when Nura has a real, tested, tenant/workspace-safe path from observed DemandSignal to traceable Opportunity, with provenance and idempotency, and is ready to proceed into Business Context / Domain Discovery.

**Now inspect the repository and execute Session 02 / Phase 02.**
