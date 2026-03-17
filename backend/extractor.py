"""
Limpeza de texto recebido.
"""
import logging
from bs4 import BeautifulSoup

def limpar_texto(texto: str) -> str:
    """
    Limpa o texto removendo espaços excessivos e caracteres indesejados.
    """
    try:
        soup = BeautifulSoup(texto, "lxml")
        texto_limpo = soup.get_text(separator=" ", strip=True)
        return texto_limpo
    except Exception as e:
        logging.exception(f"Erro ao limpar texto: {e}")
        return texto
