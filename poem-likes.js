(() => {
  const dialog=document.getElementById('poem-dialog'),section=document.getElementById('siirleri');if(!dialog||!section)return;
  const panel=document.createElement('section');panel.id='poemLikes';panel.className='poem-likes';panel.setAttribute('aria-label','Şiiri beğen');
  panel.innerHTML='<div class="poem-likes-heading"><button class="poem-like-button" type="button" data-music-like="" data-track-title="Şiir" aria-pressed="false" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 5.8a5 5 0 0 0-7.1 0L12 6.9l-1.1-1.1a5 5 0 0 0-7.1 7.1L12 21l8.2-8.1a5 5 0 0 0 0-7.1Z"/></svg><span>Bu şiiri beğen</span><span data-like-count>—</span></button><span class="poem-likes-caption">Bir dize, bir gönül bağı.</span></div><p id="poemLikesStatus" role="status" aria-live="polite">Beğeniler yükleniyor…</p><button id="poemLikesRetry" class="poem-likes-retry" type="button" hidden>Yeniden dene</button>';
  const body=dialog.querySelector('.poem-modal-body'),comments=body.querySelector('.work-comments');body.insertBefore(panel,comments||null);
  const button=panel.querySelector('[data-music-like]'),status=panel.querySelector('[role=status]');let archive,version=0;
  function getArchive(){return archive||(archive=fetch('assets/poetry-discovery.json?v=archive-71-millet-removed-4').then(r=>{if(!r.ok)throw Error();return r.json();}).catch(e=>{archive=null;throw e;}));}
  async function select(card){
    const current=++version;button.disabled=true;button.dataset.musicLike='';button.dataset.trackTitle=card.dataset.title;button.setAttribute('aria-pressed','false');button.querySelector('[data-like-count]').textContent='—';
    dialog.querySelector('.poem-saz-celebration')?.remove();status.textContent='Beğeniler yükleniyor…';
    try{
      const data=await getArchive();if(current!==version||!dialog.open)return;
      const poem=data.poems.find(item=>item.title===card.dataset.title);if(!poem)throw Error();
      button.dataset.musicLike='poem-'+poem.poemNo;document.dispatchEvent(new Event('ceyhani-poem-likes-ready'));
    }catch(_){if(current===version)status.textContent='Şiirin beğeni alanı yüklenemedi. Şiiri yeniden açarak deneyebilirsiniz.';}
  }
  section.addEventListener('click',event=>{const card=event.target.closest('.poem-card');if(card)select(card);});
  if(dialog.open){const title=document.getElementById('poem-title')?.textContent;const card=[...section.querySelectorAll('.poem-card')].find(card=>card.dataset.title===title);if(card)select(card);}
  new MutationObserver(()=>{if(!dialog.open){version++;dialog.querySelector('.poem-saz-celebration')?.remove();}}).observe(dialog,{attributes:true,attributeFilter:['open']});
})();
