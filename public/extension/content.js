// Content script for DOM manipulation
class AdvancedShopifyController {
  constructor() {
    // Dynamically set baseUrl to the current Shopify store's origin
    this.baseUrl = window.location.origin
    this.selectors = {
      // Navigation
      searchBox: 'input[type="search"], .search-input, [data-testid="search"], .header__search input, #Search',
      searchButton: '.search-button, [type="submit"], .header__search button',
      cartIcon:
        '.cart-icon, [data-testid="cart"], .header__icon--cart, .header__icons .header__icon:last-child, #cart-icon-bubble',
      homeLink: 'a[href="/"], .header__heading-link, .logo, .header__heading',
      catalogLink: 'a[href*="catalog"], a[href*="collection"], .header__inline-menu a:nth-child(2)',
      contactLink: 'a[href*="contact"], .header__inline-menu a:last-child',
      accountLink: 'a[href*="account"], .header__account-link',

      // Products
      productLinks:
        ".product-item a, .card__heading a, .product-card-wrapper a, .grid__item .card__content a, .product-link",
      productTitles: ".product-title, .card__heading, .product-card__title, h3 a",
      productPrices: ".price, .product-price, .card__price, .money",
      productImages: ".product-image, .card__media img, .product-card__image img",

      // Product page
      addToCartButton:
        '.btn--add-to-cart, [name="add"], .product-form__cart-submit, .btn.product-form__cart-submit, #AddToCart',
      quantityInput: 'input[name="quantity"], .quantity__input, #Quantity',
      variantSelectors: '.product-form__input, .variant-input, select[name*="id"], .product-option select',
      productDescription: ".product-description, .product__description, .rte",
      productReviews: ".reviews, .product-reviews, .review-section",

      // Cart
      cartItems: ".cart-item, .cart__item, .line-item",
      cartQuantity: '.cart-quantity, .quantity-input, input[name*="quantity"]',
      cartRemove: '.cart-remove, .remove-item, [data-action="remove"]',
      cartTotal: ".cart-total, .totals__total, .cart__total",
      checkoutButton: '.checkout-button, [data-testid="checkout"], .btn--checkout, .cart__checkout-button, #checkout',
      discountInput: ".discount-input, #discount-code, .coupon-input",
      discountButton: '.discount-button, .coupon-apply, [data-action="apply-discount"]',

      // Filters and sorting
      filterButtons: ".filter-button, .facet-checkbox, .collection-filter input",
      sortSelect: ".sort-select, .collection-sort select, #sort-by",
      priceFilter: '.price-filter, .price-range, input[name*="price"]',
      colorFilter: '.color-filter, .color-swatch, input[name*="color"]',
      sizeFilter: '.size-filter, .size-option, input[name*="size"]',

      // Pagination
      nextPage: '.pagination__next, .next-page, a[rel="next"]',
      prevPage: '.pagination__prev, .prev-page, a[rel="prev"]',
      pageNumbers: ".pagination__item, .page-number",

      // Checkout
      shippingForm: ".shipping-form, #shipping-address",
      paymentForm: ".payment-form, #payment-method",
      orderButton: ".order-button, #submit-order, .btn--complete-order",

      // General
      backButton: ".breadcrumb a, .back-link, .header__heading-link",
      loadingIndicator: ".loading, .spinner, .loader",
      errorMessage: ".error, .alert-error, .notice--error",
      successMessage: ".success, .alert-success, .notice--success",
    }

    this.currentContext = this.getPageContext()
    this.actionQueue = []
    this.isProcessing = false
  }

  // Enhanced page context detection
  getPageContext() {
    const url = window.location.href
    const pathname = window.location.pathname

    let pageType = "unknown"
    if (pathname === "/" || pathname === "") pageType = "homepage"
    else if (pathname.includes("/products/")) pageType = "product"
    else if (pathname.includes("/collections/")) pageType = "collection"
    else if (pathname.includes("/cart")) pageType = "cart"
    else if (pathname.includes("/checkout")) pageType = "checkout"
    else if (pathname.includes("/search")) pageType = "search"
    else if (pathname.includes("/contact")) pageType = "contact"
    else if (pathname.includes("/account")) pageType = "account"

    return {
      url,
      pathname,
      pageType,
      title: document.title,
      hasProducts: !!document.querySelector(this.selectors.productLinks),
      cartCount: this.getCartCount(), // Ensure cartCount is always present
      isLoading: !!document.querySelector(this.selectors.loadingIndicator),
      hasError: !!document.querySelector(this.selectors.errorMessage),
    }
  }

