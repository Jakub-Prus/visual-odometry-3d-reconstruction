# UI Information Architecture

## Main navigation
- Home
- New Run
- Results
- Datasets
- About

## Result hierarchy
- `/results/[runId]` is the main summary page
- `/results/[runId]/map` focuses on trajectory and sparse map
- `/results/[runId]/sequence` focuses on the input frame sequence
- `/results/[runId]/correspondences` focuses on point-to-image evidence
- `/results/[runId]/visuals` shows overlays and snapshots
- `/results/[runId]/metrics` shows charts
- `/results/[runId]/details` contains technical drill-down

## Why diagnostics moved deeper
- the old navigation exposed internal debugging too early
- the new structure emphasizes final outcomes first
- technical detail remains available without dominating the UX
