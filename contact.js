(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'contact-dialog';
  dialog.setAttribute('aria-labelledby', 'contact-title');
  dialog.innerHTML = `<div class="contact-heading"><h2 id="contact-title">Bize ulaşın</h2><button type="button" data-contact-close aria-label="İletişim penceresini kapat">×</button></div>
    <p>E-postanızı nasıl yazmak istersiniz?</p>
    <label for="contact-address">E-posta adresimiz</label><input id="contact-address" type="text" value="info@ceyhani.com.tr" readonly>
    <a class="contact-webmail" target="_blank" rel="noopener">Gmail’de yaz ↗</a>
    <a class="contact-localmail">Posta uygulamasında aç</a>
    <button type="button" class="contact-copy">Adresi kopyala</button>
    <p class="contact-note">Gmail seçeneği tarayıcıda açılır ve Gmail hesabınızla giriş yapmanızı gerektirebilir.</p>
    <p class="contact-status" role="status" aria-live="polite"></p>`;
  document.body.appendChild(dialog);
  const address = dialog.querySelector('#contact-address');
  const status = dialog.querySelector('.contact-status');
  let opener = null;
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="mailto:"]');
    if (!link || link.closest('.contact-dialog')) return;
    const mail = new URL(link.href);
    if (mail.pathname !== 'info@ceyhani.com.tr') return;
    event.preventDefault();
    opener = link;
    const gmail = new URL('https://mail.google.com/mail/');
    gmail.searchParams.set('view', 'cm');
    gmail.searchParams.set('fs', '1');
    gmail.searchParams.set('to', mail.pathname);
    for (const name of ['subject', 'body', 'cc', 'bcc']) {
      const value = mail.searchParams.get(name);
      if (value) gmail.searchParams.set(name === 'subject' ? 'su' : name, value);
    }
    dialog.querySelector('.contact-webmail').href = gmail.href;
    dialog.querySelector('.contact-localmail').href = mail.href;
    status.textContent = '';
    dialog.showModal();
  });
  dialog.querySelector('[data-contact-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  dialog.querySelector('.contact-copy').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(address.value);
      status.textContent = 'E-posta adresi kopyalandı.';
    } catch (_) {
      address.focus();
      address.select();
      status.textContent = 'Adres seçildi. Ctrl+C veya telefonunuzdaki Kopyala seçeneğini kullanın.';
    }
  });
})();
