# UI Refocus Results-First Plan

## Objective
Refactor the frontend from a diagnostics-first console into a launch-to-results product flow for portfolio demos and future backend integration.

## Areas touched
- `frontend/app/`
- `frontend/components/`
- `frontend/src/types/`
- `frontend/src/lib/api/`
- `frontend/src/lib/mock/`
- `frontend/src/hooks/`
- `frontend/public/demo/`
- `docs/`
- `README.md`

## Steps
1. Introduce results-first types, result/data adapters, and dataset/run launch contracts.
2. Implement new navigation and pages for home, new run, results, datasets, and about.
3. Redesign the main result page around summary, trajectory, point cloud, artifacts, and interpretation.
4. Move diagnostics and raw technical detail into deeper metrics/details views.
5. Add demo-mode run launch and progress simulation that can later map to real API calls.
6. Update docs and README, then run frontend validation.

## Validation
- `npm run lint`
- `npm run build`

## Risks
- Client-side demo run simulation needs local persistence so created demo results remain accessible after navigation.
