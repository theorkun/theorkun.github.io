(async () => {
  function gesture(event) {
    if (event.type==='keydown' && !['Enter',' '].includes(event.key)) return;
    if (event.target.closest('.background-music, .music-library, .channel-video-card, .cookie-banner, .cookie-panel, [data-cookie-settings]')) return;
    try { window.parent.ceyhaniMusic?.startIfWanted(); } catch (_) {}
  }
  try {
    if (window.parent!==window && window.parent.ceyhaniNavigation) {
      document.addEventListener('pointerdown',gesture,{passive:true});document.addEventListener('keydown',gesture);return;
    }
  } catch (_) {}
  let config,tracks;
  try {
    const response=await fetch('assets/audio-playlist.json?v=tracks-21');if(!response.ok)throw Error();config=await response.json();
    const seen=new Set();tracks=config.tracks.filter(t=>typeof t.id==='string'&&typeof t.title==='string'&&/^(?:assets\/music\/[a-z0-9-]+\.mp3|assets\/ceyhani-turkleriz\.mp3)$/.test(t.source)&&!seen.has(t.id)&&seen.add(t.id));
    if(!tracks.length)return;
  } catch (_) { return; }
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let stored={};try{stored=JSON.parse(window.CeyhaniCookies?.read('sessionStorage','ceyhani-background-music'))||{};}catch(_){}
  if(stored.kind!=='mp3')stored={};
  let index=Math.max(0,tracks.findIndex(t=>t.id===stored.id)),shuffle=stored.shuffle===true,repeat=['off','all','one'].includes(stored.repeat)?stored.repeat:'all';
  let order=[],cursor=0,loaded='',generation=0,mode=stored.mode==='paused'?'paused':'idle',autoWanted=stored.mode!=='paused',pendingPosition=Number.isFinite(stored.position)&&stored.position>0?stored.position:0;
  const audio=new Audio();audio.preload='none';audio.volume=Number.isFinite(stored.volume)?Math.max(0,Math.min(1,stored.volume)):Math.max(0,Math.min(1,Number.isFinite(config.volume)?config.volume:0.35));
  const widget=document.createElement('aside');widget.className='background-music audio-playlist';widget.setAttribute('aria-label','Ceyhani’den Türküler müzik listesi');
  widget.innerHTML='<section class="ap-panel" hidden aria-label="Çalma listesi"><div class="ap-heading"><div><p>AŞIK CEYHANİ</p><h2>Ceyhani’den Türküler</h2></div><button type="button" data-ap="minimize" aria-label="Müziği durdurmadan listeyi küçült">−</button></div><p class="ap-now"></p><div class="ap-progress"><input type="range" min="0" max="100" step="0.1" value="0" disabled aria-label="Dinleme konumu"><div><span class="ap-time">0:00</span><span class="ap-duration">0:00</span></div></div><div class="ap-options"><button type="button" data-ap="shuffle" aria-pressed="false">Karışık</button><button type="button" data-ap="repeat" aria-pressed="true">Tekrar: tümü</button><label>Ses<input class="ap-volume" type="range" min="0" max="100" value="35" aria-label="Ses düzeyi"></label></div><label class="ap-search">Listede ara<input type="search" placeholder="Türkü adı…" autocomplete="off"></label><ol class="ap-tracks"></ol><p class="ap-empty" hidden>Bu aramaya uygun kayıt bulunamadı.</p><p class="ap-count"></p></section><div class="ap-bar"><button class="ap-open" type="button" aria-expanded="false" aria-label="Çalma listesini aç"><span class="ap-music-icon" aria-hidden="true">♫</span><span><small>Ceyhani’den Türküler</small><strong class="ap-current"></strong></span></button><button type="button" data-ap="previous" aria-label="Önceki türkü">‹</button><button type="button" data-ap="play" aria-label="Müziği çal">▶</button><button type="button" data-ap="next" aria-label="Sonraki türkü">›</button></div><p class="ap-status" role="status" aria-live="polite"></p>';
  document.body.appendChild(widget);
  const $=selector=>widget.querySelector(selector),control=name=>$(`[data-ap="${name}"]`),panel=$('.ap-panel'),search=$('.ap-search input'),list=$('.ap-tracks'),status=$('.ap-status'),progress=$('.ap-progress input'),volume=$('.ap-volume');
  const subscribers=new Set();
  function getState(){return {tracks:tracks.map(t=>({...t})),index,mode,shuffle,repeat,position:Number.isFinite(audio.currentTime)?audio.currentTime:0,duration:Number.isFinite(audio.duration)?audio.duration:0,volume:audio.volume,status:status.textContent||''};}
  function publish(){const state=getState();for(const callback of subscribers)try{callback(state);}catch(error){console.error('Müzik görünümü güncellenemedi.',error);}}
  const time=value=>{const n=Number.isFinite(value)&&value>=0?Math.floor(value):0;return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};
  function save(){window.CeyhaniCookies?.write('sessionStorage','ceyhani-background-music',JSON.stringify({kind:'mp3',id:tracks[index].id,position:loaded===tracks[index].id?audio.currentTime||0:0,volume:audio.volume,shuffle,repeat,mode:mode==='paused'||mode==='ended'?'paused':'playing'}));}
  function resetOrder(keepCurrent=true){
    order=tracks.map((_,i)=>i);
    if(shuffle){
      if(keepCurrent)order.splice(index,1);
      for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
      if(keepCurrent)order.unshift(index);else if(order.length>1&&order[0]===index)[order[0],order[1]]=[order[1],order[0]];
    }
    cursor=order.indexOf(index);
  }
  function updateProgress(){
    const duration=audio.duration;progress.disabled=!(Number.isFinite(duration)&&duration>0);progress.value=progress.disabled?0:Math.min(100,(audio.currentTime/duration)*100);
    $('.ap-time').textContent=time(audio.currentTime);$('.ap-duration').textContent=time(duration);progress.setAttribute('aria-valuetext',`${time(audio.currentTime)} / ${time(duration)}`);
    publish();
  }
  function render(){
    const active=mode==='playing',query=search.value.trim().toLocaleLowerCase('tr');let count=0;
    list.innerHTML=tracks.map((t,i)=>{if(!t.title.toLocaleLowerCase('tr').includes(query))return '';count++;return `<li><button type="button" data-audio-index="${i}" aria-current="${i===index}"><span class="ap-track-number">${String(i+1).padStart(2,'0')}</span><span>${esc(t.title)}<small>${esc(t.artist||'Aşık Ceyhani')}</small></span><span class="ap-track-icon" aria-hidden="true">${i===index&&active?'♫':'▷'}</span></button></li>`;}).join('');
    $('.ap-empty').hidden=count!==0;$('.ap-count').textContent=`${count} kayıt · MP3 arşivi`;
    $('.ap-current').textContent=tracks[index].title;$('.ap-now').textContent=tracks[index].title;
    control('play').textContent=active?'Ⅱ':'▶';control('play').setAttribute('aria-label',active?'Müziği durdur':'Müziği çal');control('play').setAttribute('aria-pressed',String(active));
    control('shuffle').setAttribute('aria-pressed',String(shuffle));control('repeat').setAttribute('aria-pressed',String(repeat!=='off'));
    control('repeat').textContent={off:'Tekrar: kapalı',all:'Tekrar: tümü',one:'Tekrar: bu türkü'}[repeat];
    volume.value=Math.round(audio.volume*100);updateProgress();
  }
  function pause(message='Müzik durduruldu'){
    generation++;autoWanted=false;mode='paused';audio.pause();status.textContent=message;render();save();
  }
  function stopOtherVideo(){
    document.dispatchEvent(new Event('ceyhani-pause-video'));
    try{document.querySelector('.site-page-frame')?.contentDocument.dispatchEvent(new Event('ceyhani-pause-video'));}catch(_){}
  }
  async function play(automatic=false){
    const retry=mode==='error',token=++generation;autoWanted=automatic;mode='loading';status.textContent='Türkü hazırlanıyor…';publish();
    if(loaded!==tracks[index].id||retry){loaded=tracks[index].id;audio.src=tracks[index].source;updateProgress();}
    stopOtherVideo();
    try{
      await audio.play();if(token!==generation)return;
      mode='playing';autoWanted=false;status.textContent='Şimdi çalıyor';render();save();
    }catch(error){
      if(token!==generation)return;
      if(error.name==='NotAllowedError'){
        mode='blocked';autoWanted=true;status.textContent='Dinlemek için sayfaya dokunun veya Çal’a basın.';
      }else if(error.name==='AbortError'){mode='paused';status.textContent='Dinlemek için Çal’a basın.';render();return;}
      else{mode='error';autoWanted=false;status.textContent='Bu kayıt açılamadı. Tekrar deneyebilir veya sonraki türküyü seçebilirsiniz.';}
      render();
    }
  }
  function select(next){
    if(!Number.isInteger(next)||next<0||next>=tracks.length)return;
    generation++;audio.pause();index=next;pendingPosition=0;resetOrder();render();return play();
  }
  function advance(direction,automatic=false){
    pendingPosition=0;
    if(automatic&&repeat==='one'){audio.currentTime=0;return play();}
    if(direction<0&&audio.currentTime>3){audio.currentTime=0;updateProgress();return play();}
    let next=cursor+direction;
    if(next>=order.length||next<0){
      if(automatic&&repeat==='off'){pause('Liste tamamlandı. Yeniden dinlemek için bir türkü seçebilirsiniz.');mode='ended';return;}
      if(shuffle&&direction>0){resetOrder(false);next=0;}else next=(next+order.length)%order.length;
    }
    audio.pause();cursor=next;index=order[cursor];render();return play();
  }
  function togglePanel(open){panel.hidden=!open;$('.ap-open').setAttribute('aria-expanded',String(open));widget.classList.toggle('is-open',open);}
  function togglePlay(){return mode==='playing'||mode==='loading'?pause():play();}
  function toggleShuffle(){shuffle=!shuffle;resetOrder();render();save();}
  function cycleRepeat(){repeat={all:'one',one:'off',off:'all'}[repeat];render();save();}
  function seek(seconds){if(Number.isFinite(seconds)&&Number.isFinite(audio.duration)&&audio.duration>0){audio.currentTime=Math.max(0,Math.min(audio.duration,seconds));updateProgress();save();}}
  function setVolume(value){if(!Number.isFinite(value))return;audio.volume=Math.max(0,Math.min(1,value));volume.value=Math.round(audio.volume*100);volume.setAttribute('aria-valuetext',`${Math.round(audio.volume*100)} yüzde`);publish();save();}
  $('.ap-open').addEventListener('click',()=>togglePanel(panel.hidden));control('minimize').addEventListener('click',()=>{togglePanel(false);$('.ap-open').focus();});
  control('play').addEventListener('click',togglePlay);
  control('previous').addEventListener('click',()=>advance(-1));control('next').addEventListener('click',()=>advance(1));
  control('shuffle').addEventListener('click',toggleShuffle);
  control('repeat').addEventListener('click',cycleRepeat);
  search.addEventListener('input',render);list.addEventListener('click',event=>{const button=event.target.closest('[data-audio-index]');if(!button)return;const next=Number(button.dataset.audioIndex);if(Number.isInteger(next)&&next>=0&&next<tracks.length)return select(next);});
  progress.addEventListener('input',()=>seek(audio.duration*Number(progress.value)/100));
  volume.addEventListener('input',()=>setVolume(Number(volume.value)/100));
  audio.addEventListener('loadedmetadata',()=>{if(pendingPosition&&pendingPosition<audio.duration){audio.currentTime=pendingPosition;pendingPosition=0;}updateProgress();});
  audio.addEventListener('timeupdate',updateProgress);
  audio.addEventListener('playing',()=>{if(mode==='paused'||mode==='ended'){audio.pause();return;}mode='playing';autoWanted=false;status.textContent='Şimdi çalıyor';render();});
  audio.addEventListener('waiting',()=>{if(mode==='playing'||mode==='loading'){status.textContent='Türkü yükleniyor…';publish();}});
  audio.addEventListener('ended',()=>advance(1,true));
  audio.addEventListener('error',()=>{generation++;mode='error';autoWanted=false;status.textContent='Bu kayıt yüklenemedi. Çal’a basarak tekrar deneyebilir veya sonraki türküyü seçebilirsiniz.';render();});
  window.ceyhaniMusic={startIfWanted:()=>{if(autoWanted&&mode==='blocked')return play(true);},pause,getState,select,togglePlay,next:()=>advance(1),previous:()=>advance(-1),toggleShuffle,cycleRepeat,seek,setVolume,subscribe(callback){subscribers.add(callback);callback(getState());return()=>subscribers.delete(callback);}};
  document.dispatchEvent(new Event('ceyhani-music-ready'));
  document.addEventListener('pointerdown',gesture,{passive:true});document.addEventListener('keydown',gesture);
  document.addEventListener('ceyhani-pause-music',()=>pause('Video için müzik durduruldu'));
  document.addEventListener('click',event=>{if(event.target.closest('.channel-video-card'))pause('Video için müzik durduruldu');});
  window.addEventListener('pagehide',save);document.addEventListener('ceyhani-page-change',save);
  resetOrder();render();if(autoWanted)await play(true);else{status.textContent='Dinlemek için Çal’a basın.';publish();}
})();
