# NuraHub Product Blueprint

## Role

NuraHub is the primary platform and front door of the Nura ecosystem.

It is not merely a landing page, chatbot, dashboard, or website builder.

## Core User Flow

```text
User Need
   ↓
NuraHub
   ↓
Intent / Need Routing
   ├── NuraDigital
   ├── NuraVertical
   └── Cross-domain
   ↓
Nuralabs Core
   ↓
Verified Outcome
```

## Core Responsibilities

1. Identity/session boundary.
2. Workspace entry.
3. Need/request creation.
4. Intent and business-line routing.
5. Task status and execution visibility.
6. Result and artifact presentation.
7. Cross-line navigation.
8. Feedback and learning capture.

## MVP Surface

The first useful NuraHub should make one thing obvious:

> **Apa yang ingin kamu selesaikan?**

A request becomes a task/opportunity, is routed to Digital or Vertical, executed by Nuralabs Core, and returns an observable result.

## Boundary

NuraHub should not duplicate the execution engine. It consumes stable Core interfaces such as model/provider routing, tool registry, state, artifacts, policy, validation, and audit capabilities.

## Multi-Deployment

NuraHub may be deployed separately from NuraDigital and NuraVertical while sharing the same codebase when practical. Configuration and routing determine the deployment surface; security and tenant/data boundaries remain explicit.

## Success Signal

The MVP is successful when a real user can submit a meaningful need, see where it is routed, observe legitimate execution, and receive a verified artifact or business result.

No simulated completion should be presented as real execution.
