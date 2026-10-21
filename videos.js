(() => {
  const grid = document.querySelector('#channel-video-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.channel-video-card'));
  const search = document.querySelector('#video-search');
  const more = document.querySelector('#channel-show-more');
  const count = document.querySelector('#channel-video-count');
  const empty = document.querySelector('#channel-no-results');
  let player = document.querySelector('#channel-player');
  const frame = player.parentElement;
  const title = document.querySelector('#channel-now-playing');
  const watch = document.querySelector('#channel-watch-link');
  const status = document.querySelector('#channel-player-status');
  const dialog = document.querySelector('#channel-video-dialog');
  const close = document.querySelector('#channel-player-close');
  const retry = document.querySelector('#channel-player-retry');
  const mediaNotice = document.querySelector('#channel-media-notice');
  if (mediaNotice) mediaNotice.hidden = window.CeyhaniCookies?.allows('media') === true;
  const batchSize = 12;
  let visibleCount = batchSize;
  let youtubePlayer = null;
  let playerReady = false;
  let generation = 0;
  let selectedId = null;
  let privatePlayer = false;
  const videoStart = value => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : 0;
  let selectedStart = videoStart(cards[0]?.dataset.videoStart);

  function embedUrl(id, autoplay = false, start = 0) {
    const domain = privatePlayer ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    const url = new URL(`https://${domain}/embed/${id}`);
    url.searchParams.set('enablejsapi', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('hl', 'tr');
    if (autoplay) url.searchParams.set('autoplay', '1');
    if (start) url.searchParams.set('start', String(start));
    if (/^https?:$/.test(window.location.protocol)) {
      url.searchParams.set('origin', window.location.origin);
    }
    return url.href;
  }

  function showPlayerError(event) {
    const messages = {
      2: 'Video bağlantısı geçerli değil. Başka bir video seçebilirsiniz.',
      5: 'Tarayıcı videoyu oynatamadı. Yeniden deneyin veya YouTube’da izle bağlantısını kullanın.',
      100: 'Bu video kaldırılmış veya gizli olarak ayarlanmış. Başka bir video seçebilirsiniz.',
      101: 'Bu videonun site içinde oynatılmasına izin verilmiyor. YouTube’da izle bağlantısını kullanabilirsiniz.',
      150: 'Bu videonun site içinde oynatılmasına izin verilmiyor. YouTube’da izle bağlantısını kullanabilirsiniz.',
      153: 'YouTube site adresini doğrulayamadı. Sayfayı normal tarayıcıda theorkun.github.io üzerinden açın veya YouTube’da izle bağlantısını kullanın.'
    };
    status.textContent = (messages[event.data] || 'YouTube oynatıcıyı açamadı. Yeniden deneyin veya YouTube’da izle bağlantısını kullanın.') + ` (Hata kodu: ${Number(event.data) || 'bilinmiyor'})`;
    status.hidden = false;
  }

  if (window.location.protocol === 'file:') {
    status.textContent = 'Dosya önizlemesinde YouTube oynatıcısı çalışmayabilir. Videoları theorkun.github.io/videolar.html üzerinden açabilirsiniz.';
    status.hidden = false;
  }
  function resetFrame(source = 'about:blank') {
    const next = player.cloneNode(false);
    next.src = source;
    try { youtubePlayer?.destroy(); } catch (_) {}
    youtubePlayer = null;playerReady = false;
    frame.replaceChildren(next);player = next;
  }
  function startSelectedVideo() {
    if (!selectedId || !window.CeyhaniCookies?.allows('media')) return;
    const token = ++generation;
    status.hidden = true;
    // A new iframe gives every selection and retry a clean playback session.
    resetFrame(embedUrl(selectedId, true, selectedStart));
    window.CeyhaniYouTube.load().then(() => {
      if (token !== generation || !dialog.open) return;
      youtubePlayer = new window.YT.Player(player, {
        events: {
          onReady() { if (token === generation) playerReady = true; },
          onError(event) { if (token === generation && dialog.open) showPlayerError(event); },
          onStateChange(event) { if (token === generation && event.data === 1) status.hidden = true; }
        }
      });
    }).catch(() => {
      if (token !== generation || !dialog.open) return;
      status.textContent = 'Oynatıcıdan durum bilgisi alınamadı. Video açılmadıysa Yeniden dene veya YouTube’da izle seçeneğini kullanın.';
      status.hidden = false;
    });
  }
  retry?.addEventListener('click', () => { privatePlayer = !privatePlayer;startSelectedVideo(); });
  document.addEventListener('ceyhani-pause-video', () => {
    if (dialog.open) dialog.close();
    else if (playerReady && youtubePlayer) youtubePlayer.pauseVideo();
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    generation++;resetFrame();status.hidden = true;
    cards.forEach(card => card.setAttribute('aria-pressed', 'false'));
  });

  function render() {
    const query = search.value.trim().toLocaleLowerCase('tr');
    const matches = cards.filter(card => card.dataset.videoTitle.toLocaleLowerCase('tr').includes(query));
    cards.forEach(card => { card.hidden = true; });
    matches.slice(0, visibleCount).forEach(card => { card.hidden = false; });
    count.textContent = `${Math.min(visibleCount, matches.length)} / ${matches.length} video`;
    empty.hidden = matches.length > 0;
    more.hidden = visibleCount >= matches.length;
  }

  search.addEventListener('input', () => {
    visibleCount = batchSize;
    render();
  });
  more.addEventListener('click', () => {
    visibleCount += batchSize;
    render();
  });
  cards.forEach(card => card.addEventListener('click', () => {
    if (!window.CeyhaniCookies?.allows('media')) { window.CeyhaniCookies?.open(); return; }
    const id = card.dataset.videoId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    selectedStart = videoStart(card.dataset.videoStart);
    selectedId = id;
    privatePlayer = false;
    cards.forEach(item => item.setAttribute('aria-pressed', String(item === card)));
    status.hidden = true;
    if (!dialog.open) dialog.showModal();
    player.title = card.dataset.videoTitle;
    title.textContent = card.dataset.videoTitle;
    watch.href = `https://www.youtube.com/watch?v=${id}${selectedStart ? `&t=${selectedStart}s` : ''}`;
    startSelectedVideo();
    title.focus({ preventScroll: true });
  }));
  render();
})();
