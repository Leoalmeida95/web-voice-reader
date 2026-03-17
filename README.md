

# Web Voice Reader

Ferramenta em Python para extrair o conteúdo principal de uma página web (usando Readability.js) e gerar áudio narrado em português do Brasil com voz neural (Piper TTS).



## Instalação

1. Clone o repositório
2. Crie um ambiente virtual (opcional, mas recomendado)
3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Instale o Piper TTS:

```bash
pip install piper-tts
```

5. Baixe o modelo de voz em português (exemplo: pt_BR-faber-medium):

5.1. Baixe Piper
5.2. Extraia na pasta /piper
5.3. Baixe o modelo de voz

Baixe os arquivos `pt_BR-faber-medium.onnx` e `pt_BR-faber-medium.json` do repositório oficial do Piper e coloque-os na raiz do backend.

6. Inicie o backend:

```bash
uvicorn backend.app:app --reload
```



## Configuração

Não é necessário configurar chaves de API. O mecanismo de voz é totalmente local (Piper).



## Uso

1. Instale a extensão manualmente no Chrome:
	- Abra `chrome://extensions`.
	- Ative o modo desenvolvedor.
	- Clique em "Carregar sem compactação" e selecione a pasta `extension/`.

2. Abra uma página web.
3. Clique no ícone da extensão e depois em "Enviar texto da página".
4. O texto será extraído usando Readability.js e enviado para o backend.
5. O backend gera arquivos WAV com voz neural (Piper) em `output_audio/`.




## Como funciona o tratamento de textos longos

Se o texto extraído da página for muito grande, ele será automaticamente dividido em partes ("chunks") respeitando o limite de caracteres do mecanismo Piper e preferencialmente em finais de frase. Para cada parte, será gerado um arquivo de áudio separado: `audio_1.wav`, `audio_2.wav`, etc.



## Observações
- O backend deve estar rodando localmente em `http://localhost:8000`.
- O áudio é gerado em português do Brasil e salvo como WAV.
- Textos longos são divididos em partes e cada parte gera um arquivo WAV.
- O nome do arquivo inclui um timestamp para evitar conflitos.
- A extensão utiliza Readability.js para extrair apenas o conteúdo principal da página.
- O mecanismo de voz utiliza Piper TTS, modelo neural open source.
