# Shopify Voice Automation

This project demonstrates a voice automation solution for Shopify stores, allowing users to control their store experience using voice commands. It includes a Next.js application for processing voice commands via AI (Groq) and a browser extension to capture voice input and execute actions on the Shopify storefront.

## Features

- **Voice Command Processing**: Uses Groq AI to interpret natural language voice commands and translate them into actionable steps.
- **Shopify Integration**: Designed to interact with a Shopify store's DOM to perform actions like navigation, search, adding to cart, filling forms, and more.
- **Browser Extension**: A simple Chrome/Firefox extension to capture voice input and send it to the Next.js backend for processing.
- **Demo Interface**: A web-based demo to manually test voice commands and see the AI's JSON response.

## Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/shopify-voice-automation.git
cd shopify-voice-automation
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add your Groq API key:

\`\`\`
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SHOPIFY_STORE_URL=https://your-store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STORE_NAME=Your Store Name
\`\`\`

You can get a Groq API key from [Groq Console](https://console.groq.com/).
`NEXT_PUBLIC_SHOPIFY_STORE_URL` should be your Shopify store's URL (e.g., `https://cfcu5s-iu.myshopify.com`).
`NEXT_PUBLIC_SHOPIFY_STORE_NAME` is a friendly name for your store.

### 4. Run the Next.js Application

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be running at `http://localhost:3000`.

### 5. Install the Browser Extension

This project includes a basic browser extension.

#### For Chrome:
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the `public/extension` directory from your cloned project.

#### For Firefox:
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on..." and select any file inside the `public/extension` directory (e.g., `manifest.json`).

The extension icon should appear in your browser's toolbar.

### 6. Integrate with Shopify (Optional)

To use the voice agent directly on your Shopify store, you'll need to inject the `voice-agent.liquid` snippet into your Shopify theme.

1. **Copy `shopify_integration/snippets/voice-agent.liquid`** to your Shopify theme's `snippets` directory.
2. **Include the snippet** in your theme's `layout/theme.liquid` file, typically before the closing `</body>` tag:

   \`\`\`liquid
   {% include 'voice-agent' %}
   </body>
   </html>
   \`\`\`

   This snippet will load the necessary scripts to enable voice commands on your live Shopify store.

## Usage

### Using the Demo Interface

Navigate to `http://localhost:3000` in your browser. You can type commands into the "Voice Command" input field and click "Process Command" to see the AI's JSON response. Use the "Test Groq Connection" button to verify your API key setup.

### Using the Browser Extension (on Shopify Store)

1. Navigate to your Shopify store (e.g., `https://your-store-name.myshopify.com`).
2. Click the browser extension icon.
3. Click the "Start Listening" button and speak your command (e.g., "Go to cart", "Search for rings", "Add a blue t-shirt to cart").
4. The extension will send the command to your running Next.js app, and the AI will attempt to perform the requested action on the Shopify page.

## API Endpoints

- `POST /api/process-command`: Processes a voice command and returns a JSON object with actions to perform.
- `POST /api/groq-test`: Tests the connection to the Groq API.

## Contributing

Feel free to fork this repository, open issues, and submit pull requests.
