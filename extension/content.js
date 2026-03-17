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
        const oldPlayer = document.getElementById("web-voice-player-container");
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

        try {
            createAudioPlayer(url);
        } catch (e) {
            console.warn("Falha ao criar player:", e);
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

function createAudioPlayer(audioUrl) {

    const existing = document.getElementById("web-voice-player-container");
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.id = "web-voice-player-container";

    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.width = "320px";
    container.style.background = "#1f1f1f";
    container.style.color = "#fff";
    container.style.padding = "12px";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "0 6px 16px rgba(0,0,0,0.4)";
    container.style.zIndex = "999999";

    const title = document.createElement("div");
    title.innerText = "🔊 Web Voice Reader";
    title.style.fontWeight = "bold";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖";
    closeBtn.style.float = "right";
    closeBtn.onclick = () => {
        audio.pause();
        container.remove();
    };

    title.appendChild(closeBtn);

    const audio = document.createElement("audio");
    audio.src = audioUrl;

    const playBtn = document.createElement("button");
    playBtn.innerText = "▶";

    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerText = "⏸";
        } else {
            audio.pause();
            playBtn.innerText = "▶";
        }
    };

    const progress = document.createElement("input");
    progress.type = "range";
    progress.min = 0;
    progress.max = 100;
    progress.value = 0;
    progress.style.width = "100%";

    audio.ontimeupdate = () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.value = percent || 0;
    };

    progress.oninput = () => {
        audio.currentTime = (progress.value / 100) * audio.duration;
    };

    container.appendChild(title);
    container.appendChild(progress);
    container.appendChild(playBtn);
    container.appendChild(audio); // importante

    document.body.appendChild(container);

    audio.play().catch(()=>{});
}