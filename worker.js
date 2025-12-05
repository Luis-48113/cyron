export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      // Serve a simple HTML form for browser testing
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test Meta LLaMA 3 8B Worker</title>
          </head>
          <body>
            <h1>Test Meta LLaMA 3 8B Worker</h1>
            <form id="promptForm">
              <input type="text" name="prompt" placeholder="Enter prompt" />
              <button type="submit">Send</button>
            </form>
            <pre id="output"></pre>

            <script>
              const form = document.getElementById('promptForm');
              const output = document.getElementById('output');
              form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const prompt = form.prompt.value;
                const res = await fetch(window.location.href, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt })
                });
                const data = await res.json();
                
                // Extract generated text
                if (data.output && Array.isArray(data.output)) {
                  output.textContent = data.output.map(item => item.generated_text).join('\\n');
                } else {
                  output.textContent = JSON.stringify(data, null, 2);
                }
              });
            </script>
          </body>
        </html>
      `;
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } else if (request.method === "POST") {
      try {
        const { prompt } = await request.json();

        // Hugging Face API token from environment variable
        const HF_TOKEN = env.HF_TOKEN;
        if (!HF_TOKEN) throw new Error("Hugging Face token not set in environment");

        // Call Meta LLaMA 3 8B via Router API
        const response = await fetch(
          "https://router.huggingface.co/models/meta-llama/Llama-3-8b-chat",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HF_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              inputs: prompt,
              options: { wait_for_model: true }
            })
          }
        );

        const data = await response.json();

        return new Response(JSON.stringify({ output: data }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      return new Response("Method not allowed", { status: 405 });
    }
  }
};
