import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { shopifyUrl, groqApiKey } = await request.json()

    // Use the API key from the request body, which comes from the client-side input
    if (!groqApiKey) {
      return NextResponse.json({ error: "Groq API key is required" }, { status: 400 })
    }

    // Create Groq instance with API key
    const groq = createGroq({
      apiKey: groqApiKey,
    })

    // Test Groq connection
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: 'Say "Connection successful" if you can read this.',
    })

    if (text.toLowerCase().includes("connection successful")) {
      return NextResponse.json({ status: "success", message: "Connection established" })
    } else {
      return NextResponse.json({ status: "error", message: "Unexpected response from Groq" }, { status: 400 })
    }
  } catch (error) {
    console.error("Connection test failed:", error)
    return NextResponse.json({ status: "error", message: "Failed to connect to Groq API" }, { status: 500 })
  }
}
