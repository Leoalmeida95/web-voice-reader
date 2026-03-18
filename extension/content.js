// =============================
// BOTÃO "LER PÁGINA"
// =============================
(function addReadButton() {
    if (document.getElementById('read-page-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'read-page-btn';
    btn.textContent = '🔊 Ler página';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999999,
        background: '#1f1f1f',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 16px',
        cursor: 'pointer'
    });
    btn.onclick = async () => {
        btn.disabled = true;
        btn.textContent = 'Carregando...';
        try {
            const text = await extractMainContent();
            if (!text || text.length < 50) {
                alert("Texto insuficiente");
                btn.disabled = false;
                btn.textContent = '🔊 Ler página';
                return;
            }
            showLoadingPlayer();
            const response = await sendTTS(text);
            if (!response.success) {
                throw new Error("Erro no TTS");
            }
            createAudioPlayer(response.audio);
        } catch (e) {
            console.error(e);
            alert("Erro ao gerar áudio");
        } finally {
            btn.disabled = false;
            btn.textContent = '🔊 Ler página';
        }
    };
    document.body.appendChild(btn);
})();


// =============================
// BOTÃO "RESOLVER COM IA"
// =============================
(function addSolveButton() {
    if (document.getElementById('solve-ia-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'solve-ia-btn';
    btn.textContent = '🧠 Resolver com IA';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '70px',
        right: '20px',
        zIndex: 999999,
        background: '#2d7ff9',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 16px',
        cursor: 'pointer'
    });
    btn.onclick = async () => {
        btn.disabled = true;
        btn.textContent = 'Carregando...';
        try {
            const question = extractQuestion();
            if (!question) {
                alert("Pergunta não encontrada");
                btn.disabled = false;
                btn.textContent = '🧠 Resolver com IA';
                return;
            }
            showLoadingPlayer();
            const aiResponse = await new Promise(resolve => {
                chrome.runtime.sendMessage(
                    { type: "solve_question", text: question },
                    resolve
                );
            });
            if (!aiResponse?.success) {
                throw new Error("Erro IA");
            }
            const tts = await sendTTS(aiResponse.answer);
            if (!tts.success) {
                throw new Error("Erro TTS");
            }
            createAudioPlayer(tts.audio);
        } catch (e) {
            console.error(e);
            alert("Erro ao resolver");
        } finally {
            btn.disabled = false;
            btn.textContent = '🧠 Resolver com IA';
        }
    };
    document.body.appendChild(btn);
})();


// =============================
// TTS VIA BACKGROUND (FIX CORS)
// =============================
function sendTTS(text) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(
            { type: "tts", text },
            resolve
        );
    });
}


// =============================
// EXTRACT QUESTION
// =============================
function extractQuestion() {

    const qEl = document.querySelector('.question_text');
    if (!qEl) return '';

    const question = qEl.textContent.trim().replace(/\s+/g, ' ');

    const altEls = document.querySelectorAll('.answers .answer_label');

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const alternatives = Array.from(altEls).map((el, i) => {
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        return `${letters[i]}) ${text}`;
    });

    return `Pergunta:\n${question}\n\nAlternativas:\n${alternatives.join('\n')}`;
}


// =============================
// EXTRAÇÃO DE TEXTO
// =============================
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
    if (!container) return "";

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

    return textParts.join("\n\n");
}


// =============================
// PLAYER (SEM CORS)
// =============================
function showLoadingPlayer() {
    removeAudioPlayer();
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
        zIndex: "9999999",
        fontFamily: "Arial",
        textAlign: "center"
    });
    container.textContent = "🔄 Gerando áudio...";
    document.body.appendChild(container);
}

function removeAudioPlayer() {
    const existing = document.getElementById("web-voice-player-container");
    if (existing) existing.remove();
}

function createAudioPlayer(audioArray) {
    removeAudioPlayer();
    const blob = new Blob(
        [new Uint8Array(audioArray)],
        { type: "audio/wav" }
    );
    const url = URL.createObjectURL(blob);
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
        zIndex: "9999999",
        fontFamily: "Arial"
    });
    const title = document.createElement("div");
    title.textContent = "🔊 Web Voice Reader";
    title.style.fontWeight = "bold";
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    audio.autoplay = true;
    audio.onplaying = audio.oncanplay = () => {
        container.querySelector(".loading")?.remove();
    };
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✖";
    closeBtn.onclick = () => {
        audio.pause();
        URL.revokeObjectURL(url);
        container.remove();
    };
    container.appendChild(title);
    container.appendChild(closeBtn);
    container.appendChild(audio);
    document.body.appendChild(container);
    container.querySelector(".loading")?.remove();
}