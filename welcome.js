(() => {
  const dialog = document.querySelector('#welcome-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const key = 'ceyhani-welcome-v1';
  try {
    if (sessionStorage.getItem(key)) return;
  } catch { /* The announcement also works when browser storage is disabled. */ }

  dialog.querySelectorAll('[data-welcome-close]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.showModal();
  try { sessionStorage.setItem(key, 'seen'); } catch { /* Storage is optional. */ }
})();
