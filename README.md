# Click and Summarize

**Click and Summarize** is a Chrome extension that simplifies web browsing by generating concise summaries of selected text using AI-powered summarization. It's designed to save time and improve productivity for users navigating through lengthy content.

---

## Features
- **Get Selected Text**: Fetch highlighted text from any webpage.
- **AI Summarization**: Generate clear and concise summaries of the selected or entered text.
- **Streaming Support**: See summaries appear in real-time as they are processed.
- **User-Friendly Interface**: Intuitive design with easy-to-use buttons for seamless interaction.
- **Abort Summarization**: Stop an ongoing summarization process anytime.

---

## How to Use
1. Install the extension by loading the folder via Developer Mode in Chrome (`chrome://extensions/` > **Load unpacked**).
2. Highlight text on any webpage.
3. Open the extension and click **Get Selected Text** to populate the text area.
4. Click **Summarize** to generate a summary. The result will appear in the output section.
5. To halt a summarization, click **Stop**.

---

## Installation
1. Clone this repository or download the zip file.
2. Extract the folder and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** and click **Load unpacked**.
4. Select the extracted folder to install the extension.

---

## Development
### File Structure
- **popup.html**: The extension's popup interface.
- **popup.js**: Main script handling UI interactions and AI summarization.
- **content.js**: Script for fetching selected text from active tabs.
- **manifest.json**: Defines the extension's settings and permissions.

### Key Technologies
- Chrome Extension APIs (e.g., `tabs`, `runtime`)
- AI Summarization API for generating summaries
- JavaScript for handling logic and DOM interactions
- HTML/CSS for the user interface

---

## Testing Instructions
1. Highlight text on a webpage and use **Get Selected Text**.
2. Enter text manually or use fetched text and click **Summarize**.
3. Test the **Stop** button to halt summarization.
4. Check error handling by using the extension on unsupported pages (e.g., `chrome://settings`).

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contributing
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

---

Feel free to reach out for questions or support!
