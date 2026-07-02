---
name: code-standards
description: >-
  Apply this project's coding standards to any TypeScript/JavaScript code you
  write, refactor, or review. Use this skill WHENEVER you create or change
  application code — new functions, endpoints, components, bug fixes, refactors —
  or whenever the user asks to clean up, refactor, simplify, or review code for
  style, even if they don't mention "standards" or "style" by name. Triggers
  include: "refactor this", "clean this up", "is this well written?", "review my
  code", writing any new method/class/module, or anything touching files under
  src/ or frontend/. This skill encodes the project's rules on method length,
  parameters, variable scope, error handling, comments, magic numbers, nesting,
  and ternaries so new code matches the rest of the codebase instead of drifting.
---

# Coding Standards

This skill is the contract for how code is written in this project: how long methods
may get, how many parameters they take, where variables are declared, how errors are
handled, and how branching is structured. It is the single source of truth for code
style here — apply it as you write, and check against it before you call a change done.

The goal behind every rule is the same: code that a reader can understand in a few
seconds, where intent is obvious from names and structure rather than from comments or
careful tracing. These rules apply to all application code (`src/`, `frontend/`), not
to tests — tests have their own conventions in the [`test-automation`](../test-automation/SKILL.md) skill.

## The rules, as a working checklist

Apply these while writing. Each links to a worked before/after in
[`references/examples.md`](references/examples.md) — read it when a rule is unclear.

1. **Methods under ~30 lines.** A method that runs long is usually doing several jobs.
   Extract the steps into smaller, well-named functions that each do one thing; the
   caller then reads as a summary of what happens. The 30 lines is a smell threshold,
   not a hard limit — a single cohesive block that happens to be longer is fine.
2. **At most 3 parameters; prefer an object.** Long positional parameter lists are easy
   to pass in the wrong order and hard to extend. Once you reach four, group them into a
   named input type (`type CreateAccountInput = { ... }`) and pass one object.
3. **Declare variables close to first use.** Don't hoist declarations to the top of a
   function "to get them out of the way" — declare each variable right where it's first
   needed, so its purpose and lifetime are visible together.
4. **Never an empty `catch`.** Swallowing an error hides failures and makes debugging
   miserable. At minimum log it with context; usually also rethrow or translate it into
   a domain error. If you genuinely intend to ignore an error, say why in a comment.
5. **No blank lines inside a method body.** Within a function, blank lines fragment a
   single train of thought. If you feel the need to separate "sections" of a method with
   blank lines, that's a signal to extract those sections into their own functions
   (see rule 1).
6. **Avoid unnecessary comments.** A comment that just restates the code is noise that
   drifts out of date. Make the code self-explanatory through good names instead. Keep
   comments that explain *why* something non-obvious is done, not *what* the line does.
7. **Name meaningful literals.** A bare `3` or `"paid"` in a condition hides intent.
   Promote significant numbers and strings to named constants (`MAX_LOGIN_ATTEMPTS`) so
   the meaning is explicit and the value has one place to change.
8. **At most 2 levels of `if`/`else`; prefer early returns.** Deep nesting forces the
   reader to hold every branch in their head. Handle edge/guard cases first with early
   returns or throws, then let the main path flow at the top indentation level.
9. **No nested ternaries.** A ternary inside a ternary is hard to read and harder to
   change. For more than two outcomes, use a small function with early returns (or a
   lookup map) instead.

## How to apply this

- **When writing new code**, follow the rules from the start — it's cheaper than
  cleaning up after. Match the surrounding files' naming and idiom.
- **When refactoring or reviewing**, walk the checklist against the changed code. For
  each violation, prefer the structural fix the rule points to (extract a function,
  introduce an input type, add a guard clause) over a cosmetic patch.
- **Don't over-correct.** These are heuristics for readability, not laws to enforce
  mechanically. If applying a rule literally would make the code *less* clear (e.g.
  extracting a one-line "function" used once, or naming a constant that's obvious in
  context), keep the clearer version and note why.

## Before you finish

A change isn't done until the code you touched satisfies the checklist: methods stay
short and single-purpose, signatures take few/grouped parameters, variables sit next to
their use, no errors are silently swallowed, method bodies have no blank-line padding,
comments earn their place, literals are named, branching is shallow with early returns,
and no ternary is nested. If you left a rule deliberately unapplied, say so and why.

## Reference

- [`references/examples.md`](references/examples.md) — the bad/good pair for every rule
  above, in this project's TypeScript style. Read it when you need a concrete model for
  a refactor.
