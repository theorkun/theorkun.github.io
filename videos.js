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
  const batchSize = 12;
  let visibleCount = batchSize;

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
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&hl=tr`;
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
