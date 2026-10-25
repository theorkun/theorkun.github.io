(() => {
  const cookies = window.CeyhaniCookies;
  // Remember this introduction only with permission to store functional preferences.
  if (!cookies?.decided() || !cookies.allows('functional')) return;
  const key = 'ceyhani-welcome-seen-v1';
  if (cookies.read('localStorage', key) === '1') return;
  const dialog = document.querySelector('#welcome-dialog');
  if (!dialog || typeof dialog.showModal !== 'function' ||
      document.querySelector('dialog[open]')) return;

  // If storage is unavailable, avoid a popup that would reappear on every visit.
  cookies.write('localStorage', key, '1');
  if (cookies.read('localStorage', key) !== '1') return;
  dialog.querySelectorAll('[data-welcome-close]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.showModal();
})();
