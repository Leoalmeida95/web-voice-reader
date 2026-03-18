import logging
from config.settings import (
    GROQ_API_KEY
)

try:
    from groq import Groq
except ImportError:
    Groq = None

MODEL = "llama-3.1-8b-instant"

PROMPT_TEMPLATE = (
    "You are an assistant that solves multiple-choice questions.\n"
    "Answer in this format:\n"
    "Resposta: <letter>\n"
    "Explicação: <short explanation>\n\n"
    "Question:\n{texto}"
)

def resolver_questao(texto: str) -> str:
    """
    Envia questão para Groq API e retorna resposta.
    """
    if not Groq or not GROQ_API_KEY:
        logging.error("Groq SDK não instalado ou API key ausente.")
        return "Erro: Groq API não disponível."
    prompt = PROMPT_TEMPLATE.format(texto=texto)
    logging.info(f"Enviando questão para Groq: {texto[:200]}")
    try:
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=256,
            temperature=0.2
        )
        answer = response.choices[0].message.content.strip()
        logging.info(f"Resposta Groq: {answer[:200]}")
        return answer
    except Exception as e:
        logging.exception("Erro ao consultar Groq API")
        return "Erro: não foi possível resolver a questão."
