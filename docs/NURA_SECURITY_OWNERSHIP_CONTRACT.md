# Nura Security & Ownership Contract

**Status:** Canonical
**Version:** 1.0
**Date:** 2026-09-14

## 1. Purpose

This document defines the security, ownership, authorization, credential, privacy, audit, and data-governance boundaries for Nura.

Nura is one platform with two business dimensions:

- **Digital**
- **Vertical**

Security must protect the complete operating loop:

`Demand → Evidence → Opportunity → Validation → Solution → Execution → Verification → Outcome → Learning`

## 2. Security Principles

1. Tenant isolation is mandatory.
2. Authorization is enforced server-side.
3. Least privilege is the default.
4. Deny by default when authorization is uncertain.
5. Secrets are never stored in source code or ordinary API payloads.
6. Sensitive values are never returned unnecessarily.
7. Every consequential mutation is attributable.
8. External actions are treated as untrusted until verified.
9. AI output is not automatically treated as factual evidence.
10. Verification requires explicit evidence.
11. Security boundaries must not depend on client-side UI behavior.
12. Nura should collect and retain only data necessary for the intended business function.

## 3. Ownership Hierarchy

Canonical ownership boundary:

```text
Tenant
  │
  └── Workspace
       │
       ├── Users / Operators
       ├── Demand Signals
       ├── Evidence
       ├── Opportunities
       ├── Solutions
       ├── Executions
       ├── Artifacts
       ├── Outcomes
       ├── Learning Records
       ├── Connector Configurations
       └── Audit Events
```

Every tenant-owned record must be traceable to a tenant, directly or through a workspace relationship.

A user must never gain access to another tenant's records merely by changing an ID in a URL, query, request body, or client state.

## 4. Tenant Isolation

Tenant isolation is a server-side invariant.

Every read and write must establish:

```text
Authenticated Principal
        ↓
Tenant Membership
        ↓
Workspace Authorization
        ↓
Resource Ownership
        ↓
Operation Permission
```

Resource IDs are not authorization.

Example of prohibited behavior:

```text
GET /api/v1/opportunities/{anotherTenantId}
→ return record because the ID exists
```

The server must instead verify ownership and authorization before returning the resource.

## 5. Workspace Isolation

Workspaces provide operational separation within a tenant.

A user may belong to:

- one workspace;
- multiple workspaces;
- or tenant-level administration scope,

according to the authorization model.

Workspace-scoped resources must not be implicitly visible across workspaces unless the authenticated role has explicit cross-workspace permission.

## 6. Roles

The MVP should use a small explicit role model.

Suggested roles:

### Tenant Owner

Can:

- manage tenant settings;
- manage workspaces;
- manage membership;
- manage connector authorization;
- access tenant-wide records;
- manage retention/export/deletion controls where permitted.

### Workspace Admin

Can:

- manage workspace users;
- manage workspace operations;
- access workspace data;
- configure approved connectors;
- review audit events available to the workspace.

### Operator

Can:

- capture demand;
- manage opportunities;
- score and validate opportunities;
- select solutions;
- execute permitted work;
- record verification and learning.

### Reviewer / Verifier

Can:

- review execution evidence;
- perform verification;
- approve outcome verification;
- reject insufficient evidence.

### Viewer

Can:

- view authorized records;
- not perform consequential mutations.

The final implementation may combine roles where the MVP does not need separate identities, but permissions must remain explicit.

## 7. Permission Model

Authorization should be evaluated using at least:

```text
principal
+ tenant
+ workspace
+ role
+ resource
+ action
+ resource state
```

Examples:

```text
opportunity:read
opportunity:create
opportunity:update
opportunity:validate
solution:select
execution:start
execution:cancel
connector:test
connector:configure
verification:create
outcome:verify
audit:read
```

High-impact actions should require stronger permissions than ordinary reads.

## 8. Human-in-the-Loop Boundary

Nura may recommend actions, but recommendation does not equal authorization.

The system must distinguish:

```text
AI Recommendation
      ↓
Human Review / Policy Check
      ↓
Authorized Action
      ↓
Execution
      ↓
Verification
```

Consequential external actions may require explicit human confirmation depending on policy and risk.

Examples include:

- sending messages;
- publishing content;
- changing external records;
- spending money;
- deleting external data;
- triggering irreversible operations.

## 9. Credential and Secret Ownership

Connector credentials belong to the tenant/workspace that authorized them, subject to the provider's actual terms and account ownership.

Nura stores only a secure reference to a secret where possible:

```text
Connector
  └── credential_reference
          ↓
      Secret Store
```

Never persist raw API keys, OAuth client secrets, access tokens, refresh tokens, passwords, or private keys in ordinary domain tables.

## 10. Secret Handling Rules

Secrets must not appear in:

- Git repositories;
- source code;
- frontend bundles;
- ordinary database records;
- API response bodies;
- analytics events;
- screenshots generated by the application;
- error messages;
- normal application logs;
- audit metadata.

Secrets must be redacted before logging or telemetry.

## 11. Connector Credential Lifecycle

Recommended lifecycle:

