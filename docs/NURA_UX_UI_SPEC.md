# Nura UX/UI Specification

**Status:** Canonical — Discovery Core Ready  
**Version:** 2.0  
**Date:** 2026-09-14

## 1. Purpose

This document defines the UX/UI contract for **Nura as one platform** with two solution dimensions: **Digital** and **Vertical**.

Discovery Core is an internal capability of Nura, not a separate product or application. The UX must make the canonical operating loop visible:

`Demand Signal → Opportunity → Business Context → Domain → Workflow → Problem → Evidence → Score → Validation → Solution → Execution → Verification → Outcome → Learning`

Governing principle:

> **Demand First → Context First → Solution Second → Execution Always**

The interface must never force a predetermined industry, vertical, or solution before sufficient context and evidence exist.

## 2. Canonical UX Principles

1. **Demand before solution.** Start from observed demand and context, not a product catalogue.
2. **Context before solution.** Business context, domain, workflow, and problem discovery precede solution selection.
3. **One Nura.** Digital and Vertical are dimensions of one platform.
4. **Discovery is first-class.** Domain and workflow discovery are visible parts of the core experience.
5. **Unknown-first.** A user can capture something Nura does not already know.
6. **Evidence is visible.** Claims expose provenance and strength.
7. **AI is assistive.** AI interpretations and recommendations are clearly distinguished from source facts.
8. **Human control.** Consequential actions require explicit authorization unless an authorized automation policy exists.
9. **Execution ≠ verification.** Completion never automatically means a verified outcome.
10. **No fake state.** UI state must reflect persisted platform state.
11. **Outcome over activity.** Verified business outcomes matter more than task counts.
12. **Progressive disclosure.** Operational summaries remain simple while evidence, scoring, and audit detail remain inspectable.

## 3. Onboarding / Entry Experience

Onboarding is part of the main Nura UX. It does not require a separate product or document.

Canonical first-use path:

```text
Onboarding
   ↓
Workspace / Tenant
   ↓
Discovery
   ↓
Capture Demand
   ↓
Understand Business Context
   ↓
Discover Domain
   ↓
Map Workflow
   ↓
Identify Problem
   ↓
Attach Evidence
   ↓
Score
   ↓
Validate
   ↓
Select Solution
   ↓
Execute
   ↓
Verify Outcome
```

The onboarding experience should teach the user that Nura does not require them to know the final solution in advance. A new workspace may begin with an unknown problem/domain and progressively structure it.

## 4. Information Architecture

```text
NURA
├── Overview
├── Discovery
│   ├── Signals
│   ├── Opportunities
│   ├── Business Context
│   ├── Domains
│   ├── Workflows
│   └── Problems
├── Evidence & Scoring
├── Validation
├── Solutions
├── Execution
├── Verification & Delivery
├── Outcomes
├── Learning
└── Settings
    ├── Workspace
    ├── Connectors
    ├── Members & Roles
    └── Audit
```

This is one Nura application. There is no NuraHub product surface, no standalone Vertical System, and no Nuralabs dependency.

## 5. Global Navigation

Primary navigation:

- Overview
- Discovery
- Evidence & Scoring
- Validation
- Solutions
- Execution
- Verification
- Outcomes
- Learning

Discovery should be the natural entry point for new opportunities. Existing users may enter directly into a known workflow where permissions allow it.

Global controls:

- workspace selector;
- search;
- current user/profile;
- notifications when implemented;
- environment indicator outside production;
- help/context affordance.

## 6. Overview Dashboard

The dashboard answers:

1. What demand is arriving?
2. What context and problems are emerging?
3. Which opportunities deserve attention?
4. What is being executed?
5. Which outcomes are actually verified?

Recommended cards:

- New demand signals
- Opportunities needing discovery
- Domains/workflows under discovery
- Problems awaiting evidence
- Opportunities awaiting validation
- Active executions
- Items awaiting verification
- Verified business outcomes
- Productization candidates

Counts must respect lifecycle state. A signal is not automatically an opportunity; an opportunity is not automatically validated demand.

## 7. Discovery Workspace

Discovery is the core UX surface.

### 7.1 Demand Signal

Capture:

- source;
- original/normalized content where permitted;
- capture time;
- source type;
- provenance;
- extraction/normalization notes;
- related entities.

The UI must allow a signal to remain unresolved.

### 7.2 Opportunity

An opportunity is a structured hypothesis formed from demand signals. Show:

- title;
- problem hypothesis;
- linked signals;
- current evidence;
- score;
- discovery state;
- validation state;
- solution state.

### 7.3 Business Context

Context answers **where and how this demand exists**.

Show:

- organization/business context;
- actors;
- customer/user type;
- operating environment;
- goals;
- constraints;
- existing tools/processes;
- source evidence;
- unknown fields requiring discovery.

Do not force an industry label when evidence is insufficient.

