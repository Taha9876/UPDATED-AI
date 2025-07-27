const chrome = window.chrome

chrome.runtime.onInstalled.addListener(() => {
  console.log("Shopify Voice Automation Extension Installed.")
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processVoiceCommand") {
    console.log("Received voice command in background:", request.command)
    // Forward the command to the Next.js API
    fetch(request.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: request.command,
        shopifyUrl: request.shopifyUrl,
        pageContext: request.pageContext,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data)
        sendResponse({ success: true, data: data })
        // Send action back to content script to perform DOM manipulation
        if (sender.tab && data.action) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "performDomAction",
            domAction: data.action,
            followUp: data.followUp,
            response: data.response,
          })
        }
      })
      .catch((error) => {
        console.error("Error forwarding command to API:", error)
        sendResponse({ success: false, error: error.message })
      })
    return true // Indicates that the response will be sent asynchronously
  }
})
