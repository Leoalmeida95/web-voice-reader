"""
API FastAPI para geração de áudio.
"""
import logging
from fastapi import FastAPI, Request
from pydantic import BaseModel
from backend.extractor import limpar_texto
from backend.tts import gerar_audio

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI()

class ReadPageRequest(BaseModel):
    text: str

@app.post("/read-page")
async def read_page(request: ReadPageRequest):
    texto_limpo = limpar_texto(request.text)
    arquivos = gerar_audio(texto_limpo)
    return {"audio_files": arquivos}