### 7.4 Domain Discovery

A domain is an observed business context, not a fixed catalogue entry.

Domain UI should show:

- candidate name/description;
- discovery status;
- evidence count;
- confidence;
- related contexts;
- workflows;
- repeated problems;
- validation status;
- solution state.

Valid early state:

`Domain Candidate → solution: null`

Example:

```text
Snack Distribution
Status: Observed
Evidence: 12
Workflows: Ordering, Replenishment, Delivery
Repeated Problems: Manual Order Capture, Stock Visibility
Validation: In Progress
Solution: Not Yet Selected
```

Never require the UI to select a predefined vertical such as Barber/Cafe/Property.

### 7.5 Workflow Discovery

A workflow view should expose:

- workflow name;
- actor(s);
- trigger;
- inputs;
- actions;
- decisions;
- handoffs;
- tools;
- outputs;
- bottlenecks;
- frequency;
- constraints;
- supporting evidence.

The UI should make the operational flow understandable before recommending automation or software.

### 7.6 Problem Discovery

Separate:

`Symptom → Request → Operational Friction → Repeated Problem → Root-Cause Hypothesis → Validated Problem`

Problem cards should show:

- observed statement;
- affected actor;
- frequency/materiality;
- related workflow;
- evidence;
- confidence;
- validation state;
- unresolved questions.

## 8. Evidence & Provenance

Evidence is inspectable at every discovery stage.

Show:

- evidence level;
- source;
- timestamp;
- lawful source reference when available;
- linked signal/context/domain/workflow/problem;
- extraction/interpretation note;
- strength/confidence.

Recommended evidence levels:

`Observed → Inferred → Validated → Paid-Adopted → Outcome Verified`

The UI must distinguish **source fact** from **Nura interpretation**.

## 9. Scoring

Scores are decision support, not objective truth.

Show:

- overall score;
- dimensions;
- contribution of each dimension;
- supporting evidence;
- missing evidence;
- scoring/model version;
- timestamp;
- recommendation.

Possible dimensions include demand strength, repetition, pain severity, buyer relevance, reachability, willingness-to-pay evidence, outcome potential, and execution feasibility.

## 10. Validation Workspace

Validation is an explicit gate.

Support:

- hypothesis;
- target customer/problem;
- evidence to collect;
- method;
- activity;
- observed result;
- decision;
- validator/operator;
- timestamp;
- supporting artifacts.

Decisions:

- Validated
- Rejected
- Parked
- Needs more evidence

A validated state requires persisted evidence. Until then, the solution may remain `null`.

## 11. Solution Selection

Only after sufficient validation should the UI ask:

> **What is the smallest appropriate intervention that can produce the desired outcome?**

Supported solution types may include:

- Digital
- Vertical workflow
- Productized service
- Custom service
- Automation
- Software
- Integration/connector
- Existing external tool
- No action / monitor

Digital and Vertical are dimensions inside one solution registry. They are not separate products.

Show:

- selected solution;
- why it fits;
- expected outcome;
- dependencies;
- evidence supporting the choice;
- alternatives considered;
- effort/constraints where known.

## 12. Execution Workspace

Execution exposes:

- goal;
- status;
- tasks/steps;
- responsible actor;
- dependencies;
- connector/tool use;
- retries/errors;
- artifacts;
- execution events;
- cancellation;
- audit trail.

State:

`READY → RUNNING → BLOCKED / FAILED / CANCELLED → COMPLETED`

Execution completion does not verify the business outcome.

## 13. Verification & Delivery

Verification is a separate stage.

Show:

- expected result;
- delivered artifact;
- verification criteria;
- actual evidence;
- verifier;
- timestamp;
- verification state;
- delivery state.

States:

- Pending
- Passed
- Failed
- Needs review

`Executed ≠ Delivered ≠ Verified Outcome`

## 14. Outcome UX

Show:

- expected outcome;
- actual observed outcome;
- metric/value;
- baseline/comparison when available;
- evidence source;
- verification state;
- customer acknowledgement when applicable;
- date range.

No verified-outcome badge may appear without persisted verification evidence.

## 15. Learning & Productization

Learning records show:

- original hypothesis;
- validated facts;
- failures;
- successful intervention;
- measured outcome;
- repeatability;
- related opportunities;
- productization recommendation.

Productization follows:

`Signal → Repeated Problem → Evidence → Validation → Pilot → Repeatable Outcome → Productization`

## 16. Connector UX

Connector settings show:

- provider/type;
- connection status;
- tenant/workspace scope;
- permissions/scopes;
- last successful use;
- last error;
- credential status without secrets;
- audit history.

Secrets are never rendered in plaintext. Provider-specific details remain behind the normalized Nura connector boundary.

## 17. Audit UX

Authorized users can inspect:

- actor;
- action;
- target entity;
- timestamp;
- correlation/request ID;
- state transition;
- source/connector;
- result;
- security-relevant events.

