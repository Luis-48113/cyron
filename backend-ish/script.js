// Replace with your deployed Worker URL
const WORKER_URL = "https://cyron-worker.gx8nz7qrdr.workers.dev";
const submitBtn = document.getElementById("submit");
const promptInput = document.getElementById("prompt");
const chatBox = document.getElementById("chat-box");

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

submitBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  appendMessage(prompt, "user");
  promptInput.value = "";
  appendMessage("Thinking...", "bot");

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    chatBox.lastChild.textContent = ""; // clear "Thinking..."

    if (data.output) {
      // Hugging Face may return an array with text
      const text = Array.isArray(data.output)
        ? data.output.map(d => d.generated_text || JSON.stringify(d)).join("\n")
        : JSON.stringify(data.output);

      appendMessage(text, "bot");
    } else if (data.error) {
      appendMessage(`Error: ${data.error}`, "bot");
    }
  } catch (err) {
    chatBox.lastChild.textContent = "";
    appendMessage(`Fetch error: ${err.message}`, "bot");
  }
});
