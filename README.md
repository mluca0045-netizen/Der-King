# Der-King
Nictw

## API key setup

This project uses an OpenRouter API key. Never commit the real key to the
repository — it lives only in a local `.env` file, which is gitignored.

1. Copy the template:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder with your real key from
   <https://openrouter.ai/keys>:

   ```
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

3. Load it in your code from the environment, e.g. in Python:

   ```python
   import os
   api_key = os.environ["OPENROUTER_API_KEY"]
   ```

   or in Node.js:

   ```js
   const apiKey = process.env.OPENROUTER_API_KEY;
   ```

If a key is ever accidentally committed or shared publicly, revoke it on the
OpenRouter dashboard and create a new one.
