# Nura

**Nura** is a business ecosystem built around one principle:

> **Demand first → Product second → Execution always.**

Nura connects real demand, digital services, real-world business verticals, and an AI execution core.

## Ecosystem

```text
Nura
├── NuraHub       → primary platform / entry point
├── NuraDigital   → digital business needs
├── NuraVertical  → real-world vertical needs
└── Nuralabs Core → shared AI Work & Execution Core
```

The operating flow is:

```text
Real Demand
    ↓
Opportunity
    ↓
Validation
    ↓
Product / Service Surface
    ↓
Nuralabs Core
    ↓
Build → Run → Verify → Deliver
    ↓
Verified Business Outcome
    ↓
Learning
```

## NuraHub

NuraHub is the front door of the ecosystem. It helps a user express what they want to solve and routes that need into the appropriate Nura business line.

## NuraDigital

NuraDigital handles reusable digital needs such as websites, business applications, automation, software, APIs/integrations, dashboards, design assets, and digital operations.

## NuraVertical

NuraVertical handles needs rooted in real-world business operations. Initial discovery examples include **Nura Barber** and **Nura Cafe**. A vertical is only productized after real activity, recurring problems, workflow evidence, and validation.

## Nuralabs Core

Nuralabs is the shared execution engine. It is responsible for planning, tool execution, sandboxed work, workflow state, validation, evidence/provenance, artifacts, approvals/policy, retries/recovery, and delivery.

Nuralabs is not a branding layer or a clone of another AI product. It is the execution infrastructure underneath Nura.

## Architecture Principle

One codebase may serve multiple Nura deployments when application boundaries, configuration, secrets, routing, tenant isolation, and data boundaries remain explicit.

Target deployments:

- NuraHub
- NuraDigital
- NuraVertical

Separate repositories should only be introduced when a real technical or operational reason appears.

## Product Boundary

Nura is the business ecosystem.

NuraHub is the platform entry point.

NuraDigital and NuraVertical are business lines.

Nuralabs Core is the shared execution engine.

The ecosystem is intentionally designed to avoid building large products before demand is demonstrated.

## North Star

**Verified Business Outcomes per Active Tenant per Month.**

## Status

This repository is the initial Nura concept and product-boundary source of truth. Implementation should follow the documented boundaries before expanding into product features.
