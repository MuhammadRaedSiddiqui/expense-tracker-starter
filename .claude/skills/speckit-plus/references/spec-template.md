# Spec Template (spec.md)

Use this template when `/sp.specify` isn't available or you're writing specs manually.

---

```markdown
# Feature: <Feature Name>

**Feature ID:** <NNN>
**Branch:** <NNN>-<feature-slug>
**Status:** Draft | Review | Approved
**Created:** <date>

---

## Overview

[1-3 sentences describing what is being built and why. Focus on value, not implementation.]

---

## Goals

- [Primary goal 1]
- [Primary goal 2]

## Non-Goals (Out of Scope)

- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

---

## User Stories

### Story 1: <Short Title>

**As a** [role],
**I want to** [action],
**So that** [outcome / value].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [result]
- [ ] ...

### Story 2: <Short Title>

**As a** [role],
**I want to** [action],
**So that** [outcome].

**Acceptance Criteria:**
- [ ] ...

---

## Functional Requirements

### FR-01: [Requirement Name]
[Description of the requirement]

### FR-02: [Requirement Name]
[Description]

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | [e.g., API response < 200ms at p95] |
| Security | [e.g., All endpoints require authentication] |
| Scalability | [e.g., Support 10k concurrent users] |
| Accessibility | [e.g., WCAG 2.1 AA compliance] |
| Reliability | [e.g., 99.9% uptime SLA] |

---

## UI/UX Considerations

[Describe key UX flows, screen layouts, or interaction patterns if relevant. Link to designs if available.]

---

## Data Requirements

[Describe key data entities, relationships, or constraints. Full schema goes in plan.md → data-model.md.]

---

## Integration Points

- [External service or API 1]
- [Internal service 2]

---

## Assumptions

- [Assumption 1]
- [Assumption 2]

---

## Open Questions

- [ ] [Unresolved question 1]
- [ ] [Unresolved question 2]

---

## Clarifications

[This section is populated by /sp.clarify. Do not edit manually until clarification is complete.]

| Question | Answer | Date |
|----------|--------|------|
| | | |

---

## Review & Acceptance Checklist

- [ ] All user stories have acceptance criteria
- [ ] Functional requirements are numbered and testable
- [ ] Non-functional requirements are specified and measurable
- [ ] Out-of-scope items are explicitly listed
- [ ] Open questions are documented
- [ ] Spec reviewed by stakeholder
```
