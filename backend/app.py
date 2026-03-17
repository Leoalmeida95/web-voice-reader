"""
API FastAPI para geração de áudio.
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.extractor import limpar_texto
from backend.tts import gerar_audio

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReadPageRequest(BaseModel):
    text: str

@app.post("/read-page")
async def read_page(request: ReadPageRequest):
    texto_limpo = limpar_texto(request.text)
    arquivos = gerar_audio(texto_limpo)
    return {"audio_files": arquivos}
