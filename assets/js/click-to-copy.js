// click-to-copy.js
// Adds a "Copy" button to all code blocks in the documentation.
// This script targets both Hugo highlight blocks (.highlight > pre > code)
// and plain code blocks (pre > code) that are not already processed.

(function () {
    'use strict';

    // SVG icons for the copy button states
    var COPY_ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
        '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
        '</svg>';

    var CHECK_ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="20 6 9 17 4 12"></polyline>' +
        '</svg>';

    /**
     * Copy the text content of a code element to the clipboard.
     * Falls back to execCommand for older browsers.
     */
    function copyToClipboard(text, button) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showCopiedFeedback(button);
            }).catch(function () {
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }

    /**
     * Fallback copy method using a temporary textarea.
     */
    function fallbackCopy(text, button) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopiedFeedback(button);
        } catch (e) {
            // silently fail
        }
        document.body.removeChild(textarea);
    }

    /**
     * Show "Copied!" feedback on the button for 2 seconds.
     */
    function showCopiedFeedback(button) {
        button.innerHTML = CHECK_ICON + ' <span>Copied!</span>';
        button.classList.add('copied');

        setTimeout(function () {
            button.innerHTML = COPY_ICON + ' <span>Copy</span>';
            button.classList.remove('copied');
        }, 2000);
    }

    /**
     * Initialize copy buttons on all code blocks.
     */
    function init() {
        // Target Hugo highlight blocks and standalone pre>code blocks
        var codeBlocks = document.querySelectorAll('.highlight pre, .td-content pre:not(.mermaid)');

        for (var i = 0; i < codeBlocks.length; i++) {
            var pre = codeBlocks[i];
            var code = pre.querySelector('code');
            if (!code) continue;

            // Skip if already processed
            if (pre.querySelector('.copy-code-button')) continue;

            // Make the pre element a positioning context
            pre.style.position = 'relative';

            // Create copy button
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'copy-code-button';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            button.setAttribute('title', 'Copy to clipboard');
            button.innerHTML = COPY_ICON + ' <span>Copy</span>';

            // Capture the code element in a closure
            (function (codeEl, btn) {
                btn.addEventListener('click', function () {
                    var text = codeEl.textContent.trim();
                    copyToClipboard(text, btn);
                });
            })(code, button);

            pre.appendChild(button);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
