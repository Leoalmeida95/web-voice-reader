// Extração do conteúdo principal usando Readability.js
window.extractMainContent = function() {
	try {
		const documentClone = document.cloneNode(true);
		const article = new Readability(documentClone).parse();
		if (article && article.textContent) {
			return article.textContent;
		}
	} catch (e) {}
	// Fallback para body.innerText
	return document.body.innerText;
};
