"""
Teste simples do fluxo completo usando main.py
"""

import subprocess
import sys

URL_TESTE = "https://pt.wikipedia.org/wiki/Intelig%C3%AAncia_artificial"

print("Executando teste do projeto...\n")

process = subprocess.run(
    [sys.executable, "main.py", URL_TESTE],
    capture_output=True,
    text=True
)

print("===== STDOUT =====")
print(process.stdout)

print("===== STDERR =====")
print(process.stderr)

print("\nTeste finalizado.")