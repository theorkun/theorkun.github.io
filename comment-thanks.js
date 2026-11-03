(() => {
  let toast=null,timer=null,removal=null;
  function clear(){clearTimeout(timer);clearTimeout(removal);toast?.remove();toast=null;}
  function quiet(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('a11y-reduced-motion');}
  function show(){
    clear();toast=document.createElement('aside');toast.className='comment-thanks'+(quiet()?' is-quiet':'');toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.setAttribute('aria-atomic','true');
    toast.innerHTML='<span class="comment-thanks-art" aria-hidden="true"><img src="assets/saz-motifi.svg" alt="" width="40" height="72"></span><div class="comment-thanks-copy"><strong>Güzel sözleriniz için teşekkür ederiz.</strong><p>Yorumunuz alındı. Paylaşımınız bu hatıraya değer katıyor.</p></div><button class="comment-thanks-close" type="button" aria-label="Teşekkür bildirimini kapat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>';
    (document.querySelector('dialog[open]')||document.body).appendChild(toast);
    toast.querySelector('button').addEventListener('click',clear);
    timer=setTimeout(()=>{if(!toast)return;if(quiet()){clear();return;}toast.classList.add('is-leaving');removal=setTimeout(clear,220);},6500);
  }
  function received(){
    if(document.body.classList.contains('work-comments-page')&&window.parent!==window)window.parent.postMessage({type:'ceyhani-comment-thanks'},location.origin);
    else show();
  }
  window.CeyhaniCommentThanks={show,received,clear};
  window.addEventListener('pagehide',clear);document.addEventListener('ceyhani-page-change',clear);
})();
