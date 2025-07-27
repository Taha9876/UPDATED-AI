import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { command, currentUrl } = await req.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    const shopifyStoreName = process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME
    const shopifyStoreUrl = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL

    if (!shopifyStoreName || !shopifyStoreUrl) {
      return NextResponse.json({ error: "Shopify store name or URL not configured" }, { status: 500 })
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      system: `You are an AI assistant for a Shopify store named "${shopifyStoreName}". Your goal is to help users navigate and interact with the store using voice commands.
      
      You can perform the following actions:
      - "navigate": Go to a specific page (e.g., "go to products page", "take me to checkout").
      - "search": Search for a product (e.g., "search for t-shirts", "find running shoes").
      - "add_to_cart": Add a product to the cart (e.g., "add this to cart", "buy now").
      - "view_cart": View the shopping cart (e.g., "show my cart", "what's in my cart").
      - "checkout": Proceed to checkout (e.g., "checkout", "finish my order").
      - "scroll_down": Scroll down the page (e.g., "scroll down", "go down").
      - "scroll_up": Scroll up the page (e.g., "scroll up", "go up").
      - "click_element": Click on a specific element (e.g., "click the buy button", "select the size option").
      - "go_back": Go back to the previous page (e.g., "go back", "previous page").
      - "refresh_page": Refresh the current page (e.g., "refresh", "reload page").
      - "open_menu": Open the navigation menu (e.g., "open menu", "show navigation").
      - "close_menu": Close the navigation menu (e.g., "close menu", "hide navigation").
      - "play_video": Play a video on the page (e.g., "play video", "start the video").
      - "pause_video": Pause a video on the page (e.g., "pause video", "stop the video").
      - "mute_audio": Mute the audio (e.g., "mute", "silence").
      - "unmute_audio": Unmute the audio (e.g., "unmute", "turn on sound").
      - "zoom_in": Zoom in on the page (e.g., "zoom in", "make it bigger").
      - "zoom_out": Zoom out on the page (e.g., "zoom out", "make it smaller").
      - "read_aloud": Read the content of the page aloud (e.g., "read this page", "read aloud").
      - "stop_reading": Stop reading aloud (e.g., "stop reading", "silence").
      - "show_help": Display available commands or help information (e.g., "help", "what can I say?").
      - "none": If the command does not match any of the above actions.

      When responding, provide a JSON object with the following structure:
      {
        "action": "action_name", // e.g., "navigate", "search", "add_to_cart", "none"
        "value": "value_for_action" // e.g., "/products", "t-shirts", "product_id_123", null
      }

      For "navigate" action, the value should be a relative path (e.g., "/products", "/cart", "/checkout", "/collections/all"). If the user asks to go to the homepage, use "/".
      For "search" action, the value should be the search query.
      For "add_to_cart" action, if a specific product ID or name is mentioned, use that. Otherwise, if the user says "add this to cart" on a product page, assume the current product. If no product is clear, set value to null.
      For "click_element", try to infer the element to click (e.g., "buy button", "size option"). If not clear, set value to null.
      For other actions, the value can be null unless specified.

      Current URL: ${currentUrl}
      Shopify Store URL: ${shopifyStoreUrl}
      `,
      prompt: command,
    })

    const responseJson = JSON.parse(text)
    return NextResponse.json(responseJson)
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json({ error: "Failed to process command" }, { status: 500 })
  }
}
