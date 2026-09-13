# NURA — GENSPARK SESSION 01 / PHASE 01 IMPLEMENTATION PROMPT

**Status:** Canonical execution prompt for Genspark Session 01
**Repository:** `Sparkmind-obp-off/-Nura`
**Target:** Nura Discovery Core MVP
**Phase:** Phase 01 — Runtime Baseline + Identity / Tenant / Workspace + implementation readiness

---

## 0. EXECUTE NOW

You are the implementation agent working directly on the existing Nura repository.

This is **Session 01 / Phase 01**.

Do not create another architecture proposal.
Do not redesign Nura.
Do not create a separate Vertical System.
Do not create NuraHub.
Do not introduce Nuralabs into Nura.
Do not invent a new product layer.

Your job is to inspect the current repository, establish the Phase 01 technical baseline, implement what is missing, run verification, and commit the work.

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

Discovery Core is an internal capability of Nura.

Vertical is a solution dimension/contextual execution layer, NOT a separate application.

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

The documents above are architecture authority.

These files are stale and must not override the canonical architecture:

- `docs/NURA_ECOSYSTEM_MASTER_BOUNDARY.md`
- `docs/NURA_HUB_BLUEPRINT.md`
- `docs/NURA_DIGITAL_BOUNDARY.md`
- `docs/NURA_VERTICAL_BOUNDARY.md`

If implementation conflicts with stale documents, follow the canonical documents.

---

# 3. SESSION 01 OBJECTIVE

Phase 01 is NOT the entire Discovery Core.

The goal is to create a solid technical foundation so the next sessions can implement the discovery loop safely.

Phase 01 target:

```text
Repository
   ↓
Runtime Baseline
   ↓
Application Shell
   ↓
Database / Migration Baseline
   ↓
Tenant
   ↓
Workspace
   ↓
User / Session Boundary
   ↓
Ownership Context
   ↓
Authorization Boundary
   ↓
Tests
   ↓
Verified Commit
```

If some of these already exist and are working, preserve them and improve only what is necessary.

Do NOT rebuild working infrastructure unnecessarily.

---

# 4. STEP 1 — INSPECT THE REPOSITORY

Before coding, inspect:

- directory tree
- `package.json` or equivalent
- framework/runtime
- TypeScript configuration
- build configuration
- Cloudflare configuration if present
- database configuration
- migration directory
- existing schema
- API routes
- frontend routes/components
- authentication/session implementation
- tests
- lint/typecheck/build scripts
- environment configuration
- deployment configuration

Determine:

1. What already exists?
2. What is incomplete?
3. What is broken?
4. What can be reused?
5. What minimum work is required for Phase 01?

Do not assume the repository is empty merely because the architecture documents are detailed.

---

# 5. STEP 2 — DETERMINE THE ACTUAL RUNTIME

Use the repository itself as the source of truth for implementation technology.

Prefer existing project choices.

If the repository is already configured for a valid stack, continue with it.

Do not replace the framework merely because another stack might be preferable.

For Cloudflare-based implementation, preserve the existing Cloudflare architecture if present.

Potential canonical runtime from the technical specification includes:

- TypeScript
- Hono/server runtime
- Cloudflare
- D1
- object storage where needed
- model abstraction
- connector boundary

But repository inspection has priority for concrete implementation details.

---

# 6. STEP 3 — PHASE 01 DATA MODEL

Establish the minimum tenant/workspace identity model.

At minimum the conceptual model must support:

```text
Tenant
Workspace
User
```

Required ownership direction:

```text
Tenant
  └── Workspace
        └── User / Membership
```

The exact schema may adapt to the existing runtime.

Every tenant-scoped future discovery object must have an unambiguous ownership path.

The system must be designed so that later objects such as:

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

can safely belong to a tenant/workspace.

---

# 7. TENANT REQUIREMENTS

Implement or verify:

- stable tenant ID
- tenant creation/initialization path
- tenant ownership semantics
- tenant lookup
- tenant-scoped request context
- server-side tenant authorization

Do not implement complex billing, enterprise organizations, SSO, SCIM, or advanced IAM in this phase.

Keep the boundary extensible but MVP-sized.

