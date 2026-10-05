(() => {
  const section = document.querySelector('#ziyaretci-defteri');
  if (!section) return;
  const status = section.querySelector('[role="status"]');
  const retry = section.querySelector('.guestbook-retry');
  let loading = false;

  // Keep a single thread across index.html, anchors and query strings.
  window.hcb_user = {
    PAGE: 'https://theorkun.github.io/',
    MAX_CHARS: 1000,
    comments_header: 'Ziyaretçi mesajları',
    name_label: 'Adın veya takma adın (isteğe bağlı)',
    content_label: 'Mesajını buraya yaz…',
    submit: 'Mesajı gönder',
    anonymous: 'Bir ziyaretçi',
    no_comments_msg: 'Henüz mesaj yok. İlk hatırayı sen bırak.',
    add: 'Bir mesaj bırak',
    again: 'Yeni bir mesaj yaz',
    said: '',
    showing: 'Gösterilen',
    to: '–',
    prev_page: '← Önceki mesajlar',
    next_page: 'Sonraki mesajlar →',
    reply: 'Yanıtla',
    flag: 'Bildir',
    like: 'Beğen',
    admin_link: '',
    logout_link: '',
    add_image: 'Fotoğraf ekle',
    mod_label: '(yönetici)',
    days_ago: 'gün önce',
    hours_ago: 'saat önce',
    minutes_ago: 'dakika önce',
    within_the_last_minute: 'az önce',
    msg_thankyou: 'Mesajın yayımlandı. Hatıranı paylaştığın için teşekkürler!',
    msg_approval: 'Bu mesaj yönetici onayını bekliyor.',
    msg_approval_required: 'Teşekkürler! Mesajın yönetici onayından sonra görünecek.',
    err_bad_html: 'Lütfen mesajını düz metin olarak yaz.',
    err_bad_email: 'Geçerli bir e-posta adresi yaz.',
    err_too_frequent: 'Yeni bir mesaj göndermeden önce birkaç saniye bekle.',
    err_comment_empty: 'Lütfen önce mesajını yaz.',
    err_denied: 'Mesaj gönderilemedi. Lütfen tekrar dene.',
    err_unknown: 'Mesaj gönderilemedi. Lütfen tekrar dene.',
    err_spam: 'Mesaj spam filtresine takıldı.',
    err_blocked: 'Mesaj yorum servisi tarafından engellendi.',
    are_you_sure: 'Bu mesajı uygunsuz olarak bildirmek istiyor musun?',
    onload() {
      loading = false;
      status.hidden = true;
      retry.hidden = true;
      const name = document.querySelector('#hcb_form_name');
      const message = document.querySelector('#hcb_form_content');
      if (name) name.setAttribute('aria-label', window.hcb_user.name_label);
      if (message) message.setAttribute('aria-label', 'Mesajın');
    }
  };

  function loadGuestbook() {
    if (loading) return;
    loading = true;
    status.hidden = false;
    status.textContent = 'Ziyaretçi defteri yükleniyor…';
    retry.hidden = true;
    const previous = document.querySelector('#guestbook-service');
    if (previous) previous.remove();
    const script = document.createElement('script');
    const url = new URL('https://www.htmlcommentbox.com/jread');
    url.searchParams.set('page', window.hcb_user.PAGE);
    // Form first, dates and spam filter; no email, website or login required.
    url.searchParams.set('opts', '22');
    url.searchParams.set('num', '10');
    script.id = 'guestbook-service';
    script.src = url.href;
    script.async = true;
    script.onerror = () => {
      loading = false;
      status.hidden = false;
      status.textContent = 'Ziyaretçi defteri yüklenemedi. Lütfen tekrar dene.';
      retry.hidden = false;
    };
    document.head.appendChild(script);
  }

  retry.addEventListener('click', loadGuestbook);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        loadGuestbook();
      }
    }, { rootMargin: '200px' });
    observer.observe(section);
  } else {
    loadGuestbook();
  }
})();
