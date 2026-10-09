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

  fetch('assets/background-music.json')
    .then(response => response.ok ? response.json() : null)
    .then(config => {
      if (!config || !config.source) return;
      const audio = new Audio(config.source);
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = Math.max(0, Math.min(1, Number.isFinite(config.volume) ? config.volume : 0.35));
      const storedPreference = readPreference();
      const preference = storedPreference.source === config.source ? storedPreference : {};
      let mode = preference.mode || 'playing';
      let autoStartWanted = mode === 'playing';
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
      const save = () => savePreference({ mode: autoStartWanted ? 'playing' : mode, position: audio.currentTime, source: config.source });
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
          autoStartWanted = false;
          update();
        } catch {
          if (currentRequest !== request) return;
          mode = 'paused';
          toggle.textContent = 'Çal';
          toggle.setAttribute('aria-label', 'Müziği çal');
          status.textContent = audio.error ? 'Kayıt açılamadı. Tekrar deneyin.' : 'Dinlemek için Çal’a dokunun';
        }
        save();
      };
      const pause = () => {
        ++request;
        autoStartWanted = false;
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
        if (event.target.closest('.channel-video-card')) {
          if (mode === 'playing' || autoStartWanted) pause();
        } else if (autoStartWanted && audio.paused && !event.target.closest('.background-music, .accessibility-widget, #accessibility-dialog')) {
          // A visitor's first click can start audio when automatic playback was blocked.
          play();
        }
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
