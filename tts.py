"""
Converte texto em áudio usando Azure Speech.
"""
import logging
from TTS.api import TTS
import logging
import asyncio

VOICE = "tts_models/multilingual/multi-dataset/your_tts"

async def gerar_audio_tts(texto: str, nome_arquivo: str, config=None) -> None:
    """
    Converte texto em áudio WAV usando Coqui TTS local.
    """
    try:
        # Carrega modelo apenas uma vez por execução
        loop = asyncio.get_event_loop()
        tts = await loop.run_in_executor(None, lambda: TTS(VOICE))
        # Gera áudio em português
        await loop.run_in_executor(None, lambda: tts.tts_to_file(text=texto, file_path=nome_arquivo, speaker="pt", language="pt"))
        logging.info(f"Áudio gerado: {nome_arquivo}")
    except Exception as e:
        logging.exception(f"Erro ao gerar áudio: {e}")
