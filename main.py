"""
Módulo principal: Orquestra o fluxo da aplicação.
"""
import asyncio
import logging
from config import get_config
from browser import BrowserManager
from extractor import extrair_texto_principal
from tts import gerar_audio_tts
from utils import dividir_texto_em_chunks
import sys


def configurar_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )


async def main():
    configurar_logging()
    if len(sys.argv) < 2:
        logging.error("Uso: python main.py <URL>")
        sys.exit(1)
    url = sys.argv[1]
    get_config()  # Mantém compatibilidade, mas não é usado
    try:
        async with BrowserManager(None) as browser:
            html = await browser.carregar_pagina(url)
        texto = extrair_texto_principal(html)
        if not texto:
            logging.error("Nenhum texto extraído da página.")
            sys.exit(2)
        partes = dividir_texto_em_chunks(texto)
        logging.info(f"Texto dividido em {len(partes)} parte(s) para TTS.")
        arquivos_audio = []
        from tts import generate_audio
        for i, parte in enumerate(partes):
            nome_arquivo = f"audio_{i+1}.mp3"
            logging.info(f"Gerando áudio para chunk {i+1}/{len(partes)}...")
            generate_audio(parte, nome_arquivo)
            arquivos_audio.append(nome_arquivo)
        logging.info(f"Áudio(s) gerado(s): {arquivos_audio}")
    except Exception as e:
        logging.exception(f"Erro durante a execução: {e}")

if __name__ == "__main__":
    asyncio.run(main())
