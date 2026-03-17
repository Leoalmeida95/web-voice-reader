"""
Limpeza de texto recebido.
"""
import logging
from bs4 import BeautifulSoup

def limpar_texto(texto: str) -> str:
    """
    Limpa o texto removendo espaços duplicados, quebras de linha excessivas e caracteres indesejados.
    """
    try:
        soup = BeautifulSoup(texto, "lxml")
        texto_limpo = soup.get_text(separator=" ", strip=True)
        # Remove múltiplos espaços
        import re
        texto_limpo = re.sub(r'\s+', ' ', texto_limpo)
        # Remove múltiplas quebras de linha
        texto_limpo = texto_limpo.replace('\n', ' ')
        texto_limpo = re.sub(r'\s+', ' ', texto_limpo)
        return texto_limpo.strip()
    except Exception as e:
        logging.exception(f"Erro ao limpar texto: {e}")
        return texto
