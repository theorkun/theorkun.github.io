const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../comment-privacy.js'),'utf8');
class Node{constructor(){this.checked=false;this.hidden=false;this.attrs={};this.dataset={};this.listeners={};this.classes=new Set();this.classList={toggle:(k,on)=>on?this.classes.add(k):this.classes.delete(k)};}setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}addEventListener(k,fn){this.listeners[k]=fn;}focus(){this.focused=true;}}
function harness(){
  const ack=new Node(),consent=new Node(),error=new Node(),button=new Node(),gate=new Node(),root=new Node(),box=new Node();let observer;
  const links=[];gate.querySelector=s=>s==='[data-notice-ack]'?ack:s==='[data-public-consent]'?consent:error;root.insertBefore=n=>root.gate=n;box.querySelectorAll=s=>s==='a[href]'?links:[button];
  const window={addEventListener(){}};vm.runInNewContext(source,{window,document:{createElement:()=>gate},location:{href:'https://asikceyhani.com.tr/'},URL,MutationObserver:class{constructor(fn){observer=fn;}observe(){}disconnect(){}}});
  const api=window.CeyhaniCommentPrivacy.attach(root,box);
  function click(){const e={target:{closest:s=>s==='#HCB_comment_box'?box:button},preventDefault(){this.blocked=true;},stopImmediatePropagation(){this.stopped=true;}};root.listeners.click(e);return e;}
  return {ack,consent,error,button,gate,root,box,links,api,click,update:()=>observer()};
}
test('notice acknowledgement and publication consent start separately unchecked and both are required',()=>{
  const h=harness();assert.equal(h.api.ready(),false);assert.equal(h.click().blocked,true);assert.match(h.error.textContent,/Aydınlatma/);assert.ok(h.ack.focused);
  h.ack.checked=true;h.gate.listeners.change();assert.equal(h.click().blocked,true);assert.match(h.error.textContent,/açık rıza/);
  h.consent.checked=true;h.gate.listeners.change();assert.equal(h.api.ready(),true);assert.equal(h.click().blocked,undefined);assert.equal(h.button.attrs['aria-disabled'],undefined);
  h.api.reset();assert.equal(h.ack.checked,false);assert.equal(h.consent.checked,false);assert.equal(h.click().blocked,true);
});
test('the guard does not undo a provider disabled state or bypass unconfirmed moderation',()=>{
  const h=harness();h.button.disabled=true;h.ack.checked=h.consent.checked=true;h.gate.listeners.change();assert.equal(h.button.disabled,true);
});
test('native submit and keyboard submission are blocked without both choices',()=>{
  const h=harness();
  for(const kind of ['submit','keydown']){const e={key:'Enter',ctrlKey:true,target:{tagName:'TEXTAREA',closest:()=>h.box},preventDefault(){this.blocked=true;},stopImmediatePropagation(){}};h.root.listeners[kind](e);assert.equal(e.blocked,true);}
  h.ack.checked=h.consent.checked=true;const e={target:{closest:()=>h.box},preventDefault(){this.blocked=true;},stopImmediatePropagation(){}};h.root.listeners.submit(e);assert.equal(e.blocked,undefined);
});
test('paid attribution is hidden without hiding the comment box or changing comment content',()=>{
  const h=harness(),link=new Node();link.href='https://www.htmlcommentbox.com/';link.textContent='HTML Comment Box';link.closest=()=>null;link.parentElement=h.box;h.box.childElementCount=1;h.box.textContent='HTML Comment Box';h.links.push(link);h.update();assert.equal(link.hidden,true);assert.notEqual(h.box.hidden,true);
  const userLink=new Node();userLink.href=link.href;userLink.textContent=link.textContent;userLink.closest=()=>({});h.links.push(userLink);h.update();assert.equal(userLink.hidden,false);
});
