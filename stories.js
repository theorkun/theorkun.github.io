(() => {
  const dialog = document.querySelector('#story-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const stories = [
    { image: 'assets/ceyhani-saz.jpg', caption: 'Sazıyla, sözüyle Aşık Ceyhani.' },
    { image: 'assets/fotograf.jpg', caption: 'Gençlik yıllarından bir hatıra.' },
    { image: 'assets/ceyhani-portre.jpeg', caption: 'Gülüşüyle hatıralarımızda…' },
    { image: 'assets/hatira-dogada.jpeg', caption: 'Doğadan bir hatıra.' },
    { image: 'assets/hatira-daglar.jpeg', caption: 'Dağların arasında bir hatıra.' },
    { image: 'assets/hatira-bayrak.jpeg', caption: 'Bayrağımızın gölgesinde.' },
    { image: 'assets/hatira-etkinlik.jpeg', caption: 'Bir etkinlikten hatıra.' }
  ];
  const image = dialog.querySelector('#story-image');
  const caption = dialog.querySelector('#story-caption');
  const count = dialog.querySelector('#story-count');
  const progress = dialog.querySelector('.story-progress');
  progress.replaceChildren(...stories.map(() => document.createElement('span')));
  const segments = [...progress.children];
  const buttons = [...document.querySelectorAll('[data-story]')];
  const prev = dialog.querySelector('#story-prev');
  const next = dialog.querySelector('#story-next');
  let current = 0;

  function show(index) {
    current = (index + stories.length) % stories.length;
    image.src = stories[current].image;
    image.alt = stories[current].caption;
    caption.textContent = stories[current].caption;
    count.textContent = `${current + 1} / ${stories.length}`;
    segments.forEach((segment, i) => segment.classList.toggle('is-viewed', i <= current));
    buttons[current].classList.add('is-seen');
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    show(Number(button.dataset.story));
    dialog.showModal();
  }));
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  dialog.querySelector('#story-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
