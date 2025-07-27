"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function VoiceCommandsDemo() {
  const [command, setCommand] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [groqTestResult, setGroqTestResult] = useState("")
  const { toast } = useToast()

  const handleProcessCommand = async () => {
    setIsLoading(true)
    setResponse("")
    try {
      // Use relative path for API call
      const res = await fetch(`/api/process-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command,
          shopifyUrl: window.location.origin, // Use current origin for Shopify URL context
          pageContext: { url: window.location.href, pageType: "demo", cartCount: 0 }, // Mock pageContext for demo
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setResponse(JSON.stringify(data, null, 2))
        toast({
          title: "Command Processed",
          description: data.response || "Command processed successfully.",
        })
      } else {
        setResponse(`Error: ${data.error || "Unknown error"}`)
        toast({
          title: "Error",
          description: data.error || "Failed to process command.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error processing command:", error)
      setResponse(`Network Error: ${error.message}`)
      toast({
        title: "Network Error",
        description: "Could not connect to the API. Check your network and server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testGroqConnection = async () => {
    setGroqTestResult("Testing...")
    try {
      // Use relative path for API call
      const res = await fetch(`/api/groq-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()
      if (res.ok) {
        setGroqTestResult(`Success: ${data.message}`)
        toast({
          title: "Groq Connection",
          description: "Successfully connected to Groq API.",
        })
      } else {
        setGroqTestResult(`Error: ${data.error || "Unknown error"}`)
        toast({
          title: "Groq Connection Error",
          description: data.error || "Failed to connect to Groq API.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error testing Groq connection:", error)
      setGroqTestResult(`Network Error: ${error.message}`)
      toast({
        title: "Network Error",
        description: "Could not connect to Groq test endpoint. Check your network and server.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Shopify Voice Automation Demo</CardTitle>
        <CardDescription>
          Test voice commands for your Shopify store. Ensure your Next.js app is deployed and the browser extension is
          installed.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="command">Voice Command</Label>
          <Input
            id="command"
            placeholder="e.g., Go to cart, Search for t-shirts, Add 2 blue shirts to cart"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleProcessCommand} disabled={isLoading}>
          {isLoading ? "Processing..." : "Process Command"}
        </Button>
        {response && (
          <div className="grid gap-2">
            <Label htmlFor="response">API Response</Label>
            <Textarea id="response" value={response} readOnly rows={10} className="font-mono text-sm" />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="groq-test">Groq API Connection Test</Label>
          <Button onClick={testGroqConnection} disabled={isLoading}>
            Test Groq Connection
          </Button>
          {groqTestResult && <p className="text-sm text-muted-foreground">{groqTestResult}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
