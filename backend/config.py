"""
Configurações do backend.
"""
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output_audio')

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)
