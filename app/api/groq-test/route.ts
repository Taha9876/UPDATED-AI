import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function GET() {
  const GROQ_API_KEY = process.env.GROQ_API_KEY

  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "Groq API Key not configured on the server." }, { status: 500 })
  }

  try {
    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Using a suitable Groq model [^1]
      prompt: "Hello, Groq! What is the capital of France?",
      apiKey: GROQ_API_KEY,
    })

    return NextResponse.json({ message: "Groq connection successful!", response: text })
  } catch (error) {
    console.error("Error connecting to Groq:", error)
    return NextResponse.json(
      {
        message: "Failed to connect to Groq.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