  // Get cart count
  getCartCount() {
    const cartBadge = document.querySelector(".cart-count, .cart-badge, .header__icon--cart .badge")
    return cartBadge ? Number.parseInt(cartBadge.textContent) || 0 : 0 // Default to 0 if not found
  }

  // Wait for element to appear
  async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector)
        if (element) {
          obs.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      }, timeout)
    })
  }

  // Enhanced navigation
  async navigate(destination, target = "_self") {
    switch (destination) {
      case "homepage":
      case "home":
        if (target === "_blank") {
          window.open(this.baseUrl, "_blank")
        } else {
          window.location.href = this.baseUrl
        }
        break
      case "catalog":
      case "collection":
        const catalogLink = document.querySelector(this.selectors.catalogLink)
        if (catalogLink) {
          if (target === "_blank") {
            window.open(catalogLink.href, "_blank")
          } else {
            catalogLink.click()
          }
        } else {
          window.location.href = `${this.baseUrl}/collections/all`
        }
        break
      case "cart":
        await this.openCart()
        break
      case "checkout":
        window.location.href = `${this.baseUrl}/checkout`
        break
      case "back":
        window.history.back()
        break
      case "forward":
        window.history.forward()
        break
      case "account":
        window.location.href = `${this.baseUrl}/account`
        break
      default:
        if (destination.startsWith("http")) {
          if (target === "_blank") {
            window.open(destination, "_blank")
          } else {
            window.location.href = destination
          }
        }
    }
  }

  // Advanced search with filters
  async search(query, filters = {}) {
    const searchBox = document.querySelector(this.selectors.searchBox)
    if (!searchBox) return false

    // Clear and enter search query
    searchBox.value = ""
    searchBox.focus()

    // Type character by character for better compatibility
    for (const char of query) {
      searchBox.value += char
      searchBox.dispatchEvent(new Event("input", { bubbles: true }))
      await this.wait(50)
    }

    // Submit search
    const searchButton = document.querySelector(this.selectors.searchButton)
    if (searchButton) {
      searchButton.click()
    } else {
      const form = searchBox.closest("form")
      if (form) {
        form.submit()
      } else {
        searchBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
      }
    }

    // Wait for results and apply filters
    await this.wait(2000)
    if (Object.keys(filters).length > 0) {
      await this.applyFilters(filters)
    }

    return true
  }

  // Apply filters
  async applyFilters(filters) {
    for (const [filterType, value] of Object.entries(filters)) {
      switch (filterType) {
        case "price":
          await this.filterByPrice(value)
          break
        case "color":
          await this.filterByColor(value)
          break
        case "size":
          await this.filterBySize(value)
          break
        case "category":
          await this.filterByCategory(value)
          break
      }
      await this.wait(1000) // Wait between filters
    }
  }

  // Price filtering
  async filterByPrice(priceRange) {
    const priceFilters = document.querySelectorAll(this.selectors.priceFilter)

    if (typeof priceRange === "string") {
      // Handle ranges like "under-50", "50-100", "over-100"
      const priceButton = Array.from(document.querySelectorAll(".price-filter, .facet-checkbox")).find((btn) =>
        btn.textContent.toLowerCase().includes(priceRange.toLowerCase()),
      )
      if (priceButton) priceButton.click()
    } else if (typeof priceRange === "object" && priceRange.min !== undefined) {
      // Handle min/max price inputs
      const minInput = document.querySelector('input[name*="price_min"], input[placeholder*="min"]')
      const maxInput = document.querySelector('input[name*="price_max"], input[placeholder*="max"]')

      if (minInput && priceRange.min) {
        minInput.value = priceRange.min
        minInput.dispatchEvent(new Event("change", { bubbles: true }))
      }
      if (maxInput && priceRange.max) {
        maxInput.value = priceRange.max
        maxInput.dispatchEvent(new Event("change", { bubbles: true }))
      }
    }
  }

  // Color filtering
  async filterByColor(color) {
    const colorOptions = document.querySelectorAll(this.selectors.colorFilter)
    const colorOption = Array.from(colorOptions).find(
      (option) =>
        option.value?.toLowerCase().includes(color.toLowerCase()) ||
        option.textContent?.toLowerCase().includes(color.toLowerCase()),
    )
    if (colorOption) colorOption.click()
  }

  // Size filtering
  async filterBySize(size) {
    const sizeOptions = document.querySelectorAll(this.selectors.sizeFilter)
    const sizeOption = Array.from(sizeOptions).find(
      (option) =>
        option.value?.toLowerCase().includes(size.toLowerCase()) ||
        option.textContent?.toLowerCase().includes(size.toLowerCase()),
    )
    if (sizeOption) sizeOption.click()
  }

  // Sort products
  async sort(by, order = "asc") {
    const sortSelect = document.querySelector(this.selectors.sortSelect)
    if (!sortSelect) return false

    const sortValue = `${by}-${order}`
    const option = Array.from(sortSelect.options).find(
      (opt) => opt.value.includes(by) || opt.textContent.toLowerCase().includes(by),
    )

    if (option) {
      sortSelect.value = option.value
      sortSelect.dispatchEvent(new Event("change", { bubbles: true }))
      return true
    }
    return false
  }

  // Enhanced add to cart
  async addToCart(productId = null, quantity = 1, variant = null) {
    // If on product page
    if (this.currentContext.pageType === "product") {
      // Set quantity
      const quantityInput = document.querySelector(this.selectors.quantityInput)
      if (quantityInput && quantity !== 1) {
        quantityInput.value = quantity
        quantityInput.dispatchEvent(new Event("change", { bubbles: true }))
      }

      // Select variant if specified
      if (variant) {
        await this.selectVariant(variant)
      }

      // Click add to cart
      const addButton = document.querySelector(this.selectors.addToCartButton)
      if (addButton && !addButton.disabled) {
        addButton.click()
        await this.wait(2000) // Wait for cart update
        return true
      }
    } else if (productId) {
      // Add specific product by ID (for collection pages)
      const productElement = document.querySelector(`[data-product-id="${productId}"]`)
      if (productElement) {
        const addButton = productElement.querySelector(this.selectors.addToCartButton)
        if (addButton) {
          addButton.click()
          return true
        }
      }
    }
    return false
  }

  // Select product variant
  async selectVariant(variant) {
    const variantSelectors = document.querySelectorAll(this.selectors.variantSelectors)

    for (const selector of variantSelectors) {
      if (selector.tagName === "SELECT") {
        const option = Array.from(selector.options).find((opt) =>
          opt.textContent.toLowerCase().includes(variant.toLowerCase()),
        )
        if (option) {
          selector.value = option.value
          selector.dispatchEvent(new Event("change", { bubbles: true }))
          await this.wait(500)
        }
      } else if (selector.type === "radio") {
        if (
          selector.value.toLowerCase().includes(variant.toLowerCase()) ||
          selector.nextElementSibling?.textContent.toLowerCase().includes(variant.toLowerCase())
        ) {
          selector.click()
          await this.wait(500)
        }
      }
    }
  }

  // Open cart
  async openCart() {
    const cartIcon = document.querySelector(this.selectors.cartIcon)
    if (cartIcon) {
      cartIcon.click()
      await this.wait(1000)
    } else {
      window.location.href = `${this.baseUrl}/cart`
    }
  }

  // Update cart quantity
  async updateQuantity(quantity, productId = null) {
    if (this.currentContext.pageType !== "cart") {
      await this.openCart()
    }

    const quantityInputs = document.querySelectorAll(this.selectors.cartQuantity)

    if (productId) {
      // Update specific product
      const productRow = document.querySelector(`[data-product-id="${productId}"]`)
      if (productRow) {
        const quantityInput = productRow.querySelector(this.selectors.cartQuantity)
        if (quantityInput) {
          quantityInput.value = quantity
          quantityInput.dispatchEvent(new Event("change", { bubbles: true }))
        }
      }
    } else if (quantityInputs.length > 0) {
      // Update first item
      quantityInputs[0].value = quantity
      quantityInputs[0].dispatchEvent(new Event("change", { bubbles: true }))
    }
  }

  // Remove from cart
  async removeFromCart(productId = null) {
    if (this.currentContext.pageType !== "cart") {
      await this.openCart()
    }

    if (productId) {
      const productRow = document.querySelector(`[data-product-id="${productId}"]`)
      if (productRow) {
        const removeButton = productRow.querySelector(this.selectors.cartRemove)
        if (removeButton) removeButton.click()
      }
    } else {
      // Remove all items
      const removeButtons = document.querySelectorAll(this.selectors.cartRemove)
      for (const button of removeButtons) {
        button.click()
        await this.wait(1000)
      }
    }
  }

  // Apply discount code
  async applyDiscount(code) {
    if (this.currentContext.pageType !== "cart") {
      await this.openCart()
    }

    const discountInput = document.querySelector(this.selectors.discountInput)
    const discountButton = document.querySelector(this.selectors.discountButton)

    if (discountInput && discountButton) {
      discountInput.value = code
      discountInput.dispatchEvent(new Event("input", { bubbles: true }))
      discountButton.click()
      await this.wait(2000)
      return true
    }
    return false
  }

  // Proceed to checkout
  async checkout(skipToPayment = false, fillShipping = {}) {
    if (this.currentContext.pageType !== "cart") {
      await this.openCart()
    }

    const checkoutButton = document.querySelector(this.selectors.checkoutButton)
    if (checkoutButton) {
      checkoutButton.click()
      await this.wait(3000)

      if (skipToPayment && Object.keys(fillShipping).length > 0) {
        await this.fillShippingForm(fillShipping)
      }
      return true
    }
    return false
  }

  // Fill shipping form
  async fillShippingForm(shippingData) {
    const form = document.querySelector(this.selectors.shippingForm)
    if (!form) return false

    for (const [field, value] of Object.entries(shippingData)) {
      const input = form.querySelector(`input[name*="${field}"], select[name*="${field}"]`)
      if (input) {
        input.value = value
        input.dispatchEvent(new Event("change", { bubbles: true }))
        await this.wait(200)
      }
    }
    return true
  }

  // Enhanced scroll
  async scroll(direction, amount = null) {
    let scrollAmount = 0

    switch (direction) {
      case "up":
        scrollAmount = amount || -window.innerHeight * 0.8
        break
      case "down":
        scrollAmount = amount || window.innerHeight * 0.8
        break
      case "top":
        window.scrollTo({ top: 0, behavior: "smooth" })
        return
      case "bottom":
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        return
    }

    window.scrollBy({ top: scrollAmount, behavior: "smooth" })
  }

  // Hover over element
  async hover(selector) {
    const element = document.querySelector(selector)
    if (element) {
      element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }))
      element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }))
      return true
    }
    return false
  }

  // Get text from element
  getText(selector) {
    const element = document.querySelector(selector)
    return element ? element.textContent.trim() : null
  }

  // Set attribute
  setAttribute(selector, attribute, value) {
    const element = document.querySelector(selector)
    if (element) {
      element.setAttribute(attribute, value)
      return true
    }
    return false
  }

  // Remove element
  removeElement(selector) {
    const element = document.querySelector(selector)
    if (element) {
      element.remove()
      return true
    }
    return false
  }

  // Wait utility
  async wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  // Execute action with error handling
  async executeAction(action) {
    try {
      this.currentContext = this.getPageContext()

      switch (action.type) {
        case "navigate":
          return await this.navigate(action.url, action.target)
        case "search":
          return await this.search(action.query, action.filters)
        case "click":
          const element = document.querySelector(action.selector)
          if (element) {
            element.click()
            if (action.waitFor) {
              await this.waitForElement(action.waitFor)
            }
            return true
          }
          return false
        case "addToCart":
          return await this.addToCart(action.productId, action.quantity, action.variant)
        case "fillForm":
          return await this.fillForm(action.fields, action.submit)
        case "scroll":
          return await this.scroll(action.direction, action.amount)
        case "filter":
          return await this.applyFilters({ [action.category]: action.value })
        case "sort":
          return await this.sort(action.by, action.order)
        case "hover":
          return await this.hover(action.selector)
        case "wait":
          await this.wait(action.duration)
          return true
        case "getText":
          return this.getText(action.selector)
        case "setAttribute":
          return this.setAttribute(action.selector, action.attribute, action.value)
        case "removeElement":
          return this.removeElement(action.selector)
        case "checkout":
          return await this.checkout(action.skipToPayment, action.fillShipping)
        case "applyDiscount":
          return await this.applyDiscount(action.code)
        case "selectVariant":
          return await this.selectVariant(action.value)
        case "updateQuantity":
          return await this.updateQuantity(action.quantity, action.productId)
        case "removeFromCart":
          return await this.removeFromCart(action.productId)
        case "back":
          window.history.back()
          return true
        case "compareProducts":
          console.warn("Product comparison not implemented in demo.")
          return false
        case "readReviews":
          console.warn("Reading reviews not implemented in demo.")
          return false
        case "wishlist":
          console.warn("Wishlist functionality not implemented in demo.")
          return false
        default:
          console.warn("Unknown action type:", action.type)
          return false
      }
    } catch (error) {
      console.error("Error executing action:", error)
      return false
    }
  }

  // Execute multiple actions in sequence
  async executeActionSequence(actions) {
    const results = []
    for (const action of actions) {
      const result = await this.executeAction(action)
      results.push(result)
      await this.wait(500) // Small delay between actions
    }
    return results
  }
}

