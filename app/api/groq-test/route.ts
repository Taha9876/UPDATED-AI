import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  // Changed to POST
  // Set CORS headers for Shopify integration (if needed for direct calls from Shopify)
  const headers = {
    "Access-Control-Allow-Origin": "*", // Replace with your Shopify domain in production for security
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers })
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY

  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API Key not configured on the server." }, { status: 500, headers })
  }

  try {
    // The groqTestMessage from the client is not used here, as this endpoint
    // is solely for testing the Groq API connection itself.
    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Using a suitable Groq model [^5]
      prompt: "Respond with 'Groq API is working perfectly!' if you can read this message.",
      apiKey: GROQ_API_KEY,
    })

    return NextResponse.json({ message: "Groq connection successful!", response: text }, { status: 200, headers })
  } catch (error) {
    console.error("Error connecting to Groq:", error)
    return NextResponse.json(
      {
        message: "Failed to connect to Groq.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers },
    )
  }
}
