"""
Módulo principal: Orquestra o fluxo da aplicação.
"""
from config import get_config
from browser import BrowserManager, obter_html_aba_ativa
from extractor import extrair_texto_principal
from utils import dividir_texto_em_chunks
from pathlib import Path
from gTTS import gerar_audio_tts as generate_audio

import sys
import asyncio
import logging
import time

# if sys.platform.startswith("win"):
#     asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

OUTPUT_DIR = Path("output_audio")
OUTPUT_DIR.mkdir(exist_ok=True)


def configurar_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )


async def main():
    configurar_logging()
    get_config()

    try:
        # modo URL
        if len(sys.argv) > 1:
            url = sys.argv[1]
            logging.info(f"Carregando página via URL: {url}")
            async with BrowserManager(None) as browser:
                html = await browser.carregar_pagina(url)

        # modo aba ativa
        else:
            logging.info("Nenhuma URL informada. Usando aba ativa do navegador.")
            html = await obter_html_aba_ativa()

        texto = extrair_texto_principal(html)

        if not texto:
            logging.error("Nenhum texto extraído da página.")
            sys.exit(2)

        partes = dividir_texto_em_chunks(texto)

        logging.info(f"Texto dividido em {len(partes)} parte(s) para TTS.")

        arquivos_audio = []

        timestamp = int(time.time())

        for i, parte in enumerate(partes):

            nome_arquivo = OUTPUT_DIR / f"audio_{timestamp}_{i+1}.mp3"

            logging.info(f"Gerando áudio para chunk {i+1}/{len(partes)}...")

            generate_audio(parte, str(nome_arquivo))

            arquivos_audio.append(nome_arquivo)

        logging.info(f"Áudio(s) gerado(s): {arquivos_audio}")

    except Exception as e:
        logging.exception(f"Erro durante a execução: {e}")


if __name__ == "__main__":
    asyncio.run(main())