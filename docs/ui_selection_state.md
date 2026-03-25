# UI Selection State

## Shared state model
- `selectedPointId`
- `selectedFrameId`
- `hoveredPointId`
- `selectedObservationIndex`

## Behavior
- changing the selected point updates the active observation frame
- changing the observation updates the image view while preserving the point selection
- hovering a point previews it without clearing the locked selection
- changing runs resets the selection context to the new result defaults

## Sync rules
- map viewer, sequence browser, and correspondence page all use the same store
- pages derive linked observations from structured result data instead of building ad hoc lookup state
