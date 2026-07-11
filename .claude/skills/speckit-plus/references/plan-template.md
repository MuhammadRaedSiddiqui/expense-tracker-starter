# Plan Template (plan.md)

Use this template when `/sp.plan` isn't available or you're writing plans manually.

---

```markdown
# Implementation Plan: <Feature Name>

**Feature ID:** <NNN>
**Spec:** `specs/<NNN>-<slug>/spec.md`
**Status:** Draft | Review | Approved
**Created:** <date>

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | [e.g., Python] | [e.g., 3.12] |
| Framework | [e.g., FastAPI] | [e.g., 0.115] |
| Database | [e.g., PostgreSQL] | [e.g., 16] |
| Frontend | [e.g., Next.js] | [e.g., 15] |
| Runtime | [e.g., Docker + Kubernetes] | |
| AI SDK | [e.g., OpenAI Agents SDK] | |

---

## Architecture Overview

[High-level description of the system architecture. Include component diagram in ASCII or link to diagram file.]

```
[Client] → [API Gateway] → [Service A] → [Database]
                         → [Service B] → [Queue]
```

---

## Components

### Component 1: [Name]

**Responsibility:** [What it does]
**Technology:** [Stack]
**Interfaces:** [APIs it exposes or consumes]

### Component 2: [Name]

**Responsibility:**
**Technology:**
**Interfaces:**

---

## Data Model

[See `data-model.md` for full schema. Summarize key entities here.]

Key entities:
- `User` — [description]
- `Project` — [description]
- `Task` — [description]

---

## API Design

[See `contracts/api-spec.json` for OpenAPI spec. Summarize key endpoints here.]

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project |
| ... | | |

---

## Security Design

- Authentication: [e.g., JWT via OAuth2]
- Authorization: [e.g., RBAC with roles: admin, member]
- Data encryption: [e.g., AES-256 at rest, TLS 1.3 in transit]

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Database schema & migrations
- [ ] Core models and repositories
- [ ] Basic API scaffolding

### Phase 2: Core Features
- [ ] [User story 1 implementation]
- [ ] [User story 2 implementation]

### Phase 3: Polish & Production
- [ ] Error handling & logging
- [ ] Tests (unit + integration)
- [ ] CI/CD pipeline
- [ ] Documentation

---

## Dependencies & Prerequisites

```bash
# Example for Python project
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary

# Example for Node project
npm install next react react-dom @vercel/ai
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `SECRET_KEY` | App secret key | `<random-256-bit>` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |

---

## Testing Strategy

- **Unit tests:** [Framework, coverage target]
- **Integration tests:** [Scope]
- **E2E tests:** [Tool, key flows]

---

## Deployment

[Describe deployment target: Docker, Kubernetes, serverless, etc.]

```bash
# Example build and deploy
docker build -t my-app:latest .
kubectl apply -f k8s/
```

---

## Research Notes

[See `research.md` for detailed research. Key findings:]

- [Finding 1]
- [Finding 2]

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk 1] | Medium | High | [Mitigation] |

---

## Checklist

- [ ] Tech stack validated against constitution
- [ ] All spec requirements addressed
- [ ] Data model reviewed
- [ ] API contracts defined
- [ ] Security design complete
- [ ] Research.md updated
```
