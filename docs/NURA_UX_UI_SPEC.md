# Nura UX/UI Specification

**Status:** Canonical
**Version:** 1.0
**Date:** 2026-09-14

## 1. Purpose

This document defines the UX/UI contract for Nura as **one platform** with two primary business dimensions:

- **Digital** — digital products, services, automation, software, integrations, websites, dashboards, and digital operations.
- **Vertical** — validated workflows and solutions for real-world business verticals such as Barber, Cafe, and future verticals.

Digital and Vertical are dimensions of the same Nura platform, not separate products.

The interface must make the core operating loop visible:

`Demand Signal → Opportunity → Evidence + Scoring → Validation → Solution → Execution → Verification → Delivery → Outcome → Learning`

## 2. Canonical UX Principles

1. **Demand before solution.** The UI starts from evidence and opportunity, not from a catalogue of things Nura wants to sell.
2. **One Nura.** Navigation and visual identity must present one coherent platform.
3. **Digital and Vertical are dimensions.** They may be filters, solution classifications, or workspace contexts, but must not appear as unrelated products.
4. **Evidence is visible.** Users must be able to inspect where a claim came from and how strong the evidence is.
5. **AI is assistive, not magical.** Predictions, recommendations, summaries, and scores are explicitly labelled as AI-generated or inferred when applicable.
6. **Human control for consequential actions.** External publishing, client commitments, destructive actions, financial actions, or irreversible executions require explicit confirmation unless a separately authorized automation policy exists.
7. **Verification is separate from execution.** Completing a task does not automatically mean the business outcome is verified.
8. **No fake state.** The UI must never display a successful, verified, paid, or delivered state without the corresponding persisted evidence.
9. **Progressive disclosure.** Summary first; source evidence, scoring details, audit events, and technical metadata are available on demand.
10. **Outcome over activity.** The interface should make business outcomes more important than task counts.

## 3. Information Architecture

The primary application shell is:

```text
NURA
├── Overview
├── Demand
│   ├── Signals
│   └── Opportunities
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

The shell is a single Nura application. There is no separate NuraHub product surface.

## 4. Global Navigation

### Primary navigation

- Overview
- Demand
- Opportunities
- Validation
- Solutions
- Execution
- Verification
- Outcomes
- Learning

### Secondary navigation

- Workspace settings
- Connectors
- Members & roles
- Audit

### Global controls

Every authenticated workspace should expose:

- workspace selector when the user has multiple workspaces;
- search;
- current user/profile control;
- notifications where implemented;
- clear environment indicator for non-production environments;
- help/context affordance.

## 5. Overview Dashboard

The dashboard answers four questions:

1. What demand is arriving?
2. Which opportunities deserve attention?
3. What is currently being executed?
4. Which outcomes have actually been verified?

Recommended cards:

- New demand signals
- High-priority opportunities
- Opportunities awaiting validation
- Active executions
- Items awaiting verification
- Verified business outcomes
- Productization candidates

The dashboard must distinguish counts by evidence/state rather than presenting every signal as an opportunity or every opportunity as validated demand.

## 6. Demand Signals

### Signal list

Each signal row/card should expose:

- source;
- captured time;
- short normalized summary;
- source type;
- evidence status;
- current processing state;
- related opportunity, if any;
- confidence/evidence strength where meaningful.

Filters:

- source;
- date range;
- status;
- evidence level;
- workspace;
- related/unrelated opportunity.

### Signal detail

Show:

- original/normalized content where permitted;
- source/provenance;
- capture metadata;
- extraction/normalization notes;
- related evidence;
- linked opportunity;
- audit history.

Never imply that a single public mention is automatically validated market demand.

## 7. Opportunity Management

### Opportunity list

Primary columns/cards:

- Opportunity title
- Problem statement
- Demand/evidence strength
- Score
- Validation status
- Solution direction
- Current execution state
- Last updated

### Opportunity workspace

The detail view should use a clear progression:

```text
Problem
  ↓
Evidence
  ↓
Score
  ↓
Validation
  ↓
Solution
  ↓
Execution
  ↓
Verification
  ↓
