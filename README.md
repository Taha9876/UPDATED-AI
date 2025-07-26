# Shopify Voice Automation

This project enables voice-controlled automation for your Shopify store using Next.js, Groq, and the Web Speech API.

## Features

-   **Voice Commands**: Control your Shopify store with natural language commands.
-   **Groq Integration**: Utilizes Groq for fast and efficient natural language processing.
-   **Browser Extension**: A companion browser extension to inject the voice agent into your Shopify store.
-   **Demo Page**: A Next.js application to test voice commands and Groq API connection.

## Setup and Deployment

### 1. Clone the Repository

\`\`\`bash
git clone [your-repo-url]
cd shopify-voice-automation
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Environment Variables

Create a `.env.local` file in the root of your project and add your Groq API key:

\`\`\`
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SHOPIFY_STORE_NAME="Your Shopify Store Name"
\`\`\`

For Vercel deployments, set `GROQ_API_KEY` as an environment variable in your Vercel project settings.

### 4. Run Locally

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

The application will be available at `http://localhost:3000`.

### 5. Deploy to Vercel

Deploy your Next.js application to Vercel. Ensure you set the `GROQ_API_KEY` environment variable in your Vercel project settings.

### 6. Shopify Integration

#### a. Get Your Next.js App URL

After deploying your Next.js app to Vercel, get its public URL (e.g., `https://your-app-name.vercel.app`). This will be your `NEXTJS_APP_URL`.

#### b. Add Liquid Snippet to Shopify

1.  In your Shopify admin, navigate to **Online Store > Themes**.
2.  Find your current theme and click **Actions > Edit code**.
3.  Under the `Snippets` directory, create a new snippet named `voice-agent.liquid`.
4.  Copy the content from `shopify_integration/snippets/voice-agent.liquid` into this new snippet.
5.  **Important**: Replace `YOUR_NEXTJS_APP_URL` in the `voice-agent.liquid` snippet with your actual deployed Next.js app URL.

    ```liquid
    <script>
      window.NEXTJS_APP_URL = "YOUR_NEXTJS_APP_URL"; // e.g., "https://your-app-name.vercel.app"
    </script>
    \`\`\`

6.  Include the snippet in your theme's `theme.liquid` file. Find the `</body>` tag and add the following line just before it:

    ```liquid
    {% render 'voice-agent' %}
    \`\`\`

#### c. Install the Browser Extension

1.  Open your browser (e.g., Chrome) and go to `chrome://extensions`.
2.  Enable "Developer mode" in the top right corner.
3.  Click "Load unpacked" and select the `public/extension` directory from your cloned project.
4.  The extension will now be installed. Pin it to your toolbar for easy access.

### 7. Usage

1.  Visit your Shopify store.
2.  Click the browser extension icon.
3.  Click the microphone button to start listening for commands.
4.  Try commands like:
    -   "Go to products"
    -   "Search for t-shirts"
    -   "Add Vintage T-Shirt to cart"
    -   "Go to checkout"
    -   "Increase quantity of [product name] to [number]"
    -   "Remove [product name] from cart"

## Project Structure

-   `app/api`: Next.js API routes for processing voice commands and testing Groq connection.
-   `components`: React components, including the voice command demo and UI components.
-   `public/extension`: Source code for the browser extension.
-   `shopify_integration`: Shopify Liquid snippet for injecting the voice agent.

## Troubleshooting

-   **"Speech recognition not supported"**: Ensure you are using a browser that supports the Web Speech API (e.g., Chrome, Edge).
-   **API Key Errors**: Double-check your `GROQ_API_KEY` in `.env.local` (for local) or Vercel environment variables (for deployment).
-   **Command Processing Errors**: Check the network tab in your browser's developer tools for errors from `/api/process-command`.
-   **Extension Not Working**: Ensure "Developer mode" is enabled in `chrome://extensions` and the extension is loaded unpacked correctly. Also, verify `NEXTJS_APP_URL` in your `voice-agent.liquid` snippet is correct.
