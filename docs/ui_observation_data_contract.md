# UI Observation Data Contract

## Required output files
- `summary.json`
- `trajectory.json`
- `metrics.json`
- `pointcloud.ply`
- `map_points.json`
- `frames/index.json`
- optional preview images and overlay exports

## Map point schema
- `id`
- `xyz`
- `meanReprojectionError`
- `observationCount`
- `isValid`
- `observations[]`

## Observation schema
- `frameId`
- `imageX`
- `imageY`
- `isKeyframe`
- `reprojectionError`

## Sequence frame schema
- `frameId`
- `imageUrl`
- `isKeyframe`
- `observedPointIds[]`
- optional timestamp

## UI mapping
- map points drive 3D selection and inspector panels
- sequence frames drive filmstrips and image viewers
- observations drive overlay markers and correspondence stepping
