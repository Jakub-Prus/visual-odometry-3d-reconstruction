# UI Correspondence Plan

## Why point-to-image linking matters
- results are more trustworthy when a 3D point can be traced back to real image evidence
- users should not have to infer which frames support the sparse map
- the feature improves both explainability and portfolio value

## Main user flows
1. click a 3D point and inspect linked frames
2. browse the sequence and highlight observations in images
3. step through observations in the correspondence split view

## Interaction rules
- hover previews a point without replacing the current selection
- click locks the selected point and frame
- frame or observation selection updates the 3D highlight
- selection persists while navigating between result subpages
