---
name: test-automation
description: >-
  Write and organize automated tests for this project following its established
  conventions (Vitest + Sinon for unit/integration, Playwright for E2E). Use this
  skill WHENEVER you create or change application code that needs test coverage,
  or whenever the user asks to write, add, fix, or review tests — even if they
  don't mention Vitest, Sinon, or Playwright by name. Triggers include: "add a
  test", "cover this with tests", "write a unit/integration/e2e test", "is this
  tested?", new functions/endpoints/components, bug fixes that need a regression
  test, or anything touching files under test/ or e2e/. This skill encodes where
  tests live, the tooling, the structure, and the coverage targets so new tests
  match the rest of the codebase instead of drifting.
---

# Test Automation

This skill is the contract for how tests are built in this project: where tests go,
which tools to reach for, how each test is structured, and the checks to run before you
consider a change "covered". It is the single source of truth for test conventions here.

The goal behind every rule below is the same: tests that someone can read in a few
seconds, trust to fail only for real reasons, and run in any order without surprises.

## Project layout — where tests go

Match the existing structure exactly; don't invent new folders.

| Kind        | Location                  | Runner / extension          | Notes |
| ----------- | ------------------------- | --------------------------- | ----- |
| Unit        | `test/unit/`              | Vitest, `*.test.ts`         | Pure domain logic, no I/O |
| Integration | `test/integration/`      | Vitest, `*.test.ts`         | Crosses layers; hits the running API/DB |
| E2E         | `e2e/tests/`              | Playwright, `*.spec.js`     | Full flow through the React frontend |

Source modules live in `src/`. Vitest is configured (`vitest.config.ts`) to exclude
`node_modules`, `dist`, and `e2e/**`, so Playwright specs never run under Vitest.

## Tooling

- **Vitest** runs and asserts unit/integration tests.
- **Sinon** provides test doubles — `stub`, `spy`, `mock` — to keep tests
  repeatable and isolated from live data. It is listed in the rules but **not yet a
  dependency**; if a test needs a double, install it first: `npm i -D sinon @types/sinon`.
  For simple cases you may also use Vitest's built-in `vi.fn()`/`vi.spyOn()`.
- **Playwright** drives the browser for E2E.

### Commands

```bash
npm test                      # Vitest (watch mode) — unit + integration
npm run test:coverage         # Vitest with the v8 coverage report
cd e2e && npx playwright test # E2E
```

Integration tests call `http://localhost:3000` and need the backend + database
running (`npm run compose:up`, then `node src/index.ts`). E2E additionally needs the
frontend on `http://localhost:5173` (`cd frontend/react && npm run dev`). If a layer
isn't running, the test fails on connection — note that rather than rewriting the test.

## Conventions specific to this codebase

These are easy to get wrong because they differ from generic Vitest defaults — follow
the surrounding files:

- **ESM with explicit `.ts` extensions on relative imports.** The project is
  `"type": "module"`. Import source as `from "../../src/validateCpf.ts"`, including
  the `.ts`. Omitting the extension breaks resolution.
- **Behavior descriptions in Portuguese**, phrased as expectations: `"Deve …"` for
  the happy path and `"Não deve …"` for rejections. This keeps test reports readable
  alongside the existing suite. (Code identifiers stay in English.)
- **`test`, never `it`.** Both work in Vitest, but the codebase standardizes on
  `test` for uniformity.
- **Import named members from Vitest**: `import { expect, test } from "vitest";`
  (add `describe`, `beforeEach`, `afterEach` as needed).
- **Data-driven cases use `test.each`** for families of valid/invalid inputs —
  see `test/unit/validateCpf.test.ts` for the established pattern.

## The rules, as a working checklist

Apply these while writing:

1. **Cover new code.** Any new or changed behavior gets tests in the same change.
2. **Right tools.** Vitest to run/assert, Sinon (or `vi`) for doubles, Playwright for E2E.
3. **`test` over `it`.**
4. **Structure each test as Arrange / Act / Assert** (Given/When/Then). Keep the
   three phases visible so the intent reads top-to-bottom.
5. **Independent tests.** No shared mutable state between tests; each builds what it
   needs so it can run alone or in parallel.
6. **Common setup in `beforeEach`.** Especially initialization shared across a `describe`.
7. **Release resources in `afterEach`.** Close DB connections and anything external.
8. **Repeatable.** Stub/mock anything non-deterministic or external (rates, clocks,
   network) so the test doesn't depend on data that can change.
9. **Right level** (see below).
10. **One behavior per test.** Avoid catch-all tests that assert many unrelated things.
11. **Assert clearly.** Every relevant field gets an explicit expectation — no vague checks.
12. **High, cost-effective coverage:** aim for **>80%**, prioritizing the riskiest and
    most-changed code. Verify with `npm run test:coverage`.

## Choosing the test level

Pick the cheapest level that actually exercises the risk:

- **Unit** — a single pure function or domain rule, no I/O. Fast, run by default.
  Example: validating a CPF or a name.
- **Integration** — more than one layer collaborating (use case + repository + DB, or
  an HTTP endpoint end-to-end on the server). In this project these `fetch` the running
  API on `:3000` and assert the response/persistence.
- **E2E** — the complete flow through the real frontend, asserting what the user sees.
  Reserve for critical journeys; these are the slowest and most brittle.

Don't push logic up the pyramid: if a rule can be proven with a unit test, don't make
it an integration or E2E test.

## Before you finish

A change isn't "tested" until:

- New/changed behavior has tests at the appropriate level, including the failure cases.
- Tests follow the conventions above (location, `.ts` imports, `test`, Portuguese
  descriptions, AAA structure, clear assertions).
- The relevant suite passes — run `npm test` (or the Playwright suite for E2E).
- For risk-bearing changes, `npm run test:coverage` stays at/above the 80% target.

If you skipped a level or couldn't run a suite (e.g., the DB/backend wasn't up), say so
explicitly rather than implying full coverage.

## Reference

- [`references/examples.md`](references/examples.md) — concrete, copy-ready templates
  for unit (incl. `test.each`), integration, E2E, and Sinon doubles, matching this
  project's exact style. Read it when scaffolding a new test file.
