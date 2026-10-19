(() => {
  const cards = [...document.querySelectorAll('.archive-card')];
  if (!cards.length || !('IntersectionObserver' in window)) return;
  // Each photo colours in once. No scroll listener or continuous animation.
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -4% 0px' });
  cards.forEach(card => observer.observe(card));
  window.addEventListener('pagehide', () => observer.disconnect());
  window.addEventListener('pageshow', event => {
    if (event.persisted) cards.filter(card => !card.classList.contains('is-revealed')).forEach(card => observer.observe(card));
  });
})();
