
(async () => {
    try {
        let text = extractMainContent();
        // Validação do texto extraído
        if (!text || typeof text !== 'string' || text.trim().length < 50) {
            console.warn("Texto extraído é vazio ou muito pequeno.");
            return;
        }
        if (text.length > 20000) {
            text = text.slice(0, 20000);
            console.warn("Texto foi truncado para 20000 caracteres.");
        }

        // Pausar e remover player anterior
        const oldPlayer = document.getElementById("web-voice-player");
        if (oldPlayer) {
            try { oldPlayer.pause(); } catch(e){}
            oldPlayer.remove();
        }

        let response;
        try {
            response = await fetch("http://localhost:8000/read-page", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });
        } catch (e) {
            console.error("Erro de rede ao enviar texto para backend:", e);
            return;
        }
        if (!response.ok || !response.headers.get('content-type')?.includes('audio/wav')) {
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

        // Libera o objeto URL após o uso
        audio.addEventListener('ended', () => {
            URL.revokeObjectURL(url);
        });
        audio.addEventListener('pause', () => {
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

function extractMainContent() {
    // Prioriza .content, depois main/article/body
    let container = document.querySelector('.content')
        || document.querySelector('main')
        || document.querySelector('article')
        || document.body;
    if (!container) return '';
    // Remove elementos irrelevantes
    try {
        container.querySelectorAll('nav,aside,footer,button,menu,script,style,svg,iframe').forEach(el => el.remove());
    } catch (e) {}
    let text = container.innerText || '';
    text = text.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
    return text;
}