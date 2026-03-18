from groq import Groq
from config.settings import (
    GROG_API_KEY
)

client = Groq(api_key=GROG_API_KEY)

response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
        {"role": "user", "content": "Qual é a capital do Brasil?"}
    ]
)

print(response.choices[0].message.content)