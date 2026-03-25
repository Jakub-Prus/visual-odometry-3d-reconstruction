# UI Sequence Browser

## UX goals
- make the input sequence browsable instead of hidden behind artifacts
- show keyframes clearly
- reveal which frames contain the selected 3D point

## Main behaviors
- filmstrip navigation across the full sequence
- selected frame preview with point overlays
- toggles for selected-point-only, keypoint overlay, and reprojection overlay
- selected point remains synchronized with the map and correspondence views

## Highlighting rules
- selected frames are visually emphasized
- frames containing the selected point are marked in the filmstrip
- point markers in the image use a bright ring and center dot for visibility
