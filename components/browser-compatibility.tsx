"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Chrome, ChromeIcon as Firefox, AppleIcon as Safari, Globe } from "lucide-react"

export default function BrowserCompatibility() {
  const [compatibility, setCompatibility] = useState({
    speechRecognition: false,
    speechSynthesis: false,
    browser: "unknown",
    isSupported: false,
  })

  useEffect(() => {
    const checkCompatibility = () => {
      const hasWebkitSpeech = "webkitSpeechRecognition" in window
      const hasSpeechRecognition = "SpeechRecognition" in window
      const hasSpeechSynthesis = "speechSynthesis" in window

      // Detect browser
      let browser = "unknown"
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.includes("chrome")) browser = "chrome"
      else if (userAgent.includes("firefox")) browser = "firefox"
      else if (userAgent.includes("safari")) browser = "safari"
      else if (userAgent.includes("edge")) browser = "edge"

      const speechRecognition = hasWebkitSpeech || hasSpeechRecognition
      const isSupported = speechRecognition && hasSpeechSynthesis

      setCompatibility({
        speechRecognition,
        speechSynthesis: hasSpeechSynthesis,
        browser,
        isSupported,
      })
    }

    checkCompatibility()
  }, [])

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case "chrome":
        return <Chrome className="h-4 w-4" />
      case "firefox":
        return <Firefox className="h-4 w-4" />
      case "safari":
        return <Safari className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const openInChrome = () => {
    const currentUrl = window.location.href
    window.open(`googlechrome://navigate?url=${encodeURIComponent(currentUrl)}`, "_blank")
  }

  if (compatibility.isSupported) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Browser fully supported!</span>
            <Badge variant="default" className="bg-green-600">
              {compatibility.browser.charAt(0).toUpperCase() + compatibility.browser.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Browser Compatibility Issue
        </CardTitle>
        <CardDescription className="text-orange-700">
          Your browser has limited support for voice features. For the best experience, please use Google Chrome.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${compatibility.speechRecognition ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-sm">Voice Recognition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${compatibility.speechSynthesis ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm">Text-to-Speech</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Current Browser:</span>
          {getBrowserIcon(compatibility.browser)}
          <Badge variant="outline">{compatibility.browser}</Badge>
        </div>

        <div className="flex gap-2">
          <Button onClick={openInChrome} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Chrome className="h-4 w-4 mr-2" />
            Open in Chrome
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Retry
          </Button>
        </div>

        <div className="text-xs text-orange-600">
          <p>
            <strong>Recommended:</strong> Google Chrome, Microsoft Edge, or Safari for full voice control features.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
