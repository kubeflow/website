
(function () {
  'use strict';

  const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

  function setText(btn, icon, label, copied) {
    btn.innerHTML = icon + `<span class="c2c-label">${label}</span>`;
    btn.setAttribute('aria-label', label);
    btn.classList.toggle('c2c-btn--copied', copied);
  }

  function writeToClipboard(text, btn) {
    function onSuccess() {
      setText(btn, CHECK_ICON, 'Copied!', true);
      setTimeout(function () { setText(btn, COPY_ICON, 'Copy', false); }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(onSuccess);
    } else {
      // Fallback
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      document.body.removeChild(ta);
      onSuccess();
    }
  }

  function addCopyButtons() {
    var barePres = document.querySelectorAll('.td-content > pre:not(.mermaid)');
    barePres.forEach(function (pre) {
      if (pre.parentNode && pre.parentNode.classList.contains('highlight')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'highlight';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    });

    var highlights = document.querySelectorAll('.td-content .highlight');
    highlights.forEach(function (hl) {
      if (hl.querySelector('.c2c-header')) return;

      var codeEl = hl.querySelector('pre code') || hl.querySelector('pre');
      var lang = '';
      if (codeEl) {
        var dataLang = codeEl.getAttribute('data-lang');
        if (!dataLang && codeEl.className) {
          var match = codeEl.className.match(/language-(\S+)/);
          if (match) dataLang = match[1];
        }
        if (dataLang) {
          lang = dataLang.trim().toUpperCase();
        }
      }

      if (lang === 'SHELL' || lang === 'BASH' || lang === 'SH') {
        lang = 'Terminal';
      } else if (lang === 'YAML' || lang === 'YML') {
        lang = 'YAML';
      } else if (lang === 'JSON') {
        lang = 'JSON';
      } else if (lang === 'PYTHON' || lang === 'PY') {
        lang = 'Python';
      } else if (!lang) {
        lang = 'Code';
      }

      var header = document.createElement('div');
      header.className = 'c2c-header';

      var langBadge = document.createElement('span');
      langBadge.className = 'c2c-lang-badge';
      langBadge.textContent = lang;
      header.appendChild(langBadge);

      // Create copy button
      var btn = document.createElement('button');
      btn.className = 'c2c-btn';
      btn.setAttribute('type', 'button');
      setText(btn, COPY_ICON, 'Copy', false);

      btn.addEventListener('click', function () {
        var text = (codeEl.textContent || codeEl.innerText || '').trim();
        writeToClipboard(text, btn);
      });

      header.appendChild(btn);

      // Prepend header to highlight block
      hl.insertBefore(header, hl.firstChild);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCopyButtons);
  } else {
    document.addCopyButtons || addCopyButtons();
  }
})();
