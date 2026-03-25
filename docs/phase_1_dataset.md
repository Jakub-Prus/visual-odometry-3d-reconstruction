# Phase 1: Dataset and Camera

## Dataset abstraction design
The dataset layer exposes three core operations:
- `__len__()` for sequence size
- `get_frame(idx)` for indexed access to grayscale frames
- `get_intrinsics()` for the associated camera model

Frames are returned through a consistent `Frame` dataclass that contains the frame index, grayscale image, and source path.

## KITTI loader
The KITTI loader searches for a sequence inside `image_0/`, `images/`, or the dataset root. It loads images in grayscale, applies optional resizing, and keeps image ordering deterministic through sorted paths.

## Camera intrinsics
Camera intrinsics are defined in the YAML config and converted into a `Camera` object. When the dataset is resized, the loader rescales the intrinsic matrix so feature coordinates and geometry stay consistent.

## Expected outputs
- ordered grayscale frames
- calibrated `Camera` instance with a 3x3 intrinsic matrix
- image width and height after resize
- deterministic frame indexing for pipeline processing
