(() => {
  const root=document.querySelector('.music-library');if(!root)return;
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clock=value=>{const n=Number.isFinite(value)&&value>0?Math.floor(value):0;return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};
  let api=null,unsubscribe=null,timer=null,attempts=0,listKey='',model=null;
  const playIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7z"/></svg>';
  const pauseIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm7 0h4v14h-4z"/></svg>';
  function render(state){
    if(!state.tracks.length)return;model=state;
    const playing=state.mode==='playing',track=state.tracks[state.index];
    $('musicPlayer').classList.toggle('is-playing',playing);
    $('musicCurrent').textContent=track.title;$('musicArtist').textContent=track.artist||'Aşık Ceyhani';
    $('musicPlayingLabel').textContent=playing?'ŞİMDİ ÇALIYOR':'SEÇİLİ TÜRKÜ';
    $('musicPlay').innerHTML=playing?pauseIcon:playIcon;
    $('musicPlay').setAttribute('aria-label',playing?'Müziği durdur':'Müziği çal');$('musicPlay').setAttribute('aria-pressed',String(playing));
    $('musicShuffle').setAttribute('aria-pressed',String(state.shuffle));
    $('musicRepeat').setAttribute('aria-pressed',String(state.repeat!=='off'));
    $('musicRepeat').textContent={all:'Tüm liste',one:'Bu türkü',off:'Kapalı'}[state.repeat];
    $('musicRepeat').setAttribute('aria-label',`Tekrar: ${{all:'tüm liste',one:'bu türkü',off:'kapalı'}[state.repeat]}. Değiştirmek için tıklayın.`);
    $('musicStatus').textContent=state.status;$('musicReload').hidden=true;
    $('musicPosition').textContent=clock(state.position);$('musicDuration').textContent=clock(state.duration);
    const percent=state.duration>0?Math.max(0,Math.min(100,state.position/state.duration*100)):0;
    $('musicSeek').disabled=state.duration<=0;$('musicSeek').value=percent;$('musicSeek').style.setProperty('--played',percent+'%');
    $('musicSeek').setAttribute('aria-valuetext',`${clock(state.position)} / ${clock(state.duration)}`);
    $('musicVolume').value=Math.round(state.volume*100);$('musicVolumeValue').textContent=`${Math.round(state.volume*100)}%`;
    $('musicTotal').textContent=`${state.tracks.length} türkü`;
    const query=$('musicSearch').value.trim().toLocaleLowerCase('tr');
    const key=state.tracks.map(t=>t.id+'|'+t.title).join(';')+'?'+query;
    if(key!==listKey){
      listKey=key;const matches=state.tracks.map((t,i)=>({t,i})).filter(({t})=>t.title.toLocaleLowerCase('tr').includes(query));
      $('musicTracks').innerHTML=matches.map(({t,i})=>`<li><button class="music-track-button" type="button" data-music-index="${i}" aria-label="${esc(t.title)} dinle"><span class="music-track-number">${String(i+1).padStart(2,'0')}</span><span class="music-track-copy"><strong>${esc(t.title)}</strong><small>${esc(t.artist||'Aşık Ceyhani')}</small></span><span class="music-track-indicator" data-indicator>Dinle</span><span class="music-track-play" aria-hidden="true">▷</span></button></li>`).join('');
      $('musicEmpty').hidden=matches.length!==0;$('musicResults').textContent=query?`${matches.length} / ${state.tracks.length} türkü`:`${state.tracks.length} türkü`;
    }
    for(const button of $('musicTracks').querySelectorAll('[data-music-index]')){
      const selected=Number(button.dataset.musicIndex)===state.index;
      button.setAttribute('aria-current',String(selected));button.classList.toggle('is-playing',selected&&playing);
      button.querySelector('[data-indicator]').textContent=selected?(playing?'Çalınıyor':'Seçili'):'Dinle';
      button.querySelector('.music-track-play').textContent=selected&&playing?'Ⅱ':'▷';
    }
  }
  function connect(){
    if(api)return;
    try{api=(window.parent!==window&&window.parent.ceyhaniNavigation)?window.parent.ceyhaniMusic:window.ceyhaniMusic;}catch(_){}
    if(!api?.subscribe||!api?.getState){api=null;return;}
    if(timer){clearInterval(timer);timer=null;}
    for(const control of root.querySelectorAll('[data-music-control]'))control.disabled=false;
    unsubscribe=api.subscribe(render);
  }
  $('musicPlay').addEventListener('click',()=>api?.togglePlay());
  $('musicPrevious').addEventListener('click',()=>api?.previous());$('musicNext').addEventListener('click',()=>api?.next());
  $('musicShuffle').addEventListener('click',()=>api?.toggleShuffle());$('musicRepeat').addEventListener('click',()=>api?.cycleRepeat());
  $('musicSeek').addEventListener('input',()=>{if(api&&model)api.seek(model.duration*Number($('musicSeek').value)/100);});
  $('musicVolume').addEventListener('input',()=>api?.setVolume(Number($('musicVolume').value)/100));
  $('musicSearch').addEventListener('input',()=>{if(api)render(api.getState());});
  $('musicClearSearch').addEventListener('click',()=>{$('musicSearch').value='';if(api)render(api.getState());$('musicSearch').focus();});
  $('musicTracks').addEventListener('click',event=>{
    const button=event.target.closest('[data-music-index]');if(!button||!api)return;
    const index=Number(button.dataset.musicIndex),state=api.getState();if(!Number.isInteger(index)||index<0||index>=state.tracks.length)return;
    return index===state.index?api.togglePlay():api.select(index);
  });
  $('musicReload').addEventListener('click',()=>window.location.reload());
  document.addEventListener('ceyhani-music-ready',connect);window.addEventListener('pageshow',connect);
  window.addEventListener('pagehide',()=>{unsubscribe?.();unsubscribe=null;api=null;if(timer)clearInterval(timer);timer=null;});
  connect();
  if(!api)timer=setInterval(()=>{connect();if(++attempts>=150&&!api){clearInterval(timer);timer=null;$('musicStatus').textContent='Müzik listesi yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.';$('musicReload').hidden=false;}},100);
})();
