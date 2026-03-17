function isVisible(el) {
    const style = window.getComputedStyle(el);
    return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
    );
}

function extractVisibleText(root) {
    let text = "";

    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;

    while (node = walker.nextNode()) {
        const parent = node.parentElement;

        if (!parent) continue;

        if (!isVisible(parent)) continue;

        const value = node.nodeValue.trim();

        if (value.length > 2) {
            text += value + "\n";
        }
    }

    return text;
}

function extractMainContent() {

    let container =
        document.querySelector(".show-content") ||
        document.querySelector("#content") ||
        document.querySelector("main") ||
        document.querySelector("article");

    if (!container) {
        container = document.body;
    }

    // remover coisas irrelevantes
    container.querySelectorAll(
        "nav,aside,footer,button,menu,script,style,svg"
    ).forEach(el => el.remove());

    let text = extractVisibleText(container);

    text = text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, "\n")
        .trim();

    return text;
}