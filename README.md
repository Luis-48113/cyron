# cyron
**Cyron** is a Cloudflare Worker project that connects to Hugging Face’s Meta LLaMA 3.1 8B model.  
It allows you to send prompts via a web interface and receive AI-generated responses in real time.

---

 Features

- Simple web interface to test prompts
- Sends requests to the Meta LLaMA 3.1 8B model
- Uses Cloudflare Worker for serverless execution
- Secure API key handling via Wrangler secrets

---

Setup

1. **Clone the repository**:

```bash
git clone https://github.com/<YOUR_USERNAME>/cyron.git
cd cyron
Install Wrangler CLI (if not installed):

bash
Copy code
npm install -g wrangler
Add your Hugging Face API token as a secret:

bash
Copy code
wrangler secret put HF_TOKEN
Publish your Worker:

bash
Copy code
wrangler deploy
Usage
Visit your Worker URL in a browser

Enter a prompt in the form

Click Send to get a response from the LLaMA 3.1 8B model

Responses appear below the input form

File Structure
bash
Copy code
cyron/
├── worker.js      # Main Worker script
├── package.json   # NPM / Wrangler dependencies
├── README.md      # This file
└── LICENSE        # License file
License
This project is licensed under the MIT License. See LICENSE for details.
