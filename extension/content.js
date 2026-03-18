(function addSolveWithAIButton() {

    if (document.getElementById('solve-ia-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'solve-ia-btn';
    btn.textContent = '🧠 Resolver com IA';

    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000000,
        background: '#2d7ff9',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 18px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    });

    function updateButtonPosition() {

        const player = document.getElementById("web-voice-player-container");

        if (!player) {
            btn.style.bottom = "20px";
            btn.style.right = "20px";
            return;
        }

        const playerRect = player.getBoundingClientRect();

        // 👉 posiciona o botão à esquerda do player
        const playerWidth = playerRect.width;

        btn.style.bottom = "20px";
        btn.style.right = `${playerWidth + 40}px`; // 40px de espaço
    }

    // Atualiza posição continuamente (leve e suficiente)
    setInterval(updateButtonPosition, 300);

    // Também reage a resize
    window.addEventListener("resize", updateButtonPosition);


    btn.onclick = async () => {
        const questionText = extractQuestion();
        if (!questionText) {
            alert('Não foi possível extrair a questão.');
            return;
        }
        btn.disabled = true;
        btn.textContent = 'Resolvendo...';
        try {
            const response = await new Promise(resolve => {
                chrome.runtime.sendMessage(
                    { type: "solve_question", text: questionText },
                    resolve
                );
            });
            if (!response || !response.success) {
                throw new Error("Erro ao resolver questão");
            }
            const resposta = response.answer;
            if (!resposta) {
                throw new Error("Resposta vazia");
            }
            // Toca áudio via streaming direto
            createAudioPlayer(resposta);
        } catch (e) {
            alert('Erro ao resolver com IA: ' + e.message);
        } finally {
            btn.disabled = false;
            btn.textContent = '🧠 Resolver com IA';
        }
    };

    document.body.appendChild(btn);

})();


function extractQuestion() {

    const qEl = document.querySelector('.question_text');
    if (!qEl) return '';

    const question = qEl.textContent
        .trim()
        .replace(/\s+/g, ' ');

    const altEls = document.querySelectorAll('.answers .answer_label');

    if (!altEls.length) return question;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const alternatives = Array.from(altEls).map((el, i) => {
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        return `${letters[i]}) ${text}`;
    });

    return `Pergunta:\n${question}\n\nAlternativas:\n${alternatives.join('\n')}`;
}


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
        // Toca áudio via streaming direto
        createAudioPlayer(finalText);
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
    // Preferir primeiros parágrafos e conteúdo principal
    const nodes = container.querySelectorAll("p, h1, h2, h3");
    let textParts = [];
    let totalLen = 0;
    for (let node of nodes) {
        let t = node.textContent.trim();
        if (t.length < 20) continue;
        textParts.push(t);
        totalLen += t.length;
        if (totalLen > 1800) break;
    }
    let text = textParts.join("\n\n");
    // Smart truncation: prefer final de frase
    if (text.length > 1800) {
        let cut = text.slice(0, 1800);
        let lastSentence = cut.lastIndexOf('.') > 0 ? cut.lastIndexOf('.') : cut.lastIndexOf('!') > 0 ? cut.lastIndexOf('!') : cut.lastIndexOf('?');
        if (lastSentence > 1000) {
            text = cut.slice(0, lastSentence + 1);
        } else {
            text = cut;
        }
    }
    return text;
}

    function extractPreviewContent() {
        // Preview mode: retorna só os primeiros 2-3 parágrafos significativos
        const container = document.querySelector('.show-content') || document.body;
        const nodes = container.querySelectorAll('p');
        let preview = [];
        for (let node of nodes) {
            let t = node.textContent.trim();
            if (t.length < 20) continue;
            preview.push(t);
            if (preview.length >= 3) break;
        }
        return preview.join("\n\n");
    }


function createAudioPlayer(text) {
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
    audio.src = `http://localhost:8000/stream-tts?text=${encodeURIComponent(text)}`;
    audio.autoplay = true;
    audio.controls = true;

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