---

# 8. WORKSPACE REQUIREMENTS

Implement or verify:

- stable workspace ID
- workspace belongs to tenant
- workspace lookup
- workspace-scoped request context
- workspace authorization
- workspace cannot belong to another tenant through normal API paths

Minimum invariant:

```text
workspace.tenant_id == current_tenant.id
```

A request attempting to cross this boundary must fail safely.

---

# 9. USER / SESSION REQUIREMENTS

Implement the smallest practical identity boundary needed by the current repository.

If real authentication already exists:

- preserve it
- integrate tenant/workspace context
- do not replace it unnecessarily

If authentication does not yet exist:

- implement the smallest safe MVP session/user boundary supported by the current architecture
- do not pretend it is production-grade identity infrastructure
- clearly mark any temporary development authentication mechanism
- keep authorization server-side

Never trust tenant_id/workspace_id supplied by an untrusted client without authorization verification.

---

# 10. REQUEST CONTEXT

Establish a reusable request context containing, where applicable:

```text
user_id
tenant_id
workspace_id
request_id
correlation_id
roles/permissions
```

The exact implementation can vary.

The important invariant is that downstream Discovery Core services will be able to determine:

```text
WHO
↓
WHICH TENANT
↓
WHICH WORKSPACE
↓
WHICH RESOURCE
```

without trusting arbitrary client ownership fields.

---

# 11. AUTHORIZATION BOUNDARY

Implement server-side checks for:

```text
current user
    ↓
current tenant
    ↓
current workspace
    ↓
resource ownership
```

Do not rely only on UI hiding.

Do not rely only on client-supplied IDs.

The API must reject unauthorized cross-tenant/cross-workspace access.

---

# 12. DATABASE / MIGRATION REQUIREMENTS

If a database exists:

- inspect current migrations
- preserve migration history
- add the minimum migration required for Phase 01
- do not rewrite historical migrations unless absolutely necessary

If no database exists but the canonical runtime requires one:

- establish the minimum supported database/migration setup
- keep schema intentionally small

Prefer explicit IDs, timestamps, foreign keys where supported, and indexes needed for ownership lookups.

Do not prematurely create the entire Discovery Core schema if it would make Phase 01 unnecessarily large.

It is acceptable to create only:

```text
Tenant
Workspace
User / Membership
```

and prepare the migration structure for later Discovery Core entities.

---

# 13. API BASELINE

Create or verify only the minimum routes required for Phase 01.

Possible route groups:

```text
/auth/*
/tenants/*
/workspaces/*
```

The implementation must remain compatible with future routes:

```text
/signals/*
/opportunities/*
/contexts/*
/domains/*
/workflows/*
/problems/*
/evidence/*
/scores/*
/validations/*
```

Do not implement every future route in Phase 01 just to make the tree look complete.

---

# 14. HEALTH / RUNTIME VERIFICATION

If the application has an HTTP runtime, establish or verify a basic health endpoint.

Example semantics:

```text
GET /health
→ runtime is alive
```

If the repository already has a health endpoint, preserve it.

Health checks must not expose secrets.

---

# 15. ERROR HANDLING

Establish a consistent minimal error response strategy.

At minimum distinguish:

```text
400 — invalid input
401 — unauthenticated
403 — unauthorized
404 — resource not found
409 — conflict
500 — internal error
```

Do not expose stack traces or secrets in normal production responses.

---

# 16. AUDIT / OBSERVABILITY BASELINE

Phase 01 should establish the minimum foundation for future auditability.

At minimum where practical:

- request/correlation ID
- structured server logging
- clear error logging
- actor identity when available
- tenant/workspace context when safe

Do not build a giant observability platform.

The purpose is traceability for later Discovery Core operations.

---

# 17. SECURITY HARD RULES

Never:

- commit secrets
- commit `.env` credentials
- expose API keys
- trust client-controlled tenant ownership
- trust client-controlled workspace ownership
- bypass authorization for convenience
- fabricate authentication success
- claim production security without verification

Use environment variables for secrets.

If credentials are missing, keep the implementation runnable where possible without inventing credentials.

---

# 18. TESTS — REQUIRED FOR PHASE 01

