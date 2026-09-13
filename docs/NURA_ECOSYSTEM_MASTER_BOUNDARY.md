# Nura Ecosystem Master Boundary

## 1. Purpose

This document defines the canonical relationship between the Nura brand, its business lines, the platform surface, and the shared execution core.

```text
Nura
  ↓
NuraHub / NuraDigital / NuraVertical
  ↓
Nuralabs Core
  ↓
Execution
```

Nura is the commercial and product ecosystem. Nuralabs is the reusable execution infrastructure underneath it.

## 2. Brand Hierarchy

### Nura

Master brand. It represents the complete ecosystem rather than one technical product or one service category.

### NuraHub

Primary platform and entry point. It connects a user's need to the correct Nura business line and exposes workspace, status, results, and cross-line experiences.

### NuraDigital

Business line for broad, reusable digital needs: websites, software, automation, dashboards, APIs/integrations, design assets, and digital operations.

### NuraVertical

Business line for needs grounded in real-world verticals and operational workflows. Examples for discovery include Barber and Cafe.

### Nuralabs Core

Shared AI Work & Execution Core. It performs the actual work and provides common reliability, validation, evidence, artifact, policy, and audit capabilities.

## 3. Demand Model

Nura does not begin by assuming a product should exist.

```text
Real Demand
→ Opportunity
→ Validation
→ Product Surface
→ Nuralabs Execution
→ Verified Outcome
→ Learning
```

Demand can originate from social platforms, marketplaces, communities, direct requests, real businesses, operational activity, web signals, or existing customer workflows. Threads is only one possible source.

## 4. Digital vs Vertical Boundary

Use **NuraDigital** when the problem is broadly reusable across industries.

Use **NuraVertical** when the problem depends materially on domain terminology, domain data, business rules, or operational workflows.

A vertical must not be created merely because an industry name sounds attractive.

## 5. Multi-Deployment Principle

Nura should initially favor one codebase/monorepo with multiple deployments where practical.

The deployments may include:

- NuraHub
- NuraDigital
- NuraVertical

Separate repositories become justified only when technical, security, data, team, release, or operational boundaries require them.

## 6. Naming Decision

NuraWeb/NuraWebs is not the master platform identity. Web work remains an important NuraDigital wedge but does not define the ecosystem.

## 7. Non-Goals

Do not prematurely build:

- a giant all-in-one marketplace;
- every possible vertical;
- a website-only identity;
- duplicated execution engines;
- features without demand evidence;
- fake autonomous execution or simulated completion.

## 8. North Star

**Verified Business Outcomes per Active Tenant per Month.**
