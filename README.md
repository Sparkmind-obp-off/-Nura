# Nura

## Project Overview

- **Name:** Nura
- **Goal:** Build one trustworthy Discovery Core that moves from observed demand to context, validation, solution, execution, and verified learning.
- **Current phase:** Session 03 / Phase 03 — Opportunity → BusinessContext → DomainCandidate.
- **Governing principle:** **Demand First → Context First → Solution Second → Execution Always.**

Nura is one platform. Discovery Core is an internal capability. Digital and Vertical are solution dimensions, not separate products. This implementation does not introduce a fixed industry catalogue, NuraHub, a Vertical System, or a Nuralabs dependency.

## Completed Features

### Phase 01 foundation

- Cloudflare Pages/Workers-compatible TypeScript + Hono runtime.
- Cloudflare D1 migration baseline.
- Tenant, workspace, user, memberships, session, and append-oriented audit schema.
- PBKDF2-SHA256 password hashing and hashed opaque session tokens.
- Server-side tenant/workspace context derived from authenticated sessions and memberships.
- Role-aware workspace and Discovery mutation boundaries.
- Request/correlation IDs and structured API responses/errors.

### Phase 02 discovery entry

- Manual/internal Demand Signal capture independent of external acquisition providers.
- Original content preservation plus deterministic whitespace-only normalization.
- Provenance fields for source type/reference, source event ID, capture timestamp, actor, mechanism, and metadata.
- Extensible source categories: `MANUAL`, `WEB`, `SOCIAL`, `MARKETPLACE`, `REFERRAL`, `DIRECT`, and `OTHER`.
- Stable source-event deduplication and request-level `Idempotency-Key` handling.
- Deterministic Opportunity formation from an authorized Demand Signal.
- Traceable many-signals-to-one-opportunity relationship table (MVP forms one opportunity per signal).
- Conservative Opportunity lifecycle: `NEW → REVIEW → QUALIFIED` with explicit dismissal/review paths.
- Tenant/workspace-scoped signal and opportunity list/detail APIs.
- Composite ownership foreign keys preventing cross-scope signal/opportunity links.
- Audit events for signal creation/deduplication and opportunity creation/update/dismissal.
- Minimal responsive Discovery UI for signal capture, provenance inspection, opportunity formation, lists, and lifecycle updates.
- Automated Phase 01 regression and Phase 02 integration/security tests.

### Phase 03 context and domain discovery

- One tenant/workspace-scoped `BusinessContext` per Opportunity with observed facts, operating context, actors, channels, constraints, process clues, explicit unknowns, confidence, and provenance.
- Unknown-first capture: incomplete fields remain null, empty, or explicitly listed as unknown instead of receiving fabricated defaults.
- Dynamic free-text `DomainCandidate` labels with no industry/vertical enum or fixed catalogue.
- Explicit `OBSERVED` versus `INFERRED` interpretation type on contexts and domain candidates.
- Traceable `Opportunity → BusinessContext → DomainCandidate` ownership relationships enforced by composite foreign keys and scoped repository queries.
- Multiple domain candidates may be associated with one context when interpretation is ambiguous.
- `solution = null` is persisted and returned for every Phase 03 candidate; no solution-selection capability exists.
- Request-level idempotency plus natural context/domain replay deduplication and conflict detection for changed payloads.
- Append-oriented audit events for context/domain creation and replay deduplication.
- Minimal responsive UI embedded in Opportunity cards for context capture, unknown inspection, dynamic domain formation, provenance, and null-solution visibility.
- Automated Phase 03 integration/security tests plus Phase 01 and Phase 02 regressions.

## URLs and Entry Points

### Application

- `/` — authentication, workspace selection, and the Phase 03 Discovery interface.
- `/health` — public non-sensitive health check; reports Phase `03`.

### Authentication and ownership API

- `POST /api/v1/auth/register` — initialize a tenant, owner, and first workspace.
- `POST /api/v1/auth/login` — establish a session.
- `POST /api/v1/auth/logout` — revoke the current session.
- `GET /api/v1/auth/status` — non-sensitive session-presence check.
- `GET /api/v1/auth/session` — current authorized identity/tenant/workspace context.
- `GET /api/v1/tenants/current` — current authorized tenant.
- `GET /api/v1/workspaces` — list authorized workspaces.
- `POST /api/v1/workspaces` — create a workspace as tenant owner.
- `GET /api/v1/workspaces/:workspaceId` — retrieve an authorized workspace.

### Phase 02 API

- `POST /api/v1/signals` — capture a Demand Signal.
  - Required: `source_type`, `raw_content`.
  - Optional: `source_reference`, `external_id`, `capture_mechanism`, `metadata`.
  - Optional header: `Idempotency-Key` (maximum 200 characters).
  - Ownership fields in the body are ignored; scope always comes from the server-authorized session.
- `GET /api/v1/signals` — list up to 100 signals in the active tenant/workspace.
- `GET /api/v1/signals/:signalId` — retrieve one authorized signal (UUID).
- `POST /api/v1/opportunities/from-signal` — form an opportunity from a signal.
  - Required: `signal_id`.
  - Optional conservative overrides: `title`, `summary`.
