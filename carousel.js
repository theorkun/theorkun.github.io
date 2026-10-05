(() => {
  const slides = [
    { image: 'slide-stage', photo: 'assets/ceyhani-saz.jpg', caption: 'Aile arşivinden · Sazıyla Aşık Ceyhani' },
    { image: 'slide-young', photo: 'assets/fotograf.jpg', caption: 'Aile arşivinden · Gençlik yıllarında Durmuş Ali Sayıcı' }
  ];
  const carousel = document.querySelector('.hero-carousel');
  const dots = [...document.querySelectorAll('[data-slide]')];
  let current = 0;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { document.getElementById(slide.image).hidden = i !== current; });
    const slide = slides[current];
    carousel.closest('.hero').style.setProperty('--slide-photo', `url("${slide.photo}")`);
    document.getElementById('slide-caption').textContent = slide.caption;
    document.getElementById('slide-count').textContent = `${current + 1} / ${slides.length}`;
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
  }
  document.getElementById('slide-prev').addEventListener('click', () => showSlide(current - 1));
  document.getElementById('slide-next').addEventListener('click', () => showSlide(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide))));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  const surface = carousel.querySelector('.carousel-images');
  let start = null;
  surface.addEventListener('touchstart', event => {
    start = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  surface.addEventListener('touchend', event => {
    if (!start || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    start = null;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.4) showSlide(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  surface.addEventListener('touchcancel', () => { start = null; }, { passive: true });
})();
