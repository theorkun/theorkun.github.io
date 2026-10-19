(() => {
  if (document.querySelector('.back-to-top')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top';
  button.hidden = true;
  button.setAttribute('aria-label', 'Sayfanın başına dön');
  button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg><span>Başa dön</span>';
  document.body.appendChild(button);

  function updateVisibility() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const threshold = Math.min(400, Math.max(80, distance / 2));
    button.hidden = window.scrollY <= threshold;
  }
  button.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('a11y-reduced-motion');
    document.querySelector('header .brand, header a[href]')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  });
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  window.addEventListener('pageshow', updateVisibility);
  updateVisibility();
})();
