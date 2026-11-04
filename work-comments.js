(() => {
  const icon='<svg class="work-comment-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 1-8 8H5l-4 3V11a9 9 0 0 1 19 0Z"/><path d="M6 9h8M6 13h5"/></svg>';
  function whenClosed(dialog,cleanup){
    const check=()=>{if(!dialog.open)cleanup();};
    dialog.addEventListener('close',check);
    // Closing removes the open attribute before the deferred close event runs.
    new MutationObserver(check).observe(dialog,{attributes:true,attributeFilter:['open']});
  }
  function mount(container,kind,id,title){
    container.dataset.commentMount=kind;container.dataset.commentId=id;container.dataset.commentTitle=title;
    container.replaceChildren();
    if(!window.CeyhaniCookies?.allows('comments')){
      const note=document.createElement('p');note.className='work-comments-note';note.textContent='Yorum alanını açtığınızda HTML Comment Box hizmetine bağlanılır; bağlantı bilgileriniz sağlayıcıya iletilir. Bu izin yalnızca yorumlar içindir. Göndermeden önce KVKK ve paylaşım onaylarını ayrıca seçebilirsiniz.';
      const button=document.createElement('button');button.type='button';button.className='work-comments-action';button.textContent='Yorum alanını aç';button.onclick=()=>{if(window.CeyhaniCookies?.grantComments())mount(container,kind,id,title);};container.append(note,button);return;
    }
    const frame=document.createElement('iframe');frame.className='work-comments-frame';frame.title=title+' — yorumlar';
    frame.src='eser-yorumlari.html?'+new URLSearchParams({type:kind,id,v:'comment-design-8'});
    frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');container.appendChild(frame);
  }
  document.addEventListener('ceyhani-cookie-change',()=>{
    if(!window.CeyhaniCookies?.allows('comments'))return;
    for(const container of document.querySelectorAll('[data-comment-mount]')){
      if(container.querySelector('.work-comments-frame'))continue;
      const dialog=container.closest('dialog'),details=container.closest('details');
      if((dialog&&!dialog.open)||(details&&!details.open))continue;
      mount(container,container.dataset.commentMount,container.dataset.commentId,container.dataset.commentTitle);
    }
  });
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin)return;
    for(const frame of document.querySelectorAll('.work-comments-frame'))if(event.source===frame.contentWindow){
      if(event.data?.type==='ceyhani-work-comments-size'&&Number.isFinite(event.data.height))frame.style.height=Math.min(1200,Math.max(350,event.data.height))+'px';
      if(event.data?.type==='ceyhani-comment-thanks')window.CeyhaniCommentThanks?.show();
    }
  });
  const tracks=document.getElementById('musicTracks');
  if(tracks){
    const dialog=document.createElement('dialog');dialog.className='work-comments-dialog';dialog.setAttribute('aria-labelledby','work-comments-title');
    dialog.innerHTML='<div class="dialog-top"><div><p class="eyebrow">TÜRKÜYE DAİR</p><h2 id="work-comments-title"></h2></div><button type="button" aria-label="Yorumları kapat">×</button></div><p class="work-comments-note">Bu türkünün sizdeki hatırasını paylaşın. Her türkünün yorumları ayrı tutulur.</p><div data-work-comments-body></div>';
    document.body.appendChild(dialog);const body=dialog.querySelector('[data-work-comments-body]');let opener;
    tracks.addEventListener('click',event=>{
      const button=event.target.closest('[data-work-comment]');if(!button)return;
      opener=button;dialog.querySelector('h2').textContent=button.dataset.workTitle;mount(body,'track',button.dataset.workComment,button.dataset.workTitle);dialog.showModal();
    });
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    whenClosed(dialog,()=>{body.replaceChildren();if(opener?.isConnected)opener.focus({preventScroll:true});});
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  }
})();
