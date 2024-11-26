let summarizer = null;
let abortController = new AbortController();

async function initializeAI() {
  const statusDiv = document.getElementById("status");

  try {
    // Check if the Summarizer API is supported
    if (!("ai" in self && "summarizer" in self.ai)) {
      statusDiv.textContent = "Summarizer API is not supported";
      return false;
    }

    // Check capabilities
    const capabilities = await self.ai.summarizer.capabilities();

    if (capabilities.available === "no") {
      statusDiv.textContent = "Summarizer is not available on this device";
      return false;
    }

    const options = {
      type: "key-points",
      format: "markdown",
      length: "medium",
    };

    if (capabilities.available === "after-download") {
      statusDiv.textContent = "Downloading summarizer model...";

      // Create summarizer with download monitoring
      summarizer = await self.ai.summarizer.create({
        ...options,
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            const progress = Math.round((e.loaded / e.total) * 100);
            statusDiv.textContent = `Downloading: ${progress}%`;
          });
        },
      });

      await summarizer.ready;
    } else {
      // Model is readily available
      summarizer = await self.ai.summarizer.create(options);
    }

    statusDiv.textContent = "Summarizer Ready!";
    return true;
  } catch (error) {
    statusDiv.textContent = `Error: ${error.message}`;
    return false;
  }
}

async function handlePrompt(text, streaming = true) {
  const outputDiv = document.getElementById("output");

  try {
    if (!summarizer) {
      throw new Error("Summarizer not initialized");
    }

    if (streaming) {
      // Use streaming summarization
      const stream = summarizer.summarizeStreaming(text, {
        context: "Summarize this text concisely",
        signal: abortController.signal,
      });

      let result = "";
      let previousLength = 0;

      for await (const segment of stream) {
        const newContent = segment.slice(previousLength);
        result += newContent;
        outputDiv.textContent = result;
        previousLength = segment.length;
      }
    } else {
      // Use non-streaming summarization
      const summary = await summarizer.summarize(text, {
        context: "Summarize this text concisely",
        signal: abortController.signal,
      });
      outputDiv.textContent = summary;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      outputDiv.textContent += "\n[Summary stopped by user]";
    } else {
      outputDiv.textContent += `\nError: ${error.message}`;
    }
  }
}

// Add this function to get selected text from the active tab
async function getSelectedText() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab) {
      throw new Error("No active tab found");
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GET_SELECTED_TEXT",
    });

    if (response && response.text) {
      const promptTextarea = document.getElementById("prompt");
      promptTextarea.value = response.text;
    } else {
      throw new Error("No text selected");
    }
  } catch (error) {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = `Error: ${error.message}`;
  }
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", async () => {
  const initialized = await initializeAI();

  if (initialized) {
    const promptTextarea = document.getElementById("prompt");
    const sendButton = document.getElementById("sendPrompt");
    const stopButton = document.getElementById("stopPrompt");
    const getSelectedButton = document.getElementById("getSelected");

    if (!promptTextarea || !sendButton || !stopButton || !getSelectedButton) {
      console.error("Required elements not found");
      return;
    }

    getSelectedButton.addEventListener("click", getSelectedText);

    sendButton.addEventListener("click", () => {
      const text = promptTextarea.value.trim();
      if (text) {
        handlePrompt(text);
        promptTextarea.value = "";
      }
    });

    stopButton.addEventListener("click", () => {
      abortController.abort();
      abortController = new AbortController();
    });

    promptTextarea.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        sendButton.click();
      }
    });
  }
});

// Cleanup when popup closes
window.addEventListener("unload", () => {
  if (summarizer) {
    summarizer.destroy?.();
  }
});
