"""
Gerencia inicialização do navegador e navegação usando Playwright.
"""
from playwright.async_api import async_playwright, BrowserContext
from config import get_config
import logging

BROWSER_DATA_DIR = "browser-data"

class BrowserManager:
    def __init__(self, config: get_config):
        self.config = config
        self.context: BrowserContext | None = None
        self.playwright = None

    async def __aenter__(self):
        self.playwright = await async_playwright().start()
        self.context = await self.playwright.chromium.launch_persistent_context(
            BROWSER_DATA_DIR,
            headless=False,
            locale="pt-BR"
        )
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if self.context:
            await self.context.close()
        if self.playwright:
            await self.playwright.stop()

    async def carregar_pagina(self, url: str) -> str:
        logging.info(f"Carregando página: {url}")
        page = await self.context.new_page()
        await page.goto(url)
        await page.wait_for_load_state("networkidle")
        html = await page.content()
        await page.close()
        return html


async def conectar_chrome_existente():
    playwright = await async_playwright().start()

    browser = await playwright.chromium.connect_over_cdp(
        "http://localhost:9222"
    )

    context = browser.contexts[0]

    pages = context.pages

    # pega a aba ativa
    page = pages[-1]

    return page

async def obter_html_aba_ativa():
    page = await conectar_chrome_existente()

    await page.wait_for_load_state("networkidle")

    html = await page.content()

    return html