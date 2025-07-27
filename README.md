# Shopify Voice Automation

This project demonstrates a voice automation solution for Shopify stores, leveraging AI models for natural language processing and command execution.

## Features

- **Voice Command Processing**: Convert spoken commands into actionable instructions.
- **Groq Integration**: Utilizes Groq for fast and efficient AI model inference.
- **Shopify Integration (Planned)**: Future integration to interact with Shopify store functionalities (e.g., adding to cart, searching products).
- **Browser Compatibility Check**: Ensures the user's browser supports necessary Web Speech API features.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/Taha9876/UPDATED-AI.git
cd UPDATED-AI
\`\`\`

### 2. Install Dependencies

Using pnpm:

\`\`\`bash
pnpm install
\`\`\`

### 3. Set up Environment Variables

Create a `.env.local` file in the root of your project and add your Groq API key:

\`\`\`
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SHOPIFY_STORE_NAME=your_shopify_store_name
NEXT_PUBLIC_SHOPIFY_STORE_URL=your_shopify_store_url
\`\`\`

You can obtain a Groq API key from [Groq Console](https://console.groq.com/).

### 4. Run the Development Server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/api/groq-test/route.ts`: API route to test the Groq API connection.
- `app/api/process-command/route.ts`: API route to process voice commands using Groq.
- `app/page.tsx`: Main application page with the voice command interface.
- `components/voice-commands-demo.tsx`: React component for the voice command demo UI.
- `components/browser-compatibility.tsx`: Component to check Web Speech API compatibility.
- `components/orna-voice-commands.tsx`: Placeholder for Shopify-specific voice commands.
- `components/orna-store-selectors.tsx`: Placeholder for Shopify store element selectors.
- `public/extension/`: Contains files for a potential browser extension.

## Deployment

This project can be deployed to Vercel. Ensure your `GROQ_API_KEY` is set as an environment variable in your Vercel project settings.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.
