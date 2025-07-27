const chrome = window.chrome // Declare the chrome variable

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processVoiceCommand") {
    fetch("http://localhost:3000/api/process-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command: request.command }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Send the instruction back to the content script
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "executeInstruction",
            instruction: data.instruction,
          })
          sendResponse({ success: true, instruction: data.instruction })
        } else {
          sendResponse({ success: false, message: data.message })
        }
      })
      .catch((error) => {
        console.error("Error processing command in background script:", error)
        sendResponse({ success: false, message: error.message })
      })
    return true // Indicates that the response will be sent asynchronously
  }
})
