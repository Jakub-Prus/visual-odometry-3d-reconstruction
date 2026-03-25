"""File-system utilities used across the project."""

from __future__ import annotations

from pathlib import Path


def resolve_path(path_value: str | Path, base_dir: str | Path) -> Path:
    """Resolve a possibly relative path against a base directory."""
    path = Path(path_value)
    if path.is_absolute():
        return path
    return Path(base_dir) / path


def ensure_directory(path_value: str | Path) -> Path:
    """Create a directory when it does not already exist."""
    path = Path(path_value)
    path.mkdir(parents=True, exist_ok=True)
    return path