```text
NOT_CONFIGURED
      ↓
AUTHORIZED
      ↓
ACTIVE
      ├──→ EXPIRED
      ├──→ REVOKED
      └──→ ERROR
```

Nura should not assume a credential remains valid merely because it exists.

Connector health checks must avoid exposing credential material.

## 12. Authentication

Authentication establishes identity. It does not establish authorization.

Every protected request must derive the authenticated principal from a trusted server-side mechanism.

The application must not trust arbitrary client-provided fields such as:

```text
user_id
role
tenant_id
workspace_id
```

as proof of identity or ownership.

These values may be used as requested context, but the server must resolve and validate the authoritative values from the authenticated session/membership model.

## 13. Session Security

Sessions should:

- use secure, appropriately scoped cookies or equivalent secure tokens;
- avoid exposing sensitive session values to client scripts where possible;
- expire according to risk and product policy;
- support revocation where required;
- prevent cross-tenant session confusion.

Authentication implementation may evolve, but the authorization invariants in this contract are mandatory.

## 14. API Security

All protected API routes must:

1. authenticate the request;
2. resolve tenant/workspace context;
3. authorize the requested action;
4. validate input;
5. enforce state transition rules;
6. execute the operation;
7. emit relevant audit information.

Do not rely on hidden UI buttons to enforce permissions.

## 15. Input Validation

All external input must be validated at the server boundary.

Validation must cover:

- type;
- required fields;
- allowed enum values;
- size limits;
- identifier format;
- state transition legality;
- connector capability compatibility;
- tenant/workspace ownership.

Untrusted content must be treated as data, not executable instructions.

## 16. Prompt and AI Safety Boundary

External source content may contain malicious or manipulative instructions.

For AI-assisted processing:

```text
External Content
      ↓
Untrusted Data
      ↓
Controlled Prompt/Tool Context
      ↓
Model Output
      ↓
Validation / Policy
      ↓
Nura State Change
```

The model must not be given unrestricted authority merely because content was retrieved from a source.

AI output cannot directly elevate privileges or bypass authorization.

## 17. Evidence Integrity

Evidence must preserve provenance.

Minimum provenance should identify where the evidence originated and when it was captured.

Evidence should distinguish:

- observed;
- inferred;
- validated;
- paid/adopted;
- outcome verified.

The UI and API must not silently upgrade evidence level.

## 18. Outcome Verification Security

A business outcome may only become `VERIFIED` when an authorized verification action records sufficient evidence.

The following shortcut is prohibited:

```text
Execution COMPLETED
        ↓
Outcome VERIFIED
```

Correct boundary:

```text
Execution COMPLETED
        ↓
Verification
        ↓
Evidence Check
        ↓
Outcome VERIFIED
```

## 19. Artifact Security

Artifacts may contain sensitive business data.

Requirements:

- access is tenant/workspace scoped;
- object references are not authorization credentials;
- download operations re-check authorization;
- direct object-storage access should use controlled access mechanisms;
- artifact metadata must not expose secrets;
- deleted artifacts must follow retention/deletion policy.

## 20. Audit Requirements

Audit events are required for consequential actions, including at minimum:

- authentication/security events where available;
- membership/role changes;
- connector configuration changes;
- credential lifecycle changes;
- opportunity state transitions;
- validation decisions;
- solution selection;
- execution control actions;
- verification decisions;
- outcome verification;
- data export/deletion actions.

Audit records should include:

```text
actor
tenant
workspace
action
target
request_id
correlation_id
result
timestamp
```

Audit records should avoid sensitive payload duplication.

## 21. Audit Immutability

Ordinary users must not be able to rewrite historical audit records.

If a correction is necessary, create a new compensating event rather than silently rewriting history.

## 22. Request and Correlation IDs

Every API request should receive a `request_id`.

Operations spanning multiple internal steps should use a `correlation_id`.

These identifiers should appear in safe logs and error responses so operators can trace failures without exposing secrets.

## 23. Logging and Observability

Logs should be useful for debugging while minimizing sensitive information.

Never log by default:

- authorization headers;
- access tokens;
- refresh tokens;
- passwords;
- secret keys;
- full private source content;
- payment credentials;
- unnecessary personal data.

Use structured logs with severity and correlation context.

## 24. Rate Limiting and Abuse Controls

Public or externally reachable ingestion/API surfaces should have appropriate rate limits.

Rate limiting should consider:

- tenant;
- authenticated principal;
- endpoint/action;
- connector/provider;
- IP/network context where appropriate.

Limits should prevent abuse without becoming a substitute for authorization.

## 25. External Connector Trust Boundary

External providers are separate trust domains.

```text
Nura Trust Boundary
────────────────────────────
Authenticated Nura Request
        ↓
Nura Authorization
        ↓
Connector Policy
        ↓
Provider Adapter
────────────────────────────
External Provider
```

Provider responses are untrusted input and must be validated before becoming domain state.

## 26. Connector Action Authorization

Before a connector action executes, Nura should verify:

1. the connector belongs to the current tenant/workspace;
2. the connector is active;
3. the requested capability is supported;
4. the principal is allowed to perform the action;
5. the action is compatible with the current resource state;
6. required confirmation/policy checks have passed;
7. an idempotency strategy exists where needed.

