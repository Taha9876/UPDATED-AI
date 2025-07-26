"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Settings, Zap } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { SpeechRecognition } from "web-speech-api"
import VoiceCommandsDemo from "@/components/voice-commands-demo"
import BrowserCompatibility from "@/components/browser-compatibility"
import OrnaStoreSelectors from "@/components/orna-store-selectors"
import AdvancedVoiceCommands from "@/components/advanced-voice-commands"

export default function VoiceShopifyAgent() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [shopifyUrl, setShopifyUrl] = useState("https://cfcu5s-iu.myshopify.com")
  const [groqApiKey, setGroqApiKey] = useState("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")
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected" | "error">("connected")
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true)
  const [pageContext, setPageContext] = useState(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check for speech recognition support with better fallbacks
    const checkSpeechSupport = () => {
      if ("webkitSpeechRecognition" in window) {
        return window.webkitSpeechRecognition
      } else if ("SpeechRecognition" in window) {
        return window.SpeechRecognition
      }
      return null
    }

    const SpeechRecognition = checkSpeechSupport()

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex
        const transcript = event.results[current][0].transcript
        setTranscript(transcript)

        if (event.results[current].isFinal) {
          processVoiceCommand(transcript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }
    } else {
      console.warn("Speech recognition not supported in this browser")
      setIsSpeechRecognitionSupported(false)
    }

    // Initialize speech synthesis with fallback
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    // Get page context from extension if available
    getPageContext()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const getPageContext = async () => {
    try {
      if (typeof window.chrome !== "undefined" && window.chrome.tabs) {
        const [tab] = await window.chrome.tabs.query({ active: true, currentWindow: true })
        if (tab.id) {
          const response = await window.chrome.tabs.sendMessage(tab.id, { type: "GET_CONTEXT" })
          setPageContext(response.context)
        }
      }
    } catch (error) {
      console.log("Could not get page context:", error)
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      synthRef.current.speak(utterance)
    }
  }

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          shopifyUrl,
          groqApiKey,
          pageContext,
        }),
      })

      const data = await response.json()
      setResponse(data.response)
      speak(data.response)

      // Execute the action(s) if provided
      if (data.action) {
        await executeAction(data.action)
      }
      if (data.followUp && Array.isArray(data.followUp)) {
        for (const action of data.followUp) {
          await executeAction(action)
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait between actions
        }
      }
    } catch (error) {
      console.error("Error processing command:", error)
      const errorMsg = "Sorry, I encountered an error processing your command."
      setResponse(errorMsg)
      speak(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const executeAction = async (action: any) => {
    try {
      // Send action to content script via extension messaging
      if (typeof window.chrome !== "undefined" && window.chrome.tabs) {
        const [tab] = await window.chrome.tabs.query({ active: true, currentWindow: true })
        if (tab.id) {
          const response = await window.chrome.tabs.sendMessage(tab.id, {
            type: "EXECUTE_ACTION",
            action: action,
          })
          console.log("Action executed:", response)
        }
      } else {
        // For demo purposes, simulate the action
        console.log("Executing action:", action)
      }
    } catch (error) {
      console.error("Error executing action:", error)
    }
  }

  const testConnection = async () => {
    try {
      setConnectionStatus("disconnected")
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopifyUrl,
          groqApiKey,
        }),
      })

      if (response.ok) {
        setConnectionStatus("connected")
        speak("Connection successful!")
      } else {
        setConnectionStatus("error")
        speak("Connection failed. Please check your settings.")
      }
    } catch (error) {
      setConnectionStatus("error")
      speak("Connection failed. Please check your settings.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Advanced Voice-Controlled Shopify Agent</h1>
          <p className="text-lg text-gray-600">Complete DOM automation with intelligent voice commands</p>
          <Badge className="bg-green-500">
            <Zap className="h-3 w-3 mr-1" />
            Advanced AI-Powered
          </Badge>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>Your Orna store is pre-configured and ready to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopify-url">Shopify Store URL</Label>
                <Input
                  id="shopify-url"
                  value={shopifyUrl}
                  onChange={(e) => setShopifyUrl(e.target.value)}
                  placeholder="https://your-store.myshopify.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groq-key">Groq API Key</Label>
                <Input
                  id="groq-key"
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => setGroqApiKey(e.target.value)}
                  placeholder="Enter your Groq API key"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={testConnection} variant="outline">
                Test Connection
              </Button>
              <Badge
                variant={
                  connectionStatus === "connected"
                    ? "default"
                    : connectionStatus === "error"
                      ? "destructive"
                      : "secondary"
                }
              >
                {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "error"
                    ? "Error"
                    : "Not Connected"}
              </Badge>
              {pageContext && (
                <Badge variant="outline">
                  Page: {pageContext.pageType} | Cart: {pageContext.cartCount}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Browser Compatibility Check */}
        <BrowserCompatibility />

        {/* Voice Control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Advanced Voice Control
              </CardTitle>
              <CardDescription>Speak naturally - the AI understands complex commands</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-32 h-32 rounded-full ${
                    isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
                </Button>
              </div>

              {transcript && (
                <div className="space-y-2">
                  <Label>Current Speech:</Label>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm">{transcript}</p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-600">Processing advanced command...</span>
                </div>
              )}

              {response && (
                <div className="space-y-2">
                  <Label>AI Response:</Label>
                  <Textarea value={response} readOnly className="min-h-[100px]" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Voice Examples</CardTitle>
              <CardDescription>Try these advanced commands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Search for gold earrings under $30",
                  "Add this to cart and checkout",
                  "Filter by 5-star reviews",
                  "Sort by newest arrivals",
                  "Remove the second item from cart",
                  "Apply discount code SAVE20",
                  "Show me similar products",
                  "Go back to the previous page",
                ].map((cmd, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <Mic className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium">"{cmd}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Commands */}
        <AdvancedVoiceCommands />

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Advanced Features</CardTitle>
            <CardDescription>Powerful capabilities for complete store automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-semibold text-green-600">✓ Multi-Step Actions</h3>
                <p className="text-sm text-gray-600">Chain multiple actions in one command</p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold text-blue-600">✓ Context Awareness</h3>
                <p className="text-sm text-gray-600">Adapts to current page and situation</p>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50">
                <h3 className="font-semibold text-purple-600">✓ Smart Filtering</h3>
                <p className="text-sm text-gray-600">Advanced product filtering and sorting</p>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50">
                <h3 className="font-semibold text-orange-600">✓ Cart Management</h3>
                <p className="text-sm text-gray-600">Complete cart control and checkout</p>
              </div>
              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold text-red-600">✓ Form Automation</h3>
                <p className="text-sm text-gray-600">Auto-fill forms and complete orders</p>
              </div>
              <div className="p-4 border rounded-lg bg-indigo-50">
                <h3 className="font-semibold text-indigo-600">✓ Error Handling</h3>
                <p className="text-sm text-gray-600">Robust error recovery and fallbacks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Selectors */}
        <OrnaStoreSelectors />

        {/* Voice Commands Demo */}
        <VoiceCommandsDemo groqApiKey={groqApiKey} shopifyUrl={shopifyUrl} />
      </div>
    </div>
  )
}
