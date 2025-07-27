"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, CheckCircle, XCircle } from "lucide-react"

export default function BrowserCompatibility() {
  const [isCompatible, setIsCompatible] = useState<boolean | null>(null)

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      setIsCompatible(true)
    } else {
      setIsCompatible(false)
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Browser Compatibility</CardTitle>
      </CardHeader>
      <CardContent>
        {isCompatible === null && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Checking compatibility...</AlertTitle>
            <AlertDescription>
              Detecting if your browser supports the Web Speech API for voice commands.
            </AlertDescription>
          </Alert>
        )}
        {isCompatible === true && (
          <Alert className="border-green-500 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Compatible!</AlertTitle>
            <AlertDescription>Your browser supports the Web Speech API. You can use voice commands.</AlertDescription>
          </Alert>
        )}
        {isCompatible === false && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Not Compatible</AlertTitle>
            <AlertDescription>
              Your browser does not fully support the Web Speech API. Voice commands may not work. Please try a modern
              browser like Chrome, Edge, or Firefox.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
