(() => {
  const root = document.documentElement, key = 'ceyhani-accessibility';
  const defaults = { size:100, contrast:false, motion:false, links:false, light:false, color:0, saturation:0, images:false, easy:false, warm:false, font:false, line:false, mask:false, cursor:false, height:0, align:0, focus:false };
  const levels = {size:[100,125,150,175,200],color:[0,1,2],saturation:[0,1,2,3],height:[0,1,2,3],align:[0,1,2]};
  function readSettings() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(key)); } catch (_) {}
    const next = {...defaults};
    for (const name of Object.keys(defaults)) next[name] = levels[name] ? (levels[name].includes(saved?.[name]) ? saved[name] : defaults[name]) : saved?.[name] === true;
    return next;
  }
  let settings = readSettings();
  const icon = path => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const options = [
    ['structure','Sayfa Yapısı','<rect x="3" y="3" width="6" height="6"/><rect x="15" y="15" width="6" height="6"/><path d="M6 9v9h9M12 6h9M18 6v6"/>'],
    ['light','Albino Modu','<circle cx="12" cy="4" r="2"/><path d="M4 9h16M12 7v8M12 15l-4 7m4-7l4 7"/>'],
    ['color','Renk Körü Modu','<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'],
    ['focus','Odak Takibi','<path d="M8 12V5a2 2 0 0 1 4 0v6l3-1 5 2-2 8H9l-5-6a2 2 0 0 1 3-2l1 1"/>'],
    ['saturation','Doygunluk Modu','<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z"/><path d="M12 5v16"/>'],
    ['contrast','Kontrast Modu','<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>'],
    ['size','Metin Büyütme','<circle cx="10" cy="10" r="7"/><path d="M15 15l6 6M7 10h6M10 7v6"/>'],
    ['images','Resimleri Gizle','<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 3l18 18M4 17l5-5M13 13l3-3 5 6"/>'],
    ['links','Linkleri Vurgula','<path d="M10 13a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-2 2M14 11a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l2-2"/>'],
    ['easy','Kolay Okuma','<path d="M5 19L12 4l7 15M8 13h8M4 22h16"/>'],
    ['warm','Mavi Işık Filtresi','<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12l1 1M5 19l1-1M18 6l1-1"/>'],
    ['motion','Animasyonları Durdur','<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>'],
    ['font','Okunaklı Font','<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17l5-10 5 10M9 13h6"/>'],
    ['line','Okuma Çizgisi','<path d="M3 17h18M3 5h18M3 9h12M3 13h15"/>'],
    ['mask','Okuma Maskesi','<path d="M3 5h18v4H3zM3 15h18v4H3z" fill="currentColor"/>'],
    ['cursor','Büyük İmleç','<path d="M5 3v17l5-5 4 6 3-2-4-6h7z"/>'],
    ['height','Satır Yüksekliği','<path d="M6 3v18M3 6l3-3 3 3M3 18l3 3 3-3M13 5h8M13 12h8M13 19h8"/>'],
    ['align','Metin Hizalama','<path d="M3 4h18M3 9h12M3 14h18M3 19h12"/>']
  ];
  const descriptions = { light:'Açık zemin ve koyu yazı',color:'Gri tonlar veya mavi-sarı görünüm',focus:'İmlecin üzerindeki bağlantı ve düğmeyi odaklar; otomatik tıklamaz',font:'Arial fontu ve daha geniş harf aralığı',warm:'Ekran renklerine sıcak bir ton ekler' };
  const widget = document.createElement('div'); widget.className = 'accessibility-widget';
  widget.innerHTML = `<button type="button" class="accessibility-open" aria-haspopup="dialog" aria-controls="accessibility-dialog" aria-label="Erişilebilirlik ayarlarını aç">${icon(options[1][2])}<span>Erişilebilirlik</span></button>`;
  const dialog = document.createElement('dialog'); dialog.id = 'accessibility-dialog'; dialog.className = 'accessibility-dialog';
  dialog.setAttribute('aria-labelledby','accessibility-title');
  dialog.innerHTML = `<div class="accessibility-heading"><div><p class="accessibility-eyebrow">SİZE GÖRE BİR DENEYİM</p><h2 id="accessibility-title">Erişilebilirlik</h2></div><button type="button" data-close aria-label="Erişilebilirlik ayarlarını kapat">×</button></div>
    <div class="accessibility-body"><p class="accessibility-intro">Bir karta dokunarak ayarı açın. Noktalı kartlara tekrar dokunarak seviyeyi değiştirin.</p>
    <div class="accessibility-grid">${options.map(([name,label,path]) => `<button type="button" class="accessibility-card" data-setting="${name}" ${name === 'structure' ? 'aria-expanded="false" aria-controls="accessibility-structure"' : 'aria-pressed="false"'} ${descriptions[name] ? `title="${descriptions[name]}"` : ''}>${icon(path)}<span class="accessibility-card-label">${label}</span>${levels[name] ? `<span class="accessibility-dots" aria-hidden="true">${levels[name].slice(1).map(() => '<i></i>').join('')}</span>` : '<span class="accessibility-card-check" aria-hidden="true">✓</span>'}<span class="accessibility-card-value"></span></button>`).join('')}</div>
    <section id="accessibility-structure" class="accessibility-structure" aria-label="Sayfa başlıkları" hidden><h3>Sayfa başlıkları</h3><div></div></section>
    <details class="accessibility-keyboard"><summary>Klavyeyle nasıl kullanırım?</summary><p>Tab ile ilerleyin, Shift + Tab ile geri dönün. Enter veya boşluk ile seçim yapın. Esc ile paneli kapatın. Kitapta ok tuşlarıyla sayfa çevirin.</p></details></div>
    <div class="accessibility-footer"><button type="button" class="accessibility-reset">↺ Ayarları Sıfırla</button><span>Tercihleriniz bu tarayıcıda saklanır.</span></div>`;
  const guide = document.createElement('div'); guide.className = 'accessibility-reading-guide'; guide.setAttribute('aria-hidden','true');
  document.body.append(widget,dialog,guide);
  const opener = widget.querySelector('button');
  let closeFocusTarget = null;
  const cards = [...dialog.querySelectorAll('[data-setting]')];
  const structure = dialog.querySelector('#accessibility-structure');
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
      if (element.closest('.accessibility-widget, #accessibility-dialog, .accessibility-reading-guide, svg') ||
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
  function valueLabel(name) {
    if (name === 'size') return settings.size === 100 ? '' : `${settings.size}%`;
    if (name === 'color') return ['', 'Gri tonlar', 'Mavi / sarı'][settings.color];
    if (name === 'saturation') return ['', 'Düşük', 'Yüksek', 'Renksiz'][settings.saturation];
    if (name === 'height') return ['', '1.8', '2.2', '2.6'][settings.height];
    if (name === 'align') return ['', 'Sola', 'Ortaya'][settings.align];
    return settings[name] ? 'Açık' : '';
  }
  function apply(persist = true) {
    const classes = {contrast:'high-contrast',motion:'reduced-motion',links:'underlined-links',light:'light',images:'hide-images',easy:'easy',warm:'warm',font:'readable-font',line:'reading-line',mask:'reading-mask',cursor:'large-cursor'};
    for (const [name,className] of Object.entries(classes)) root.classList.toggle(`a11y-${className}`,settings[name]);
    root.classList.toggle('a11y-large-text',settings.size > 100);
    for (const name of ['color','saturation','height','align']) root.dataset[`a11y${name[0].toUpperCase()}${name.slice(1)}`] = String(settings[name]);
    cards.forEach(card => {
      const name = card.dataset.setting; if (name === 'structure') return;
      const active = levels[name] ? settings[name] !== defaults[name] : settings[name];
      card.setAttribute('aria-pressed',String(active));
      const value = valueLabel(name);
      card.setAttribute('aria-label',`${options.find(option => option[0] === name)[1]}: ${value || 'Kapalı'}`);
      const output = card.querySelector('.accessibility-card-value');
      if (output.textContent !== value) output.textContent = value;
      card.querySelectorAll('.accessibility-dots i').forEach((dot,i) => dot.classList.toggle('active',levels[name]?.indexOf(settings[name]) === i + 1));
    });
    resizeText();
    if (persist) try {localStorage.setItem(key,JSON.stringify(settings));} catch (_) {}
  }
  function toggleStructure(card) {
    structure.hidden = !structure.hidden; card.setAttribute('aria-expanded',String(!structure.hidden));
    if (structure.hidden) return;
    const list = structure.querySelector('div'); list.replaceChildren();
    document.querySelectorAll('main h1, main h2, main h3').forEach(heading => {
      if (heading.closest('[hidden]')) return;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = heading.textContent;
      button.addEventListener('click',() => {
        closeFocusTarget = heading; dialog.close(); const tabindex = heading.getAttribute('tabindex'); heading.setAttribute('tabindex','-1');
        heading.scrollIntoView({block:'start'}); heading.focus({preventScroll:true});
        heading.addEventListener('blur',() => tabindex === null ? heading.removeAttribute('tabindex') : heading.setAttribute('tabindex',tabindex),{once:true});
      }); list.appendChild(button);
    });
    if (!list.children.length) list.textContent = 'Bu sayfada başlık bulunamadı.';
    structure.scrollIntoView({block:'nearest'});
  }
  cards.forEach(card => card.addEventListener('click',() => {
    const name = card.dataset.setting; if (name === 'structure') {toggleStructure(card);return;}
    if (levels[name]) settings[name] = levels[name][(levels[name].indexOf(settings[name]) + 1) % levels[name].length];
    else settings[name] = !settings[name];
    if (name === 'light' && settings.light) settings.contrast = false;
    if (name === 'contrast' && settings.contrast) settings.light = false;
    if (name === 'line' && settings.line) settings.mask = false;
    if (name === 'mask' && settings.mask) settings.line = false;
    apply();
  }));
  opener.addEventListener('click',() => dialog.showModal());
  dialog.querySelector('[data-close]').addEventListener('click',() => dialog.close());
  dialog.addEventListener('close',() => {const target = closeFocusTarget || opener; closeFocusTarget = null; target.focus({preventScroll:true});});
  dialog.querySelector('.accessibility-reset').addEventListener('click',() => {
    settings = {...defaults}; structure.hidden = true;
    cards.find(card => card.dataset.setting === 'structure').setAttribute('aria-expanded','false'); apply();
  });
  function trackReading(y) {if (settings.line || settings.mask) root.style.setProperty('--a11y-reading-y',`${Math.max(0,Math.min(innerHeight,y))}px`);}
  document.addEventListener('pointermove',event => trackReading(event.clientY),{passive:true});
  document.addEventListener('focusin',event => {const bounds = event.target.getBoundingClientRect();trackReading(bounds.top + bounds.height / 2);});
  document.addEventListener('pointerover',event => {
    if (!settings.focus || event.pointerType === 'touch' || dialog.open) return;
    const target = event.target.closest('a[href], button, input, select, textarea, summary');
    if (target && !target.disabled && !target.closest('.accessibility-widget')) target.focus({preventScroll:true});
  });
  window.addEventListener('storage',event => {if (event.key === key) {settings = readSettings();apply(false);}});
  window.addEventListener('resize',scheduleResize);
  new MutationObserver(scheduleResize).observe(document.body,{childList:true,subtree:true});
  if (document.fonts) document.fonts.ready.then(scheduleResize);
  apply();
})();
