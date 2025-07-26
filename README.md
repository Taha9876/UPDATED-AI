# Voice-Controlled Shopify Automation Agent

A comprehensive voice-controlled automation system for Shopify stores using completely **FREE** tools and APIs.

## 🎯 Features

- **Voice Recognition**: Built-in Web Speech API (completely free)
- **AI Processing**: Groq AI for fast, free inference
- **DOM Automation**: Direct website interaction and control
- **Universal Compatibility**: Works on any website, not just Shopify
- **Text-to-Speech**: Built-in browser TTS for responses
- **Browser Extension**: Chrome extension for seamless integration

## 🛠️ Free Tools Used

### 1. **Web Speech API** (Built-in Browser)
- Real-time voice recognition
- No API keys required
- Works offline
- Supports multiple languages

### 2. **Groq AI** (Free Tier)
- Fast AI inference (up to 14,000 tokens/minute free)
- Multiple model options
- Easy integration with AI SDK

### 3. **Speech Synthesis API** (Built-in Browser)
- Text-to-speech responses
- Multiple voice options
- No external dependencies

### 4. **Chrome Extensions API** (Free)
- DOM manipulation capabilities
- Cross-site functionality
- Persistent background processes

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

\`\`\`bash
npm install
npm run dev
\`\`\`

### 2. Get Free Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Generate API key (free tier includes 14,000 tokens/minute)

### 3. Install Browser Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `public/extension` folder
4. Pin the extension to your toolbar

### 4. Configure the System

1. Open the dashboard at `http://localhost:3000`
2. Enter your Shopify store URL
3. Add your Groq API key
4. Test the connection

## 🎤 Voice Commands

### Navigation Commands
- "Go to homepage"
- "Navigate back" 
- "Go to checkout"
- "Show cart"

### Product Commands
- "Search for [product name]"
- "Add to cart"
- "Show product details"
- "Compare products"

### Shopping Commands
- "Proceed to checkout"
- "Apply discount code"
- "Update quantity"
- "Remove from cart"

### Advanced Commands
- "Filter by price under $50"
- "Sort by popularity"
- "Show reviews"
- "Find similar products"

## 🏗️ Architecture

### Frontend (Next.js App)
- Voice recognition interface
- Real-time transcription
- AI response display
- Configuration management

### Backend API Routes
- `/api/process-command`: Processes voice commands using Groq AI
- `/api/test-connection`: Tests API connectivity

### Browser Extension
- **manifest.json**: Extension configuration
- **background.js**: Service worker for message handling
- **content.js**: DOM manipulation and automation
- **popup.html**: Quick access interface

### AI Processing Flow
1. Voice → Web Speech API → Text
2. Text → Groq AI → Structured Command
3. Command → Extension → DOM Action
4. Response → Text-to-Speech → User

## 🔧 Customization

### Adding New Commands

1. **Update the AI prompt** in `/api/process-command/route.ts`:
\`\`\`typescript
system: \`Available actions:
- customAction: {type: "customAction", params: "value"}\`
\`\`\`

2. **Add handler** in `content.js`:
\`\`\`javascript
case 'customAction':
  this.handleCustomAction(action.params);
  break;
\`\`\`

### Supporting New Websites

1. **Update manifest.json** with new host permissions
2. **Add site-specific selectors** in the DOM controller
3. **Test and refine** the automation logic

### Advanced AI Features

The system uses the AI SDK with Groq for:
- **Intent Recognition**: Understanding complex voice commands
- **Context Awareness**: Maintaining conversation state
- **Action Planning**: Breaking down complex tasks
- **Error Handling**: Graceful failure recovery

## 🌐 Universal Website Support

This system can be adapted for any website by:

1. **Updating selectors** in the DOM controller
2. **Adding site-specific logic** for navigation
3. **Customizing the AI prompts** for domain-specific actions
4. **Testing automation flows** on the target site

## 📊 Performance & Limits

### Groq Free Tier Limits
- 14,000 tokens per minute
- Multiple model options
- No daily limits
- Commercial use allowed

### Browser API Limits
- Web Speech API: No limits
- Speech Synthesis: No limits
- Extension APIs: Standard Chrome limits

## 🔒 Privacy & Security

- **Local Processing**: Voice recognition happens in browser
- **No Data Storage**: Commands are processed in real-time
- **Secure APIs**: All API calls use HTTPS
- **User Control**: Full control over data and permissions

## 🚀 Deployment Options

### Local Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Vercel Deployment
- Push to GitHub
- Connect to Vercel
- Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add new voice commands or website support
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use and modify for your projects!

## 🆘 Troubleshooting

### Voice Recognition Not Working
- Check microphone permissions
- Ensure HTTPS connection
- Try different browsers (Chrome recommended)

### AI Commands Not Processing
- Verify Groq API key
- Check network connection
- Monitor browser console for errors

### Extension Not Loading
- Enable Developer mode in Chrome
- Check extension permissions
- Reload the extension

## 🔮 Future Enhancements

- **Multi-language Support**: Voice commands in different languages
- **Visual Recognition**: Screenshot analysis for better context
- **Workflow Recording**: Record and replay complex shopping flows
- **Analytics Dashboard**: Track usage and optimize commands
- **Mobile Support**: Voice control on mobile browsers
\`\`\`
