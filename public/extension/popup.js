const startButton = document.getElementById("startButton")
const stopButton = document.getElementById("stopButton")
const statusDiv = document.getElementById("status")

let recognition
const webkitSpeechRecognition = window.webkitSpeechRecognition

if (webkitSpeechRecognition) {
  recognition = new webkitSpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = "en-US"

  recognition.onstart = () => {
    statusDiv.textContent = "Status: Listening..."
    startButton.disabled = true
    stopButton.disabled = false
  }

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript
    statusDiv.textContent = `Command: "${command}"`
    processCommand(command)
  }

  recognition.onerror = (event) => {
    statusDiv.textContent = `Error: ${event.error}`
    startButton.disabled = false
    stopButton.disabled = true
  }

  recognition.onend = () => {
    statusDiv.textContent = "Status: Idle"
    startButton.disabled = false
    stopButton.disabled = true
  }

  startButton.addEventListener("click", () => {
    recognition.start()
  })

  stopButton.addEventListener("click", () => {
    recognition.stop()
  })
} else {
  statusDiv.textContent = "Web Speech API is not supported in this browser."
  startButton.disabled = true
  stopButton.disabled = true
}

function processCommand(command) {
  const chrome = window.chrome
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ action: "processVoiceCommand", command: command }, (response) => {
      if (response.success) {
        statusDiv.textContent = `Instruction: ${response.instruction}`
      } else {
        statusDiv.textContent = `Error: ${response.message}`
      }
    })
  } else {
    statusDiv.textContent = "Chrome runtime is not available."
  }
}
