(() => {
  const storageKey = 'ceyhani-background-music';
  const readPreference = () => {
    try { return JSON.parse(sessionStorage.getItem(storageKey)) || {}; }
    catch { return {}; }
  };
  const savePreference = value => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(value)); }
    catch { /* Playback remains available when storage is disabled. */ }
  };

  const loadYouTubeAPI = () => new Promise((resolve, reject) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      try { if (previousReady) previousReady(); }
      finally { resolve(); }
    };
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('error', reject, { once: true });
  });

  const setupYouTube = config => {
    if (!/^[A-Za-z0-9_-]{11}$/.test(config.videoId || '')) return;
    const preference = readPreference();
    let mode = preference.mode || 'playing';
    let player = null;
    let ready = false;
    let generation = 0;
    const widget = document.createElement('aside');
    widget.className = 'background-music background-music--youtube';
    widget.setAttribute('aria-label', 'Âşık Ceyhani müzik oynatıcısı');
    widget.innerHTML = '<div class="background-music-content"><div class="background-music-panel"><div class="background-music-copy"><span class="background-music-title"></span><span class="background-music-status" role="status" aria-live="polite">Oynatıcı yükleniyor…</span></div><button class="background-music-toggle" type="button">Çal</button><button class="background-music-close" type="button" aria-label="Müziği kapat">×</button></div><div class="background-music-video"></div><a class="background-music-watch" target="_blank" rel="noopener noreferrer">YouTube’da dinle ↗</a></div><button class="background-music-reopen" type="button" hidden>Müziği aç ♫</button>';
    document.body.appendChild(widget);
    const content = widget.querySelector('.background-music-content');
    const video = widget.querySelector('.background-music-video');
    const toggle = widget.querySelector('.background-music-toggle');
    const close = widget.querySelector('.background-music-close');
    const reopen = widget.querySelector('.background-music-reopen');
    const status = widget.querySelector('.background-music-status');
    widget.querySelector('.background-music-title').textContent = config.title || 'Âşık Ceyhani';
    widget.querySelector('.background-music-watch').href = `https://www.youtube.com/watch?v=${config.videoId}`;
    const save = () => savePreference({ mode, source: config.source, position: ready && player ? player.getCurrentTime() : 0 });
    const update = text => {
      toggle.textContent = mode === 'playing' ? 'Durdur' : 'Çal';
      toggle.setAttribute('aria-label', mode === 'playing' ? 'Müziği durdur' : 'Müziği çal');
      status.textContent = text || (mode === 'playing' ? 'Şimdi çalıyor' : 'Müzik durduruldu');
    };
    const welcomeIsOpen = () => document.querySelector('#welcome-dialog[open]');
    const play = () => {
      mode = 'playing';
      if (ready && player && !welcomeIsOpen()) player.playVideo();
      update(ready ? 'Müzik başlatılıyor…' : 'Oynatıcı yükleniyor…');
      save();
    };
    const pause = () => {
      mode = 'paused';
      if (ready && player) player.pauseVideo();
      update();
      save();
    };
    const createPlayer = async () => {
      const current = ++generation;
      try {
        await loadYouTubeAPI();
        if (current !== generation || mode === 'closed') return;
        video.innerHTML = '<div id="background-youtube-player"></div>';
        const vars = { playsinline: 1, loop: 1, playlist: config.videoId, hl: 'tr' };
        if (/^https?:$/.test(window.location.protocol)) vars.origin = window.location.origin;
        player = new window.YT.Player('background-youtube-player', {
          width: '320', height: '200', videoId: config.videoId, playerVars: vars,
          events: {
            onReady(event) {
              if (current !== generation) { event.target.destroy(); return; }
              ready = true;
              event.target.getIframe().title = config.title || 'Âşık Ceyhani müzik videosu';
              event.target.setVolume(Math.round((Number.isFinite(config.volume) ? config.volume : 0.35) * 100));
              if (preference.source === config.source && Number.isFinite(preference.position) && preference.position > 0) event.target.seekTo(preference.position, true);
              if (mode === 'playing' && !welcomeIsOpen()) event.target.playVideo();
              update(mode === 'playing' ? 'Dinlemek için Çal’a dokunabilirsiniz' : undefined);
              // Until YouTube confirms playback, keep a usable start button.
              if (mode === 'playing') {
                toggle.textContent = 'Çal';
                toggle.setAttribute('aria-label', 'Müziği çal');
              }
            },
            onStateChange(event) {
              if (current !== generation || mode === 'closed') return;
              if (event.data === 1) {
                mode = 'playing'; update(); save();
              } else if (event.data === 2) {
                mode = 'paused'; update(); save();
              }
            },
            onAutoplayBlocked() {
              if (current !== generation) return;
              mode = 'paused'; update('Dinlemek için Çal’a dokunun'); save();
            },
            onError() {
              if (current !== generation) return;
              mode = 'paused'; update('Kayıt açılamadı; YouTube’da dinleyebilirsiniz.'); save();
            }
          }
        });
      } catch {
        if (current !== generation || mode === 'closed') return;
        mode = 'paused'; update('YouTube bağlantısı kurulamadı.');
      }
    };
    toggle.addEventListener('click', () => {
      if (ready && player && player.getPlayerState() === 1) pause();
      else if (!player) { play(); createPlayer(); }
      else play();
    });
    close.addEventListener('click', () => {
      mode = 'closed';
      ++generation;
      if (player) player.destroy();
      player = null; ready = false;
      content.hidden = true; reopen.hidden = false;
      save(); reopen.focus();
    });
    reopen.addEventListener('click', () => {
      content.hidden = false; reopen.hidden = true;
      mode = 'playing'; update('Oynatıcı yükleniyor…');
      createPlayer(); toggle.focus();
    });
    document.addEventListener('click', event => {
      if (event.target.closest('.channel-video-card') && mode === 'playing') pause();
    });
    const welcome = document.querySelector('#welcome-dialog');
    if (welcome) welcome.addEventListener('close', () => { if (mode === 'playing') play(); });
    window.addEventListener('pagehide', save);
    if (mode === 'closed') { content.hidden = true; reopen.hidden = false; }
    else createPlayer();
  };

  fetch('assets/background-music.json')
    .then(response => response.ok ? response.json() : null)
    .then(config => {
      if (config && config.type === 'youtube') { setupYouTube(config); return; }
      if (!config || !config.source) return;
      const audio = new Audio(config.source);
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = Math.max(0, Math.min(1, Number.isFinite(config.volume) ? config.volume : 0.35));
      const preference = readPreference();
      let mode = preference.mode || 'playing';
      let request = 0;
      const widget = document.createElement('aside');
      widget.className = 'background-music';
      widget.setAttribute('aria-label', 'Arka plan müziği');
      widget.innerHTML = '<div class="background-music-panel"><img src="assets/saz-motifi.svg" alt="" aria-hidden="true" width="22" height="40"><div class="background-music-copy"><span class="background-music-title"></span><span class="background-music-status" role="status" aria-live="polite">Çalmaya hazır</span></div><button class="background-music-toggle" type="button">Çal</button><button class="background-music-close" type="button" aria-label="Müziği kapat">×</button></div><button class="background-music-reopen" type="button" hidden>Müziği aç ♫</button>';
      document.body.appendChild(widget);
      const panel = widget.querySelector('.background-music-panel');
      const toggle = widget.querySelector('.background-music-toggle');
      const close = widget.querySelector('.background-music-close');
      const reopen = widget.querySelector('.background-music-reopen');
      const status = widget.querySelector('.background-music-status');
      widget.querySelector('.background-music-title').textContent = config.title || 'Âşık Ceyhani';
      const save = () => savePreference({ mode, position: audio.currentTime, source: config.source });
      const update = () => {
        toggle.textContent = audio.paused ? 'Çal' : 'Durdur';
        toggle.setAttribute('aria-label', audio.paused ? 'Müziği çal' : 'Müziği durdur');
        status.textContent = audio.paused ? 'Müzik durduruldu' : 'Şimdi çalıyor';
      };
      const play = async () => {
        const currentRequest = ++request;
        mode = 'playing';
        status.textContent = 'Müzik yükleniyor…';
        try {
          await audio.play();
          if (currentRequest !== request) { audio.pause(); return; }
          update();
        } catch {
          if (currentRequest !== request) return;
          mode = 'paused';
          toggle.textContent = 'Çal';
          status.textContent = audio.error ? 'Kayıt açılamadı. Tekrar deneyin.' : 'Dinlemek için Çal’a dokunun';
        }
        save();
      };
      const pause = () => {
        ++request;
        mode = 'paused';
        audio.pause();
        update();
        save();
      };
      toggle.addEventListener('click', () => audio.paused && mode !== 'playing' ? play() : pause());
      close.addEventListener('click', () => {
        pause();
        mode = 'closed';
        audio.currentTime = 0;
        panel.hidden = true;
        reopen.hidden = false;
        save();
        reopen.focus();
      });
      reopen.addEventListener('click', () => {
        panel.hidden = false;
        reopen.hidden = true;
        toggle.focus();
        play();
      });
      audio.addEventListener('loadedmetadata', () => {
        if (preference.source === config.source && Number.isFinite(preference.position) && preference.position > 0 && preference.position < audio.duration) audio.currentTime = preference.position;
      }, { once: true });
      audio.addEventListener('error', () => {
        pause();
        status.textContent = 'Kayıt açılamadı. Tekrar deneyin.';
      });
      // Pause background music when a video is opened so the two recordings do not overlap.
      document.addEventListener('click', event => {
        if (event.target.closest('.channel-video-card') && mode === 'playing') pause();
      });
      window.addEventListener('pagehide', save);
      if (mode === 'closed') {
        panel.hidden = true;
        reopen.hidden = false;
      } else if (mode === 'playing') {
        play();
      } else {
        update();
      }
    })
    .catch(() => { /* Do not show an unusable player if configuration is unavailable. */ });
})();
