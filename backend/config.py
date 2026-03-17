"""
Configurações do backend.
"""
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

OUTPUT_DIR = BASE_DIR / "output_audio"

OUTPUT_DIR.mkdir(exist_ok=True)