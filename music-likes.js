(() => {
  const list=document.getElementById('musicTracks')||document.getElementById('poemLikes');if(!list)return;
  const poemMode=list.id==='poemLikes';
  const status=document.getElementById(poemMode?'poemLikesStatus':'musicLikesStatus'),retry=document.getElementById(poemMode?'poemLikesRetry':'musicLikesRetry'),sort=document.getElementById('musicSort');
  let counts=Object.create(null),liked=new Set(),ready=false,disposed=false,unavailable=false;
  const pending=new Set(),subscribers=new Set();
  // GitHub Pages and local previews share the API hosted on our own domain.
  const endpoint='https://asikceyhani.com.tr/music-likes.ashx',identityKey='ceyhani-like-visitor-v2';
  let identity=null;
  try{const saved=localStorage.getItem(identityKey);if(/^[a-f0-9]{32}$/.test(saved||''))identity=saved;}catch(_){}
  function visitor(){
    if(!identity){identity=Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');try{localStorage.setItem(identityKey,identity);}catch(_){}}
    return identity;
  }
  function announce(text){status.textContent=text;}
  function paint(){
    if(sort)sort.disabled=!ready;
    for(const button of list.querySelectorAll('[data-music-like]')){
      const id=button.dataset.musicLike,n=counts[id],known=ready&&Object.hasOwn(counts,id);
      const stateText=pending.size?'Beğeniniz kaydediliyor':unavailable&&!ready?'Beğeni servisine şu anda ulaşılamıyor':ready&&!known?'Bu eserin beğeni kaydına ulaşılamıyor':'Beğeniler yükleniyor';
      button.disabled=!known||pending.size>0;button.setAttribute('aria-pressed',String(liked.has(id)));
      button.setAttribute('aria-label',`${button.dataset.trackTitle}: ${liked.has(id)?'beğeniyi geri al':'beğen'}. ${known&&!pending.size?`${n} beğeni`:stateText}`);
      button.title=button.disabled?stateText:liked.has(id)?'Beğeniyi geri al':poemMode?'Bu şiiri beğen':'Bu türküyü beğen';
      button.querySelector('[data-like-count]').textContent=known?new Intl.NumberFormat('tr-TR').format(n):'—';
      if(poemMode&&ready&&!known&&id){announce('Şiir beğenileri henüz kullanılamıyor. Ortak servisin güncellenmesi gerekiyor.');retry.hidden=false;}
    }
  }
  function publish(){if(disposed)return;for(const callback of subscribers)callback();paint();}
  function accept(data){
    if(data?.ok!==true||!data.counts||!Array.isArray(data.liked))throw Error('Invalid result');
    const next=Object.create(null);
    for(const [id,count] of Object.entries(data.counts)){
      if(!/^[a-z0-9-]{1,80}$/.test(id)||!Number.isSafeInteger(count)||count<0)throw Error('Invalid count');
      next[id]=count;
    }
    if(!Object.keys(next).length||data.liked.some(id=>!Object.hasOwn(next,id)))throw Error('Invalid result');
    counts=next;liked=new Set(data.liked);ready=true;
  }
  async function request(options={}){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
    try{
      const headers={...options.headers};if(identity)headers['X-Ceyhani-Visitor']=identity;
      const response=await fetch(endpoint,{...options,headers,credentials:'omit',mode:'cors',cache:'no-store',signal:controller.signal});
      if(!response.ok)throw Error('Likes unavailable');
      accept(await response.json());
    }finally{clearTimeout(timer);}
  }
  async function load(){
    unavailable=false;retry.hidden=true;announce('Beğeniler yükleniyor…');paint();
    try{await request();announce('Beğeniler tüm ziyaretçilerin ortak toplamıdır.');}
    catch(_){unavailable=true;announce('Ortak beğeni servisine ulaşılamıyor. Beğeniler şu anda kullanılamıyor.');retry.hidden=false;}
    publish();
  }
  function animate(button){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('a11y-reduced-motion'))return;
    if(poemMode){
      const dialog=document.getElementById('poem-dialog');if(!dialog?.open)return;
      dialog.querySelector('.poem-saz-celebration')?.remove();
      const burst=document.createElement('span');burst.className='poem-saz-celebration';burst.setAttribute('aria-hidden','true');burst.style.top=(dialog.scrollTop+dialog.clientHeight/2)+'px';
      burst.innerHTML='<span class="poem-saz-halo"></span><img src="assets/saz-motifi.svg" alt="" width="150" height="270"><i></i><i></i><i></i><i></i><i></i><i></i>';
      dialog.appendChild(burst);burst.addEventListener('animationend',event=>{if(event.target===burst)burst.remove();});setTimeout(()=>burst.remove(),1800);return;
    }
    const burst=document.createElement('span');burst.className='music-saz-burst';burst.setAttribute('aria-hidden','true');
    burst.innerHTML='<img src="assets/saz-motifi.svg" alt="" width="25" height="45"><i></i><i></i><i></i>';
    button.appendChild(burst);burst.addEventListener('animationend',()=>burst.remove(),{once:true});setTimeout(()=>burst.remove(),1100);
  }
  list.addEventListener('click',async event=>{
    const button=event.target.closest('[data-music-like]');if(!button||!ready||button.disabled)return;
    const id=button.dataset.musicLike;if(!Object.hasOwn(counts,id)||pending.size)return;
    const desired=!liked.has(id),hadFocus=document.activeElement===button;
    pending.add(id);paint();announce('Beğeniniz kaydediliyor…');
    try{
      visitor();
      await request({method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({track:id,liked:desired?'1':'0'}).toString()});
      announce(desired?'Beğeniniz kaydedildi. Teşekkür ederiz.':'Beğeniniz geri alındı.');
      pending.delete(id);publish();
      const current=[...list.querySelectorAll('[data-music-like]')].find(b=>b.dataset.musicLike===id);
      if(current){if(desired)animate(current);if(hadFocus&&(document.activeElement===document.body||document.activeElement===button))current.focus({preventScroll:true});}
    }catch(_){announce('Beğeniniz kaydedilemedi. Lütfen yeniden deneyin.');pending.delete(id);paint();}
  });
  retry.addEventListener('click',load);
  window[poemMode?'CeyhaniPoemLikes':'CeyhaniTrackLikes']={getCount:id=>ready&&Object.hasOwn(counts,id)?counts[id]:null,paint,subscribe(callback){subscribers.add(callback);return()=>subscribers.delete(callback);}};
  window.addEventListener('pagehide',()=>{disposed=true;subscribers.clear();});
  let started=!poemMode;
  window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;if(started)load();}});
  if(poemMode){
    const onPoemReady=()=>{if(!started){started=true;load();}else{announce(pending.size?'Beğeniniz kaydediliyor…':ready?'Beğeniler tüm ziyaretçilerin ortak toplamıdır.':unavailable?'Ortak beğeni servisine ulaşılamıyor.':'Beğeniler yükleniyor…');paint();}};
    document.addEventListener('ceyhani-poem-likes-ready',onPoemReady);
    if(document.getElementById('poem-dialog')?.open&&list.querySelector('[data-music-like]')?.dataset.musicLike)onPoemReady();
  }
  else load();
})();
