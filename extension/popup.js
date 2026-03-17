document.getElementById('sendText').addEventListener('click', async () => {
  document.getElementById('status').textContent = 'Extraindo texto...';
  chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => document.body.innerText
    }, async (results) => {
      const texto = results[0].result;
      document.getElementById('status').textContent = 'Enviando para backend...';
      try {
        const resp = await fetch('http://localhost:8000/read-page', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({text: texto})
        });
        const data = await resp.json();
        document.getElementById('status').textContent = 'Áudio gerado!';
      } catch (e) {
        document.getElementById('status').textContent = 'Erro ao enviar texto.';
      }
    });
  });
});
