(() => {
  const section = document.querySelector('#ziyaretci-defteri');
  if (!section) return;

  const repo = 'theorkun/theorkun.github.io';
  const prefix = '[Ziyaretçi Defteri] ';
  const form = section.querySelector('form');
  const list = section.querySelector('.guestbook-entries');
  const status = section.querySelector('[role="status"]');
  const refresh = section.querySelector('.guestbook-refresh');
  let loading = false;

  form.hidden = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.visitorName.value.trim();
    const message = form.elements.visitorMessage.value.trim();
    if (!name || !message) {
      status.textContent = 'Lütfen adını ve mesajını yaz.';
      (!name ? form.elements.visitorName : form.elements.visitorMessage).focus();
      return;
    }
    const url = new URL(`https://github.com/${repo}/issues/new`);
    url.searchParams.set('title', prefix + name);
    url.searchParams.set('body', `Ad: ${name}\n\n${message}`);
    window.location.assign(url.href);
  });

  async function loadEntries() {
    if (loading) return;
    loading = true;
    refresh.disabled = true;
    list.setAttribute('aria-busy', 'true');
    status.textContent = 'Mesajlar yükleniyor…';
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=open&sort=created&direction=desc&per_page=100`, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(12000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const issues = await response.json();
      if (!Array.isArray(issues)) throw new Error('Invalid response');
      const entries = issues.filter(issue => !issue.pull_request && typeof issue.title === 'string' && issue.title.startsWith(prefix)).slice(0, 20);
      const fragment = document.createDocumentFragment();
      for (const entry of entries) {
        const article = document.createElement('article');
        article.className = 'guestbook-entry';
        const heading = document.createElement('h3');
        heading.textContent = entry.title.slice(prefix.length);
        const message = document.createElement('p');
        const body = typeof entry.body === 'string' ? entry.body : '';
        message.textContent = body.replace(/^Ad: [^\r\n]*\r?\n\r?\n/, '');
        const time = document.createElement('time');
        const date = new Date(entry.created_at);
        if (!Number.isNaN(date.getTime())) {
          time.dateTime = date.toISOString();
          time.textContent = date.toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long', year: 'numeric' });
        }
        article.append(heading, time, message);
        fragment.appendChild(article);
      }
      list.replaceChildren(fragment);
      status.textContent = entries.length ? 'Son ziyaretçi mesajları.' : 'Henüz mesaj yok. İlk hatırayı sen bırak.';
    } catch {
      status.textContent = 'Mesajlar şu anda yüklenemedi. Tekrar deneyebilir veya tüm mesajlar bağlantısından okuyabilirsin.';
    } finally {
      loading = false;
      refresh.disabled = false;
      list.setAttribute('aria-busy', 'false');
    }
  }

  refresh.addEventListener('click', loadEntries);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        loadEntries();
      }
    }, { rootMargin: '200px' });
    observer.observe(section);
  } else {
    loadEntries();
  }
})();
