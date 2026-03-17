(async () => {
    try {

        const text = await extractMainContent();

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
        if (oldPlayer) oldPlayer.remove();

        // pedir ao background para buscar o áudio
        const response = await new Promise(resolve => {
            chrome.runtime.sendMessage(
                { type: "tts", text: finalText },
                resolve
            );
        });

        if (!response || !response.success) {
            console.error("Erro ao gerar áudio no backend");
            return;
        }

        const bytes = new Uint8Array(response.audio);
        const blob = new Blob([bytes], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);

        createAudioPlayer(url);

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

    Object.assign(container.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "320px",
        background: "#1f1f1f",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
        zIndex: "999999",
        fontFamily: "Arial"
    });

    const title = document.createElement("div");
    title.textContent = "🔊 Web Voice Reader";
    title.style.fontWeight = "bold";

    const audio = document.createElement("audio");
    audio.src = audioUrl;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✖";
    closeBtn.style.float = "right";

    closeBtn.onclick = () => {
        audio.pause();
        container.remove();
    };

    title.appendChild(closeBtn);

    const playBtn = document.createElement("button");
    playBtn.textContent = "▶";

    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = "⏸";
        } else {
            audio.pause();
            playBtn.textContent = "▶";
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
    container.appendChild(audio);

    document.body.appendChild(container);

    audio.play().catch(() => {});
}