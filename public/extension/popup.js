document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton")
  const stopButton = document.getElementById("stopButton")
  const statusDiv = document.getElementById("status")
  const responseDiv = document.getElementById("response")

  let recognition
  let isListening = false

  // Check for Web Speech API compatibility
  if (window.webkitSpeechRecognition) {
    recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false // Listen for a single phrase
    recognition.interimResults = false // Only return final results
    recognition.lang = "en-US"

    recognition.onstart = () => {
      isListening = true
      statusDiv.textContent = "Status: Listening..."
      startButton.disabled = true
      stopButton.disabled = false
      responseDiv.textContent = ""
    }

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript
      statusDiv.textContent = `Status: Command received: "${command}"`
      responseDiv.textContent = "Processing command..."

      // Send command to content script
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        window.chrome.tabs.sendMessage(tabs[0].id, { type: "VOICE_COMMAND", command: command }, (response) => {
          if (window.chrome.runtime.lastError) {
            responseDiv.textContent = `Error: Could not send message to content script. Is the extension enabled on this page?`
            console.error(window.chrome.runtime.lastError)
            return
          }
          if (response && response.status === "success") {
            responseDiv.textContent = `Action: ${response.action}`
          } else {
            responseDiv.textContent = `Error: ${response ? response.message : "No response from content script."}`
          }
        })
      })
    }

    recognition.onerror = (event) => {
      statusDiv.textContent = `Status: Error - ${event.error}`
      console.error("Speech recognition error:", event.error)
      isListening = false
      startButton.disabled = false
      stopButton.disabled = true
    }

    recognition.onend = () => {
      if (isListening) {
        // Only reset if it wasn't explicitly stopped
        statusDiv.textContent = "Status: Idle"
        isListening = false
        startButton.disabled = false
        stopButton.disabled = true
      }
    }

    startButton.addEventListener("click", () => {
      if (!isListening) {
        recognition.start()
      }
    })

    stopButton.addEventListener("click", () => {
      if (isListening) {
        recognition.stop()
        isListening = false // Explicitly set to false when stopped by user
        statusDiv.textContent = "Status: Stopped."
        startButton.disabled = false
        stopButton.disabled = true
      }
    })
  } else {
    statusDiv.textContent = "Status: Web Speech API not supported in this browser."
    startButton.disabled = true
    stopButton.disabled = true
  }
})
