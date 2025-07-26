import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { groqApiKey } = await request.json() // Get API key from request body

    if (!groqApiKey) {
      return NextResponse.json({ error: "Groq API key is missing." }, { status: 400 })
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

    return NextResponse.json({
      success: true,
      response: text,
      message: "Groq API connection successful!",
    })
  } catch (error) {
    console.error("Groq API test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
