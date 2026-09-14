# Brand Naming Research Prompt

## Purpose

This document is the master prompt for Genspark.ai to discover the strongest future-facing product/brand name for this system.

The task is **naming research only**. Do not modify application code, architecture, database schema, product scope, roadmap, or existing documentation except to create/update the final naming research artifact requested by the operator.

The existing system was previously called **Nura**. Treat that name as a historical/internal identifier only. Do not preserve, defend, or extend the Nura brand. The candidate **Veyra** was also explored, but it is **not locked** and must be evaluated like every other candidate.

---

## Core Objective

Analyze the entire existing repository and product concept first, then determine what the product fundamentally **is**, what role it plays, and what brand identity naturally follows from that.

The goal is NOT to invent a name that merely sounds like an AI startup.

The goal is to find a name that:

- genuinely fits the product's identity;
- can survive major product expansion;
- is easy to remember and pronounce;
- does not depend on a temporary feature or technology;
- does not need to literally describe every part of the architecture;
- feels credible as a serious software/platform business;
- is distinct enough to build a defensible identity around;
- avoids strong existing conflicts with software, AI platforms, SaaS products, companies, or brands;
- can become the public-facing identity without forcing a redesign of the underlying system.

---

## Repository Context You Must Understand

Before generating names, inspect the repository, especially:

- `README.md`
- all relevant files under `docs/`
- product/architecture documentation
- current phase documentation
- Discovery Core definitions
- data lineage and domain model
- current roadmap and future phases
- user/product flows
- security and deployment assumptions
- any existing positioning language

Do not infer the product solely from its current repository name.

### Known product philosophy

The system follows:

> **Demand First → Context First → Solution Second → Execution Always**

The broader product journey is approximately:

> **Reality → Demand → Context → Opportunity → Evidence → Decision → Solution → Execution → Outcome → Learning**

The current data lineage is approximately:

> **Tenant → Workspace → DemandSignal → Opportunity → BusinessContext → DomainCandidate → solution**

The system is intended to move from observed real-world demand toward validated opportunity, decision, execution, and verified learning.

### Important architectural distinction

The product itself is the platform/system.

**Discovery Core is an internal/core capability, not necessarily the public product name.**

Digital and vertical solutions are dimensions/extensions of the system, not separate products that should dictate the master brand.

Do not force a fixed industry catalogue or narrow vertical identity onto the brand.

---

# Phase 1 — Understand the Product

Before naming anything, produce a concise internal analysis covering:

1. What problem does the system actually solve?
2. Who is the primary user/operator?
3. What is the system's unique job?
4. What is the difference between the system and a generic AI assistant?
5. What does the system become when fully developed?
6. Which concepts are foundational and which are temporary implementation details?
7. What should the brand still mean if the product expands significantly in 3–5 years?

Do not start naming until this analysis is complete.

---

# Phase 2 — Identify Naming Territories

Generate several conceptual naming territories based on the product analysis.

Potential territories may include, but are not limited to:

- discovery
- sensing
- interpretation
- opportunity
- direction
- decision
- action
- movement
- transformation
- connection
- context
- evidence
- clarity
- momentum
- orchestration
- operating intelligence

Do NOT assume these words must appear in the final name.

A strong brand may be metaphorical rather than literal.

---

# Phase 3 — Generate Candidates

Generate **at least 30 serious candidates** across different naming styles:

- real-word names
- metaphorical names
- compound names
- subtle coined names
- conceptual names
- names derived from meaningful linguistic roots

Avoid meaningless random syllable combinations unless there is a compelling semantic reason.

For every candidate provide:

- Name
- Pronunciation
- Literal/root meaning
- Intended product meaning
- Why it fits this specific system
- Brand personality
- Potential weaknesses
- Whether it sounds too generic/AI-ish

---

# Phase 4 — Aggressive Elimination

Eliminate candidates that:

