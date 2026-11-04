(() => {
  const section = document.querySelector('#ziyaretci-defteri');
  if (!section) return;
  const status = section.querySelector('[role="status"]');
  const retry = section.querySelector('.guestbook-retry');
  const box=section.querySelector('#HCB_comment_box');
  const privacy=window.CeyhaniCommentPrivacy?.attach(box.parentElement||section,box);
  let loading = false,visible=false,loaded=false;

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
    logout_link: 'Çıkış yap',
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
    ON_COMMENT() { privacy?.reset();window.CeyhaniCommentThanks?.received(); },
    onload() {
      loading = false;
      loaded=true;
      status.hidden = true;
      retry.hidden = true;
      const name = document.querySelector('#hcb_form_name');
      const message = document.querySelector('#hcb_form_content');
      if (name) name.setAttribute('aria-label', window.hcb_user.name_label);
      if (message) message.setAttribute('aria-label', 'Mesajın');
      fillSurveyDraft();
    }
  };

  function fillSurveyDraft() {
    const message = document.querySelector('#hcb_form_content');
    try {
      const draft = window.top.CeyhaniSurveyDraft;
      if (message && typeof draft === 'string' && draft.startsWith('Âşık Ceyhani — Site değerlendirmesi') && !message.value) {
        message.value = draft.slice(0, 1000);
        message.dispatchEvent(new Event('input', { bubbles: true }));
        delete window.top.CeyhaniSurveyDraft;
        status.hidden = false;
        status.textContent = 'Anket yanıtlarınız mesaj alanına aktarıldı. Henüz yayımlanmadı. Kontrol edip Mesajı gönder düğmesiyle herkese açık paylaşabilirsiniz.';
        message.focus();
      }
    } catch (_) {}
  }
  document.addEventListener('ceyhani-survey-draft', fillSurveyDraft);

  function loadGuestbook() {
    if(!privacy){status.hidden=false;status.textContent='Yorum gizlilik kontrolleri yüklenemedi. Lütfen sayfayı yenileyin.';retry.hidden=true;return;}
    if (!window.CeyhaniCookies?.allows('comments')) {
      status.hidden = false;
      status.textContent = 'Yorum alanını açtığınızda HTML Comment Box hizmetine bağlanılır ve bağlantı bilgileriniz sağlayıcıya iletilir. Bu izin yalnızca yorumlar içindir; mesaj göndermek için KVKK ve paylaşım onayları ayrıca seçilir.';
      retry.textContent = 'Yorum alanını aç';
      retry.hidden = false;
      return;
    }
    if (loading||loaded) return;
    loading = true;
    retry.textContent='Tekrar dene';
    status.hidden = false;
    status.textContent = 'Ziyaretçi defteri yükleniyor…';
    retry.hidden = true;
    const previous = document.querySelector('#guestbook-service');
    if (previous) previous.remove();
    const script = document.createElement('script');
    const url = new URL('https://www.htmlcommentbox.com/jread');
    url.searchParams.set('page', window.hcb_user.PAGE);
    // Public moderator reference from the owner's official embed code.
    url.searchParams.set('mod', '$1$wq1rdBcg$dG7tLtCXm1VIIchtX2SGm1');
    // Form first, dates and spam filter; no email, website or login required.
    url.searchParams.set('opts', '22');
    url.searchParams.set('num', '10');
    script.id = 'guestbook-service';
    script.src = url.href;
    script.async = true;
    let formObserver;
    const ready=()=>{if(!box.querySelector?.('#hcb_form'))return;window.hcb_user.onload();formObserver?.disconnect();};
    if(typeof MutationObserver==='function'){formObserver=new MutationObserver(ready);formObserver.observe(box,{childList:true,subtree:true});}
    script.onload=ready;
    window.addEventListener('pagehide',()=>formObserver?.disconnect());
    script.onerror = () => {
      formObserver?.disconnect();
      loading = false;
      status.hidden = false;
      status.textContent = 'Ziyaretçi defteri yüklenemedi. Lütfen tekrar dene.';
      retry.hidden = false;
    };
    document.head.appendChild(script);
  }

  retry.addEventListener('click', () => {
    if (!window.CeyhaniCookies?.allows('comments')&&!window.CeyhaniCookies?.grantComments()) return;
    visible=true;loadGuestbook();
  });
  document.addEventListener('ceyhani-cookie-change',()=>{if(visible&&window.CeyhaniCookies?.allows('comments'))loadGuestbook();});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        visible=true;
        loadGuestbook();
      }
    }, { rootMargin: '200px' });
    observer.observe(section);
  } else {
    visible=true;
    loadGuestbook();
  }
})();
