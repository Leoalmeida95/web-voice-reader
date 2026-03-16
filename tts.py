"""
Converte texto em áudio usando Azure Speech.
"""
import logging
from azure.cognitiveservices.speech import SpeechConfig, SpeechSynthesizer, AudioConfig
from config import Config

VOICE = "pt-BR-FranciscaNeural"
AUDIO_FORMAT = "audio-16khz-32kbitrate-mono-mp3"

async def gerar_audio_tts(texto: str, nome_arquivo: str, config: Config) -> None:
    """
    Converte texto em áudio MP3 usando Azure Speech.
    """
    try:
        speech_config = SpeechConfig(subscription=config.AZURE_SPEECH_KEY, region=config.AZURE_SPEECH_REGION)
        speech_config.speech_synthesis_language = "pt-BR"
        speech_config.speech_synthesis_voice_name = VOICE
        audio_config = AudioConfig(filename=nome_arquivo)
        synthesizer = SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
        result = synthesizer.speak_text_async(texto).get()
        if result.reason != 0:
            logging.error(f"Erro na síntese de fala: {result.reason}")
        else:
            logging.info(f"Áudio gerado: {nome_arquivo}")
    except Exception as e:
        logging.exception(f"Erro ao gerar áudio: {e}")
