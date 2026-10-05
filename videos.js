(() => {
  const grid = document.querySelector('#channel-video-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.channel-video-card'));
  const search = document.querySelector('#video-search');
  const more = document.querySelector('#channel-show-more');
  const count = document.querySelector('#channel-video-count');
  const empty = document.querySelector('#channel-no-results');
  const player = document.querySelector('#channel-player');
  const title = document.querySelector('#channel-now-playing');
  const watch = document.querySelector('#channel-watch-link');
  const status = document.querySelector('#channel-player-status');
  const batchSize = 12;
  let visibleCount = batchSize;
  let youtubePlayer = null;
  let playerReady = false;

  function embedUrl(id, autoplay = false) {
    const url = new URL(`https://www.youtube.com/embed/${id}`);
    url.searchParams.set('enablejsapi', '1');
    url.searchParams.set('playsinline', '1');
    url.searchParams.set('hl', 'tr');
    if (autoplay) url.searchParams.set('autoplay', '1');
    if (/^https?:$/.test(window.location.protocol)) {
      url.searchParams.set('origin', window.location.origin);
    }
    return url.href;
  }

  function showPlayerError(event) {
    const messages = {
      100: 'Bu video kaldırılmış veya gizli olarak ayarlanmış. Başka bir video seçebilirsiniz.',
      101: 'Bu videonun site içinde oynatılmasına izin verilmiyor. YouTube’da izle bağlantısını kullanabilirsiniz.',
      150: 'Bu videonun site içinde oynatılmasına izin verilmiyor. YouTube’da izle bağlantısını kullanabilirsiniz.',
      153: 'YouTube site adresini doğrulayamadı. Sayfayı normal tarayıcıda theorkun.github.io üzerinden açın veya YouTube’da izle bağlantısını kullanın.'
    };
    status.textContent = messages[event.data] || 'YouTube oynatıcıyı açamadı. YouTube’da izle bağlantısını kullanabilir veya başka bir video seçebilirsiniz.';
    status.hidden = false;
  }

  // Identify the actual hosting origin, including local HTTP previews.
  if (cards[0]) player.src = embedUrl(cards[0].dataset.videoId);
  if (window.location.protocol === 'file:') {
    status.textContent = 'Dosya önizlemesinde YouTube oynatıcısı çalışmayabilir. Videoları theorkun.github.io/videolar.html üzerinden açabilirsiniz.';
    status.hidden = false;
  }
  window.onYouTubeIframeAPIReady = () => {
    youtubePlayer = new window.YT.Player(player, {
      events: {
        onReady() { playerReady = true; },
        onError: showPlayerError,
        onStateChange(event) {
          if (event.data === 1) status.hidden = true;
        }
      }
    });
  };
  const api = document.createElement('script');
  api.src = 'https://www.youtube.com/iframe_api';
  api.async = true;
  document.head.appendChild(api);

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
    const id = card.dataset.videoId;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    cards.forEach(item => item.setAttribute('aria-pressed', String(item === card)));
    status.hidden = true;
    if (playerReady && youtubePlayer) youtubePlayer.loadVideoById(id);
    else player.src = embedUrl(id, true);
    player.title = card.dataset.videoTitle;
    title.textContent = card.dataset.videoTitle;
    watch.href = `https://www.youtube.com/watch?v=${id}`;
    title.focus({ preventScroll: true });
    player.closest('.channel-player').scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }));
  if (cards[0]) cards[0].setAttribute('aria-pressed', 'true');
  render();
})();
