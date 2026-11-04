(() => {
  let sequence=0;
  function attach(root,box){
    const id='comment-privacy-'+(++sequence),gate=document.createElement('fieldset');gate.className='comment-privacy';
    gate.innerHTML=`<legend>Yorum ve gizlilik</legend><p>Adınız/takma adınız ve yorumunuz herkese açık görünebilir. İletişim, kimlik veya başkalarına ait özel bilgileri yazmayın.</p><label><input type="checkbox" data-notice-ack><span><a href="cerez-politikasi.html#aydinlatma" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>’ni okudum ve bilgilendirildim.</span></label><label><input type="checkbox" data-public-consent><span><a href="cerez-politikasi.html#yorum-acik-riza" target="_blank" rel="noopener">Açık rıza metni</a> kapsamında, adım/takma adım ile yorumumun bu arşivde yorum paylaşımı amacıyla işlenmesine ve herkese açık yayımlanmasına açık rıza veriyorum.</span></label><p class="comment-privacy-choice">Yorum yapmadan da arşivi kullanabilir ve türküleri dinleyebilirsiniz. Rızanızı geri almak için <a href="mailto:iletisim@asikceyhani.com.tr">bize yazabilirsiniz</a>.</p><p class="comment-privacy-error" id="${id}-error" role="alert" hidden></p>`;
    root.insertBefore(gate,box);
    const ack=gate.querySelector('[data-notice-ack]'),consent=gate.querySelector('[data-public-consent]'),error=gate.querySelector('[role=alert]');
    const ready=()=>ack.checked&&consent.checked;
    function branding(){
      // The owner confirmed a paid plan, which permits removing this attribution.
      for(const link of box.querySelectorAll('a[href]')){
        if(link.closest('.hcb-comment-body'))continue;
        let url;try{url=new URL(link.href,location.href);}catch(_){continue;}
        if(!['www.htmlcommentbox.com','htmlcommentbox.com'].includes(url.hostname)||url.pathname!=='/')continue;
        if(!/html\s*comment\s*box/i.test(link.textContent))continue;
        const parent=link.parentElement,target=parent&&parent!==box&&parent.childElementCount===1&&/^(?:(?:powered\s+)?by\s+)?html\s*comment\s*box[\s.!]*$/i.test(parent.textContent.trim())?parent:link;
        target.hidden=true;target.setAttribute('data-comment-branding','hidden');
      }
    }
    function paint(){
      // Keep the form text-only, including controls inserted later by the provider.
      for(const control of box.querySelectorAll('#hcb_file,#hcb_file_label,input[type="file"],label[for="hcb_file"]')){
        control.hidden=true;if(control.type==='file'){control.disabled=true;control.value='';}
      }
      const form=box.querySelector?.('#hcb_form'),submit=box.querySelector?.('#hcb_submit');
      const list=box.querySelector?.('#comments_list');
      if(form&&list&&form.previousElementSibling!==list)form.parentElement.insertBefore(list,form);
      if(form&&submit&&gate.parentElement!==form)form.insertBefore(gate,submit.parentElement===form?submit:submit.parentElement);
      for(const [selector,text] of [['#hcb_form_name','Adınız veya takma adınız (isteğe bağlı)'],['#hcb_form_content',box.closest?.('#ziyaretci-defteri')?'Mesajınız':'Bu esere dair yorumunuz']]){
        const field=box.querySelector?.(selector);if(!field)continue;
        field.setAttribute('aria-label',text);field.setAttribute('placeholder',selector==='#hcb_form_name'?'Size nasıl hitap edelim?':'Düşüncelerinizi birkaç satırla paylaşın…');
        if(!form.querySelector('label[data-comment-field="'+field.id+'"]')){const label=document.createElement('label');label.className='comment-field-label';label.dataset.commentField=field.id;label.setAttribute('for',field.id);label.textContent=text;field.parentElement.insertBefore(label,field);}
      }
      for(const button of box.querySelectorAll('#hcb_submit,#hcb_form [type=submit]')){
        button.classList.toggle('is-privacy-blocked',!ready());
        if(!ready()){button.setAttribute('aria-disabled','true');button.dataset.privacyBlocked='true';}
        else if(button.dataset.privacyBlocked){button.removeAttribute('aria-disabled');delete button.dataset.privacyBlocked;}
      }
      branding();
    }
    function block(event){
      if(ready())return;event.preventDefault();event.stopImmediatePropagation();
      error.hidden=false;error.textContent=!ack.checked?'Lütfen KVKK Aydınlatma Metni’ni okuyup bilgilendirildiğinizi belirten kutuyu işaretleyin.':'Yorum göndermek için yorumunuzun işlenmesine ve herkese açık yayımlanmasına ilişkin ayrı açık rıza kutusunu işaretleyin. Onay vermeden siteyi gezmeye devam edebilirsiniz.';
      (!ack.checked?ack:consent).focus();
    }
    root.addEventListener('submit',event=>{if(event.target.closest('#HCB_comment_box'))block(event);},true);
    root.addEventListener('click',event=>{if(event.target.closest('#hcb_submit,#hcb_form [type=submit]'))block(event);},true);
    root.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.closest('#HCB_comment_box')&&(event.target.tagName!=='TEXTAREA'||event.ctrlKey||event.metaKey))block(event);},true);
    gate.addEventListener('change',()=>{error.hidden=true;paint();});
    const observer=new MutationObserver(paint);observer.observe(box,{childList:true,subtree:true});paint();
    window.addEventListener('pagehide',()=>observer.disconnect());
    return {ready,reset(){ack.checked=false;consent.checked=false;error.hidden=true;paint();}};
  }
  window.CeyhaniCommentPrivacy={attach};
})();
