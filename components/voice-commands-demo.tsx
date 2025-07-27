"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mic, StopCircle } from "lucide-react"
import AdvancedVoiceCommands from "./advanced-voice-commands"
import OrnaVoiceCommands from "./orna-voice-commands"
import OrnaStoreSelectors from "./orna-store-selectors"
import { Separator } from "@/components/ui/separator"

// Declare webkitSpeechRecognition globally to avoid TypeScript errors
declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

export default function VoiceCommandsDemo() {
  const [isListening, setIsListening] = useState(false)
  const [voiceCommand, setVoiceCommand] = useState("")
  const [processedInstruction, setProcessedInstruction] = useState("")
  const [groqTestResponse, setGroqTestResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isTestingGroq, setIsTestingGroq] = useState(false)
  const { toast } = useToast()

  let recognition: any = null

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsListening(true)
        setVoiceCommand("")
        setProcessedInstruction("")
        toast({
          title: "Listening...",
          description: "Say your command now.",
        })
      }

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript
        setVoiceCommand(command)
        setIsListening(false)
        toast({
          title: "Command Captured",
          description: `"${command}"`,
        })
      }

      recognition.onerror = (event: any) => {
        setIsListening(false)
        console.error("Speech recognition error:", event.error)
        toast({
          title: "Speech Recognition Error",
          description: event.error,
          variant: "destructive",
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Web Speech API is not available in this browser.",
        variant: "destructive",
      })
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognition) {
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
    }
  }

  const handleProcessCommand = async () => {
    if (!voiceCommand) {
      toast({
        title: "No Command",
        description: "Please say or type a voice command first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessedInstruction("")
    try {
      const response = await fetch("/api/process-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: voiceCommand }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setProcessedInstruction(data.instruction)
        toast({
          title: "Command Processed",
          description: "Instruction generated successfully.",
        })
      } else {
        setProcessedInstruction(`Error: ${data.message || "Unknown error"}`)
        toast({
          title: "Error Processing Command",
          description: data.message || "Failed to get instruction from AI.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error processing command:", error)
      setProcessedInstruction(`Error processing command: ${error.message}`)
      toast({
        title: "Network Error",
        description: `Could not connect to the API: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTestGroqConnection = async () => {
    setIsTestingGroq(true)
    setGroqTestResponse("")
    try {
      const response = await fetch("/api/groq-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setGroqTestResponse(`Success: ${data.message} Response: "${data.response}"`)
        toast({
          title: "Groq Connection Test",
          description: "Successfully connected to Groq API.",
        })
      } else {
        setGroqTestResponse(`Error: ${data.message || "Unknown error"}`)
        toast({
          title: "Groq Connection Failed",
          description: data.message || "Failed to connect to Groq API.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error testing Groq connection:", error)
      setGroqTestResponse(`Error testing connection: ${error.message}`)
      toast({
        title: "Network Error",
        description: `Could not connect to Groq API: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsTestingGroq(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Voice Command Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="voice-command">Your Voice Command</Label>
            <div className="flex space-x-2">
              <Button onClick={startListening} disabled={isListening} className="flex-shrink-0">
                <Mic className="mr-2 h-4 w-4" />
                {isListening ? "Listening..." : "Start Listening"}
              </Button>
              <Button
                onClick={stopListening}
                disabled={!isListening}
                variant="outline"
                className="flex-shrink-0 bg-transparent"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Listening
              </Button>
              <Textarea
                id="voice-command"
                placeholder="Or type your command here..."
                value={voiceCommand}
                onChange={(e) => setVoiceCommand(e.target.value)}
                className="flex-grow"
              />
            </div>
          </div>

          <Button onClick={handleProcessCommand} className="w-full" disabled={isProcessing || !voiceCommand}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Command...
              </>
            ) : (
              "Process Command"
            )}
          </Button>

          {processedInstruction && (
            <div className="grid w-full items-center gap-1.5">
              <Label>AI Generated Instruction</Label>
              <Textarea value={processedInstruction} readOnly className="font-mono text-sm" />
            </div>
          )}

          <Separator />

          <Button onClick={handleTestGroqConnection} className="w-full" variant="secondary" disabled={isTestingGroq}>
            {isTestingGroq ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Groq Connection...
              </>
            ) : (
              "Test Groq Connection"
            )}
          </Button>

          {groqTestResponse && (
            <div className="grid w-full items-center gap-1.5">
              <Label>Groq API Test Result</Label>
              <Textarea value={groqTestResponse} readOnly className="font-mono text-sm" />
            </div>
          )}
        </CardContent>
      </Card>

      <AdvancedVoiceCommands />
      <OrnaVoiceCommands />
      <OrnaStoreSelectors />
    </div>
  )
}
