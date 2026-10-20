(() => {
  const header=document.querySelector('body > header'),button=header?.querySelector('.menu'),nav=header?.querySelector('#nav');
  if(!header||!button||!nav)return;
  const desktop=window.matchMedia('(min-width:761px)');
  function setOpen(open){
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Ana menüyü kapat':'Ana menüyü aç');
    button.textContent=open?'Kapat':'Menü';
    nav.classList.toggle('open',open);header.classList.toggle('is-menu-open',open);
  }
  header.classList.add('menu-ready');setOpen(false);
  button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||button.getAttribute('aria-expanded')!=='true'||document.querySelector('dialog[open]'))return;
    event.preventDefault();setOpen(false);button.focus({preventScroll:true});
  });
  document.addEventListener('pointerdown',event=>{if(!header.contains(event.target))setOpen(false);},{passive:true});
  document.addEventListener('focusin',event=>{if(!header.contains(event.target))setOpen(false);});
  desktop.addEventListener?.('change',()=>setOpen(false));
  window.addEventListener('pagehide',()=>setOpen(false));
})();