## 27. Data Classification

MVP data should be classified conceptually as:

### Public / Low Sensitivity

General solution descriptions or non-sensitive product metadata.

### Business Confidential

Opportunity details, customer context, internal notes, pricing assumptions, execution records.

### Sensitive

Personal data, private source content, credentials, tokens, confidential customer material.

Sensitive data requires stronger access and handling controls.

## 28. Personal Data Minimization

Nura should collect only personal data needed for a defined operational purpose.

Avoid collecting identity attributes merely because they may be useful later.

When a public source contains personal information that is not required for the business workflow, do not unnecessarily copy it into normalized domain records.

## 29. Data Export

Tenant owners should have a controlled export path when supported by the deployment.

Exports must:

- be authorization checked;
- be scoped to the tenant;
- identify the export request;
- avoid leaking other tenants' data;
- be protected during generation and download;
- be audited.

## 30. Data Deletion

Deletion must distinguish:

- user-visible deletion;
- business-record retention;
- legal/audit retention;
- object-storage deletion;
- external-provider deletion.

Deleting a Nura record must not imply that Nura can or will delete the corresponding external provider record unless an explicit connector action exists and is authorized.

## 31. Tenant Offboarding

A tenant offboarding workflow should support:

```text
OFFBOARD_REQUESTED
      ↓
ACCESS_RESTRICTED
      ↓
EXPORT_WINDOW (if applicable)
      ↓
DELETION / RETENTION POLICY
      ↓
OFFBOARDED
```

Irreversible deletion must be explicit and protected against accidental execution.

## 32. Backup and Recovery Boundary

Production deployments should maintain appropriate database/object backup and recovery procedures according to the selected infrastructure.

Backups are also tenant data and must receive appropriate access controls.

Deletion policies must document how long data may remain in backups and how restoration interacts with deletion requests.

## 33. Environment Separation

At minimum:

```text
Development
Staging / Preview
Production
```

Production secrets must not be copied into development or preview environments.

Test data should not contain unnecessary real customer secrets or private data.

## 34. Deployment Security

Deployment configuration must separate:

- application code;
- environment configuration;
- secret values;
- database identifiers;
- connector credentials;
- observability configuration.

Secrets should be injected through the deployment/runtime secret mechanism.

## 35. Database Security

Database access should be server-side only for protected application data.

The frontend must not receive unrestricted database credentials.

Every repository/service operation should preserve tenant/workspace scoping.

Indexes should support the ownership predicates used in authorization-sensitive queries.

## 36. Object Storage Security

Object storage references must not be treated as public authorization.

Downloads should use controlled authorization, such as short-lived signed access or server-mediated retrieval, according to infrastructure capabilities.

## 37. Security Failure Behavior

When security context cannot be established safely:

```text
UNKNOWN AUTHORIZATION
        ↓
DENY
```

Do not fail open because a tenant, role, connector, or permission lookup is unavailable.

## 38. Incident Boundary

Security-sensitive incidents should preserve enough information to investigate:

- affected tenant/workspace;
- approximate time;
- request/correlation ID;
- affected action/resource;
- connector/provider where relevant;
- safe error information.

Incident logs must not expose the secret that caused the incident.

## 39. Security Acceptance Criteria

Nura security implementation is acceptable when:

1. A user cannot read another tenant's records by modifying resource IDs.
2. Workspace permissions are enforced server-side.
3. Roles cannot be self-assigned through client payloads.
4. Connector credentials are never returned in ordinary API responses.
5. Secrets are not committed to the repository.
6. Sensitive logs are redacted.
7. Consequential actions are auditable.
8. Invalid state transitions are rejected.
9. Outcome verification requires explicit authorized verification.
10. External provider responses are treated as untrusted input.
11. Connector actions enforce capability and ownership checks.
12. Data export is tenant-scoped and authorized.
13. Deletion cannot silently cross tenant boundaries.
14. Preview/development environments do not inherit production secrets.
15. Security failures default to deny.

## 40. MVP Security Scope

The MVP does not require a giant enterprise security platform.

It does require the following from the first real implementation:

```text
Authentication
      ↓
Tenant Isolation
      ↓
Workspace Authorization
      ↓
Role Permissions
      ↓
Server-side Validation
      ↓
Connector Boundary
      ↓
Secret Protection
      ↓
Audit Trail
```

Advanced capabilities such as SSO, SCIM, enterprise key management, advanced DLP, SIEM integration, and organization-wide policy engines can be added when actual customer requirements justify them.

## 41. Explicit Non-Goals

This contract does not require:

- zero-trust marketing claims without implementation evidence;
- a separate Nura security product;
- a separate NuraHub security layer;
- dependency on Nuralabs;
- client-side authorization as a security mechanism;
- storing every possible personal attribute;
- enterprise IAM complexity before demand exists.

## 42. Canonical References

This contract must be implemented together with:

1. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
2. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
3. `docs/NURA_TECHNICAL_SPEC.md`
4. `docs/NURA_UX_UI_SPEC.md`
5. `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`

If an older document conflicts with these references, the canonical documents above take precedence.
