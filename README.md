# 🔊 Web Voice Reader

Extensão de navegador + backend em Python que permite **ouvir o conteúdo de páginas web** com voz neural em português utilizando **Piper TTS (local)**.

---

## 🚀 Visão Geral

O Web Voice Reader extrai automaticamente o conteúdo principal de uma página web e o transforma em áudio, exibindo um **player integrado diretamente na página**.

### Fluxo da aplicação

```
Usuário abre uma página
↓
Clica na extensão
↓
Content Script extrai o conteúdo
↓
Mensagem enviada ao Background Script
↓
Background chama o backend (FastAPI)
↓
Piper TTS gera áudio
↓
Áudio retorna como stream
↓
Player é exibido na página
↓
Áudio começa a tocar
```

---

## 🧱 Arquitetura

```
web-voice-reader/
│
├── backend/
│   ├── app.py
│   ├── extractor.py
│   ├── tts.py
│   └── utils.py
│
├── extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js
│   └── background.js
│
├── piper/
│   ├── piper.exe
│   └── models/
│       └── pt_BR-faber-medium.onnx
│
├── output_audio/
├── requirements.txt
└── README.md
```

---

## ⚙️ Tecnologias Utilizadas

### Backend

* FastAPI
* Piper TTS (voz neural local)
* Uvicorn

### Extensão

* Chrome Extension API (Manifest V3)
* JavaScript
* DOM Extraction

---

## 🧩 Funcionalidades

* 🔎 Extração do conteúdo principal da página
* 🔊 Conversão de texto em áudio (TTS local)
* 🎧 Player de áudio integrado na página
* ⚡ Comunicação via background script (evita bloqueios de rede)
* 🧠 Preparado para integração com IA (resolução de questões)

---

## 🛠️ Instalação

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd web-voice-reader
```

---

### 2. Criar ambiente virtual (opcional)

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

---

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

---

### 4. Configurar o Piper TTS

1. Baixe o Piper
2. Extraia na pasta `/piper`
3. Baixe o modelo:

* `pt_BR-faber-medium.onnx`
* `pt_BR-faber-medium.onnx.json`

Coloque em:

```
/piper/models/
```

---

## ▶️ Executando o projeto

### 1. Iniciar o backend

```bash
uvicorn backend.app:app --reload
```

Acesse para verificar:

```
http://localhost:8000/docs
```

---

### 2. Instalar a extensão no Chrome

1. Abra:

```
chrome://extensions
```

2. Ative **Modo Desenvolvedor**
3. Clique em:

```
Carregar sem compactação
```

4. Selecione a pasta:

```
/extension
```

---

### 3. Usar a extensão

1. Abra qualquer página web
2. Clique no ícone da extensão
3. Clique em **"▶ Ler página"**
4. O player aparecerá no canto da página
5. O áudio começará automaticamente

---

## 🎧 Player de Áudio

O player é exibido diretamente na página e permite:

* ▶ Play / Pause
* ⏱ Barra de progresso
* ❌ Fechar player

---

## ⚠️ Observações

* O backend deve estar rodando em:

  ```
  http://localhost:8000
  ```

* O processamento de áudio é **100% local (offline)**

* A extensão utiliza:

  * Content Script → extração
  * Background Script → requisições (evita bloqueios do Chrome)

---

## 🧠 Próximas melhorias

* ✔ Detecção de perguntas na página
* ✔ Integração com IA (resolução automática)
* ✔ Explicação das respostas via voz
* ✔ Streaming de áudio em tempo real
* ✔ Highlight do texto sendo narrado

---

## 💡 Sobre o projeto

Este projeto foi desenvolvido como um estudo prático envolvendo:

* Extensões de navegador
* Processamento de linguagem natural
* Text-to-Speech local
* Integração com IA

---

## 📄 Licença

MIT
