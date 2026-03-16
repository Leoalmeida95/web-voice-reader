# Copilot Project Instructions

## Idioma obrigatório

Todas as respostas, comentários de código, explicações e documentação devem ser geradas **sempre em português do Brasil**.

---

# Objetivo do projeto

Criar uma ferramenta em Python que:

1. Abre uma página web usando Playwright
2. Permite reutilizar sessões autenticadas do navegador
3. Extrai o conteúdo textual principal da página
4. Limpa o texto removendo elementos irrelevantes
5. Converte o texto em áudio usando um mecanismo gratuito de Text-to-Speech
6. Salva o áudio localmente

Fluxo esperado:

URL → navegador Playwright → extração de texto → limpeza → TTS → arquivo de áudio

---

# Stack tecnológica

Linguagem:

Python 3.11+

Bibliotecas principais:

playwright
beautifulsoup4
readability-lxml
TTS (Coqui TTS)
python-dotenv
asyncio
logging

---

# Estrutura do projeto

project/

main.py
browser.py
extractor.py
tts.py
config.py
utils.py
requirements.txt
.env.example
README.md

---

# Responsabilidade de cada módulo

main.py
Orquestra todo o fluxo da aplicação.

browser.py
Gerencia inicialização do navegador e navegação usando Playwright.

extractor.py
Extrai e limpa o texto principal da página.

tts.py
Converte texto em áudio usando Coqui TTS.

config.py
Carrega configurações do projeto.

utils.py
Funções utilitárias.

---

# Skill obrigatória do Copilot

Skill: Modular Python Architecture

Sempre aplicar:

1. Código modular
2. Separação clara de responsabilidades
3. Funções pequenas
4. Type hints
5. Tratamento de erros
6. Logging estruturado
7. Código legível
8. Comentários explicativos

---

# Padrões de código

Seguir sempre:

PEP8
Type hints
Docstrings

Exemplo:

def extract_main_text(html: str) -> str:
"""
Extrai o conteúdo principal de uma página HTML.
"""
pass

---

# Playwright

O navegador deve utilizar **persistent context** para permitir login manual.

Diretório de dados:

browser-data/

Exemplo esperado:

playwright.chromium.launch_persistent_context()

---

# Text-to-Speech

O projeto deve utilizar **Coqui TTS** para gerar áudio localmente.

Requisitos:

* não utilizar serviços pagos
* não utilizar APIs externas
* gerar áudio localmente
* formato WAV ou MP3

O sistema deve carregar um modelo compatível com português.

---

# Tratamento de textos longos

Se o texto for muito grande:

1. dividir em partes
2. gerar múltiplos áudios
3. opcionalmente concatenar

---

# Boas práticas

Sempre:

* validar entradas
* tratar exceções
* registrar logs
* evitar funções grandes
* manter responsabilidades separadas

---

# Comportamento esperado do Copilot

O Copilot deve:

1. responder sempre em português
2. seguir a arquitetura definida
3. explicar decisões importantes
4. evitar código monolítico
5. priorizar código limpo e modular
