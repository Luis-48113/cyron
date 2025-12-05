export default {
  async fetch(request, env) {
    try {
      const { prompt } = await request.json();

      // Get Hugging Face API key from environment variable
      const HUGGINGFACE_API_KEY = env.HUGGINGFACE_API_KEY;

      if (!HUGGINGFACE_API_KEY) {
        return new Response(JSON.stringify({ error: "API key not set" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Hugging Face Inference API
      const response = await fetch(
        "https://api-inference.huggingface.co/models/gpt-neo-2.7B",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
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
