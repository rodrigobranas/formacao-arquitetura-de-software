# CLAUDE.md

## Projects & Ports

| Service  | Stack                | Port | Location         |
| -------- | -------------------- | ---- | ---------------- |
| Backend  | Express (TypeScript) | 3000 | `src/`           |
| Frontend | React + Vite         | 5173 | `frontend/react/`|
| Database | PostgreSQL 18.4      | 5432 | `docker/`        |

The backend listens on port **3000** (`src/index.ts`). The frontend runs on Vite's
default port **5173**. The database runs on the default PostgreSQL port **5432**
(user `postgres`, password `123456`, database `app`).

## Install Dependencies

```bash
npm install                      # backend (root)
cd frontend/react && npm install # frontend
cd e2e && npm install            # e2e tests
```

## Run

```bash
# Backend (Express on :3000) — Node runs the TypeScript entrypoint directly
node src/index.ts

# Frontend (Vite dev server on :5173)
cd frontend/react && npm run dev
```

> The backend needs the database running (see below) before it can serve requests.

## Database (Docker)

A PostgreSQL container is defined in `docker/docker-compose.yaml` and runs on port
**5432**. On first start it initializes the schema from `database/create.sql`.

```bash
npm run compose:up    # start the database (detached)
npm run compose:down  # stop the database and remove its volume (-v)
```

## Tests & Coverage

```bash
npm test               # run unit/integration tests with Vitest (watch mode)
npm run test:coverage  # run tests and generate the coverage report
```

End-to-end tests use Playwright (in `e2e/`):

```bash
cd e2e && npx playwright test
```

## Test Automation

> **MANDATORY:** Whenever ANY code is created or changed in this project, the
> **`test-automation` skill** MUST be loaded — without exception. This is not optional
> and applies to every single code change: new files, new functions, new endpoints, new
> components, bug fixes, refactors, or any other modification to application code. Before
> writing or editing code, load
> [.claude/skills/test-automation/](.claude/skills/test-automation/SKILL.md) and follow
> it. If you are about to touch code and have not loaded the skill, STOP and load it first.

This project ships a **`test-automation` skill** that defines how automated tests are
written and organized. Whenever you create or change code that needs test coverage —
or write, fix, or review tests — use the skill in
[.claude/skills/test-automation/](.claude/skills/test-automation/SKILL.md); it is the
reference for tooling, structure, isolation, test levels, and coverage targets. Claude
loads it automatically when a task involves tests.
