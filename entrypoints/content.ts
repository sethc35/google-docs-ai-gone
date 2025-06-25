export default defineContentScript({
  matches: ['*://*.google.com/*'],
  runAt: 'document_idle',
  main() {
    const removeAIBlockBubbles = () => {
      const selectors = [
        '.unifiedPreviewBubbleRoot.docs-bubble.aiBlockPreviewBubble',
        '.docs-bubble-material.docs-bubble.docs-material.aiBlockMenuBarBubbleContainer',
        '.docs-bubble-material.docs-bubble.docs-material.inlineFabBubbleContainer',
        '.docs-ai-text-generator-bubble-usecase-menu'
      ];

      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach(el => el.remove());
      }
    };

    // on page load
    removeAIBlockBubbles();

    // later too
    // TODO: optimize on perf
    const observer = new MutationObserver(() => removeAIBlockBubbles());
    observer.observe(document.body, { childList: true, subtree: true });
  },
});
