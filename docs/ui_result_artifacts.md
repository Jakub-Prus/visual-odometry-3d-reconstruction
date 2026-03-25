# UI Result Artifacts

## Output mapping
- `summary.json` -> result header and summary cards
- `trajectory.json` -> 2D path and map views
- `metrics.json` -> metrics charts and details tables
- `pointcloud.ply` -> sparse point cloud viewer and export link
- `map_points.json` -> point metadata, observation counts, and image linkage
- `frames/index.json` -> sequence browser and frame-level reverse links
- preview images -> result gallery and hero visuals
- config/log exports -> technical details page

## Required data contracts
- result summary for gallery cards
- result details for full pages
- run progress for the launch flow
- artifact image and file records for galleries and downloads

## UI sections
- hero visuals: trajectory and point cloud
- visuals page: artifact image gallery
- metrics page: charts only
- details page: config, warnings, and frame-level tables
