(() => {
  const root = document.documentElement;
  const key = 'ceyhani-accessibility';
  const defaults = { size: 100, contrast: false, motion: false, links: false };
  let settings = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved) settings = {
      size: [100, 125, 150, 175, 200].includes(saved.size) ? saved.size : 100,
      contrast: saved.contrast === true, motion: saved.motion === true, links: saved.links === true
    };
  } catch (_) { /* Preferences remain usable when storage is unavailable. */ }

  const widget = document.createElement('div');
  widget.className = 'accessibility-widget';
  widget.innerHTML = `<button type="button" class="accessibility-open" aria-haspopup="dialog" aria-controls="accessibility-dialog" aria-label="Erişilebilirlik ayarlarını aç">
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M3 8l9 2 9-2M12 10v5m0 0l-5 7m5-7l5 7"/></svg><span>Erişilebilirlik</span></button>`;
  const dialog = document.createElement('dialog');
  dialog.id = 'accessibility-dialog';
  dialog.className = 'accessibility-dialog';
  dialog.setAttribute('aria-labelledby', 'accessibility-title');
  dialog.innerHTML = `<div class="accessibility-heading"><h2 id="accessibility-title">Erişilebilirlik</h2><button type="button" data-close aria-label="Erişilebilirlik ayarlarını kapat">×</button></div>
    <p>Okuma deneyimini kendinize göre düzenleyin.</p>
    <fieldset><legend>Yazı boyutu</legend><div class="accessibility-size"><button type="button" data-smaller aria-label="Yazıları küçült">A−</button><output aria-live="polite" aria-label="Yazı boyutu">100%</output><button type="button" data-larger aria-label="Yazıları büyüt">A+</button></div></fieldset>
    <label><input type="checkbox" data-setting="contrast"> Yüksek kontrast</label>
    <label><input type="checkbox" data-setting="motion"> Hareketleri azalt</label>
    <label><input type="checkbox" data-setting="links"> Bağlantıların altını çiz</label>
    <button type="button" class="accessibility-reset">Ayarları sıfırla</button>`;
  document.body.append(widget, dialog);
  const opener = widget.querySelector('button');
  const smaller = dialog.querySelector('[data-smaller]');
  const larger = dialog.querySelector('[data-larger]');
  const output = dialog.querySelector('output');
  const originalFonts = new Map();
  let pending = false;

  function resizeText() {
    // Measure the original cascade first so inherited text is never enlarged twice.
    for (const [element, original] of originalFonts) {
      if (!element.isConnected) { originalFonts.delete(element); continue; }
      if (original.value) element.style.setProperty('font-size', original.value, original.priority);
      else element.style.removeProperty('font-size');
    }
    if (settings.size === 100) return;
    const measurements = [];
    document.body.querySelectorAll('*').forEach(element => {
      if (element.closest('.accessibility-widget, #accessibility-dialog, svg') ||
          ['SCRIPT', 'STYLE', 'OPTION'].includes(element.tagName)) return;
      const hasText = [...element.childNodes].some(node => node.nodeType === 3 && node.textContent.trim());
      if (!hasText && !element.matches('input, textarea, select')) return;
      if (!originalFonts.has(element)) originalFonts.set(element, {
        value: element.style.getPropertyValue('font-size'), priority: element.style.getPropertyPriority('font-size')
      });
      measurements.push([element, parseFloat(getComputedStyle(element).fontSize)]);
    });
    for (const [element, size] of measurements) {
      if (Number.isFinite(size)) element.style.setProperty('font-size', `${size * settings.size / 100}px`, 'important');
    }
  }
  function scheduleResize() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; resizeText(); });
  }
  function apply() {
    root.classList.toggle('a11y-high-contrast', settings.contrast);
    root.classList.toggle('a11y-reduced-motion', settings.motion);
    root.classList.toggle('a11y-underlined-links', settings.links);
    root.classList.toggle('a11y-large-text', settings.size > 100);
    output.textContent = `${settings.size}%`;
    smaller.disabled = settings.size === 100;
    larger.disabled = settings.size === 200;
    dialog.querySelectorAll('[data-setting]').forEach(input => { input.checked = settings[input.dataset.setting]; });
    resizeText();
    try { localStorage.setItem(key, JSON.stringify(settings)); } catch (_) {}
  }
  opener.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener.focus({ preventScroll: true }));
  smaller.addEventListener('click', () => { settings.size = Math.max(100, settings.size - 25); apply(); });
  larger.addEventListener('click', () => { settings.size = Math.min(200, settings.size + 25); apply(); });
  dialog.querySelectorAll('[data-setting]').forEach(input => input.addEventListener('change', () => {
    settings[input.dataset.setting] = input.checked; apply();
  }));
  dialog.querySelector('.accessibility-reset').addEventListener('click', () => { settings = { ...defaults }; apply(); });
  window.addEventListener('resize', scheduleResize);
  new MutationObserver(scheduleResize).observe(document.body, { childList: true, subtree: true });
  if (document.fonts) document.fonts.ready.then(scheduleResize);
  apply();
})();
