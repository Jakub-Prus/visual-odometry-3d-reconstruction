# Phase 0: Setup

## Environment setup
1. Use Python 3.10 or newer.
2. Create a virtual environment.
3. Install dependencies with `pip install -r requirements.txt`.
4. Run the pipeline with `python scripts/run_vo.py --config configs/default.yaml`.

## Dependencies
- `opencv-python` for image IO, features, and geometry
- `numpy` and `scipy` for numeric routines
- `pyyaml` for configuration loading
- `matplotlib` and `open3d` for later visualization work
- `tqdm` for future progress reporting

## Repository structure
- `configs/`: runtime settings
- `scripts/`: executable entry points
- `src/`: project source modules
- `docs/`: plans and implementation notes
- `outputs/`: generated artifacts
- `plans/`: persistent execution plans

## Config system
The config system reads YAML into nested dataclasses. This keeps configuration typed, explicit, and accessible through attribute access such as `config.dataset.path` and `config.features.type`.

## How to run
Use the default synthetic KITTI-style sequence:

```bash
python scripts/run_vo.py --config configs/default.yaml
```
