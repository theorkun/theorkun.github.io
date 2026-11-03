(() => {
  const status=document.getElementById('work-comment-status'),content=document.getElementById('work-comment-content'),retry=document.getElementById('work-comment-retry');
  if(window.parent!==window)document.body.classList.add('is-embedded');
  function resize(){if(window.parent!==window)window.parent.postMessage({type:'ceyhani-work-comments-size',height:document.documentElement.scrollHeight},location.origin);}
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;observer?.observe(document.body);
  const params=new URLSearchParams(location.search),kind=params.get('type'),id=params.get('id');
  let retryAction=()=>location.reload();retry.addEventListener('click',()=>retryAction());
  async function start(){
    if((kind!=='poem'&&kind!=='track')||!/^[a-z0-9-]{1,80}$/.test(id||''))throw Error('invalid');
    const response=await fetch(kind==='poem'?'assets/poetry-discovery.json?v=archive-71-millet-removed-4':'assets/audio-playlist.json');
    if(!response.ok)throw Error();const archive=await response.json();
    const item=kind==='poem'?archive.poems.find(p=>String(p.poemNo)===id):archive.tracks.find(t=>t.id===id);
    if(!item){status.textContent='Bu eser arşivde bulunamadı.';return;}
    document.getElementById('work-title').textContent=item.title;document.title=item.title+' — yorumlar';
    if(!window.CeyhaniCookies?.allows('comments')){
      status.textContent='Yorumları açmak için Ziyaretçi defteri ve eser yorumları iznini verebilirsiniz.';
      retry.textContent='Çerez tercihlerini aç';retry.hidden=false;retryAction=()=>window.CeyhaniCookies?.open();return;
    }
    const settings=await fetch('assets/work-comments-settings.json',{cache:'no-store'});if(!settings.ok)throw Error();
    if((await settings.json()).moderationConfirmed!==true){
      status.textContent='Yorum alanını hazırlıyoruz. Yorum gönderimi henüz açık değil.';
      content.innerHTML='<div class="work-comments-preview"><label for="work-preview-name">Adınız veya takma adınız</label><input id="work-preview-name" placeholder="Adınız (isteğe bağlı)" disabled><label for="work-preview-message">Bu esere dair yorumlarınız</label><textarea id="work-preview-message" placeholder="Sizde bıraktığı duyguyu paylaşın…" disabled></textarea><button type="button" disabled>Yorumu yayımla</button></div>';resize();return;
    }
    status.textContent='Yorumlar yükleniyor…';
    const box=document.createElement('div');box.id='HCB_comment_box';content.appendChild(box);
    const page='https://theorkun.github.io/eser-yorumlari.html?'+new URLSearchParams({type:kind,id});
    let timer;
    window.hcb_user={PAGE:page,MAX_CHARS:1000,comments_header:'Yorumlar',name_label:'Adınız veya takma adınız (isteğe bağlı)',content_label:'Bu esere dair yorumlarınız…',submit:'Yorumu yayımla',anonymous:'Bir ziyaretçi',no_comments_msg:'Henüz yorum yok. İlk hatırayı siz paylaşın.',add:'Yorum yaz',again:'Yeni bir yorum yaz',said:'',showing:'Gösterilen',to:'–',prev_page:'Önceki',next_page:'Sonraki',reply:'Yanıtla',flag:'Bildir',like:'Beğen',admin_link:'',logout_link:'Çıkış yap',add_image:'Fotoğraf ekle',mod_label:'(yönetici)',days_ago:'gün önce',hours_ago:'saat önce',minutes_ago:'dakika önce',within_the_last_minute:'az önce',msg_thankyou:'Yorumunuz alındı. Teşekkür ederiz.',msg_approval:'Bu yorum yönetici onayını bekliyor.',msg_approval_required:'Yorumunuz yönetici onayından sonra görünecek.',err_comment_empty:'Lütfen önce yorumunuzu yazın.',err_too_frequent:'Yeni yorum göndermeden önce birkaç saniye bekleyin.',err_unknown:'Yorum gönderilemedi. Lütfen yeniden deneyin.',err_denied:'Yorum gönderilemedi.',err_bad_html:'Lütfen yorumunuzu düz metin olarak yazın.',err_bad_email:'Geçerli bir e-posta adresi yazın.',err_spam:'Yorum spam filtresine takıldı.',err_blocked:'Yorum hizmet tarafından engellendi.',are_you_sure:'Bu yorumu uygunsuz olarak bildirmek istiyor musunuz?',onload(){clearTimeout(timer);status.hidden=true;retry.hidden=true;resize();}};
    const script=document.createElement('script'),url=new URL('https://www.htmlcommentbox.com/jread');
    url.searchParams.set('page',page);url.searchParams.set('mod','$1$wq1rdBcg$dG7tLtCXm1VIIchtX2SGm1');url.searchParams.set('opts','22');url.searchParams.set('num','10');script.src=url.href;script.async=true;
    function unavailable(){status.hidden=false;status.textContent='Yorum hizmetine şu anda ulaşılamıyor. Daha sonra yeniden deneyebilirsiniz.';retry.hidden=false;resize();}
    script.onerror=()=>{clearTimeout(timer);unavailable();};timer=setTimeout(unavailable,15000);document.head.appendChild(script);
    window.addEventListener('pagehide',()=>{clearTimeout(timer);observer?.disconnect();});
  }
  start().catch(()=>{status.textContent='Yorum alanı yüklenemedi. Lütfen yeniden deneyin.';retry.hidden=false;resize();});
})();
