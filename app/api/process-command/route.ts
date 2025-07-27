import { NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { command } = await req.json()

    if (!command) {
      return NextResponse.json({ success: false, message: "No command provided." }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Directly call groq with the model name
      prompt: `The user said: "${command}". Based on this, provide a concise, actionable instruction for a web automation tool. If it's a general question, answer it. Examples:
      - User: "Go to cart" -> Instruction: "Navigate to the shopping cart page."
      - User: "Search for red shoes" -> Instruction: "Perform a search for 'red shoes'."
      - User: "Add to cart" -> Instruction: "Click the 'Add to Cart' button."
      - User: "What is the capital of France?" -> Answer: "The capital of France is Paris."
      - User: "Show me products by Nike" -> Instruction: "Filter products by brand 'Nike'."
      - User: "Increase quantity to two" -> Instruction: "Set product quantity to 2."
      - User: "Checkout" -> Instruction: "Proceed to checkout."
      - User: "Show me my orders" -> Instruction: "Navigate to the user's order history."
      - User: "What is the current time?" -> Answer: "The current time is [current time, e.g., 1:30 PM]."
      `,
    })

    return NextResponse.json({ success: true, instruction: text })
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json({ success: false, message: `Error processing command: ${error.message}` }, { status: 500 })
  }
}
