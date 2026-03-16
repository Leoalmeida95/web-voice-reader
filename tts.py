"""
Converte texto em áudio usando gTTS.
"""

import logging
from gtts import gTTS


def gerar_audio_tts(texto: str, nome_arquivo: str) -> None:
    """
    Converte texto em áudio MP3 usando gTTS.
    """

    try:
        texto = texto.strip()

        if not texto.endswith((".", "!", "?")):
            texto += "."

        tts = gTTS(text=texto, lang="pt-br")

        tts.save(nome_arquivo)

        logging.info(f"Áudio gerado: {nome_arquivo}")

    except Exception as e:
        logging.exception(f"Erro ao gerar áudio: {e}")