"""
API FastAPI para geração de áudio.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.extractor import limpar_texto
from backend.tts import gerar_audio_temp
from backend.groq_service import resolver_questao
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask
import logging
import os

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
    temp_wav = gerar_audio_temp(texto_limpo)
    if not temp_wav or not os.path.exists(temp_wav):
        return StreamingResponse(b"", media_type="audio/wav")
    def cleanup(path):
        try:
            os.remove(path)
        except Exception:
            pass
    response = StreamingResponse(
        open(temp_wav, "rb"),
        media_type="audio/wav",
        background=BackgroundTask(cleanup, temp_wav)
    )
    return response

class QuestionRequest(BaseModel):
    text: str

@app.post("/solve-question")
async def solve_question(request: QuestionRequest):
    if not request.text or len(request.text.strip()) < 10:
        logging.warning("Texto de questão inválido recebido.")
        return {"answer": "Erro: texto inválido"}
    resposta = resolver_questao(request.text)
    return {"answer": resposta}