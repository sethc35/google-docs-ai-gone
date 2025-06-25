export default defineContentScript({
  matches: ['*://*.google.com/*'],
  runAt: 'document_idle',
  main() {
    const selectors = [
      '.unifiedPreviewBubbleRoot.docs-bubble.aiBlockPreviewBubble',
      '.docs-bubble-material.docs-bubble.docs-material.aiBlockMenuBarBubbleContainer',
      '.docs-bubble-material.docs-bubble.docs-material.inlineFabBubbleContainer',
      '.docs-ai-text-generator-bubble-usecase-menu',
      '.docos-docoview-tesla-conflict docos-anchoreddocoview',
      '.suggestionNudgeViewContainer'
    ];

    const escSelectors = [
      '.docs-bubble-material.docs-bubble.docs-material.aiBlockMenuBarBubbleContainer',
      '.docs-bubble-material.docs-bubble.docs-material.inlineFabBubbleContainer'
    ];

    let pendingEscDispatch = false;

    const dispatchEscapeKeyIntoIframe = () => {
      console.log('pressing esc')
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.docs-texteventtarget-iframe');
      if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;
      // bypass hidden css on iframe for focus
      iframe.focus();
      iframe.contentWindow.focus();
      const focusEvent = new FocusEvent('focus', { bubbles: true, cancelable: true });
      iframe.dispatchEvent(focusEvent);
      iframe.contentDocument.dispatchEvent(focusEvent);
      const escEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true
      });
      iframe.contentDocument.dispatchEvent(escEvent);
    };

    const onRotatingTileClick = () => {
      if (!pendingEscDispatch) return;
      pendingEscDispatch = false;
      dispatchEscapeKeyIntoIframe();
      const tileManager = document.querySelector('.kix-rotatingtilemanager-content');
      tileManager?.removeEventListener('click', onRotatingTileClick);
      console.log('click accepted')
    };

    const removeAIBlockBubbles = () => {
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach(el => {
          if (escSelectors.includes(selector)) {
            pendingEscDispatch = true;
            const tileManager = document.querySelector('.kix-rotatingtilemanager-content');
            tileManager?.addEventListener('click', onRotatingTileClick, { once: true });
          }
          el.remove();
        });
      }
    };

    removeAIBlockBubbles();

    const observer = new MutationObserver(() => removeAIBlockBubbles());
    const target = document.querySelector('.kix-appview-editor-container') || document.body;
    observer.observe(target, { childList: true, subtree: true });
  },
});
