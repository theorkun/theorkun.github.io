(() => {
  const pages = new Set(['index.html', 'hayati.html', 'videolar.html', 'siirler.html', 'kitaplik.html', 'fotograflar.html', 'motifler.html', 'ceyhaniye-yaz.html']);
  const initial = new URL(location.href);
  const directory = initial.pathname.slice(0, initial.pathname.lastIndexOf('/') + 1);
  const isSitePage = url => url.origin === initial.origin &&
    url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1) === directory &&
    (pages.has(url.pathname.split('/').pop()) || url.pathname === directory);
  let host;
  try { if (window.parent !== window) host = window.parent.ceyhaniNavigation; } catch (_) {}

  function handleLinks(navigate, includeHashes = false) {
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, location.href);
      if (!isSitePage(url)) return;
      if (!includeHashes && url.pathname === location.pathname && url.search === location.search && url.hash) return;
      event.preventDefault();
      navigate(url.href);
    });
  }
  if (host) {
    handleLinks(url => host.navigate(url), true);
    window.addEventListener('hashchange', () => host.syncHash(location.href));
    document.addEventListener('click', event => {
      if (event.target.closest('.channel-video-card')) host.pauseMusic();
    });
    return;
  }
  // Local file previews keep ordinary links; the continuous player uses the site's HTTP server.
  if (!/^https?:$/.test(location.protocol) || window.parent !== window) return;
  let frame = null;
  let frameURL = null;
  let hiddenElements = [];
  let returnFocus = null;
  const originalTitle = document.title;

  function restoreOriginal(url) {
    if (frame) frame.remove();
    frame = null;
    frameURL = null;
    hiddenElements.forEach(({ element, display, inert }) => {
      element.style.display = display;
      element.inert = inert;
    });
    hiddenElements = [];
    document.title = originalTitle;
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    if (url.hash) {
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch (_) { return; }
      document.getElementById(id)?.scrollIntoView();
    }
  }
  function navigate(href, push = true) {
    const url = new URL(href, initial);
    if (!isSitePage(url)) return;
    document.dispatchEvent(new Event('ceyhani-page-change'));
    if (push) history.pushState({ ceyhaniPage: true }, '', url.href);
    if (!push && url.pathname === initial.pathname && url.search === initial.search) {
      restoreOriginal(url);
      return;
    }
    frameURL = url;
    if (!frame) {
      returnFocus = document.activeElement;
      hiddenElements = [...document.body.children]
        .filter(element => !element.matches('.background-music, script, style, link'))
        .map(element => ({ element, display: element.style.display, inert: element.inert }));
      hiddenElements.forEach(({ element }) => { element.style.display = 'none'; element.inert = true; });
      frame = document.createElement('iframe');
      frame.className = 'site-page-frame';
      frame.title = 'Âşık Ceyhani — Sayfa içeriği';
      frame.allow = 'autoplay; fullscreen; picture-in-picture';
      frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:20;background:#fffdf8;';
      frame.addEventListener('load', () => {
        try {
          document.title = frame.contentDocument.title || originalTitle;
          frame.title = document.title;
          frame.contentDocument.querySelector('#main-content')?.focus({ preventScroll: true });
        } catch (_) {}
      });
      frame.src = url.href;
      document.body.appendChild(frame);
    } else {
      // Replace the frame's entry so Back/Forward is controlled by the visible site URL.
      frame.contentWindow.location.replace(url.href);
    }
  }
  window.ceyhaniNavigation = {
    navigate,
    pauseMusic: () => document.dispatchEvent(new Event('ceyhani-pause-music')),
    syncHash(href) {
      const url = new URL(href, initial);
      if (!frameURL || !isSitePage(url) || url.pathname !== frameURL.pathname) return;
      frameURL = url;
      history.replaceState(history.state, '', url.href);
    }
  };
  handleLinks(url => navigate(url));
  window.addEventListener('popstate', () => navigate(location.href, false));
})();
