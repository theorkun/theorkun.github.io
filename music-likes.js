(() => {
  const list=document.getElementById('musicTracks');if(!list)return;
  const status=document.getElementById('musicLikesStatus'),retry=document.getElementById('musicLikesRetry'),sort=document.getElementById('musicSort');
  let counts=Object.create(null),liked=new Set(),ready=false,disposed=false,unavailable=false;
  const pending=new Set(),subscribers=new Set();
  function announce(text){status.textContent=text;}
  function paint(){
    sort.disabled=!ready;
    for(const button of list.querySelectorAll('[data-music-like]')){
      const id=button.dataset.musicLike,n=counts[id];
      const stateText=pending.size?'Beğeniniz kaydediliyor':unavailable&&!ready?'Beğeni servisine şu anda ulaşılamıyor':'Beğeniler yükleniyor';
      button.disabled=!ready||pending.size>0;button.setAttribute('aria-pressed',String(liked.has(id)));
      button.setAttribute('aria-label',`${button.dataset.trackTitle}: ${liked.has(id)?'beğeniyi geri al':'beğen'}. ${ready&&!pending.size?`${n??0} beğeni`:stateText}`);
      button.title=button.disabled?stateText:liked.has(id)?'Beğeniyi geri al':'Bu türküyü beğen';
      button.querySelector('[data-like-count]').textContent=ready?new Intl.NumberFormat('tr-TR').format(n??0):'—';
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
      const response=await fetch('music-likes.ashx',{...options,credentials:'same-origin',cache:'no-store',signal:controller.signal});
      if(!response.ok)throw Error('Likes unavailable');
      accept(await response.json());
    }finally{clearTimeout(timer);}
  }
  async function load(){
    unavailable=false;retry.hidden=true;announce('Beğeniler yükleniyor…');paint();
    try{await request();announce('Beğeniler tüm ziyaretçilerin ortak toplamıdır.');}
    catch(_){unavailable=true;announce('Beğeniler şu anda yüklenemiyor. Biraz sonra yeniden deneyebilirsiniz.');retry.hidden=false;}
    publish();
  }
  function animate(button){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('a11y-reduced-motion'))return;
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
      await request({method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({track:id,liked:desired?'1':'0'}).toString()});
      announce(desired?'Beğeniniz kaydedildi. Teşekkür ederiz.':'Beğeniniz geri alındı.');
      pending.delete(id);publish();
      const current=[...list.querySelectorAll('[data-music-like]')].find(b=>b.dataset.musicLike===id);
      if(current){if(desired)animate(current);if(hadFocus&&(document.activeElement===document.body||document.activeElement===button))current.focus({preventScroll:true});}
    }catch(_){announce('Beğeniniz kaydedilemedi. Lütfen yeniden deneyin.');pending.delete(id);paint();}
  });
  retry.addEventListener('click',load);
  window.CeyhaniTrackLikes={getCount:id=>ready?(counts[id]??0):null,paint,subscribe(callback){subscribers.add(callback);return()=>subscribers.delete(callback);}};
  window.addEventListener('pagehide',()=>{disposed=true;subscribers.clear();});
  window.addEventListener('pageshow',event=>{if(event.persisted){disposed=false;load();}});
  load();
})();
