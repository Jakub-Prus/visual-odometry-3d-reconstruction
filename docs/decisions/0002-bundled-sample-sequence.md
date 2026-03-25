# ADR 0002: Bundle a Small Synthetic Sequence

## Status
Accepted

## Context
The default CLI path should run immediately after cloning the repository, but real KITTI or TUM data is not bundled with the project.

## Decision
Ship a small synthetic KITTI-like image sequence under `data/kitti/image_0` and keep the default config pointed at it.

## Rationale
- enables a zero-download smoke test
- keeps `README` instructions short and reliable
- provides a stable input for compile-and-run validation in local development

## Consequences
- the default sequence is only a functional test fixture
- geometry and trajectory quality on the synthetic sequence do not replace evaluation on real datasets
- docs must keep this distinction explicit so users do not treat the bundled data as a benchmark
