(async () => {
    try {

        const text = await extractMainContent();

        // validação do texto extraído
        if (!text || typeof text !== "string" || text.trim().length < 50) {
            console.warn("Texto extraído é vazio ou muito pequeno.");
            return;
        }

        let finalText = text;

        if (finalText.length > 20000) {
            finalText = finalText.slice(0, 20000);
            console.warn("Texto foi truncado para 20000 caracteres.");
        }

        // remover player anterior
        const oldPlayer = document.getElementById("web-voice-player");
        if (oldPlayer) {
            try { oldPlayer.pause(); } catch (e) {}
            oldPlayer.remove();
        }

        let response;

        try {
            
            response = await fetch("http://localhost:8000/read-page", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: finalText })
            });
        } catch (e) {
            console.error("Erro de rede ao enviar texto para backend:", e);
            return;
        }

        if (!response.ok || !response.headers.get("content-type")?.includes("audio/wav")) {
            console.error("Resposta inesperada do backend.");
            return;
        }

        let blob;

        try {
            blob = await response.blob();
        } catch (e) {
            console.error("Erro ao ler blob de áudio:", e);
            return;
        }

        const url = URL.createObjectURL(blob);

        const audio = document.createElement("audio");
        audio.id = "web-voice-player";
        audio.controls = true;
        audio.preload = "auto";
        audio.src = url;

        audio.style.position = "fixed";
        audio.style.bottom = "20px";
        audio.style.right = "20px";
        audio.style.zIndex = "9999";
        audio.style.background = "#fff";
        audio.style.borderRadius = "8px";
        audio.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

        // liberar URL quando terminar
        audio.addEventListener("ended", () => {
            URL.revokeObjectURL(url);
        });

        audio.addEventListener("pause", () => {
            URL.revokeObjectURL(url);
        });

        document.body.appendChild(audio);

        try {
            await audio.play();
        } catch (e) {
            console.warn("Falha ao reproduzir áudio automaticamente:", e);
        }

    } catch (err) {
        console.error("Erro inesperado na extensão Web Voice Reader:", err);
    }
})();


function waitForContent() {

    return new Promise(resolve => {

        const interval = setInterval(() => {

            const content = document.querySelector(".show-content");

            if (content) {
                clearInterval(interval);
                resolve(content);
            }

        }, 300);

    });

}


async function extractMainContent() {

    const container = await waitForContent();

    if (!container) {
        console.warn("Container de conteúdo não encontrado.");
        return "";
    }

    const nodes = container.querySelectorAll("h1, h2, h3, p, li");

    const text = Array.from(nodes)
        .map(node => node.textContent.trim())
        .filter(t => t.length > 20)
        .join("\n\n");

    return text;
}