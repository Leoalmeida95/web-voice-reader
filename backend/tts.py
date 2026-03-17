"""
Converte texto em áudio MP3 usando gTTS.
"""
import logging
from gtts import gTTS
import os
from datetime import datetime
from backend.config import OUTPUT_DIR

def gerar_audio(texto: str, prefixo: str = "audio") -> list[str]:
    """
    Gera arquivos MP3 a partir de texto, dividindo em chunks se necessário.
    Retorna lista de caminhos dos arquivos gerados.
    """
    from backend.utils import dividir_texto_em_chunks
    arquivos = []
    chunks = dividir_texto_em_chunks(texto)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    for i, chunk in enumerate(chunks):
        nome_arquivo = f"{prefixo}_{timestamp}_{i+1}.mp3"
        caminho = os.path.join(OUTPUT_DIR, nome_arquivo)
        try:
            tts = gTTS(text=chunk, lang="pt-br")
            tts.save(caminho)
            logging.info(f"Áudio gerado: {caminho}")
            arquivos.append(caminho)
        except Exception as e:
            logging.exception(f"Erro ao gerar áudio: {e}")
    return arquivos
