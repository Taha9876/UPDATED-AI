// Background script for the Chrome extension
const chrome = window.chrome // Declare the chrome variable

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "EXECUTE_ACTION") {
    // Forward the action to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, request)
      }
    })
  }
})

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Voice Shopify Agent extension installed")
})