Add or update automated tests appropriate to the existing framework.

At minimum verify:

### Test A — Tenant creation / initialization

A valid tenant can be created or initialized.

### Test B — Workspace ownership

A workspace belongs to exactly the expected tenant.

### Test C — Tenant isolation

Tenant A cannot access Tenant B resources.

### Test D — Workspace isolation

A workspace cannot be accessed through an unauthorized workspace context.

### Test E — Server-side ownership

Client-supplied tenant/workspace IDs cannot bypass authorization.

### Test F — Request context

Authenticated/request context resolves the correct tenant/workspace boundary.

### Test G — Health/runtime

The application starts and the health/runtime check succeeds where applicable.

### Test H — Existing tests

All pre-existing tests continue to pass unless a failure is demonstrably unrelated to this change.

---

# 19. DISCOVERY CORE PREPARATION TEST

Phase 01 must include a lightweight structural test or assertion proving the identity model can safely own a future Discovery Core object.

The test does NOT need to implement the full DemandSignal flow yet.

It must demonstrate the intended ownership relationship:

```text
Tenant
 ↓
Workspace
 ↓
future Discovery object
```

Do not create a fake discovery success just to satisfy this test.

---

# 20. UI / SHELL

If the repository already has a frontend, create or verify a minimal authenticated/application shell.

The shell should establish:

```text
Nura
├── Workspace context
├── Overview
└── Discovery entry
```

Do not build the complete Discovery UI in Phase 01.

Do not create a separate Vertical UI/product.

Do not create a NuraHub dashboard.

The next session will build the Discovery Core flow.

---

# 21. DO NOT OVERBUILD

Explicitly out of scope for Session 01:

- external social APIs
- Threads acquisition
- Instagram acquisition
- TikTok acquisition
- Make.com connector implementation
- marketplace scraping
- AI model orchestration
- autonomous agents
- solution marketplace
- vertical catalogue
- billing/subscriptions
- complex enterprise IAM
- production-grade SSO
- advanced analytics
- productization engine
- execution engine
- business outcome automation

These may come later.

The objective is a clean foundation.

---

# 22. NEXT PHASE CONTRACT

At the end of Phase 01, the repository must be ready for:

```text
PHASE 02
Demand Signal → Opportunity
```

Phase 02 must be able to create a DemandSignal that is tenant/workspace scoped without redesigning the identity architecture.

Then:

```text
PHASE 03
Business Context → Domain Discovery
```

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

# 23. IMPLEMENTATION DISCIPLINE

Follow this exact operational loop:

```text
INSPECT
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
VERIFY
  ↓
COMMIT
```

Do not skip verification.

If a command does not exist, report that fact instead of pretending it ran.

If a test fails:

1. diagnose it
2. fix it if within scope
3. rerun it
4. report remaining failures honestly

---

# 24. GIT REQUIREMENTS

Commit all actual Phase 01 implementation changes.

Commit message should clearly identify the phase, for example:

```text
tfeat: implement Nura Phase 01 identity workspace foundation
```

Do not rewrite unrelated history.

Do not modify canonical architecture documents unless a concrete implementation contradiction is discovered and explicitly justified.

---

# 25. FINAL REPORT — REQUIRED OUTPUT FROM GENSPARK

At the end of execution, return exactly this structure:

```text
NURA SESSION 01 — PHASE 01 REPORT

Status: PASS / PARTIAL / BLOCKED

Repository:
<repo>

Commit SHA:
<sha>

Runtime:
<framework/runtime>

Database:
<database/migration system>

Implemented:
- <item>
- <item>
- <item>

Files changed:
- <path>
- <path>

Migrations:
- <migration>

Tests:
- <command> — PASS/FAIL

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
- secrets safety: PASS/FAIL

Known blockers:
- <none or exact blocker>

Next phase:
PHASE 02 — Demand Signal → Opportunity
```

Never report PASS when required work was not actually verified.

---

# 26. FINAL NON-NEGOTIABLES

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

Phase 01 is successful when Nura has a real, tested tenant/workspace/identity foundation that can safely carry the Discovery Core in subsequent phases.

**Now inspect the repository and execute Phase 01.**
