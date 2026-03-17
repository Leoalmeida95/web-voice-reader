chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "tts") {

    fetch("http://localhost:8000/read-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: message.text })
    })
    .then(r => r.arrayBuffer())
    .then(buffer => {
      sendResponse({
        success: true,
        audio: Array.from(new Uint8Array(buffer))
      });
    })
    .catch(() => sendResponse({ success: false }));

    return true;
  }

});