import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST() {
  try {
    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Directly call groq with the model name
      prompt: "Hello, what is your name?",
    })

    return NextResponse.json({ success: true, message: "Groq API connection successful!", response: text })
  } catch (error) {
    console.error("Error testing Groq connection:", error)
    return NextResponse.json(
      { success: false, message: `Groq API connection failed: ${error.message}` },
      { status: 500 },
    )
  }
}
