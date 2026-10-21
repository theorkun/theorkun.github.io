(() => {
  // One lightweight icon set for static pages and controls rendered later.
  const paths = {
    play:'<path d="m9 5 10 7-10 7z"/>',
    pause:'<path d="M9 5v14M16 5v14"/>',
    previous:'<path d="M5 5v14M19 5l-10 7 10 7z"/>',
    next:'<path d="M19 5v14M5 5l10 7-10 7z"/>',
    music:'<path d="M9 18V5l11-2v13M9 9l11-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="17" cy="16" rx="3" ry="3"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    menu:'<path d="M4 7h16M4 12h12M4 17h16"/>',
    arrowRight:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    arrowLeft:'<path d="M20 12H4m6-6-6 6 6 6"/>',
    arrowUp:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
    arrowUpRight:'<path d="M6 18 18 6M6 6h12v12"/>',
    chevronDown:'<path d="m6 9 6 6 6-6"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 3M5 15a8 8 0 0 0 13 3"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    quote:'<path d="M4 6h6v7H5c0 3 1 4 4 5M14 6h6v7h-5c0 3 1 4 4 5"/>',
    person:'<circle cx="12" cy="4" r="2"/><path d="m4 9 8 1 8-1M12 10v5m0 0-5 6m5-6 5 6"/>'
  };
  const glyphs = {'↗':'arrowUpRight','→':'arrowRight','←':'arrowLeft','×':'close','✕':'close','↺':'refresh','✓':'check','▶':'play','▷':'play','Ⅱ':'pause','♫':'music','♪':'music','‹':'previous','›':'next','−':'chevronDown'};
  const pattern = /[↗→←×✕↺✓▶▷Ⅱ♫♪‹›−]/;
  const make = name => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width','20');svg.setAttribute('height','20');
    svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.75');
    svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.setAttribute('class','site-icon');
    svg.dataset.uiIcon=name;svg.innerHTML=paths[name];return svg;
  };
  function setIcon(element,name,prepend=false) {
    const old=element.querySelector('svg');
    if(old?.dataset.uiIcon===name)return;
    const svg=make(name);
    if(old)old.replaceWith(svg);else if(glyphs[element.textContent.trim()])element.replaceChildren(svg);else if(prepend)element.prepend(svg);else element.append(svg);
  }
  const selectors = '.channel-video-play,.documentary-play,[data-ap="play"],[data-ap="previous"],[data-ap="next"],[data-ap="minimize"],.ap-music-icon,.ap-track-icon,.music-track-play,#musicPlay,#musicPrevious,#musicNext,.mobile-turkuler>span,.back-to-top,header .menu,.accessibility-open,#daily-verse-launch button';
  function enhance(root) {
    if(!root||root.nodeType!==1)return;
    const controls=[...(root.matches(selectors)?[root]:[]),...root.querySelectorAll(selectors)];
    for(const el of controls){
      let name;
      if(el.matches('.channel-video-play,.documentary-play'))name='play';
      else if(el.matches('[data-ap="play"],#musicPlay'))name=el.getAttribute('aria-pressed')==='true'?'pause':'play';
      else if(el.matches('.ap-track-icon'))name=el.closest('[data-audio-index]')?.getAttribute('aria-current')==='true'&&document.querySelector('[data-ap=play]')?.getAttribute('aria-pressed')==='true'?'pause':'play';
      else if(el.matches('.music-track-play'))name=el.closest('.music-track-button')?.classList.contains('is-playing')?'pause':'play';
      else if(el.matches('[data-ap="previous"],#musicPrevious'))name='previous';
      else if(el.matches('[data-ap="next"],#musicNext'))name='next';
      else if(el.matches('[data-ap="minimize"]'))name='chevronDown';
      else if(el.matches('.ap-music-icon,.mobile-turkuler>span'))name='music';
      else if(el.matches('.back-to-top'))name='arrowUp';
      else if(el.matches('header .menu'))name=el.getAttribute('aria-expanded')==='true'?'close':'menu';
      else if(el.matches('.accessibility-open'))name='person';
      // The daily launcher gets a real quotation mark icon, not a decorative arrow.
      else if(el.matches('#daily-verse-launch button')){if(!el.querySelector('[data-ui-icon="quote"]'))el.prepend(make('quote'));continue;}
      if(name)setIcon(el,name,el.matches('header .menu'));
    }
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const texts=[];while(walker.nextNode()){const node=walker.currentNode;if(pattern.test(node.data)&&node.parentElement.closest('a,button,[aria-hidden="true"]')&&!node.parentElement.closest('svg,script,style,pre,textarea,[data-poem-content],.poem-modal-content,.poem-card'))texts.push(node);}
    for(const node of texts){
      const parts=document.createDocumentFragment();
      for(const part of node.data.split(/([↗→←×✕↺✓▶▷Ⅱ♫♪‹›−])/))if(part)parts.append(glyphs[part]?make(glyphs[part]):document.createTextNode(part));
      node.replaceWith(parts);
    }
    // Existing settings icons already use paths; give them the same line weight.
    for(const svg of root.querySelectorAll('button svg,a svg,.accessibility-card>svg'))svg.classList.add('site-icon');
  }
  enhance(document.body);
  // Process only changed control subtrees. No polling, layout measurements or network calls.
  const pending=new Set();let scheduled=false;
  const observer=new MutationObserver(records=>{
    for(const record of records){const parent=record.target.nodeType===1?record.target:record.target.parentElement;
      if(!parent||parent.closest('svg,script,style'))continue;
      const control=parent.closest('button,a,[aria-hidden="true"]');
      if(control)pending.add(control);
      for(const node of record.addedNodes)if(node.nodeType===1&&!node.matches('svg'))pending.add(node);
    }
    if(!pending.size||scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;const roots=[...pending];pending.clear();roots.forEach(enhance);});
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
