"""
Funções utilitárias reutilizáveis.
"""
from typing import List
import re

CHUNK_SIZE = 4000  # Limite seguro para Azure TTS

def dividir_texto_em_chunks(texto: str, tamanho: int = CHUNK_SIZE) -> List[str]:
    """
    Divide o texto em partes menores para o TTS, preferencialmente em finais de frase.
    """
    if len(texto) <= tamanho:
        return [texto]
    # Quebra por sentenças usando regex
    sentencas = re.split(r'(?<=[.!?]) +', texto)
    chunks = []
    chunk_atual = ''
    for sentenca in sentencas:
        if len(chunk_atual) + len(sentenca) + 1 <= tamanho:
            chunk_atual += (' ' if chunk_atual else '') + sentenca
        else:
            if chunk_atual:
                chunks.append(chunk_atual)
            chunk_atual = sentenca
    if chunk_atual:
        chunks.append(chunk_atual)
    return chunks
