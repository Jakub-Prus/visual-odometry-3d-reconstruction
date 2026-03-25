# Phases 2 to 5 Extension Plan

## Objective
Extend the monocular VO scaffold with robust initialization, sparse triangulation, lightweight mapping, PnP tracking, reprojection filtering, exports, and tests.

## Areas touched
- `configs/`
- `scripts/`
- `src/features/`
- `src/geometry/`
- `src/map/`
- `src/pipeline/`
- `src/visualization/`
- `docs/`
- `tests/`
- `outputs/`

## Steps
1. Extend configuration objects and create new config files for triangulation and mapping.
2. Add triangulation, reprojection, PnP, map, tracking, state, initializer, and visualization modules.
3. Refactor the pipeline into bootstrap and tracking modes with keyframe insertion and map updates.
4. Add export and evaluation scripts plus updated README and phase docs.
5. Add minimal real tests and run compile, unit, and CLI checks.

## Validation
- `python -m compileall src scripts tests`
- `python -m unittest discover -s tests -v`
- `python scripts/run_vo.py --config configs/mapping.yaml --max-frames 20`
- `python scripts/evaluate_reprojection.py --config configs/mapping.yaml --max-frames 20`

## Risks
- Synthetic data supports smoke validation but may not exercise real KITTI failure modes.
- PnP support depends on stable 3D-2D correspondence construction from a lightweight local map.
