import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { command, currentUrl } = await req.json()

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"), // Using Groq's Llama 3 8B model
      prompt: `You are an AI assistant designed to help automate tasks on a Shopify store.
      The user will give you a voice command and the current URL of the Shopify store.
      Your task is to determine the most appropriate action to take on the Shopify store based on the command.
      You should respond with a JSON object containing the 'action' and 'value' fields.

      Possible actions:
      - "navigate": Navigate to a specific page. The 'value' should be the relative path (e.g., "/products/my-product", "/cart", "/collections/all").
      - "search": Perform a search on the store. The 'value' should be the search query.
      - "add_to_cart": Add a product to the cart. The 'value' should be the product handle or ID.
      - "click_element": Click a specific element on the page. The 'value' should be a CSS selector for the element.
      - "fill_form_field": Fill a form field. The 'value' should be an object with 'selector' (CSS selector) and 'text' (text to fill).
      - "scroll_to": Scroll to a specific part of the page. The 'value' can be "top", "bottom", or a CSS selector.
      - "go_back": Navigate back in browser history. The 'value' is null.
      - "go_forward": Navigate forward in browser history. The 'value' is null.
      - "refresh_page": Refresh the current page. The 'value' is null.
      - "open_mini_cart": Open the mini cart/drawer. The 'value' is null.
      - "close_mini_cart": Close the mini cart/drawer. The 'value' is null.
      - "checkout": Proceed to checkout. The 'value' is null.
      - "view_cart": Navigate to the cart page. The 'value' is null.
      - "show_product_details": Show details for a specific product. The 'value' should be the product handle or ID.
      - "filter_products": Apply a filter to product listings. The 'value' should be an object with 'filter_type' and 'filter_value'.
      - "sort_products": Sort product listings. The 'value' should be the sort order (e.g., "price_asc", "price_desc", "newest").
      - "clear_filters": Clear all active product filters. The 'value' is null.
      - "zoom_image": Zoom in on a product image. The 'value' should be a CSS selector for the image.
      - "play_video": Play a video on the page. The 'value' should be a CSS selector for the video element.
      - "pause_video": Pause a video on the page. The 'value' should be a CSS selector for the video element.
      - "adjust_quantity": Adjust the quantity of an item in the cart. The 'value' should be an object with 'product_id' and 'quantity'.
      - "remove_from_cart": Remove an item from the cart. The 'value' should be the product handle or ID.
      - "speak": Respond with a spoken message. The 'value' is the message to speak.
      - "unknown": If the command cannot be mapped to any specific action. The 'value' should be a brief explanation.

      Consider the current URL (${currentUrl}) when determining navigation or context-specific actions.

      Examples:
      - User: "Go to the homepage" -> {"action": "navigate", "value": "/"}
      - User: "Search for t-shirts" -> {"action": "search", "value": "t-shirts"}
      - User: "Add the blue shirt to cart" -> {"action": "add_to_cart", "value": "blue-shirt-product-handle"}
      - User: "Click on the buy now button" -> {"action": "click_element", "value": ".buy-now-button"}
      - User: "Fill in my email as example@test.com" -> {"action": "fill_form_field", "value": {"selector": "#email-input", "text": "example@test.com"}}
      - User: "Scroll down" -> {"action": "scroll_to", "value": "bottom"}
      - User: "Go back" -> {"action": "go_back", "value": null}
      - User: "What is this product?" (on a product page) -> {"action": "speak", "value": "This is the product details page for the current item."}
      - User: "Show me the latest arrivals" -> {"action": "navigate", "value": "/collections/new-arrivals"}
      - User: "Sort by price low to high" -> {"action": "sort_products", "value": "price_asc"}
      - User: "Remove the red dress from my cart" -> {"action": "remove_from_cart", "value": "red-dress-product-handle"}
      - User: "Increase quantity of item one to three" -> {"action": "adjust_quantity", "value": {"product_id": "item-one-id", "quantity": 3}}
      - User: "Proceed to checkout" -> {"action": "checkout", "value": null}
      - User: "View my shopping cart" -> {"action": "view_cart", "value": null}
      - User: "Open the cart drawer" -> {"action": "open_mini_cart", "value": null}
      - User: "Close the cart drawer" -> {"action": "close_mini_cart", "value": null}
      - User: "Refresh the page" -> {"action": "refresh_page", "value": null}
      - User: "Zoom in on the main image" -> {"action": "zoom_image", "value": ".product-image-main"}
      - User: "Play the product video" -> {"action": "play_video", "value": "#product-video"}
      - User: "Pause the video" -> {"action": "pause_video", "value": "#product-video"}
      - User: "Clear all filters" -> {"action": "clear_filters", "value": null}
      - User: "Filter by size large" -> {"action": "filter_products", "value": {"filter_type": "size", "filter_value": "large"}}
      - User: "What is the current page?" -> {"action": "speak", "value": "You are currently on the ${currentUrl} page."}
      - User: "I want to buy something" -> {"action": "speak", "value": "What would you like to buy?"}
      - User: "I don't know what to do" -> {"action": "speak", "value": "I can help you navigate the store, search for products, or add items to your cart. What would you like to do?"}
      - User: "What is the weather like?" -> {"action": "unknown", "value": "I can only assist with actions related to the Shopify store."}

      User: "${command}"`,
    })

    const parsedResponse = JSON.parse(text)
    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json({ error: "Failed to process command", details: error.message }, { status: 500 })
  }
}
