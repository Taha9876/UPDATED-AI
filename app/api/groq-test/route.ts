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
    const { groqApiKey } = await request.json() // Get API key from request body

    if (!groqApiKey) {
      return new NextResponse(JSON.stringify({ error: "Groq API key is missing." }), { status: 400, headers })
    }

    // Create Groq instance with API key
    const groq = createGroq({
      apiKey: groqApiKey,
    })

    // Test the Groq API with your key
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: 'Respond with "Groq API is working perfectly!" if you can read this message.',
    })

    return new NextResponse(
      JSON.stringify({
        success: true,
        response: text,
        message: "Groq API connection successful!",
      }),
      { status: 200, headers },
    )
  } catch (error) {
    console.error("Groq API test failed:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers },
    )
  }
}