Outcome
```

Each stage should show its state and the evidence required to move forward.

## 8. Evidence & Provenance UX

Evidence should be inspectable without overwhelming the main workflow.

Recommended presentation:

- Evidence level badge: Observed / Inferred / Validated / Paid-Adopted / Outcome Verified.
- Source label.
- Timestamp.
- Source reference when lawful and available.
- Extraction/interpretation note.
- Evidence strength or confidence.
- Link to related signals.

The UI must clearly distinguish **source fact** from **Nura interpretation**.

## 9. Scoring UX

Scores must be explainable.

A score view should include:

- overall score;
- component dimensions;
- contribution of each dimension;
- supporting evidence;
- missing evidence;
- scoring version/model identifier when applicable;
- timestamp;
- recommendation generated from the score.

Example dimensions:

- Demand strength
- Frequency/repetition
- Pain severity
- Buyer relevance
- Reachability
- Willingness-to-pay evidence
- Outcome potential
- Execution feasibility

AI-generated scores must not be presented as objective truth.

## 10. Validation Workspace

Validation is an explicit workflow, not a decorative status.

The UI should support:

- validation hypothesis;
- target customer/problem;
- evidence to collect;
- validation method;
- validation activity;
- observed result;
- decision;
- validator/operator;
- timestamp;
- supporting artifacts.

Possible decisions:

- Validated
- Rejected
- Parked
- Needs more evidence

A validated status requires persisted validation evidence.

## 11. Solution Selection

The solution screen should answer: **What is the smallest appropriate intervention that can produce the desired outcome?**

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

Digital and Vertical are classification dimensions inside this registry.

The UI should show:

- selected solution;
- why it fits the opportunity;
- expected outcome;
- dependencies;
- estimated effort;
- evidence supporting the choice;
- alternative options considered where useful.

## 12. Execution Workspace

Execution is where a selected solution becomes work.

The UI should expose:

- execution status;
- goal;
- tasks/steps;
- responsible actor;
- dependencies;
- connector/tool usage;
- retry/error state;
- artifacts;
- execution events;
- cancellation control;
- audit trail.

Recommended state visualization:

`READY → RUNNING → BLOCKED / FAILED / CANCELLED → COMPLETED`

Completion means execution finished. It does not mean the business outcome is verified.

## 13. Verification & Delivery

Verification must be a dedicated stage.

The screen should show:

- expected result;
- delivered artifact(s);
- verification criteria;
- actual evidence;
- verifier;
- verification timestamp;
- verification status;
- delivery status.

Possible verification states:

- Pending
- Passed
- Failed
- Needs review

A green execution completion state must not automatically turn the outcome into verified.

## 14. Outcome UX

Outcome records should focus on measurable business results.

Show:

- expected outcome;
- actual observed outcome;
- metric/value where applicable;
- baseline/comparison when available;
- evidence source;
- verification state;
- customer/client acknowledgement where applicable;
- date range.

The UI should distinguish:

`Executed ≠ Delivered ≠ Verified Outcome`

## 15. Learning & Productization

Learning records capture what happened after execution and verification.

Show:

- original hypothesis;
- what was validated;
- what failed;
- what worked;
- measured outcome;
- repeatability indicators;
- related opportunities;
- productization recommendation.

Productization should visually follow:

`Signal → Repeated Problem → Evidence → Validation → Pilot → Repeatable Outcome → Productization`

No productization badge should appear merely because an operator likes an idea.

## 16. Connector UX

Connector settings should be operational and security-aware.

Each connector should show:

- connector name/type;
- provider;
- connection status;
- scope;
- owning tenant/workspace;
- last successful use;
- last error;
- credential status without exposing secrets;
- permissions/scopes;
- audit history.

Secrets must never be rendered in plaintext.

Connector execution should display the provider through a normalized Nura action/result abstraction rather than coupling the user experience to provider-specific implementation details.

## 17. Audit UX

Audit views should allow authorized users to inspect:

- actor;
- action;
- target entity;
- timestamp;
- request/correlation identifier where available;
- result;
- relevant state transition;
- source/connector;
- security-relevant events.

Audit records are read-only from the normal application UI.

## 18. Roles & Permissions

The UI should reflect server-side authorization rather than treating hidden buttons as security.

Minimum conceptual roles:

- **Owner/Admin** — workspace administration, members, connectors, policy, audit.
- **Operator** — demand, opportunities, validation, solution selection, execution, verification workflows according to granted permissions.
- **Reviewer/Verifier** — validation and verification responsibilities without broad administrative access.
- **Client/Business User** — restricted access to relevant opportunities, deliverables, verification, and outcomes.

The exact permission matrix is defined by the security/ownership contract, not inferred from the frontend.

## 19. Human-in-the-Loop Controls

Require explicit confirmation before consequential actions such as:

- sending external communications;
- publishing externally;
- changing production configuration;
- deleting records/artifacts;
- triggering paid external actions;
- committing a client-facing delivery;
- accepting a verified outcome when human verification is required.

Confirmation dialogs should state:

- what will happen;
- target;
- important consequences;
- actor;
- whether the action is reversible.

## 20. Empty, Loading, Error, and Blocked States

Every major workflow must have intentional states.

### Empty

Explain why there is no data and provide the next useful action.

### Loading

Use skeletons or progressive loading without fabricating values.

### Error

Show:

- what failed;
- whether data was persisted;
- whether retry is safe;
- recovery action;
- correlation/reference ID where useful.

### Blocked

Explain the missing prerequisite, such as missing evidence, connector authorization, required review, or unresolved validation.

## 21. Responsive and Mobile UX

Nura should be usable on desktop and mobile.

Desktop prioritizes multi-column operational workspaces and evidence inspection.

Mobile prioritizes:

- opportunity triage;
- status review;
- approvals/confirmations;
- execution monitoring;
- verification decisions;
- essential search/filter actions.

Dense tables should collapse into readable cards or horizontally scroll only when necessary.

## 22. Accessibility

Minimum requirements:

- keyboard-accessible interactive controls;
- visible focus states;
- semantic headings and landmarks;
- sufficient text/background contrast;
- status communicated without colour alone;
- accessible labels for icons and controls;
- form validation that identifies the problem and recovery action;
- motion kept optional/non-essential.

## 23. Visual System Direction

Nura should use a professional operational-product visual language:

- clear hierarchy;
- restrained visual noise;
- strong status semantics;
- evidence and provenance visually distinct from AI recommendations;
- consistent badges for lifecycle/evidence states;
- predictable primary/secondary/destructive actions.

Avoid visual treatment that makes Nura look like:

- a chatbot wrapper;
- a generic AI playground;
- a marketplace catalogue by default;
- multiple disconnected products.

## 24. UX State Semantics

The UI should preserve these distinctions:

| State | Meaning |
|---|---|
| Captured | Signal was recorded |
| Normalized | Signal was structured |
| Scoring | Evidence is being evaluated |
| Validating | Validation activity is active |
| Validated | Sufficient validation evidence exists |
| Solution Selected | An intervention has been chosen |
| Executing | Work is in progress |
| Completed | Execution finished |
| Verifying | Result is being checked |
| Delivered | Artifact/work was delivered |
| Outcome Recorded | Outcome data was recorded |
| Outcome Verified | Outcome evidence passed verification |
| Learned | Learning record captured |

These states must not be collapsed merely for visual simplicity.

## 25. UX Acceptance Criteria

The UX/UI implementation is acceptable only if:

1. A user can follow one opportunity from signal through outcome without losing context.
2. Evidence provenance is inspectable.
3. Scoring explanations are available.
4. Validation is visibly distinct from scoring.
5. Digital and Vertical appear as solution dimensions, not separate products.
6. Execution and verification are separate states/screens or clearly separate stages.
7. No UI claims an outcome is verified without persisted verification evidence.
8. Human confirmation exists for consequential actions.
9. Tenant/workspace context is always clear.
10. Connector status and credential state are visible without exposing secrets.
11. Errors and blocked states provide recovery guidance.
12. Mobile and keyboard interaction remain usable for core workflows.
13. Audit information is accessible to authorized users.
14. AI-generated recommendations are distinguishable from source facts.
15. No NuraHub product surface is introduced.
16. Nuralabs is not referenced as a Nura subsystem or dependency.

## 26. Implementation Guardrails

Do not implement UI merely to make the product appear complete.

Do not:

- fabricate demand data;
- fabricate validation results;
- fabricate verified outcomes;
- expose secrets;
- imply autonomous capabilities that do not exist;
- create separate product identities for Digital and Vertical;
- introduce NuraHub as a product;
- introduce Nuralabs as a Nura dependency;
- build screens whose underlying state cannot be persisted or audited.

The frontend is a truthful representation of the platform state and operating loop.

## 27. Canonical Reference

This UX/UI specification must be read together with:

1. `docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`
2. `docs/NURA_PRODUCT_REQUIREMENTS_AND_MVP_SPEC.md`
3. `docs/NURA_TECHNICAL_SPEC.md`

If an older document conflicts with these canonical documents, the canonical architecture and current technical contract take precedence.