- `POST /api/v1/opportunities` — compatible formation endpoint using the same service boundary.
- `GET /api/v1/opportunities` — list up to 100 opportunities in the active scope.
- `GET /api/v1/opportunities/:opportunityId` — retrieve one opportunity and linked signal IDs.
- `PATCH /api/v1/opportunities/:opportunityId/status` — apply an allowed MVP lifecycle transition.

### Phase 03 API

- `POST /api/v1/contexts` — create the BusinessContext for an owned Opportunity.
  - Required: `opportunity_id`.
  - Optional unknown-first fields: `observed_facts`, `business_characteristics`, `operating_context`, `channels`, `actors`, `constraints`, `process_clues`, `unknowns`, `source_type`, `source_reference`, `interpretation_type`, `confidence`, and `provenance`.
  - Optional header: `Idempotency-Key` (maximum 200 characters).
- `GET /api/v1/contexts` — list contexts in the active tenant/workspace.
- `GET /api/v1/contexts/:contextId` — retrieve one authorized context (UUID).
- `POST /api/v1/domains/from-context` — form a dynamic DomainCandidate from a matching owned Opportunity and BusinessContext.
- `POST /api/v1/domains` — compatible candidate-formation endpoint.
  - Required: `opportunity_id`, `business_context_id`, and free-text `label`.
  - Optional: `description`, `rationale`, `interpretation_type`, `confidence`, `source_type`, `source_reference`, and `provenance`.
  - `solution` from client input is ignored; the persisted API value is `null`.
- `GET /api/v1/domains` — list candidate domains in the active scope.
- `GET /api/v1/domains/:domainId` — retrieve one authorized candidate (UUID).

Protected routes accept `X-Workspace-Id` only as a requested context. The server verifies the session, tenant membership, workspace ownership, and workspace membership before resolving it. Ownership fields supplied in mutation bodies are never trusted.

## Data Architecture

### Storage

- **Cloudflare D1** for identity, ownership, Demand Signals, Opportunities, Business Contexts, Domain Candidates, relationships, sessions, and audit records.
- No runtime filesystem or in-memory persistence.
- No external acquisition connector is required or claimed.

### Models

- Phase 01: `tenants`, `users`, `tenant_memberships`, `workspaces`, `workspace_memberships`, `sessions`, `audit_events`.
- Phase 02: `demand_signals`, `opportunities`, `opportunity_signals`.
- Phase 03: `business_contexts`, `domain_candidates`.

Ownership and causal lineage:

```text
Tenant
  └── Workspace
       ├── DemandSignal
       │     └── opportunity_signals
       └── Opportunity
             └── BusinessContext
                   └── DomainCandidate
                         └── solution = null
```

Application queries and composite relationship foreign keys enforce matching `tenant_id` and `workspace_id` throughout the chain.

## User Guide

1. Open the application and sign in, or initialize a tenant/workspace.
2. Select an authorized workspace.
3. In **Capture Signal**, select a source type and enter the original observed content.
4. Optionally add a lawful source reference. Nura preserves the original text and stores a separate deterministic normalized representation.
5. Inspect the saved signal and its provenance.
6. Choose **Form opportunity**. The result starts as `NEW`; creation does not mean validation or solution selection.
7. In the Opportunity card, record only context that is known and list unresolved facts under **Unknowns**.
8. When context supports an interpretation, enter any evidence-led free-text domain label and rationale; no catalogue match is required.
9. Inspect the candidate state and verify that `solution = null`. Workflow, Problem, Evidence, Scoring, Validation, Solution, and Execution remain intentionally absent.

## Validation and Local Development

```bash
npm install
npm run db:migrate:local
npm test
npm run typecheck
npm run lint
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/health
```

The test suite verifies Phase 01 identity/ownership, Phase 02 signal/opportunity behavior, and Phase 03 context/domain creation, provenance, unknown-first behavior, dynamic labels, null solution state, relationship traceability, tenant/workspace isolation, server-side ownership, cross-scope rejection, idempotency conflicts, and auditing.

## Features Not Yet Implemented

- Phase 04 Workflow and Problem discovery.
- Phase 05 Evidence, explainable scoring, and validation gates.
- Solution routing, execution, verification, outcomes, and learning.
- External social/marketplace/API acquisition connectors.
- Autonomous AI interpretation or qualification.
- Billing, enterprise IAM, and advanced analytics.

## Recommended Next Steps

1. Implement Phase 04 Workflow and Problem discovery from the persisted Phase 03 context/domain lineage.
2. Permit multiple related signals to be linked to one opportunity through an explicit authorized service operation when clustering is required.
3. Add pagination cursors when record volume exceeds the MVP list limit.
4. Add account recovery and member invitation workflows when product requirements justify them.

## Deployment

- **Platform:** Cloudflare Pages + Workers runtime.
- **Database:** Cloudflare D1.
- **Configuration:** `wrangler.jsonc`.
- **Migrations:**
  - `migrations/0001_phase_01_identity.sql`
  - `migrations/0002_phase_02_demand_opportunities.sql`
  - `migrations/0003_phase_03_context_domains.sql`
- **Secrets:** configure through Cloudflare environment/secrets; never commit plaintext credentials.
- **Production URL:** https://nura-4nr.pages.dev
- **Latest verified Phase 03 deployment:** https://9a3edd76.nura-4nr.pages.dev
- **Status:** Phase 03 verified locally and deployed through Cloudflare BYOK.
- **Last updated:** 2026-09-13.
