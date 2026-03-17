"""
Converte texto em áudio WAV usando Piper TTS.
"""
import logging
import os
from datetime import datetime
from backend.config import OUTPUT_DIR
from piper.tts import PiperVoice

def gerar_audio(texto: str, prefixo: str = "audio") -> list[str]:
    """
    Gera arquivos WAV a partir de texto, dividindo em chunks se necessário.
    Retorna lista de caminhos dos arquivos gerados.
    """
    from backend.utils import dividir_texto_em_chunks
    arquivos = []
    chunks = dividir_texto_em_chunks(texto)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # Carrega modelo Piper
    try:
        voice = PiperVoice(model_path="pt_BR-faber-medium.onnx", config_path="pt_BR-faber-medium.json")
    except Exception as e:
        logging.exception("Erro ao carregar modelo Piper.")
        return []
    for i, chunk in enumerate(chunks):
        nome_arquivo = f"{prefixo}_{timestamp}_{i+1}.wav"
        caminho = os.path.join(OUTPUT_DIR, nome_arquivo)
        try:
            voice.synthesize(chunk, caminho)
            logging.info(f"Áudio gerado: {caminho}")
            arquivos.append(caminho)
        except Exception as e:
            logging.exception(f"Erro ao gerar áudio: {e}")
    return arquivos
