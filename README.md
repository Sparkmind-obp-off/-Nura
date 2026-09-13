# Nura

## Project Overview

- **Name:** Nura
- **Goal:** Establish a secure, tenant-scoped foundation for the Nura Discovery Core.
- **Current phase:** Session 01 / Phase 01 — runtime baseline, identity, tenant, workspace, ownership, and authorization.
- **Governing principle:** **Demand First → Context First → Solution Second → Execution Always.**

Nura is one platform. Discovery Core is an internal capability. Digital and Vertical are solution dimensions, not separate products. No fixed industry catalogue, NuraHub product, Vertical System, or Nuralabs dependency is implemented.

## Completed Features

- Cloudflare Pages/Workers-compatible TypeScript + Hono runtime.
- Cloudflare D1 migration baseline.
- Tenant, workspace, user, tenant membership, workspace membership, session, and audit-event schema.
- Self-service MVP tenant initialization with a tenant owner and first workspace.
- PBKDF2-SHA256 password hashing and hashed opaque session tokens.
- HTTP-only, `SameSite=Lax`, production-secure session cookies.
- Server-side tenant/workspace resolution from session and membership records.
- Role check for workspace creation.
- Cross-tenant and unauthorized-workspace denial.
- Request and correlation IDs on requests, responses, logs, and audit writes.
- Structured API success/error envelopes.
- Responsive Nura application shell with visible tenant/workspace context.
- Phase 01 integration and ownership-contract tests.

## URLs and Entry Points

### Application

- `/` — Nura login, tenant initialization, and authenticated workspace shell.
- `/health` — public non-sensitive runtime health check.

### API v1

- `POST /api/v1/auth/register` — initialize a tenant, owner user, and first workspace.
  - Body: `email`, `password` (12–128 characters), `tenant_name`, `workspace_name`.
  - Public registration can be disabled with `ALLOW_PUBLIC_SIGNUP=false`.
- `POST /api/v1/auth/login` — establish a session.
  - Body: `email`, `password`.
- `POST /api/v1/auth/logout` — revoke the current session.
- `GET /api/v1/auth/status` — non-sensitive session-presence check for the application shell.
- `GET /api/v1/auth/session` — return the authorized user/tenant/workspace context.
- `GET /api/v1/tenants/current` — return the current authorized tenant.
- `GET /api/v1/workspaces` — list workspaces authorized for the current user and tenant.
- `POST /api/v1/workspaces` — create a workspace as tenant owner.
  - Body: `name`. Client-supplied ownership fields are not trusted.
- `GET /api/v1/workspaces/:workspaceId` — fetch an authorized workspace.

Protected routes accept `X-Workspace-Id` only as a requested context. The server verifies the session, tenant membership, workspace ownership, and workspace membership before resolving it.

## Data Architecture

### Storage

- **Cloudflare D1** for relational identity, ownership, sessions, and audit records.
- No runtime filesystem or in-memory persistence is used.

### Phase 01 Models

- `tenants`
- `users`
- `tenant_memberships`
- `workspaces`
- `workspace_memberships`
- `sessions`
- `audit_events`

Ownership direction:

```text
Tenant
  └── Workspace
       └── User / Membership
            └── future tenant/workspace-owned Discovery object
```

Future Discovery records must carry or resolve both `tenant_id` and `workspace_id`. The reusable `OwnedResource` contract and `assertOwnedResource` guard enforce this shape in application services.

## Local Development

```bash
npm install
npm run db:migrate:local
npm run build
pm2 start ecosystem.config.cjs
curl http://localhost:3000/health
```

Verification commands:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## User Guide

1. Open the application.
2. Choose **Buat workspace**.
3. Enter an owner email, a password of at least 12 characters, a tenant name, and the first workspace name.
4. Nura initializes the ownership boundary and signs the owner in.
5. Use the workspace selector to choose an authorized workspace.
6. The Discovery entry is intentionally read-only until Phase 02 implements `Demand Signal → Opportunity`.

The Phase 01 authentication mechanism is an MVP identity boundary, not enterprise IAM. SSO, SCIM, MFA, recovery workflows, invitations, and advanced session administration are not yet implemented.

## Features Not Yet Implemented

- Demand Signal and Opportunity persistence (Phase 02).
- Business Context and dynamic Domain Candidate discovery (Phase 03).
- Workflow and Problem discovery (Phase 04).
- Evidence, scoring, and validation gates (Phase 05).
- Solution routing, execution, verification, outcomes, learning, and connectors.
- Member invitation/management and advanced identity controls.

## Recommended Next Steps

1. Implement Phase 02 `Demand Signal → Opportunity` with `tenant_id` and `workspace_id` ownership.
2. Add idempotency for demand ingestion.
3. Emit append-oriented audit events for Phase 02 mutations and authorization denials.
4. Add account recovery and invitation flows when product requirements justify them.

## Deployment

- **Platform:** Cloudflare Pages + Workers runtime.
- **Database:** Cloudflare D1.
- **Configuration:** `wrangler.jsonc`.
- **Migration:** `migrations/0001_phase_01_identity.sql`.
- **Secrets:** Runtime values must be configured with Cloudflare secrets/environment variables and must not be committed.
- **Production URL:** populated after the first BYOK deployment.
- **Status:** implementation verified locally; production deployment tracked in the Session 01 report.
- **Last updated:** 2026-09-13.
