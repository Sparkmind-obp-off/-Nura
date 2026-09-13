# Nura

**Nura is one platform.**

Nura discovers real business demand and context, identifies validated problems, selects the right digital or vertical solution, and drives execution toward a verified business outcome.

> **Demand First → Context First → Solution Second → Execution Always.**

## Final Product Structure

```text
                         NURA
                           │
              ┌────────────┴────────────┐
              │                         │
           DIGITAL                   VERTICAL
              │                         │
              └────────────┬────────────┘
                           │
                    SHARED PLATFORM
                           │
             Demand → Context → Solution
                           │
                    Execute → Verify
                           │
                    Business Outcome
```

### Digital

The Digital dimension covers needs such as websites, landing pages, business applications, automation, software, APIs/integrations, dashboards, digital assets, and digital operations.

### Vertical

The Vertical dimension covers contextual needs rooted in real-world business workflows.

**Verticals are discovered, not hardcoded.** A domain such as Barber, Cafe, Snack Distribution, Logistics, Clinic, Farming, Property, Manufacturing, or another domain may emerge from real evidence. These are examples of possible discoveries, not a fixed Nura industry catalogue.

## Important Naming Decision

- **Nura** = the platform and master product identity.
- **Digital** = business/solution dimension inside Nura.
- **Vertical** = contextual business/solution dimension inside Nura.
- **Hub** = optional internal UX/navigation terminology; **not a separate product**.
- **Nuralabs** = **not part of Nura's product architecture**.

Nura does not depend on a product or subsystem named Nuralabs. Any separate Nuralabs repository/project is independent from this Nura architecture.

## Platform Flow

```text
Real World
    ↓
Demand Signal
    ↓
Opportunity
    ↓
Domain / Business Context
    ↓
Workflow
    ↓
Problem
    ↓
Evidence + Scoring
    ↓
Validation
    ↓
Digital / Vertical / Existing Tool / Service / Automation / Integration / No Action
    ↓
Execution
    ↓
Verification
    ↓
Verified Business Outcome
    ↓
Learning
```

The user should experience this as **one Nura platform**, not as a collection of internal products.

## Architecture Principle

**One platform, modular internals.**

The platform must be capable of discovering a new business domain without redesigning the core architecture. Domain discovery is a platform capability; it is not a fixed menu of vertical products.

## Productization Rule

```text
Signal → Repeated Problem → Evidence → Validation → Pilot → Repeatable Outcome → Productization
```

A domain becomes a strong productization candidate only when the problem and outcome are sufficiently repeated and validated across real activity.

## North Star

**Verified Business Outcomes per Active Tenant per Month.**

## Canonical Architecture

See:

- [`docs/NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md`](docs/NURA_CONTEXT_FIRST_CANONICAL_AMENDMENT.md) — highest-priority context-first amendment.
- [`docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`](docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md) — final concept and architecture boundary.
- [`docs/NURA_VERTICAL_DISCOVERY_SPEC.md`](docs/NURA_VERTICAL_DISCOVERY_SPEC.md) — domain/vertical discovery contract.
