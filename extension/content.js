// Remove elementos irrelevantes do DOM
function removeIrrelevantes(root) {
    const seletor = 'nav,aside,footer,button,menu';
    root.querySelectorAll(seletor).forEach(el => el.remove());
}

window.extractMainContent = function() {
    // 1. Priorizar .content
    let container = document.querySelector('.content');
    if (!container) {
        // 2. Fallback: main ou article
        container = document.querySelector('main') || document.querySelector('article');
    }
    if (!container) {
        // 3. Fallback final: body
        container = document.body;
    }
    // Remove elementos irrelevantes do container
    removeIrrelevantes(container);
    // Extrai texto visível usando innerText
    let text = container.innerText || '';
    // Limpa o texto
    text = text.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
    return text;
};
