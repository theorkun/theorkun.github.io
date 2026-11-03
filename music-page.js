(() => {
  const searchText=value=>String(value).toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
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
    $('musicPlayer').classList.toggle('effects-active',playing&&!document.hidden);
    $('musicPlayer').classList.toggle('effects-visible',!document.hidden);
    $('musicCurrent').textContent=track.title;$('musicArtist').textContent=track.artist||'Âşık Ceyhani';
    $('musicPlayingLabel').textContent=playing?'ŞİMDİ ÇALIYOR':'SEÇİLİ TÜRKÜ';
    if($('musicPlay').dataset.iconState!==String(playing)){
      $('musicPlay').innerHTML=playing?pauseIcon:playIcon;
      $('musicPlay').dataset.iconState=String(playing);
    }
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
    $('musicVolume').value=Math.round(state.volume*100);$('musicVolumeValue').textContent=`%${Math.round(state.volume*100)}`;
    const eq=state.equalizer,eqNames={balanced:'Dengeli',bass:'Bas',vocal:'Vokal',custom:'Özel'};
    $('musicEqCurrent').textContent=eqNames[eq?.preset]||'Dengeli';
    $('musicEqBands').hidden=eq?.preset!=='custom';
    $('musicEqNotice').textContent=eq?.supported?(eq.notice||'Hazır ayarlardan seçin veya kendi ses dengenizi oluşturun.'):'Bu tarayıcıda ekolayzır kullanılamıyor; normal sesle dinleyebilirsiniz.';
    for(const name of ['balanced','bass','vocal','custom']){
      const button=$('musicEq'+name[0].toUpperCase()+name.slice(1));
      button.disabled=!eq?.supported;button.setAttribute('aria-pressed',String(eq?.preset===name));
    }
    for(const name of ['bass','mid','treble']){
      const input=$('musicEqBand'+name),value=eq?.bands[name]||0;
      input.disabled=!eq?.supported;input.value=value;input.setAttribute('aria-valuetext',`${value>0?'+':''}${value} desibel`);
      $('musicEqValue'+name).textContent=`${value>0?'+':''}${value} dB`;
    }
    const echo=eq?.echo,echoOn=echo?.enabled===true;
    $('musicEchoToggle').disabled=!eq?.supported;$('musicEchoToggle').setAttribute('aria-checked',String(echoOn));
    $('musicEchoToggle').textContent=echoOn?'Açık':'Kapalı';$('musicEchoAmountRow').hidden=!echoOn;
    $('musicEchoAmount').disabled=!eq?.supported||!echoOn;$('musicEchoAmount').value=echo?.amount??25;
    $('musicEchoAmount').setAttribute('aria-valuetext',`yüzde ${echo?.amount??25}`);$('musicEchoValue').textContent=`%${echo?.amount??25}`;
    $('musicTotal').textContent=`${state.tracks.length} türkü`;
    const query=searchText($('musicSearch').value);
    const matches=state.tracks.map((t,i)=>({t,i})).filter(({t})=>searchText(t.title).includes(query));
    if($('musicSort').value==='popular')matches.sort((a,b)=>(window.CeyhaniTrackLikes?.getCount(b.t.id)??0)-(window.CeyhaniTrackLikes?.getCount(a.t.id)??0)||a.i-b.i);
    const key=matches.map(({t})=>t.id+'|'+t.title).join(';')+'?'+query;
    if(key!==listKey){
      listKey=key;
      $('musicTracks').innerHTML=matches.map(({t,i})=>`<li class="music-track-row"><button class="music-track-button" type="button" data-music-index="${i}" aria-label="${esc(t.title)} dinle"><span class="music-track-number">${String(i+1).padStart(2,'0')}</span><span class="music-track-copy"><strong>${esc(t.title)}</strong><small>${esc(t.artist||'Âşık Ceyhani')}</small></span><span class="music-track-indicator" data-indicator>Dinle</span><span class="music-track-play" aria-hidden="true">▷</span></button><button class="music-like" type="button" data-music-like="${esc(t.id)}" data-track-title="${esc(t.title)}" aria-label="${esc(t.title)} beğen" aria-pressed="false" disabled><svg class="music-like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20.2 5.8a5 5 0 0 0-7.1 0L12 6.9l-1.1-1.1a5 5 0 0 0-7.1 7.1L12 21l8.2-8.1a5 5 0 0 0 0-7.1Z"/></svg><span data-like-count>—</span></button></li>`).join('');
      $('musicEmpty').hidden=matches.length!==0;$('musicResults').textContent=query?`${matches.length} / ${state.tracks.length} türkü`:`${state.tracks.length} türkü`;
    }
    for(const button of $('musicTracks').querySelectorAll('[data-music-index]')){
      const selected=Number(button.dataset.musicIndex)===state.index;
      button.setAttribute('aria-current',String(selected));button.classList.toggle('is-playing',selected&&playing);
      button.querySelector('[data-indicator]').textContent=selected?(playing?'Çalınıyor':'Seçili'):'Dinle';
      const indicator=button.querySelector('.music-track-play'),iconState=String(selected&&playing);
      if(indicator.dataset.iconState!==iconState){indicator.textContent=selected&&playing?'Ⅱ':'▷';indicator.dataset.iconState=iconState;}
    }
    window.CeyhaniTrackLikes?.paint();
  }
  function connect(){
    if(api)return;
    try{api=(window.parent!==window&&window.parent.ceyhaniNavigation)?window.parent.ceyhaniMusic:window.ceyhaniMusic;}catch(_){}
    if(!api?.subscribe||!api?.getState){api=null;return;}
    if(timer){clearInterval(timer);timer=null;}
    for(const control of root.querySelectorAll('[data-music-control]'))control.disabled=false;
    if(!stopLikes)stopLikes=window.CeyhaniTrackLikes?.subscribe(()=>{if(api)render(api.getState());});
    unsubscribe=api.subscribe(render);
  }
  $('musicPlay').addEventListener('click',()=>api?.togglePlay());
  $('musicPrevious').addEventListener('click',()=>api?.previous());$('musicNext').addEventListener('click',()=>api?.next());
  $('musicShuffle').addEventListener('click',()=>api?.toggleShuffle());$('musicRepeat').addEventListener('click',()=>api?.cycleRepeat());
  $('musicSeek').addEventListener('input',()=>{if(api&&model)api.seek(model.duration*Number($('musicSeek').value)/100);});
  $('musicVolume').addEventListener('input',()=>api?.setVolume(Number($('musicVolume').value)/100));
  for(const name of ['balanced','bass','vocal','custom'])$('musicEq'+name[0].toUpperCase()+name.slice(1)).addEventListener('click',()=>api?.setEqualizerPreset(name));
  for(const name of ['bass','mid','treble'])$('musicEqBand'+name).addEventListener('input',()=>api?.setEqualizerBand(name,Number($('musicEqBand'+name).value)));
  $('musicEchoToggle').addEventListener('click',()=>api?.setEcho(!model?.equalizer?.echo?.enabled));
  $('musicEchoAmount').addEventListener('input',()=>api?.setEcho(true,Number($('musicEchoAmount').value)));
  $('musicSearch').addEventListener('input',()=>{if(api)render(api.getState());});
  $('musicSort').addEventListener('change',()=>{if(api)render(api.getState());});
  let stopLikes=window.CeyhaniTrackLikes?.subscribe(()=>{if(api)render(api.getState());});
  $('musicClearSearch').addEventListener('click',()=>{$('musicSearch').value='';if(api)render(api.getState());$('musicSearch').focus();});
  $('musicTracks').addEventListener('click',event=>{
    const button=event.target.closest('[data-music-index]');if(!button||!api)return;
    const index=Number(button.dataset.musicIndex),state=api.getState();if(!Number.isInteger(index)||index<0||index>=state.tracks.length)return;
    return index===state.index?api.togglePlay():api.select(index);
  });
  $('musicReload').addEventListener('click',()=>window.location.reload());
  document.addEventListener('ceyhani-music-ready',connect);window.addEventListener('pageshow',connect);
  document.addEventListener('visibilitychange',()=>{if(api)render(api.getState());});
  window.addEventListener('pagehide',()=>{stopLikes?.();stopLikes=null;unsubscribe?.();unsubscribe=null;api=null;if(timer)clearInterval(timer);timer=null;});
  connect();
  if(!api)timer=setInterval(()=>{connect();if(++attempts>=150&&!api){clearInterval(timer);timer=null;$('musicStatus').textContent='Müzik listesi yüklenemedi. Bağlantınızı kontrol edip yeniden deneyin.';$('musicReload').hidden=false;}},100);
})();
