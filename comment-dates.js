(() => {
  const root=document.getElementById('HCB_comment_box')||document.getElementById('work-comment-content');if(!root)return;
  const units={second:'saniye',minute:'dakika',hour:'saat',day:'gün',week:'hafta',month:'ay',year:'yıl'};
  const months={january:'Ocak',february:'Şubat',march:'Mart',april:'Nisan',may:'Mayıs',june:'Haziran',july:'Temmuz',august:'Ağustos',september:'Eylül',october:'Ekim',november:'Kasım',december:'Aralık',jan:'Ocak',feb:'Şubat',mar:'Mart',apr:'Nisan',jun:'Haziran',jul:'Temmuz',aug:'Ağustos',sep:'Eylül',sept:'Eylül',oct:'Ekim',nov:'Kasım',dec:'Aralık'};
  function translate(value,stamp){
    const original=value,plain=value.trim();if(!plain)return original;
    if(/^(just now|a moment ago|moments ago|within the last minute|less than a minute ago)$/i.test(plain))return 'az önce';
    if(/^yesterday$/i.test(plain))return 'dün';if(/^today$/i.test(plain))return 'bugün';
    const relative=/^(\d+|an?|one)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i.exec(plain);
    if(relative)return `${/^\d+$/.test(relative[1])?relative[1]:1} ${units[relative[2].toLowerCase()]} önce`;
    const source=stamp||plain;
    // Numeric dates without an ISO timestamp are ambiguous; preserve their order.
    if(!/^\d{4}-\d{2}-\d{2}(?:T|\s|$)/.test(source)&&!new RegExp('\\b('+Object.keys(months).join('|')+')\\b','i').test(source))return original;
    const normalized=source.replace(/^\(?\s*on\s+/i,'').replace(/^\(|\)$/g,'').replace(/(\d)(st|nd|rd|th)\b/gi,'$1').replace(/\bat\b/gi,' ').replace(/(\d)(am|pm)\b/gi,'$1 $2').trim();
    const hasTime=/\d{1,2}:\d{2}/.test(normalized),zoned=/(?:Z|[+-]\d{2}:?\d{2}|\b(?:UTC|GMT)(?:[+-]\d{1,4})?)\s*$/i.test(normalized);
    // Keep timezone-free printed dates as printed; convert actual instants to Turkey time.
    const neutral=normalized+(/^\d{4}-\d{2}-\d{2}T/.test(normalized)?'Z':' UTC');
    const parsed=Date.parse(zoned?normalized:neutral);
    if(Number.isFinite(parsed))return new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric',...(hasTime?{hour:'2-digit',minute:'2-digit'}:{}),timeZone:zoned?'Europe/Istanbul':'UTC'}).format(new Date(parsed));
    return original.replace(new RegExp('\\b('+Object.keys(months).join('|')+')\\b','gi'),word=>months[word.toLowerCase()]);
  }
  function update(){
    const box=document.getElementById('HCB_comment_box');if(!box)return;
    for(const date of box.querySelectorAll('.date,time[datetime]')){
      if(date.closest('.hcb-comment-body'))continue;
      if(!date.childElementCount){const text=translate(date.textContent,date.getAttribute('datetime'));if(text!==date.textContent)date.textContent=text;}
      else{
        // Keep date permalinks and the comment author's markup intact.
        const walker=document.createTreeWalker(date,NodeFilter.SHOW_TEXT);let node;
        while((node=walker.nextNode())){const text=translate(node.nodeValue,null);if(text!==node.nodeValue)node.nodeValue=text;}
      }
      const title=date.getAttribute('title');if(title){const text=translate(title,null);if(text!==title)date.setAttribute('title',text);}
      date.setAttribute('lang','tr');
    }
  }
  const observer=new MutationObserver(update);observer.observe(root,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['datetime','title']});update();
  window.addEventListener('pagehide',()=>observer.disconnect());
  window.addEventListener('pageshow',event=>{if(event.persisted){observer.observe(root,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['datetime','title']});update();}});
})();
