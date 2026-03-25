# Foundation Bootstrap Plan

## Objective
Build the Phase 0-2 monocular VO foundation with runnable docs, config, dataset loading, features, essential-matrix pose estimation, and a CLI.

## Areas touched
- `configs/`
- `scripts/`
- `src/`
- `docs/`
- repo metadata files
- sample dataset under `data/kitti/`

## Steps
1. Create the required project structure and package layout.
2. Implement typed config, camera, dataset, feature, geometry, and pipeline modules.
3. Add docs, config, packaging metadata, and a runnable CLI.
4. Generate a small local sample image sequence for smoke validation.
5. Run compile and CLI checks, then fix any issues.

## Validation
- `python -m compileall src scripts`
- `python scripts/run_vo.py --config configs/default.yaml`

## Risks
- Synthetic data may be less stable than KITTI; keep motion and feature texture conservative.
