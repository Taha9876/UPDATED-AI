import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  // Set CORS headers for Shopify integration
  const headers = {
    "Access-Control-Allow-Origin": "*", // Replace with your Shopify domain in production for security
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers })
  }

  try {
    const { shopifyUrl, groqApiKey } = await request.json()

    if (!groqApiKey) {
      return new NextResponse(JSON.stringify({ error: "Groq API key is required" }), { status: 400, headers })
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
      return new NextResponse(JSON.stringify({ status: "success", message: "Connection established" }), {
        status: 200,
        headers,
      })
    } else {
      return new NextResponse(JSON.stringify({ status: "error", message: "Unexpected response from Groq" }), {
        status: 400,
        headers,
      })
    }
  } catch (error) {
    console.error("Connection test failed:", error)
    return new NextResponse(JSON.stringify({ status: "error", message: "Failed to connect to Groq API" }), {
      status: 500,
      headers,
    })
  }
}
