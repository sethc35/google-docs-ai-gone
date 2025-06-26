# Bye Bye Google Docs AI

This Chrome extension removes some AI features from Google Docs: the AI summary box, `@Summary`, and `Ask Gemini` buttons.

## How to Use

### Option 1: Install via ZIP

1. [Download the ZIP](bye-bye-docs-0.0.0-chrome.zip)
2. Go to `chrome://extensions`
3. Enable **Developer Mode** (top right toggle)
4. Drag and drop the ZIP file into the page

---

### Option 2: Build From Source

If you want to make changes to the code:

```bash
git clone https://github.com/sethc35/google-docs-ai-gone.git
cd google-docs-ai-gone
npm install
npm run build
```

1. Open chrome://extensions
2. Enable Developer Mode (upper right corner)
3. Click Load unpacked
4. Select the google-docs-ai-gone/.output/chrome-mv3 directory
