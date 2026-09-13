# Nura

**Nura is one platform.**

Nura connects real business demand with the right digital or vertical solution and drives the work toward a verified business outcome.

> **Demand first → Product second → Execution always.**

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
                    Shared Platform
                           │
             Demand → Validate → Execute
                           │
                    Verify → Deliver
                           │
                    Business Outcome
```

### Digital

The Digital line covers needs such as websites, landing pages, business applications, automation, software, APIs/integrations, dashboards, digital assets, and digital operations.

### Vertical

The Vertical line covers needs rooted in real-world business workflows. Initial discovery examples may include Barber, Cafe, and other verticals, but a vertical is only productized after real activity, recurring problems, evidence, validation, and measurable outcomes.

## Important Naming Decision

- **Nura** = the platform and master product identity.
- **Digital** = business line / capability dimension inside Nura.
- **Vertical** = business line / capability dimension inside Nura.
- **Hub** = optional internal UX/navigation terminology; **not a separate product**.
- **Nuralabs** = **not part of Nura's product architecture**.

Nura does not depend on a product or subsystem named Nuralabs. Any separate Nuralabs repository/project is independent from this Nura architecture.

## Platform Flow

```text
Demand Signal
    ↓
Opportunity
    ↓
Evidence + Scoring
    ↓
Validation
    ↓
Digital / Vertical Solution
    ↓
Execution
    ↓
Verification
    ↓
Delivery
    ↓
Verified Business Outcome
    ↓
Learning
```

The user should experience this as **one Nura platform**, not as a collection of internal products.

## Architecture Principle

**One platform, modular internals.**

Nura may use one codebase with multiple routes, surfaces, or deployments when that improves operations, but artificial product separation must not be introduced without a real technical or business reason.

## Productization Rule

```text
Signal → Repeated Problem → Evidence → Validation → Pilot → Repeatable Outcome → Productization
```

Nura should not build a large product merely because a market sounds attractive.

## North Star

**Verified Business Outcomes per Active Tenant per Month.**

## Canonical Architecture

See [`docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md`](docs/NURA_FINAL_CONCEPT_AND_ARCHITECTURE.md) for the final concept and architecture boundary.
