import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { command } = await req.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Using Groq's Llama 3 model
      prompt: `You are an AI assistant for a Shopify store. Your task is to interpret voice commands and convert them into structured JSON objects that can be used to automate actions on the store.

      Here are the available commands and their expected JSON output:

      1.  **"Go to homepage"**:
          \`\`\`json
          { "action": "navigate", "target": "/" }
          \`\`\`
      2.  **"Go to cart"** or **"View my cart"**:
          \`\`\`json
          { "action": "navigate", "target": "/cart" }
          \`\`\`
      3.  **"Go to checkout"** or **"Proceed to checkout"**:
          \`\`\`json
          { "action": "navigate", "target": "/checkout" }
          \`\`\`
      4.  **"Search for [product name]"** (e.g., "Search for t-shirts", "Search for running shoes"):
          \`\`\`json
          { "action": "search", "query": "[product name]" }
          \`\`\`
      5.  **"Add [quantity] [product name] to cart"** (e.g., "Add 2 red t-shirts to cart", "Add 1 pair of jeans to cart"). If quantity is not specified, assume 1.
          \`\`\`json
          { "action": "addToCart", "productName": "[product name]", "quantity": [quantity, default 1] }
          \`\`\`
      6.  **"Remove [quantity] [product name] from cart"** (e.g., "Remove 1 blue shirt from cart", "Remove all items from cart"). If quantity is not specified, assume 1. If "all items" is specified, set quantity to "all".
          \`\`\`json
          { "action": "removeFromCart", "productName": "[product name]", "quantity": [quantity or "all"] }
          \`\`\`
      7.  **"Increase quantity of [product name] by [number]"** (e.g., "Increase quantity of socks by 3"). If number is not specified, assume 1.
          \`\`\`json
          { "action": "updateQuantity", "productName": "[product name]", "change": [number, default 1], "operation": "increase" }
          \`\`\`
      8.  **"Decrease quantity of [product name] by [number]"** (e.g., "Decrease quantity of socks by 1"). If number is not specified, assume 1.
          \`\`\`json
          { "action": "updateQuantity", "productName": "[product name]", "change": [number, default 1], "operation": "decrease" }
          \`\`\`
      9.  **"Apply discount code [code]"** (e.g., "Apply discount code SAVE20"):
          \`\`\`json
          { "action": "applyDiscount", "code": "[code]" }
          \`\`\`
      10. **"Clear cart"**:
          \`\`\`json
          { "action": "clearCart" }
          \`\`\`
      11. **"Go back"**:
          \`\`\`json
          { "action": "navigateBack" }
          \`\`\`
      12. **"Go forward"**:
          \`\`\`json
          { "action": "navigateForward" }
          \`\`\`
      13. **"Scroll down"**:
          \`\`\`json
          { "action": "scroll", "direction": "down" }
          \`\`\`
      14. **"Scroll up"**:
          \`\`\`json
          { "action": "scroll", "direction": "up" }
          \`\`\`
      15. **"Click [element text]"** (e.g., "Click Add to Cart", "Click Buy Now"). This command should be used for general button clicks.
          \`\`\`json
          { "action": "click", "text": "[element text]" }
          \`\`\`

      If the command does not match any of the above, return:
      \`\`\`json
      { "action": "unrecognized" }
      \`\`\`

      Your response must be a valid JSON object and nothing else. Do not include any additional text or markdown outside the JSON.

      User command: "${command}"`,
    })

    // Attempt to parse the text as JSON
    let jsonResponse
    try {
      jsonResponse = JSON.parse(text)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      // If parsing fails, return an unrecognized action
      return NextResponse.json({ action: "unrecognized", rawText: text }, { status: 200 })
    }

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
