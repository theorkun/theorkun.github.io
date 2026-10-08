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
  let current = 0;
  let flipping = false;
  let drag = null;
  let suppressClickUntil = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  const step = () => 1;
  function render() {
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
  function destinationFor(direction) {
    return current === 0 && direction > 0 ? 1 : current === 1 && direction < 0 ? 0 : current + direction * step();
  }
  function canTurn(direction) {
    const destination = destinationFor(direction);
    return destination >= 0 && destination < pages.length;
  }
  function createSheet(direction) {
    const visible = pages.filter(page => !page.hidden);
    const sheet = document.createElement('div');
    sheet.className = `book-turn-sheet ${direction > 0 ? 'turn-forward' : 'turn-backward'}`;
    sheet.setAttribute('aria-hidden', 'true');
    sheet.inert = true;
    const face = (direction > 0 ? visible[visible.length - 1] : visible[0]).cloneNode(true);
    face.hidden = false;
    sheet.append(face);
    spread.append(sheet);
    return sheet;
  }
  function angleFor(direction, amount) {
    return `rotateY(${direction * -165 * amount}deg)`;
  }
  async function finishTurn(direction, sheet, amount, commit) {
    flipping = true;
    const destination = destinationFor(direction);
    spread.classList.add('is-turning');
    try {
      if (!reducedMotion.matches && sheet.animate) {
        await sheet.animate([
          { transform: angleFor(direction, amount) },
          { transform: angleFor(direction, commit ? 1 : 0) }
        ], { duration: Math.max(120, 600 * (commit ? 1 - amount : amount)), easing: 'cubic-bezier(.22,.65,.25,1)', fill: 'forwards' }).finished;
      }
      if (commit) current = destination;
    } finally {
      sheet.remove();
      spread.classList.remove('is-turning');
      flipping = false;
      render();
    }
  }
  function turn(direction) {
    if (flipping || drag || !canTurn(direction)) return;
    finishTurn(direction, createSheet(direction), 0, true);
  }
  previous.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  contents.addEventListener('change', () => {
    if (flipping || drag) { contents.value = String(current); return; }
    current = Number(contents.value); render();
  });
  spread.addEventListener('dragstart', event => event.preventDefault());
  spread.addEventListener('pointerdown', event => {
    if (flipping || drag || !event.isPrimary || event.button !== 0 || event.target.closest('a')) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, amount: 0, sheet: null, direction: 0 };
  });
  spread.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.sheet) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      if (Math.abs(dx) < 10) return;
      drag.direction = dx < 0 ? 1 : -1;
      if (!canTurn(drag.direction)) { drag = null; return; }
      drag.sheet = createSheet(drag.direction);
      spread.classList.add('is-turning');
      spread.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const width = spread.getBoundingClientRect().width;
    drag.amount = Math.max(0, Math.min(.95, (drag.direction > 0 ? -dx : dx) / Math.max(1, width * .65)));
    drag.sheet.style.transform = angleFor(drag.direction, drag.amount);
  });
  function releaseDrag(event, cancelled = false) {
    if (!drag || event.pointerId !== drag.id) return;
    const released = drag;
    drag = null;
    if (spread.hasPointerCapture(event.pointerId)) spread.releasePointerCapture(event.pointerId);
    if (!released.sheet) return;
    suppressClickUntil = Date.now() + 400;
    finishTurn(released.direction, released.sheet, released.amount, !cancelled && released.amount >= .18);
  }
  spread.addEventListener('pointerup', event => releaseDrag(event));
  spread.addEventListener('pointercancel', event => releaseDrag(event, true));
  spread.addEventListener('lostpointercapture', event => releaseDrag(event, true));
  spread.addEventListener('click', event => {
    if (Date.now() < suppressClickUntil || flipping) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
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
  reader.querySelectorAll('[data-reader-controls]').forEach(element => { element.hidden = false; });
  render();
})();
