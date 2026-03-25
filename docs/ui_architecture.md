# UI Architecture

## App structure
- `frontend/app`: results-first App Router pages
- `frontend/components`: layout, result, new-run, viewer, and metrics components
- `frontend/src/types`: result, run-request, progress, and artifact contracts
- `frontend/src/lib/api`: launch, polling, dataset, and result adapters
- `frontend/src/lib/mock`: demo datasets, results, and local progress simulation
- `frontend/public/demo`: bundled preview images and point-cloud assets

## Route structure
- `/`: home and recent result spotlight
- `/new-run`: run launch and progress view
- `/results`: result gallery
- `/results/[runId]`: main result page
- `/results/[runId]/map`: map-focused presentation
- `/results/[runId]/sequence`: input sequence browser
- `/results/[runId]/correspondences`: point-to-image split view
- `/results/[runId]/visuals`: output images
- `/results/[runId]/metrics`: chart summary
- `/results/[runId]/details`: technical drill-down
- `/datasets`: input library
- `/about`: project explanation

## State and data flow
- pages call adapters instead of hardcoding data
- demo mode persists launched runs in local storage
- progress polling and result loading are isolated from presentation
- charts and 3D viewers remain client-side components

## Backend integration plan
- `POST /api/runs`
- `GET /api/runs/:id/progress`
- `GET /api/results`
- `GET /api/results/:id`
