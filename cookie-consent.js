(() => {
  const key = 'ceyhani-cookie-consent-v1', version = 1, lifetime = 180 * 86400000;
  const categories = ['functional', 'statistics', 'media', 'comments'];
  let saved = null;
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (value?.version === version && Number.isFinite(value.at) && value.at <= Date.now() && Date.now() - value.at < lifetime && categories.every(c => typeof value[c] === 'boolean')) saved = value;
  } catch (_) {}
  const allows = category => saved?.[category] === true;
  const safeRemove = (storage, name) => { try { window[storage].removeItem(name); } catch (_) {} };
  if (!allows('functional')) {
    safeRemove('localStorage', 'ceyhani-accessibility');
    safeRemove('sessionStorage', 'ceyhani-background-music');
  }
  if (!allows('statistics')) safeRemove('sessionStorage', 'ceyhani-visitor-counted-v1');
  let panel, form, notice, error, previousFocus;
  function open() {
    if (!panel) return;
    previousFocus = document.activeElement;
    for (const category of categories) form.elements[category].checked = allows(category);
    if (!panel.open) panel.showModal();
  }
  function save(values) {
    const next = { version, at: Date.now() };
    for (const category of categories) next[category] = values[category] === true;
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch (_) {
      error.hidden = false;error.textContent = 'Tercihleriniz kaydedilemedi. Tarayıcınızın bu site için depolamaya izin verdiğini kontrol edin. Mevcut tercihleriniz değiştirilmedi.';
      return;
    }
    saved = next;
    // Reload the whole site, including its inner navigation frame, to stop previously loaded services.
    try { window.top.location.reload(); } catch (_) { window.location.reload(); }
  }
  window.CeyhaniCookies = {
    allows, decided: () => saved !== null, open,
    read(storage, name) { if (!allows('functional')) return null;try { return window[storage].getItem(name); } catch (_) { return null; } },
    write(storage, name, value) { if (allows('functional')) try { window[storage].setItem(name, value); } catch (_) {} }
  };
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) window.location.reload(); });
  document.addEventListener('DOMContentLoaded', () => {
    panel = document.createElement('dialog');panel.className = 'cookie-panel';panel.setAttribute('aria-labelledby', 'cookie-title');
    panel.innerHTML = '<form id="cookie-form"><div class="cookie-heading"><div><p class="cookie-eyebrow">GİZLİLİK TERCİHLERİNİZ</p><h2 id="cookie-title">Çerez tercihleri</h2></div><button class="cookie-close" type="button" aria-label="Tercihleri kaydetmeden kapat">×</button></div><p>İsteğe bağlı hizmetler siz izin verene kadar kapalıdır. Reddetmeniz siteyi gezmenizi engellemez. Tercihinizi daha sonra değiştirebilirsiniz.</p><div class="cookie-option"><strong>Zorunlu tercih kaydı · Her zaman etkin</strong><p>Yalnızca bu ekrandaki seçiminizi 180 gün hatırlar.</p></div><label class="cookie-option"><span><strong>İşlevsel tercihler</strong><small>Erişilebilirlik ayarlarınızın ve müzik tercihinizin hatırlanması. İzin vermeseniz de bu özellikleri kullanabilirsiniz.</small></span><input type="checkbox" name="functional"></label><label class="cookie-option"><span><strong>Ziyaret istatistikleri</strong><small>CountAPI üzerinden ziyaretçi sayacının çalışması.</small></span><input type="checkbox" name="statistics"></label><label class="cookie-option"><span><strong>YouTube videoları</strong><small>Video görselleri ve oynatıcı için YouTube / Google sunucularına bağlantı kurulması.</small></span><input type="checkbox" name="media"></label><label class="cookie-option"><span><strong>Ziyaretçi defteri</strong><small>Mesajları görüntülemek ve yazmak için HTML Comment Box hizmetinin yüklenmesi.</small></span><input type="checkbox" name="comments"></label><p><a href="cerez-politikasi.html">Çerez ve tarayıcı depolama politikasını okuyun →</a></p><div class="cookie-actions"><button type="button" data-cookie="reject">İsteğe bağlıları reddet</button><button type="button" data-cookie="accept">Tümünü kabul et</button><button type="submit">Seçimlerimi kaydet</button></div><p class="cookie-error" role="alert" hidden></p></form>';
    document.body.appendChild(panel);form = panel.querySelector('form');
    notice = document.createElement('section');notice.className = 'cookie-banner';notice.hidden = saved !== null;notice.setAttribute('aria-label', 'Çerez bilgilendirmesi');
    notice.innerHTML = '<div><strong>Gizliliğiniz sizin kontrolünüzde.</strong><p>Tercihinizi hatırlamak için tarayıcı depolaması kullanıyoruz. İstatistik, video ve ziyaretçi defteri gibi isteğe bağlı hizmetler yalnızca izninizle açılır. <a href="cerez-politikasi.html">Çerez politikası</a></p></div><div class="cookie-actions"><button type="button" data-cookie="reject">İsteğe bağlıları reddet</button><button type="button" data-cookie="accept">Tümünü kabul et</button><button type="button" data-cookie="settings">Tercihlerimi yönet</button></div>';
    document.body.appendChild(notice);
    error = panel.querySelector('.cookie-error');
    for (const container of [panel, notice]) container.addEventListener('click', event => {
      const action = event.target.closest('[data-cookie]')?.dataset.cookie;
      if (action === 'settings') open();
      if (action === 'reject' || action === 'accept') {
        if (!panel.open) open();
        save(Object.fromEntries(categories.map(c => [c, action === 'accept'])));
      }
    });
    form.addEventListener('submit', event => { event.preventDefault();save(Object.fromEntries(categories.map(c => [c, form.elements[c].checked]))); });
    panel.querySelector('.cookie-close').addEventListener('click', () => panel.close());
    panel.addEventListener('close', () => previousFocus?.focus({ preventScroll: true }));
    document.addEventListener('click', event => { if (event.target.closest('[data-cookie-settings]')) open(); });
    for (const image of document.querySelectorAll('img[data-media-src]')) if (allows('media')) image.src = image.dataset.mediaSrc;
  });
})();
