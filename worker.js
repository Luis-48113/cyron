export default {
  async fetch(request, env) {
    try {
      const { prompt } = await request.json();

      // Hugging Face Inference API
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt-neo-2.7B", // replace with your model
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${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}`,
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
  }
};
