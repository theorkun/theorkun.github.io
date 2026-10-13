(() => {
  const legal = document.querySelector('.footer-legal');
  const copyright = legal?.querySelector('.copyright');
  if (!legal || !copyright) {
    console.error('Ziyaretçi sayacı için footer alanı bulunamadı.');
    return;
  }

  const display = document.createElement('p');
  display.className = 'visitor-counter';
  display.setAttribute('role', 'status');
  display.setAttribute('aria-live', 'polite');
  display.textContent = 'Ziyaretçi sayısı yükleniyor…';
  copyright.insertAdjacentElement('afterend', display);

  const counterKey = 'ceyhani-com-tr-visitors';
  const sessionKey = 'ceyhani-visitor-counted-v1';
  const endpoint = 'https://countapi.mileshilliard.com/api/v1';
  let shouldCount = false;
  let canUseSessionStorage = true;

  try {
    shouldCount = sessionStorage.getItem(sessionKey) !== 'counted';
    if (shouldCount) sessionStorage.setItem(sessionKey, 'counted');
  } catch (error) {
    canUseSessionStorage = false;
    shouldCount = false;
    console.warn('Ziyaretçi sayacı oturum bilgisini saklayamadı; mevcut toplam yalnızca okunacak.', error);
  }

  const action = shouldCount ? 'hit' : 'get';
  fetch(`${endpoint}/${action}/${counterKey}`, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Sayaç servisi HTTP ${response.status} yanıtı verdi.`);
      return response.json();
    })
    .then(result => {
      const count = Number(result.value);
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error('Sayaç servisi geçerli bir toplam döndürmedi.');
      }
      display.textContent = `Ziyaretçi sayısı: ${new Intl.NumberFormat('tr-TR').format(count)}`;
    })
    .catch(error => {
      if (shouldCount && canUseSessionStorage) {
        try {
          sessionStorage.removeItem(sessionKey);
        } catch (storageError) {
          console.error('Sayaç hatası sonrası oturum işareti temizlenemedi.', storageError);
        }
      }
      console.error('Ziyaretçi sayısı alınamadı.', error);
      display.textContent = 'Ziyaretçi sayısı şu anda alınamıyor.';
    });
})();
