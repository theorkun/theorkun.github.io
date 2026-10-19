const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function closeNavigation() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  closeNavigation();
}));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.getAttribute('aria-expanded') !== 'true') return;
  if (document.querySelector('dialog[open]')) return;
  event.preventDefault();
  closeNavigation();
  menu.focus({ preventScroll: true });
});
document.addEventListener('focusin', event => {
  if (!menu.contains(event.target) && !nav.contains(event.target)) closeNavigation();
});
const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  const img = document.querySelector('#large-image');
  img.src = button.dataset.image;
  img.alt = button.dataset.alt;
  document.querySelector('#image-caption').textContent = button.dataset.alt;
  lightbox.showModal();
}));
document.querySelector('#close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  const rect = lightbox.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close();
});
const poemDialog = document.querySelector('#poem-dialog');
const poemTitle = document.querySelector('#poem-title');
const poemAuthor = document.querySelector('#poem-author');
const poemContent = document.querySelector('#poem-content');
const poemManuscript = document.querySelector('#poem-manuscript');
const poemClose = document.querySelector('#poem-close');
if (poemDialog && poemClose) {
  document.querySelectorAll('.poem-card').forEach(card => card.addEventListener('click', () => {
    poemTitle.textContent = card.dataset.title;
    poemAuthor.textContent = card.dataset.author;
    poemContent.innerHTML = card.dataset.poem.split('\n\n').map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join('');
    poemManuscript.hidden = !card.dataset.manuscript;
    poemDialog.classList.toggle('poem-dialog--manuscript', Boolean(card.dataset.manuscript));
    poemDialog.showModal();
  }));
  poemClose.addEventListener('click', () => poemDialog.close());
  poemDialog.addEventListener('click', event => {
    const rect = poemDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) poemDialog.close();
  });
}
if (nav.querySelector('a[href^="#"]') && 'IntersectionObserver' in window) {
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    nav.querySelectorAll('a').forEach(link => {
      if (!link.getAttribute('href').startsWith('#')) return;
      const active = link.getAttribute('href') === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
