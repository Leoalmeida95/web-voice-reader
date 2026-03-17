document.getElementById("sendText").addEventListener("click", async () => {

  const status = document.getElementById("status");
  status.textContent = "Iniciando leitura...";

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  try {

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    status.textContent = "Player carregado.";

  } catch (e) {

    console.error(e);
    status.textContent = "Erro ao iniciar leitura.";

  }

});