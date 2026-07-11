---
name: speckit-plus
description: >
  Use this skill whenever the user wants to do Spec-Driven Development with spec-kit-plus (also known as specifyplus or SpecifyPlus). Triggers include: any mention of "spec-kit-plus", "specifyplus", "sp init", "sp.specify", "sp.plan", "sp.implement", "/sp.", "spec-driven development", "spec-driven vibe coding", "specifyplus CLI", "create a spec file", "write a spec", "scaffold a project with specs", "initialize a specifyplus project", or "install specifyplus". Also trigger when the user wants to plan a software project using structured AI-driven specifications, create constitution/spec/plan/tasks files, or use slash commands like /sp.constitution, /sp.specify, /sp.plan, /sp.tasks, /sp.implement. Even if the user just says "let's use spec kit" or "set up spec driven dev" — use this skill.
compatibility:
  tools:
    - bash
    - read_file
    - write_file
  requirements:
    - Python 3.11+
    - uv or pip
    - git
    - Claude Code CLI (claude)
---

# Spec-Kit Plus Skill

This skill guides Claude Code through the full Spec-Driven Development (SDD) workflow using **specifyplus** (`sp`): reading project context, installing the CLI, and generating structured spec artifacts.

---

## Overview of Spec-Driven Development

Spec-Driven Development flips traditional coding: **specifications become first-class artifacts** that directly drive AI code generation. The workflow is:

```
constitution → specify → clarify → plan → tasks → implement
```

All artifacts live in a `.specify/` directory inside the project.

---

## Step 0 — Read Project Context

Before doing anything, read the user's project to understand what already exists.

```bash
# Check if specifyplus is already initialized
ls -la .specify/ 2>/dev/null || echo "No .specify directory found"

# Read existing docs
for f in README.md CLAUDE.md .specify/memory/constitution.md; do
  [ -f "$f" ] && echo "=== $f ===" && cat "$f"
done

# Check if specifyplus is installed
which sp || which specifyplus || echo "specifyplus not installed"
```

If `.specify/` already exists, read the current specs before proceeding:

```bash
find .specify/specs -name "*.md" 2>/dev/null | head -20 | xargs -I{} sh -c 'echo "=== {} ===" && cat {}'
```

---

## Step 1 — Install specifyplus

```bash
# Check Python version (needs 3.11+)
python3 --version

# Install via pip (preferred in Claude Code environments)
pip install specifyplus --break-system-packages

# Or via uv (if available)
uv tool install specifyplus

# Verify installation
sp --help || specifyplus --help
```

If pip fails due to network restrictions, try:

```bash
pip install specifyplus --break-system-packages --index-url https://pypi.org/simple/
```

---

## Step 2 — Initialize the Project

```bash
# In a new directory:
sp init <project_name> --ai claude

# Or in the current directory:
sp init . --ai claude
# or
sp init --here --ai claude

# Force overwrite if directory is non-empty:
sp init . --force --ai claude

# Skip AI tool check if claude CLI not detected:
sp init . --ai claude --ignore-agent-tools
```

After init, verify the scaffold:

```bash
ls -la .specify/
cat CLAUDE.md 2>/dev/null || true
```

---

## Step 3 — Establish Constitution (`/sp.constitution`)

Use the `/sp.constitution` slash command inside Claude Code to define governing principles:

```
/sp.constitution Create principles focused on [user's goals: code quality, testing standards, performance, security, etc.]
```

This writes `.specify/memory/constitution.md`. Read it after creation:

```bash
cat .specify/memory/constitution.md
```

---

## Step 4 — Create Specifications (`/sp.specify`)

Use `/sp.specify` with a detailed description of **what** to build (not how):

```
/sp.specify [Detailed feature description focusing on user stories, behaviors, and outcomes — NOT the tech stack]
```

This creates a branch (e.g., `001-feature-name`) and writes:

```
.specify/specs/001-<feature-name>/spec.md
```

Read the generated spec:

```bash
cat .specify/specs/*/spec.md
```

---

## Step 5 — Clarify Requirements (`/sp.clarify`)

Before planning, run structured clarification:

```
/sp.clarify
```

Then optionally free-form refine:

```
[Additional detail or correction to the spec]
```

Validate checklist:

```
Read the review and acceptance checklist and check off each item if the spec meets criteria.
```

---

## Step 6 — Generate Technical Plan (`/sp.plan`)

Now specify the tech stack:

```
/sp.plan [Tech stack, frameworks, architecture choices, database, API style, etc.]
```

This generates plan artifacts:

```
.specify/specs/001-<feature-name>/
├── spec.md
├── plan.md
├── data-model.md
├── research.md
├── quickstart.md
└── contracts/
    ├── api-spec.json
    └── ...
```

Read research.md to validate tech choices:

```bash
cat .specify/specs/*/research.md
```

---

## Step 7 — Generate Tasks (`/sp.tasks`)

```
/sp.tasks
```

This produces `.specify/specs/001-<feature-name>/tasks.md` with:
- Tasks organized by user story
- `[P]` markers for parallel execution
- Exact file paths per task
- TDD structure

---

## Step 8 — Implement (`/sp.implement`)

```
/sp.implement
```

This executes the tasks in order, respecting dependencies.

---

## Spec File Templates

When creating spec files manually (e.g., if the slash commands aren't available), use these templates. Reference `references/spec-template.md` and `references/plan-template.md` for the full schemas.

### Minimal spec.md structure:

```markdown
# Feature: <Name>

## Overview
[1-2 sentence summary of what is being built and why]

## User Stories
- As a [role], I want to [action] so that [outcome]
- ...

## Functional Requirements
1. ...
2. ...

## Non-Functional Requirements
- Performance: ...
- Security: ...

## Out of Scope
- ...

## Review & Acceptance Checklist
- [ ] All user stories covered
- [ ] Edge cases documented
- [ ] Non-functional requirements specified
```

---

## Common Commands Reference

| Goal | Command |
|------|---------|
| Install | `pip install specifyplus --break-system-packages` |
| New project | `sp init <name> --ai claude` |
| Init here | `sp init --here --ai claude` |
| Force overwrite | `sp init . --force --ai claude` |
| Upgrade | `pip install -U specifyplus` |
| Check tools | `sp check` |

### Slash Commands (inside Claude Code)

| Command | Purpose |
|---------|---------|
| `/sp.constitution` | Define project governing principles |
| `/sp.specify` | Write feature specification |
| `/sp.clarify` | Structured requirement clarification |
| `/sp.plan` | Technical implementation plan |
| `/sp.tasks` | Actionable task list |
| `/sp.implement` | Execute implementation |
| `/sp.analyze` | Cross-artifact consistency check |
| `/sp.checklist` | Quality checklist generation |

---

## Environment Variable

```bash
# When not using Git branches, set this to target a specific feature:
export SPECIFY_FEATURE=001-my-feature
```

---

## Troubleshooting

**`sp` not found after install:**
```bash
export PATH="$HOME/.local/bin:$PATH"
# or
python3 -m specifyplus --help
```

**SSL errors:**
```bash
sp init <name> --ai claude --skip-tls
```

**Git not initialized:**
```bash
git init && sp init . --ai claude
```

**Over-eager AI adding unrequested components:**
> Ask Claude: "Review the plan against the spec and remove any components not explicitly requested."

---

## Reference Files

- `references/spec-template.md` — Full spec.md template with all sections
- `references/plan-template.md` — Full plan.md template with all sections
