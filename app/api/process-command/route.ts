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
    const { command, shopifyUrl, pageContext } = await request.json()

    // Access Groq API key securely from environment variables
    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return new NextResponse(JSON.stringify({ error: "Groq API key is missing from server environment variables." }), {
        status: 500,
        headers,
      })
    }

    // Create Groq instance with API key
    const groq = createGroq({
      apiKey: groqApiKey,
    })

    // Use Groq to understand the command and generate appropriate actions
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system: `You are an advanced voice assistant for the Orna jewelry and fashion store (cfcu5s-iu.myshopify.com). 
You can perform ANY DOM action on the website. Analyze voice commands and return JSON with:
1. "response": A natural language response to speak back to the user
2. "action": An object with detailed action for DOM manipulation
3. "followUp": Optional array of additional actions to perform in sequence

Current page context: ${JSON.stringify(pageContext)}

Available actions (be creative and combine them):
- navigate: {type: "navigate", url: "homepage|catalog|contact|search|cart|checkout|back|forward", target: "_self|_blank"}
- search: {type: "search", query: "search term", filters: {price: "range", category: "type"}}
- click: {type: "click", selector: "CSS selector", waitFor: "optional selector to wait for"}
- addToCart: {type: "addToCart", productId: "optional", quantity: 1, variant: "optional"}
- fillForm: {type: "fillForm", fields: {field: "value"}, submit: true|false}
- scroll: {type: "scroll", direction: "up|down|top|bottom", amount: "pixels or viewport"}
- filter: {type: "filter", category: "price|size|color|brand", value: "filter value"}
- sort: {type: "sort", by: "price|popularity|newest|rating", order: "asc|desc"}
- hover: {type: "hover", selector: "CSS selector"}
- wait: {type: "wait", duration: 1000}
- getText: {type: "getText", selector: "CSS selector"}
- setAttribute: {type: "setAttribute", selector: "CSS selector", attribute: "attr", value: "val"}
- removeElement: {type: "removeElement", selector: "CSS selector"}
- checkout: {type: "checkout", skipToPayment: false, fillShipping: {}}
- applyDiscount: {type: "applyDiscount", code: "discount code"}
- selectVariant: {type: "selectVariant", option: "size|color", value: "variant value"}
- updateQuantity: {type: "updateQuantity", quantity: number, productId: "optional"}
- removeFromCart: {type: "removeFromCart", productId: "optional"}
- compareProducts: {type: "compareProducts", productIds: ["id1", "id2"]}
- readReviews: {type: "readReviews", productId: "optional"}
- wishlist: {type: "wishlist", action: "add|remove", productId: "optional"}

For complex commands, create sequences of actions. Examples:
- "Find cheap earrings" → search + filter by price
- "Buy this product" → addToCart + navigate to checkout
- "Compare these two items" → compareProducts + scroll to comparison
- "Remove everything from cart" → navigate to cart + removeFromCart (all)

Be intelligent about context:
- If on product page: can add to cart, select variants, read reviews
- If on collection page: can filter, sort, search within collection
- If on cart page: can update quantities, remove items, apply discounts, checkout
- If on homepage: can navigate anywhere, search, view offers

Always respond with valid JSON only. Be creative and handle complex multi-step requests.`,
      prompt: `User said: "${command}". Current page: ${pageContext?.url || shopifyUrl}. Page type: ${pageContext?.pageType || "unknown"}. What should I do?`,
    })

    try {
      const parsed = JSON.parse(text)
      return new NextResponse(JSON.stringify(parsed), { status: 200, headers })
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return new NextResponse(
        JSON.stringify({
          response: "I understood your command. Let me help you with that.",
          action: { type: "navigate", url: "homepage" },
        }),
        { status: 200, headers },
      )
    }
  } catch (error) {
    console.error("Error processing command:", error)
    return new NextResponse(JSON.stringify({ error: "Failed to process command" }), { status: 500, headers })
  }
}