// Initialize the advanced controller
const domController = new AdvancedShopifyController()

// Function to send a message to the background script
function sendMessageToBackground(message) {
  window.chrome.runtime.sendMessage(message)
}

// Function to handle voice commands
async function handleVoiceCommand(command) {
  console.log("Voice command received in content script:", command)

  // Send the command to your Next.js API route
  const NEXTJS_APP_URL = window.NEXTJS_APP_URL || "http://localhost:3000" // Fallback for development
  const shopifyUrl = window.location.href // Get current Shopify URL
  const pageContext = domController.getPageContext() // Use the controller's method to get context

  try {
    const response = await fetch(`${NEXTJS_APP_URL}/api/process-command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command, shopifyUrl, pageContext }), // Send shopifyUrl and pageContext
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to process command on server.")
    }

    const data = await response.json()
    console.log("AI Response:", data)

    // Speak the AI's response
    speak(data.response) // Assuming AI response has a 'response' field for speech

    // Execute the action based on AI's response
    if (data.action) {
      domController.executeAction(data.action) // Use domController to execute actions
    }
    if (data.followUp && Array.isArray(data.followUp)) {
      domController.executeActionSequence(data.followUp)
    }
  } catch (error) {
    console.error("Error processing voice command:", error)
    speak("Sorry, I encountered an error. Please try again.")
  }
}

// Function to speak text
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "en-US" // Set language
  window.speechSynthesis.speak(utterance)
}

// Listen for messages from the background script (e.g., voice command results)
window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "VOICE_COMMAND") {
    handleVoiceCommand(request.command)
    sendResponse({ status: "Command received by content script" })
  } else if (request.action === "executeInstruction") {
    const instruction = request.instruction
    console.log("Executing instruction:", instruction)

    // Example: Basic instruction parsing and execution
    if (instruction.includes("navigate to the shopping cart page")) {
      window.location.href = "/cart" // Assuming /cart is the cart page URL
    } else if (instruction.includes("perform a search for")) {
      const query = instruction.split("'")[1] // Extracts the search query
      if (query) {
        // Example: Fill a search input and submit
        const searchInput = document.querySelector('input[name="q"]') // Common Shopify search input name
        if (searchInput) {
          searchInput.value = query
          searchInput.form?.submit() // Submit the form if it's part of one
        } else {
          // Fallback if no specific search input is found
          window.location.href = `/search?q=${encodeURIComponent(query)}`
        }
      }
    } else if (instruction.includes("click the 'Add to Cart' button")) {
      const addToCartButton = document.querySelector('button[name="add"]') // Common Shopify add to cart button name
      if (addToCartButton) {
        addToCartButton.click()
      }
    }
    // Add more instruction handling logic here based on your needs

    sendResponse({ success: true, message: "Instruction executed." })
    return true
  }
})

// Inject enhanced voice agent indicator
const indicator = document.createElement("div")
indicator.innerHTML = "🎤 Advanced Voice Agent Active"
indicator.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 10000;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  cursor: pointer;
`

indicator.addEventListener("click", () => {
  const context = domController.getPageContext()
  console.log("Current page context:", context)
  alert(
    `Page: ${context.pageType}\nURL: ${context.url}\nProducts: ${context.hasProducts}\nCart: ${context.cartCount} items`,
  )
})

document.body.appendChild(indicator)

console.log("Advanced Voice Shopify Agent loaded successfully")

// Inject NEXTJS_APP_URL into the window object for content.js to access
// This is a workaround as content scripts don't directly access process.env
// The value will be set by the Liquid snippet in Shopify
// window.NEXTJS_APP_URL is expected to be defined by the Shopify Liquid snippet
