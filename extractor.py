"""
Responsável por extrair e limpar o texto da página.
"""
from readability import Document
from bs4 import BeautifulSoup
import logging

def extrair_texto_principal(html: str) -> str:
    """
    Extrai e limpa o conteúdo principal de uma página HTML.
    """
    try:
        doc = Document(html)
        conteudo_html = doc.summary()
        soup = BeautifulSoup(conteudo_html, "html.parser")
        texto = soup.get_text(separator=" ", strip=True)
        return texto
    except Exception as e:
        logging.exception(f"Erro ao extrair texto principal: {e}")
        return ""
