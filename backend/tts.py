import tempfile
def gerar_audio_temp(texto: str) -> str:
    """
    Gera áudio WAV em arquivo temporário usando Piper.
    Retorna caminho do arquivo temporário.
    """
    from backend.utils import dividir_texto_em_chunks
    chunks = dividir_texto_em_chunks(texto)
    temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    temp_wav.close()
    try:
        # Para textos longos, concatena chunks
        for chunk in chunks:
            gerar_audio_tts(chunk, temp_wav.name)
        return temp_wav.name
    except Exception as e:
        logging.exception(f"Erro ao gerar áudio temporário: {e}")
        return ""
"""
Converte texto em áudio WAV usando Piper TTS.
"""

import logging
import subprocess
from pathlib import Path
from datetime import datetime

from backend.config import OUTPUT_DIR
from backend.utils import dividir_texto_em_chunks


PIPER_PATH = Path("piper/piper.exe")
MODEL_PATH = Path("piper/models/pt_BR-faber-medium.onnx")


def gerar_audio_tts(texto: str, arquivo_saida: str):

    process = subprocess.Popen(
        [
            str(PIPER_PATH),
            "-m",
            str(MODEL_PATH),
            "-f",
            arquivo_saida,
        ],
        stdin=subprocess.PIPE,
        text=True,
        encoding="utf-8"  # 🔥 ESSENCIAL
    )

    process.communicate(texto)


def gerar_audio(texto: str, prefixo: str = "audio") -> list[str]:
    """
    Gera arquivos WAV a partir de texto dividindo em chunks.
    """

    arquivos = []

    chunks = dividir_texto_em_chunks(texto)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    for i, chunk in enumerate(chunks):

        nome_arquivo = f"{prefixo}_{timestamp}_{i+1}.wav"

        caminho = OUTPUT_DIR / nome_arquivo

        try:

            gerar_audio_tts(chunk, str(caminho))

            logging.info(f"Áudio gerado: {caminho}")

            arquivos.append(str(caminho))

        except Exception as e:

            logging.exception(f"Erro ao gerar áudio: {e}")

    return arquivos