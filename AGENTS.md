# AGENTS.md

## Purpose
- Keep Codex consistent, low-noise, and cheap to run.
- Favor minimal diffs, existing patterns, and explicit validation.

## How to work
- Read only the files needed for the task.
- Search before writing; extend existing code before adding new paths.
- For non-trivial work, make a short plan, then execute.
- State assumptions, validation performed, and residual risks.

## Source of truth
- User request and tests are authoritative for the current task.
- Then follow the nearest `AGENTS.md`, then broader repo guidance, then referenced docs.

## Local overrides
- The nearest `AGENTS.md` to the working directory takes precedence.
- Subdirectory `AGENTS.md` files may narrow scope, invariants, and validation steps.

## Planning rules
- Skip planning for trivial single-file edits.
- Write a short plan for multi-file, risky, infra, schema, or ambiguous work.
- Store persistent plans in `plans/*.md` per [PLANS.md](/c:/github/my-projects/visual-odometry-3d-reconstruction/PLANS.md).

## Token efficiency rules
- Open small, relevant slices instead of whole files when possible.
- Do not restate large specs; link or cite the exact file instead.
- Prefer local context over repo-wide scans unless the task requires it.
- Keep progress updates short and avoid repeating prior analysis.

## Editing rules
- Keep diffs minimal and scoped to the task.
- Preserve surrounding style and naming.
- Reuse helpers, constants, and patterns before adding new ones.
- Avoid speculative refactors and unrelated formatting changes.

## Testing & validation
- Run the narrowest useful checks first, then broader checks if risk justifies it.
- If tests are skipped, say why and note the risk.
- Validate changed behavior, edge cases, and obvious regressions.

## Safety & scope
- Do not modify unrelated files.
- Do not add dependencies, rename public surfaces, or change formats without need.
- Flag destructive, risky, or unclear work before proceeding.

## Output style
- Be concise, direct, and implementation-focused.
- Report: what changed, what was validated, and any remaining risk.

## Escalation rules
- Ask when requirements are materially ambiguous or a choice is irreversible.
- Escalate if local instructions conflict, data may be lost, or validation cannot be completed.

## Configuration awareness
- Put behavioral defaults in `.codex/config.toml`, not here.
- Check repo config before assuming model, reasoning, approvals, or workspace behavior.

## Definition of done
- Requested change implemented with minimal diff.
- Relevant validation completed or explicitly deferred.
- Assumptions and residual risks reported.
- New durable guidance lives in the right file, not repeated across the repo.
