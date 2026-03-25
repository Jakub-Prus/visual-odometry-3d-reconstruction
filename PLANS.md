# PLANS.md

Use a plan when work is non-trivial: multi-file changes, risky edits, infra/config changes, schema changes, migrations, unclear requirements, or anything likely to need rollback notes.

Plans should be short and actionable:
- objective
- files or areas touched
- ordered steps
- validation to run
- key risks or assumptions

Store persistent plans in `plans/*.md`.
Skip a saved plan for trivial, low-risk, single-file edits.
