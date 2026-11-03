(() => {
  if (!window.CeyhaniCookies?.decided()) return;
  const dialog = document.querySelector('#welcome-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const key = 'ceyhani-welcome-shown-v1';
  let host = window;
  try {
    if (window.top.location.origin === window.location.origin) host = window.top;
  } catch (_) {}
  if (host.CeyhaniWelcomeShown) return;
  try {
    if (window.sessionStorage.getItem(key) === '1') return;
  } catch (_) {}
  dialog.querySelectorAll('[data-welcome-close]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.showModal();
  host.CeyhaniWelcomeShown = true;
  try { window.sessionStorage.setItem(key, '1'); } catch (_) {}
})();
