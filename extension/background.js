chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "tts") {

      fetch("http://localhost:8000/read-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message.text })
      })
      .then(res => res.arrayBuffer())
      .then(buffer => {
          sendResponse({
              success: true,
              audio: Array.from(new Uint8Array(buffer))
          });
      })
      .catch(err => {
          console.error(err);
          sendResponse({ success: false });
      });

      return true;
  }

 // resolver questão (Groq)
  if (message.type === "solve_question") {

    fetch("http://localhost:8000/solve-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: message.text })
    })
    .then(r => r.json())
    .then(data => {
      sendResponse({
        success: true,
        answer: data.answer
      });
    })
    .catch(() => sendResponse({ success: false }));

    return true;
  }
});