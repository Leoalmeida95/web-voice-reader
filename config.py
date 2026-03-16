"""
Carrega variáveis de ambiente e configurações do projeto.
"""
from dataclasses import dataclass
from dotenv import load_dotenv
import os

@dataclass
class Config:
    AZURE_SPEECH_KEY: str
    AZURE_SPEECH_REGION: str


def get_config() -> Config:
    """
    Carrega as variáveis de ambiente do arquivo .env.
    """
    load_dotenv()
    return Config(
        AZURE_SPEECH_KEY=os.getenv("AZURE_SPEECH_KEY", ""),
        AZURE_SPEECH_REGION=os.getenv("AZURE_SPEECH_REGION", "")
    )
