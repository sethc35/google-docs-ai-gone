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
      '.suggestionNudgeViewContainer',
      '.docs-sidekick-button-container',
      '.appsElementsSidekickEntryPointRoot'
    ];

    const escSelectors = [
      '.docs-bubble-material.docs-bubble.docs-material.aiBlockMenuBarBubbleContainer',
      '.docs-bubble-material.docs-bubble.docs-material.inlineFabBubbleContainer'
    ];

    const escClickTrackers = new WeakMap<Element, number>();
    const handledEscElements = new WeakSet<Element>();

    const dispatchEscapeKeyIntoIframe = () => {
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

    const onRotatingTileClick = (sourceEl: Element) => () => {
      const currentCount = escClickTrackers.get(sourceEl) || 0;
      if (currentCount >= 5) return;

      dispatchEscapeKeyIntoIframe();
      escClickTrackers.set(sourceEl, currentCount + 1);

      if (currentCount + 1 >= 5) {
        const tileManager = document.querySelector('.kix-rotatingtilemanager-content');
        tileManager?.removeEventListener('click', onRotatingTileClick(sourceEl));
      }
    };

    const removeAIBlockBubbles = () => {
      for (const selector of selectors) {
        document.querySelectorAll(selector).forEach(el => {
          if (escSelectors.includes(selector) && !handledEscElements.has(el)) {
            handledEscElements.add(el);
            escClickTrackers.set(el, 0);

            const tileManager = document.querySelector('.kix-rotatingtilemanager-content');
            if (tileManager) {
              const handler = onRotatingTileClick(el);
              tileManager.addEventListener('click', handler);
            }
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
