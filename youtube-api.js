(() => {
  let pending;
  window.CeyhaniYouTube = { load() {
    if (!window.CeyhaniCookies?.allows('media')) return Promise.reject(Error('YouTube izni verilmedi.'));
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (pending) return pending;
    pending = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      const script = document.createElement('script');
      let timeout;
      const fail = () => { clearTimeout(timeout);script.remove();pending = null;reject(Error('YouTube yüklenemedi. Lütfen tekrar deneyin.')); };
      window.onYouTubeIframeAPIReady = () => { clearTimeout(timeout);resolve(window.YT);if (typeof previous === 'function') previous(); };
      script.src = 'https://www.youtube.com/iframe_api';script.async = true;script.onerror = fail;
      timeout = setTimeout(fail, 20000);document.head.appendChild(script);
    });
    return pending;
  }};
})();
