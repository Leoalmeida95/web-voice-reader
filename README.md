
# Web Voice Reader

Ferramenta em Python para extrair o texto principal de uma página web e gerar um áudio narrado em português do Brasil usando a biblioteca gTTS (Google Text-to-Speech).


## Instalação

1. Clone o repositório
2. Crie um ambiente virtual (opcional, mas recomendado)
3. Instale as dependências:

```bash
pip install -r requirements.txt
python -m playwright install
```


## Configuração

Não é necessário configurar chaves de API. O mecanismo de voz é totalmente local.


## Uso

```bash
python main.py https://exemplo.com/artigo
```

Os arquivos de áudio serão gerados como `audio_1.mp3`, `audio_2.mp3`, etc.



## Como funciona o tratamento de textos longos

Se o texto extraído da página for muito grande, ele será automaticamente dividido em partes ("chunks") respeitando o limite de caracteres do mecanismo gTTS e preferencialmente em finais de frase. Para cada parte, será gerado um arquivo de áudio separado: `audio_1.mp3`, `audio_2.mp3`, etc.


## Observações
- O navegador será aberto na primeira execução para login manual, se necessário.
- O diretório `browser-data/` armazena a sessão persistente do navegador.
- O texto é dividido em partes se exceder o limite do mecanismo gTTS, e cada parte gera um arquivo de áudio separado.
- O mecanismo de voz utiliza gTTS, que depende da API pública do Google.
