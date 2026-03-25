# UI Components

## Key components
- `components/layout/*`: shell, sidebar, topbar, section headers
- `components/results/*`: result header, summary cards, artifact gallery, interpretation, status badge
- `components/new-run/*`: dataset selection, run config, progress panel, quality preset controls
- `components/correspondences/*`: point inspector, observation viewer, selection summary
- `components/sequence/*`: filmstrip, image viewer, overlay layer, sequence browser
- `components/viewers/*`: trajectory, point cloud, artifact gallery, compare views, frame inspection
- `components/metrics/*`: reprojection, track count, and map growth charts
- `components/experiments/*`: comparison panels and experiment cards

## Props expectations
- components accept typed models from `frontend/src/types`
- chart components take `FrameMetric[]` or `ExperimentResult[]`
- viewer components take precomputed URLs or numeric geometry arrays
- layout components stay data-agnostic

## Reuse strategy
- route pages assemble result-first sections from small focused cards
- mock/demo data flows through the same adapters as future API data
- common stat, empty, loading, badge, and JSON display primitives reduce duplication

## Visualization choices
- Recharts for standard technical charts
- React Three Fiber for lightweight 3D point cloud and trajectory rendering
- static demo overlays for visuals until backend frame exports are wired live