Audit records are read-only in normal application UX.

## 18. Roles & Permissions

Minimum conceptual roles:

- **Owner/Admin** — workspace, members, connectors, policies, audit.
- **Operator** — discovery, validation, solution, execution and verification according to permissions.
- **Reviewer/Verifier** — validation/verification responsibilities.
- **Client/Business User** — restricted relevant opportunities, delivery, verification and outcomes.

Authorization is enforced server-side; hidden UI controls are not security.

## 19. Human-in-the-Loop

Explicit confirmation is required for consequential actions such as:

- external communication;
- external publishing;
- production configuration changes;
- deletion;
- paid external actions;
- client-facing delivery;
- acceptance of a verified outcome where human verification is required.

Confirmation explains target, action, consequences, actor, and reversibility.

## 20. States, Errors, and Blocked UX

Every workflow needs intentional empty/loading/error/blocked states.

Empty states explain the next useful action. Loading states never fabricate values. Errors state what failed, persistence status, retry safety, recovery action, and correlation ID where useful. Blocked states identify missing prerequisites such as evidence, authorization, review, or validation.

## 21. Responsive & Accessibility

Desktop supports dense discovery/evidence workspaces. Mobile prioritizes triage, status review, approvals, execution monitoring, verification, and search/filter.

Minimum accessibility:

- keyboard access;
- visible focus;
- semantic headings/landmarks;
- adequate contrast;
- status not conveyed by colour alone;
- accessible labels;
- actionable form validation;
- non-essential motion only.

## 22. Visual System Direction

Use a professional operational-product language with clear hierarchy, restrained noise, strong lifecycle/status semantics, and distinct treatment for source evidence versus AI recommendations.

Avoid making Nura look like:

- a chatbot wrapper;
- generic AI playground;
- default marketplace catalogue;
- multiple disconnected products.

## 23. UX State Semantics

| State | Meaning |
|---|---|
| Captured | Signal recorded |
| Normalized | Signal structured |
| Context Discovered | Business context captured |
| Domain Observed | Domain candidate identified |
| Workflow Mapped | Workflow structure captured |
| Problem Identified | Problem pattern recorded |
| Evidence Collected | Supporting evidence attached |
| Scoring | Evidence evaluated |
| Validating | Validation active |
| Validated | Sufficient validation evidence exists |
| Solution Selected | Intervention chosen |
| Executing | Work in progress |
| Completed | Execution finished |
| Verifying | Result being checked |
| Delivered | Artifact/work delivered |
| Outcome Recorded | Outcome data recorded |
| Outcome Verified | Outcome evidence passed verification |
| Learned | Learning record captured |

These states must not be collapsed in a way that changes their meaning.

## 24. UX Acceptance Criteria

The implementation is acceptable only if:

1. A new unknown signal can enter Discovery without a predetermined industry or solution.
2. A user can follow one opportunity through context, domain, workflow, problem, evidence, validation, solution and outcome.
3. Domain candidates can exist without a solution.
4. Workflow and problem discovery are visible and persisted.
5. Evidence provenance is inspectable.
6. Scoring explanations are available.
7. Validation is distinct from scoring.
8. Digital and Vertical appear as solution dimensions, not separate products.
9. Execution and verification remain separate.
10. No UI claims verified outcome without persisted verification evidence.
11. Human confirmation exists for consequential actions.
12. Tenant/workspace context is always clear.
13. Connector credentials are never exposed.
14. Errors and blocked states provide recovery guidance.
15. Mobile and keyboard interaction remain usable for core workflows.
16. Authorized audit information is accessible.
17. AI recommendations are distinguishable from source facts.
18. No NuraHub product surface is introduced.
19. Nuralabs is not referenced as a Nura subsystem or dependency.
20. No fixed industry catalogue is required for discovery.

## 25. Implementation Guardrails

Do not fabricate demand, context, validation, execution, delivery, or outcomes. Do not imply capabilities that do not exist. Do not create separate product identities for Digital and Vertical. Do not introduce NuraHub or Nuralabs into the Nura architecture. Do not build screens whose underlying state cannot be persisted, authorized, and audited.

The frontend is a truthful representation of the Discovery Core and downstream platform state.

## 26. Canonical References

Read together with:

1. `docs/NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md`
2. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
3. `docs/NURA_DISCOVERY_CORE_SPEC.md`
4. `docs/NURA_DISCOVERY_CORE_HARDENING_AND_READINESS.md`
5. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
6. `docs/NURA_TECHNICAL_SPEC.md`
7. `docs/NURA_DATA_API_CONNECTOR_CONTRACT.md`
8. `docs/NURA_SECURITY_OWNERSHIP_CONTRACT.md`

If an older document conflicts with these canonical contracts, the current canonical architecture and Discovery Core contracts take precedence.
