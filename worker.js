export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      // Serve a simple HTML page for browser testing
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Test Hugging Face Worker</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
              input, button { font-size: 16px; margin-top: 5px; }
              pre { background: #fff; padding: 10px; border: 1px solid #ccc; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>Test Hugging Face Worker</h1>
            <form id="promptForm">
              <input type="text" name="prompt" placeholder="Enter prompt" size="50" />
              <button type="submit">Send</button>
            </form>
            <pre id="output"></pre>

            <script>
              const form = document.getElementById('promptForm');
              const output = document.getElementById('output');
              form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const prompt = form.prompt.value.trim();
                if (!prompt) {
                  output.textContent = "Please enter a prompt.";
                  return;
                }

                output.textContent = "Loading...";

                try {
                  const res = await fetch(window.location.href, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                  });

                  const data = await res.json();

                  if (data.error) {
                    output.textContent = "Error: " + data.error;
                  } else {
                    output.textContent = JSON.stringify(data.output, null, 2);
                  }
                } catch (err) {
                  output.textContent = "Request failed: " + err.message;
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

        // Use the new router endpoint
        const response = await fetch(
          "https://api-inference.huggingface.co/models/gpt-neo-2.7B",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${HF_TOKEN}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
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
