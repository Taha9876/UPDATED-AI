import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Set CORS headers for Shopify integration
  const headers = {
    "Access-Control-Allow-Origin": "*", // Replace with your Shopify domain in production for security
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers })
  }

  try {
    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return new NextResponse(JSON.stringify({ error: "Groq API key is missing from server environment variables." }), {
        status: 500,
        headers,
      })
    }

    // Correct usage: groq function directly takes the model name.
    // The API key is picked up automatically from process.env.GROQ_API_KEY by the SDK.
    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Using a specific Groq model
      prompt: "Say 'Hello from Groq!'",
    })

    return new NextResponse(JSON.stringify({ success: true, message: text }), { status: 200, headers })
  } catch (error: any) {
    console.error("Error testing Groq connection:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to connect to Groq API", details: error.message }), {
      status: 500,
      headers,
    })
  }
}
