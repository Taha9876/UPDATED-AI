import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { command, shopifyStoreUrl } = await req.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Using Groq's Llama 3 8B model
      prompt: `You are an AI assistant for a Shopify store. Your goal is to interpret user voice commands and translate them into actions or information related to the Shopify store.
      
      Here are the types of commands you can process and their expected JSON output format:

      1.  **Navigation:**
          - "Go to homepage": \`{"action": "navigate", "target": "/"}\`
          - "Go to products page": \`{"action": "navigate", "target": "/products"}\`
          - "Go to cart": \`{"action": "navigate", "target": "/cart"}\`
          - "Go to checkout": \`{"action": "navigate", "target": "/checkout"}\`
          - "Go to my orders": \`{"action": "navigate", "target": "/account/orders"}\`
          - "Go to login page": \`{"action": "navigate", "target": "/account/login"}\`
          - "Go to register page": \`{"action": "navigate", "target": "/account/register"}\`
          - "Go to contact us": \`{"action": "navigate", "target": "/pages/contact"}\`
          - "Go to about us": \`{"action": "navigate", "target": "/pages/about-us"}\`
          - "Go to blog": \`{"action": "navigate", "target": "/blogs/news"}\`
          - "Show me the privacy policy": \`{"action": "navigate", "target": "/policies/privacy-policy"}\`
          - "Show me the terms of service": \`{"action": "navigate", "target": "/policies/terms-of-service"}\`
          - "Take me to the refund policy": \`{"action": "navigate", "target": "/policies/refund-policy"}\`
          - "Open the search page": \`{"action": "navigate", "target": "/search"}\`
          - "Go back": \`{"action": "navigate", "target": "back"}\`
          - "Go forward": \`{"action": "navigate", "target": "forward"}\`
          - "Refresh the page": \`{"action": "navigate", "target": "refresh"}\`
          - "Scroll down": \`{"action": "scroll", "direction": "down"}\`
          - "Scroll up": \`{"action": "scroll", "direction": "up"}\`
          - "Scroll to top": \`{"action": "scroll", "target": "top"}\`
          - "Scroll to bottom": \`{"action": "scroll", "target": "bottom"}\`
          - "Zoom in": \`{"action": "zoom", "direction": "in"}\`
          - "Zoom out": \`{"action": "zoom", "direction": "out"}\`
          - "Reset zoom": \`{"action": "zoom", "direction": "reset"}\`

      2.  **Product Search/Filtering:**
          - "Search for [product name]": \`{"action": "search", "query": "[product name]"}\`
          - "Show me [category] products": \`{"action": "filter", "category": "[category]"}\`
          - "Filter by price [min] to [max]": \`{"action": "filter", "price_min": [min], "price_max": [max]}\`
          - "Show me products by [brand]": \`{"action": "filter", "brand": "[brand]"}\`
          - "Sort by price low to high": \`{"action": "sort", "by": "price", "order": "asc"}\`
          - "Sort by price high to low": \`{"action": "sort", "by": "price", "order": "desc"}\`
          - "Sort by newest arrivals": \`{"action": "sort", "by": "date", "order": "desc"}\`
          - "Sort by best selling": \`{"action": "sort", "by": "best_selling"}\`

      3.  **Product Interaction (requires being on a product page or product listing):**
          - "Add [quantity] of this to cart": \`{"action": "add_to_cart", "quantity": [quantity]}\` (Assumes current product)
          - "Add [product name] to cart": \`{"action": "add_to_cart", "product_name": "[product name]"}\`
          - "View product details": \`{"action": "view_product_details"}\` (Assumes current product)
          - "Select size [size]": \`{"action": "select_option", "type": "size", "value": "[size]"}\`
          - "Select color [color]": \`{"action": "select_option", "type": "color", "value": "[color]"}\`

      4.  **Cart Management:**
          - "Remove [product name] from cart": \`{"action": "remove_from_cart", "product_name": "[product name]"}\`
          - "Update quantity of [product name] to [quantity]": \`{"action": "update_cart_quantity", "product_name": "[product name]", "quantity": [quantity]}\`
          - "Empty my cart": \`{"action": "empty_cart"}\`

      5.  **Account Management:**
          - "View my profile": \`{"action": "navigate", "target": "/account"}\`
          - "Update my address": \`{"action": "navigate", "target": "/account/addresses"}\`
          - "Change my password": \`{"action": "navigate", "target": "/account/password"}\`

      6.  **Information Retrieval:**
          - "What is the current time?": \`{"action": "get_info", "query": "current_time"}\`
          - "What is the current date?": \`{"action": "get_info", "query": "current_date"}\`
          - "What is the weather like?": \`{"action": "get_info", "query": "weather"}\` (Note: This would require an external API integration)
          - "Tell me about [product name]": \`{"action": "get_info", "query": "product_description", "product_name": "[product name]"}\`
          - "What is the price of [product name]?": \`{"action": "get_info", "query": "product_price", "product_name": "[product name]"}\`
          - "Is [product name] in stock?": \`{"action": "get_info", "query": "product_stock", "product_name": "[product name]"}\`
          - "What are the shipping costs?": \`{"action": "get_info", "query": "shipping_costs"}\`
          - "What is your return policy?": \`{"action": "get_info", "query": "return_policy"}\`
          - "How can I contact support?": \`{"action": "get_info", "query": "contact_support"}\`

      7.  **Checkout Process:**
          - "Apply discount code [code]": \`{"action": "apply_discount", "code": "[code]"}\`
          - "Proceed to payment": \`{"action": "navigate", "target": "/checkout?step=payment"}\`
          - "Complete order": \`{"action": "complete_order"}\` (This would typically be a final step on the checkout page)

      8.  **Voice Control:**
          - "Stop listening": \`{"action": "voice_control", "command": "stop_listening"}\`
          - "Start listening": \`{"action": "voice_control", "command": "start_listening"}\`
          - "Mute voice": \`{"action": "voice_control", "command": "mute"}\`
          - "Unmute voice": \`{"action": "voice_control", "command": "unmute"}\`

      9.  **Shopify Admin Actions (for store owners/admins - requires authentication and specific permissions):**
          - "View recent orders": \`{"action": "admin_navigate", "target": "/admin/orders"}\`
          - "Add new product": \`{"action": "admin_navigate", "target": "/admin/products/new"}\`
          - "View customers": \`{"action": "admin_navigate", "target": "/admin/customers"}\`
          - "Check inventory for [product name]": \`{"action": "admin_get_info", "query": "inventory", "product_name": "[product name]"}\`

      10. **General Assistance:**
          - "Hello": \`{"action": "greet"}\`
          - "Thank you": \`{"action": "thank"}\`
          - "Help me": \`{"action": "help"}\`
          - "What can you do?": \`{"action": "help"}\`

      If the command does not fit any of the above, respond with: \`{"action": "unrecognized", "message": "I'm sorry, I don't understand that command."}\`

      The response should ONLY be a JSON object. Do not include any other text or formatting.
      
      User command: "${command}"
      `,
      temperature: 0.7,
      maxTokens: 200,
      response_format: { type: "json_object" },
    })

    const parsedResponse = JSON.parse(text)

    // For navigation actions, prepend the Shopify store URL if it's a relative path
    if (parsedResponse.action === "navigate" && parsedResponse.target && !parsedResponse.target.startsWith("http")) {
      parsedResponse.fullUrl = `${shopifyStoreUrl}${parsedResponse.target}`
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json({ error: "Failed to process command" }, { status: 500 })
  }
}
