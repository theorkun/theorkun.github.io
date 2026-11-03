(() => {
  const key='ceyhani-cookie-consent-v1',version=2,lifetime=180*86400000;
  const categories=['functional','statistics','media','comments'];
  let saved=null,panel=null,form=null,notice=null,error=null,previousFocus=null,manager=null;
  try{if(window.parent&&window.parent!==window&&window.top.CeyhaniCookies)manager=window.top.CeyhaniCookies;}catch(_){}
  function readChoice(){try{const value=JSON.parse(localStorage.getItem(key));return value?.version===version&&Number.isFinite(value.at)&&value.at<=Date.now()&&Date.now()-value.at<lifetime&&categories.every(c=>typeof value[c]==='boolean')?value:null;}catch(_){return null;}}
  const allows=category=>saved?.[category]===true;
  function remove(storage,name){try{if(window[storage].getItem(name)!==null)window[storage].removeItem(name);}catch(_){}}
  function clean(){if(!allows('functional')){remove('localStorage','ceyhani-accessibility');remove('sessionStorage','ceyhani-background-music');}if(!allows('statistics'))remove('sessionStorage','ceyhani-visitor-counted-v1');}
  function images(){if(allows('media'))for(const image of document.querySelectorAll('img[data-media-src]'))if(image.src!==image.dataset.mediaSrc)image.src=image.dataset.mediaSrc;}
  function emit(){document.dispatchEvent(new CustomEvent('ceyhani-cookie-change'));}
  function revoked(before){return ['statistics','media','comments'].some(c=>before?.[c]===true&&!allows(c));}
  function reload(){try{window.top.location.reload();}catch(_){window.location.reload();}}
  saved=readChoice();clean();
  function actions(container){container.addEventListener('click',event=>{const action=event.target.closest('[data-cookie]')?.dataset.cookie;if(action==='settings')open();if(action==='accept'||action==='reject')save(Object.fromEntries(categories.map(c=>[c,action==='accept'])));});}
  function ensurePanel(){
    if(panel)return;
    panel=document.createElement('dialog');panel.className='cookie-panel';panel.setAttribute('aria-labelledby','cookie-title');
    panel.innerHTML = '<form id="cookie-form"><div class="cookie-heading"><div><p class="cookie-eyebrow">GİZLİLİK TERCİHLERİNİZ</p><h2 id="cookie-title">Çerez tercihleri</h2></div><button class="cookie-close" type="button" aria-label="Tercihleri kaydetmeden kapat">×</button></div><p>İsteğe bağlı hizmetler siz izin verene kadar kapalıdır. Reddetmeniz siteyi gezmenizi engellemez. Tercihinizi daha sonra değiştirebilirsiniz.</p><div class="cookie-option"><strong>Zorunlu tercih kaydı · Her zaman etkin</strong><p>Yalnızca bu ekrandaki seçiminizi 180 gün hatırlar.</p></div><label class="cookie-option"><span><strong>İşlevsel tercihler</strong><small>Erişilebilirlik ayarlarınızın ve müzik tercihinizin hatırlanması. İzin vermeseniz de bu özellikleri kullanabilirsiniz.</small></span><input type="checkbox" name="functional"></label><label class="cookie-option"><span><strong>Ziyaret istatistikleri</strong><small>CountAPI üzerinden ziyaretçi sayacının çalışması.</small></span><input type="checkbox" name="statistics"></label><label class="cookie-option"><span><strong>YouTube videoları</strong><small>Video görselleri ve oynatıcı için YouTube / Google sunucularına bağlantı kurulması.</small></span><input type="checkbox" name="media"></label><label class="cookie-option"><span><strong>Ziyaretçi defteri ve eser yorumları</strong><small>Mesajları görüntülemek ve yazmak için yorum hizmetinin yüklenmesi.</small></span><input type="checkbox" name="comments"></label><p><a href="cerez-politikasi.html">Çerez ve tarayıcı depolama politikasını okuyun →</a></p><div class="cookie-actions"><button type="button" data-cookie="reject">İsteğe bağlıları reddet</button><button type="button" data-cookie="accept">Tümünü kabul et</button><button type="submit">Seçimlerimi kaydet</button></div><p class="cookie-error" role="alert" hidden></p></form>';
    document.body.appendChild(panel);form=panel.querySelector('form');error=panel.querySelector('.cookie-error');actions(panel);
    form.addEventListener('submit',event=>{event.preventDefault();save(Object.fromEntries(categories.map(c=>[c,form.elements[c].checked])));});
    panel.querySelector('.cookie-close').addEventListener('click',()=>panel.close());panel.addEventListener('close',()=>previousFocus?.focus({preventScroll:true}));
  }
  function open(){
    if(manager)return manager.open();ensurePanel();previousFocus=document.activeElement;
    for(const category of categories)form.elements[category].checked=allows(category);
    panel.inert=false;if(panel.style)panel.style.display='';if(!panel.open)panel.showModal();
  }
  function save(values){
    const before=saved,next={version,at:Date.now()};for(const category of categories)next[category]=values[category]===true;
    try{localStorage.setItem(key,JSON.stringify(next));}catch(_){open();error.hidden=false;error.textContent='Tercihleriniz kaydedilemedi. Taray\u0131c\u0131n\u0131z\u0131n bu site i\u00e7in depolamaya izin verdi\u011fini kontrol edin. Mevcut tercihleriniz de\u011fi\u015ftirilmedi.';return;}
    saved=next;clean();if(panel?.open)panel.close();if(notice)notice.hidden=true;
    if(revoked(before)){reload();return;}images();emit();
  }
  window.CeyhaniCookies={allows,decided:()=>saved!==null,open,
    read(storage,name){if(!allows('functional'))return null;try{return window[storage].getItem(name);}catch(_){return null;}},
    write(storage,name,value){if(allows('functional'))try{window[storage].setItem(name,value);}catch(_){}}
  };
  window.addEventListener('storage',event=>{if(event.key!==key&&event.key!==null)return;const before=saved;saved=readChoice();clean();if(revoked(before)&&!manager){reload();return;}if(notice)notice.hidden=saved!==null;images();emit();});
  document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('click',event=>{if(event.target.closest('[data-cookie-settings]'))open();});
    if(!manager&&!saved){notice=document.createElement('section');notice.className='cookie-banner';notice.hidden=false;notice.setAttribute('aria-label','\u00c7erez bilgilendirmesi');
      notice.innerHTML = '<div><strong>Gizliliğiniz sizin kontrolünüzde.</strong><p>Tercihinizi hatırlamak için tarayıcı depolaması kullanıyoruz. İstatistik, video ve ziyaretçi defteri gibi isteğe bağlı hizmetler yalnızca izninizle açılır. <a href="cerez-politikasi.html">Çerez politikası</a></p></div><div class="cookie-actions"><button type="button" data-cookie="reject">İsteğe bağlıları reddet</button><button type="button" data-cookie="accept">Tümünü kabul et</button><button type="button" data-cookie="settings">Tercihlerimi yönet</button></div>';
      document.body.appendChild(notice);actions(notice);
    }
    images();
  });
})();
