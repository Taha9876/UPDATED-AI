"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Loader2, CheckCircle, XCircle } from "lucide-react"

interface VoiceCommandsDemoProps {
  shopifyUrl: string // Only shopifyUrl is needed as a prop now
}

export default function VoiceCommandsDemo({ shopifyUrl }: VoiceCommandsDemoProps) {
  const [testResults, setTestResults] = useState<Record<string, "idle" | "testing" | "success" | "error">>({})
  const [responses, setResponses] = useState<Record<string, string>>({})

  const testCommands = [
    { id: "homepage", command: "Go to homepage", expected: "navigate to homepage" },
    { id: "search", command: "Search for iPhone cases", expected: "search for products" },
    { id: "cart", command: "Add this to my cart", expected: "add product to cart" },
    { id: "checkout", command: "Proceed to checkout", expected: "go to checkout" },
    { id: "back", command: "Go back to previous page", expected: "navigate back" },
  ]

  const testCommand = async (commandData: (typeof testCommands)[0]) => {
    setTestResults((prev) => ({ ...prev, [commandData.id]: "testing" }))

    try {
      const response = await fetch("/api/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: commandData.command,
          shopifyUrl: shopifyUrl, // Use prop
          // groqApiKey is no longer sent from client
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        setTestResults((prev) => ({ ...prev, [commandData.id]: "success" }))
        setResponses((prev) => ({ ...prev, [commandData.id]: data.response }))
      } else {
        setTestResults((prev) => ({ ...prev, [commandData.id]: "error" }))
        setResponses((prev) => ({ ...prev, [commandData.id]: data.error || "Unknown error" }))
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [commandData.id]: "error" }))
      setResponses((prev) => ({ ...prev, [commandData.id]: error.message }))
    }
  }

  const testGroqConnection = async () => {
    setTestResults((prev) => ({ ...prev, groq: "testing" }))

    try {
      const response = await fetch("/api/groq-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // groqApiKey is no longer sent from client
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTestResults((prev) => ({ ...prev, groq: "success" }))
        setResponses((prev) => ({ ...prev, groq: data.response }))
      } else {
        setTestResults((prev) => ({ ...prev, groq: "error" }))
        setResponses((prev) => ({ ...prev, groq: data.error }))
      }
    } catch (error) {
      setTestResults((prev) => ({ ...prev, groq: "error" }))
      setResponses((prev) => ({ ...prev, groq: error.message }))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Play className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "testing":
        return <Badge variant="secondary">Testing...</Badge>
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            Success
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">Ready</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Groq API Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(testResults.groq)}
            Groq API Connection Test
          </CardTitle>
          <CardDescription>
            Test your Groq API key integration (configured via Vercel Environment Variable)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">API Key Status</p>
              <p className="text-sm text-gray-600">Managed securely on server</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(testResults.groq)}
              <Button onClick={testGroqConnection} disabled={testResults.groq === "testing"} size="sm">
                Test Connection
              </Button>
            </div>
          </div>

          {responses.groq && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Response:</p>
              <p className="text-sm text-gray-700">{responses.groq}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Commands Test */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Commands Testing</CardTitle>
          <CardDescription>Test individual voice commands with your Groq API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testCommands.map((cmd) => (
              <div key={cmd.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults[cmd.id])}
                  <div>
                    <p className="font-medium">"{cmd.command}"</p>
                    <p className="text-sm text-gray-600">Expected: {cmd.expected}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(testResults[cmd.id])}
                  <Button
                    onClick={() => testCommand(cmd)}
                    disabled={testResults[cmd.id] === "testing"}
                    size="sm"
                    variant="outline"
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Show responses */}
          {Object.entries(responses).filter(([key]) => key !== "groq").length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium">AI Responses:</h4>
              {Object.entries(responses)
                .filter(([key]) => key !== "groq")
                .map(([key, response]) => (
                  <div key={key} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      {testCommands.find((cmd) => cmd.id === key)?.command}
                    </p>
                    <p className="text-sm text-blue-700">{response}</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Quick Setup Guide</CardTitle>
          <CardDescription>Get started with your voice automation system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">✅ Groq API key configured (via Vercel Environment Variable)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              <span className="text-sm">Install Chrome extension from /public/extension</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              <span className="text-sm">Test voice commands above</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
              <span className="text-sm">Navigate to your Shopify store and start using voice commands</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
