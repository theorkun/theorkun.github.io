(() => {
  const reader = document.querySelector('.reader');
  if (!reader) return;
  const pages = [...reader.querySelectorAll('.book-page')];
  const previous = reader.querySelector('#book-prev');
  const next = reader.querySelector('#book-next');
  const contents = reader.querySelector('#book-contents');
  const status = reader.querySelector('#book-status');
  const progress = reader.querySelector('progress');
  const spread = reader.querySelector('.book-spread');
  const smallScreen = window.matchMedia('(max-width:760px)');
  let current = 0;
  const step = () => smallScreen.matches ? 1 : 2;
  function render() {
    if (!smallScreen.matches && current > 0) current = 1 + Math.floor((current - 1) / 2) * 2;
    const last = Math.min(current + (current === 0 ? 1 : step()), pages.length);
    spread.classList.toggle('is-single', last - current === 1);
    spread.classList.toggle('is-cover', current === 0);
    pages.forEach((page, index) => { page.hidden = index < current || index >= last; });
    previous.disabled = current === 0;
    next.disabled = last === pages.length;
    status.textContent = current === 0 ? 'Kapak · Bir Ömrün Sesi' : last - current === 1 ? `Sayfa ${current + 1} / ${pages.length}` : `Sayfa ${current + 1}–${last} / ${pages.length}`;
    next.textContent = current === 0 ? 'Kitabı aç →' : 'Sonraki →';
    progress.max = pages.length;
    progress.value = last;
    contents.value = String(current);
  }
  pages.forEach((page, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${index + 1}. ${page.dataset.title}`;
    contents.append(option);
  });
  function turn(direction) {
    const destination = current === 0 && direction > 0 ? 1 : current === 1 && direction < 0 ? 0 : current + direction * step();
    if (destination < 0 || destination >= pages.length) return;
    current = destination;
    render();
  }
  previous.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  contents.addEventListener('change', () => { current = Number(contents.value); render(); });
  reader.addEventListener('keydown', event => {
    if (event.target.closest('select,input,textarea')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      turn(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  const scanDialog = document.querySelector('#scan-dialog');
  const scanImage = document.querySelector('#scan-image');
  const zoomOut = document.querySelector('#scan-zoom-out');
  const zoomIn = document.querySelector('#scan-zoom-in');
  let zoom = 100;
  function updateZoom() {
    scanImage.style.width = `${zoom}%`;
    document.querySelector('#scan-zoom-value').textContent = `${zoom}%`;
    zoomOut.disabled = zoom === 100;
    zoomIn.disabled = zoom === 300;
  }
  reader.querySelectorAll('[data-scan]').forEach(button => {
    button.addEventListener('click', () => {
      scanImage.src = button.dataset.scan;
      scanImage.alt = button.dataset.scanTitle;
      document.querySelector('#scan-title').textContent = button.dataset.scanTitle;
      zoom = 100;
      updateZoom();
      scanDialog.showModal();
      const viewport = scanDialog.querySelector('.scan-viewport');
      viewport.scrollTop = 0;
      viewport.scrollLeft = 0;
    });
  });
  zoomOut.addEventListener('click', () => { zoom = Math.max(100, zoom - 50); updateZoom(); });
  zoomIn.addEventListener('click', () => { zoom = Math.min(300, zoom + 50); updateZoom(); });
  document.querySelector('#scan-close').addEventListener('click', () => scanDialog.close());
  scanDialog.addEventListener('click', event => {
    if (event.target !== scanDialog) return;
    const rect = scanDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) scanDialog.close();
  });
  smallScreen.addEventListener('change', render);
  reader.querySelectorAll('[data-reader-controls]').forEach(element => { element.hidden = false; });
  render();
})();
