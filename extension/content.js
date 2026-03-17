(async () => {

    const text = extractMainContent();

    console.log("Texto extraído:", text.slice(0, 200));

    const response = await fetch("http://localhost:8000/read-page", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        console.error("Erro ao gerar áudio");
        return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // remover player anterior
    const oldPlayer = document.getElementById("web-voice-player");
    if (oldPlayer) oldPlayer.remove();

    const audio = document.createElement("audio");
    audio.id = "web-voice-player";
    audio.controls = true;
    audio.src = url;

    audio.style.position = "fixed";
    audio.style.bottom = "20px";
    audio.style.right = "20px";
    audio.style.zIndex = "9999";

    document.body.appendChild(audio);

    audio.play();

})();

function extractMainContent() {

    let container = document.querySelector(".show-content");

    if (!container) {
        container =
            document.querySelector("#wiki_page_show") ||
            document.querySelector("main") ||
            document.body;
    }

    // remover coisas irrelevantes
    container.querySelectorAll(
        "nav,aside,footer,button,menu,script,style,svg,iframe"
    ).forEach(el => el.remove());

    let text = container.innerText || "";

    text = text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "\n")
        .trim();

    return text;
}