- are obviously generic;
- sound like a typical 2026 AI startup;
- are difficult to pronounce;
- are difficult to spell;
- are too narrow to survive product expansion;
- are strongly associated with unrelated major companies;
- are already strongly used by software/SaaS/AI products;
- create obvious trademark/brand confusion;
- depend on a temporary feature;
- are only attractive because they sound premium;
- cannot answer the question: **"Why does this name belong to this product?"**

Do not protect a candidate simply because it was previously suggested by the operator or another AI.

---

# Phase 5 — Existing-Use / Conflict Research

For the strongest candidates, perform web research.

Check at minimum:

- existing companies;
- software/SaaS products;
- AI products/platforms;
- GitHub projects;
- domains;
- social/brand presence where relevant;
- obvious trademark conflicts where searchable.

Prioritize conflicts in the **same or adjacent category**.

Do not claim legal trademark clearance. This is preliminary brand-conflict research only.

For each serious conflict, record:

- existing name;
- entity/product;
- category;
- geographic relevance if apparent;
- similarity risk;
- recommendation.

---

# Phase 6 — Deep Comparison

Select the strongest **5 candidates**.

Score each from 1–10 on:

| Criterion | Weight |
|---|---:|
| Product/concept fit | 25% |
| Long-term identity | 20% |
| Brand memorability | 15% |
| Distinctiveness | 15% |
| Expansion flexibility | 10% |
| Pronunciation/spelling | 5% |
| Existing-use risk | 10% |

Show both raw scores and weighted score.

Do not allow a beautiful-sounding name to win if its product fit is weak.

Do not allow a highly descriptive name to win if it is impossible to own as a brand.

---

# Phase 7 — Final Recommendation

Recommend **ONE primary name**.

Also provide:

- 2 backup names;
- one-sentence explanation of why the primary name fits;
- product positioning sentence;
- possible tagline;
- brand personality;
- what the name should NOT be associated with;
- major naming risks;
- preliminary domain/brand conflict notes.

The recommendation must answer:

> **Why does this name belong to this product?**

in one strong, natural paragraph.

Do not select a name merely because it is available.

Do not select a name merely because it sounds sophisticated.

The best candidate must balance **meaning + identity + distinctiveness + longevity + practical brandability**.

---

# Critical Constraints

## 1. Do not redesign the product

Naming research must not trigger changes to:

- architecture;
- database schema;
- APIs;
- workflows;
- security model;
- roadmap;
- product philosophy.

## 2. Do not overfit the current implementation

The product will evolve. The name must survive future phases.

## 3. Do not overfit the word "AI"

AI is an enabling technology, not necessarily the product identity.

## 4. Do not overfit "Discovery Core"

Discovery Core is an internal capability. It does not have to become the public brand.

## 5. Do not preserve Nura sentimentally

Nura is a previous identity. It should not bias the naming decision.

## 6. Do not automatically choose Veyra

Veyra is only a previously explored candidate. It must compete objectively with newly generated candidates.

## 7. Do not manufacture certainty

If no candidate is strong enough, explicitly say so and return the top candidates plus the remaining uncertainty instead of forcing a final answer.

---

# Required Output

Create a research report with this exact high-level structure:

1. `PRODUCT ESSENCE`
2. `NAMING THESIS`
3. `NAMING TERRITORIES`
4. `30+ CANDIDATES`
5. `ELIMINATION LOG`
6. `TOP 5`
7. `CONFLICT / AVAILABILITY RESEARCH`
8. `WEIGHTED COMPARISON`
9. `FINAL RECOMMENDATION`
10. `BACKUP NAMES`
11. `POSITIONING + TAGLINE`
12. `RISKS + OPEN QUESTIONS`

At the end, state clearly:

> **RECOMMENDATION: [NAME]**

or, if no candidate is strong enough:

> **RECOMMENDATION: DO NOT LOCK YET**

---

# Final Principle

Do not try to create a name that explains the entire system.

Create a name that gives the system a strong identity.

The product will give the name its meaning over time.

**Find the name that feels earned by the product — not a name that is merely attached to it.**
