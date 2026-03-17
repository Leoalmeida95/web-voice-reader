document.getElementById('sendText').addEventListener('click', async () => {
  document.getElementById('status').textContent = 'Extraindo texto...';
  chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => window.extractMainContent()
    }, async (results) => {
      const texto = results[0].result;
      document.getElementById('status').textContent = 'Enviando para backend...';
      try {
        const resp = await fetch('http://localhost:8000/read-page', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({text: texto})
        });
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        // Pausar qualquer áudio já em execução
        if (window._audioPlayer && !window._audioPlayer.paused) {
          window._audioPlayer.pause();
          window._audioPlayer.currentTime = 0;
        }
        const audio = new Audio(url);
        window._audioPlayer = audio;
        audio.play();
        document.getElementById('status').textContent = 'Áudio reproduzido!';
      } catch (e) {
        document.getElementById('status').textContent = 'Erro ao enviar texto.';
      }
    });
  });
});
