# Copilot Project Instructions

## Idioma obrigatório

Todas as respostas, explicações, comentários de código e documentação devem ser geradas **sempre em português do Brasil**.

---

# Objetivo do projeto

Este projeto tem como objetivo criar uma ferramenta em Python que:

1. Abre uma página web usando Playwright
2. Permite utilizar sessões autenticadas do navegador
3. Extrai o conteúdo textual principal da página
4. Limpa o texto removendo elementos irrelevantes
5. Converte o texto em áudio usando Azure Speech Text-to-Speech
6. Gera um arquivo de áudio narrado em português do Brasil

Fluxo esperado do sistema:

URL → navegador Playwright → extração de texto → limpeza → TTS → arquivo de áudio

---

# Stack tecnológica

Linguagem:

* Python 3.11+

Bibliotecas principais:

* playwright
* beautifulsoup4
* readability-lxml
* azure-cognitiveservices-speech
* python-dotenv
* asyncio
* logging

Serviços externos:

* Azure AI Speech (Text to Speech)

---

# Estrutura do projeto

A estrutura do projeto deve seguir o padrão abaixo:

project/
main.py
browser.py
extractor.py
tts.py
config.py
utils.py
requirements.txt
.env
README.md

Responsabilidade de cada módulo:

main.py
Orquestra todo o fluxo da aplicação.

browser.py
Gerencia inicialização do navegador e navegação usando Playwright.

extractor.py
Responsável por extrair e limpar o texto da página.

tts.py
Converte texto em áudio usando Azure Speech.

config.py
Carrega variáveis de ambiente e configurações do projeto.

utils.py
Funções utilitárias reutilizáveis.

---

# Skill obrigatória do Copilot

O Copilot deve aplicar sempre a seguinte skill ao gerar código:

## Skill: Modular Python Architecture

Toda implementação deve seguir estes princípios:

1. Código modular
2. Separação clara de responsabilidades
3. Funções pequenas e reutilizáveis
4. Uso de tipagem (type hints)
5. Uso de async/await quando possível
6. Tratamento de erros estruturado
7. Logging em vez de prints
8. Comentários explicando decisões importantes

---

# Padrões de código

Sempre seguir:

PEP8
Type hints em funções
Docstrings em funções públicas

Exemplo esperado:

def extract_main_text(html: str) -> str:
"""
Extrai o conteúdo principal de uma página HTML.
"""
pass

---

# Playwright

O navegador deve usar **persistent context** para permitir login manual.

Diretório de dados:

browser-data/

Exemplo esperado:

playwright.chromium.launch_persistent_context()

---

# Azure Speech

Requisitos:

Idioma:
pt-BR

Voz recomendada:
pt-BR-FranciscaNeural

Formato de saída:
MP3

---

# Tratamento de textos longos

O sistema deve dividir textos muito grandes em partes (chunking) antes de enviar para o TTS para evitar limites de caracteres da API.

---

# Boas práticas

Sempre:

* validar entradas
* tratar exceções
* registrar logs
* evitar funções muito grandes
* manter responsabilidades separadas

---

# Comportamento esperado do Copilot

Ao gerar código, o Copilot deve:

1. Responder sempre em português
2. Explicar brevemente decisões importantes
3. Seguir a arquitetura definida
4. Evitar gerar arquivos monolíticos
5. Priorizar código legível e modular
