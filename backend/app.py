"""
API FastAPI para geração de áudio.
"""
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.extractor import limpar_texto
from backend.tts import gerar_audio_temp
from backend.groq_service import resolver_questao
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask
import logging, os, subprocess, tempfile, re

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

def split_text_into_chunks(text):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current = ''
    for sentence in sentences:
        if len(current) + len(sentence) <= 200:
            current += (' ' if current else '') + sentence
        else:
            if current:
                chunks.append(current.strip())
            current = sentence
    if current:
        chunks.append(current.strip())
    return chunks

@app.get("/stream-tts")
async def stream_tts(text: str = Query(...)):
    texto_limpo = limpar_texto(text)

    if not texto_limpo or len(texto_limpo.strip()) < 10:
        return StreamingResponse(b"", media_type="audio/wav")

    def generate_audio_stream():

        PIPER_PATH = "piper/piper.exe"
        MODEL_PATH = "piper/models/pt_BR-faber-medium.onnx"

        # 🔥 UM processo só (isso muda tudo)
        process = subprocess.Popen(
            [PIPER_PATH, "-m", MODEL_PATH, "--output-raw"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            bufsize=0
        )

        try:
            # envia texto inteiro
            process.stdin.write((texto_limpo + "\n").encode("utf-8"))
            process.stdin.flush()
            process.stdin.close()

            # 🔥 stream contínuo
            while True:
                chunk = process.stdout.read(4096)
                if not chunk:
                    break
                yield chunk

        finally:
            process.kill()

    return StreamingResponse(
        generate_audio_stream(),
        media_type="audio/wav"
    )