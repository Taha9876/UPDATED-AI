import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, message: "GROQ_API_KEY is not set." }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: 'Say "Hello, Groq!"',
    })

    if (text.includes("Hello, Groq!")) {
      return NextResponse.json({ success: true, message: "Groq API connection successful!" })
    } else {
      return NextResponse.json(
        { success: false, message: "Groq API connection failed: Unexpected response." },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error testing Groq connection:", error)
    return NextResponse.json(
      { success: false, message: `Error testing Groq connection: ${error.message}` },
      { status: 500 },
    )
  }
}
