const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
class Node{
  constructor(){this.children=[];this.listeners={};this.attrs={};this.classes=new Set();this.classList={contains:n=>this.classes.has(n),add:n=>this.classes.add(n)};}
  appendChild(n){n.parent=this;this.children.push(n);}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}querySelector(){return this.button||(this.button=new Node());}
}
function harness({reduced=false,embedded=false,modal=false}={}){
  const body=new Node(),dialog=new Node(),messages=[],events={};if(embedded)body.classes.add('work-comments-page');
  const document={body,documentElement:new Node(),createElement:()=>new Node(),querySelector:()=>modal?dialog:null,addEventListener:(k,fn)=>events[k]=fn};
  const window={matchMedia:()=>({matches:reduced}),parent:null,addEventListener:(k,fn)=>events[k]=fn};window.parent=embedded?{postMessage:(...args)=>messages.push(args)}:window;
  vm.runInNewContext(fs.readFileSync(path.join(root,'comment-thanks.js'),'utf8'),{window,document,location:{origin:'https://example.test'},setTimeout:()=>1,clearTimeout(){}});
  return {window,body,dialog,messages,events};
}
test('no notification appears until acknowledgement; repeated acknowledgements replace the toast and close is usable',()=>{
  const h=harness();assert.equal(h.body.children.length,0);h.window.CeyhaniCommentThanks.received();assert.equal(h.body.children.length,1);
  assert.match(h.body.children[0].innerHTML,/Yorumunuz alındı/);assert.doesNotMatch(h.body.children[0].innerHTML,/yayımlandı/);assert.equal(h.body.children[0].attrs.role,'status');
  h.window.CeyhaniCommentThanks.received();assert.equal(h.body.children.length,1);h.body.children[0].querySelector('button').listeners.click();assert.equal(h.body.children.length,0);
});
test('reduced motion shows a quiet notification; modal hosts stay in the top layer and navigation removes it',()=>{
  const h=harness({reduced:true,modal:true});h.window.CeyhaniCommentThanks.show();assert.match(h.dialog.children[0].className,/is-quiet/);assert.equal(h.body.children.length,0);h.events['ceyhani-page-change']();assert.equal(h.dialog.children.length,0);
});
test('embedded work comments notify only their same-origin parent',()=>{
  const h=harness({embedded:true});h.window.CeyhaniCommentThanks.received();assert.equal(h.body.children.length,0);assert.equal(h.messages.length,1);assert.equal(h.messages[0][0].type,'ceyhani-comment-thanks');assert.equal(h.messages[0][1],'https://example.test');
});
test('guestbook acknowledgement is hooked to the provider callback, never page load or network error',()=>{
  const status=new Node(),retry=new Node(),section=new Node(),head=new Node();let received=0;
  section.querySelector=selector=>selector==='[role="status"]'?status:retry;
  const document={querySelector:selector=>selector==='#ziyaretci-defteri'?section:null,createElement:()=>new Node(),head,addEventListener(){}};
  const window={CeyhaniCommentPrivacy:{attach:()=>({reset(){}})},CeyhaniCookies:{allows:()=>true},CeyhaniCommentThanks:{received:()=>received++},top:{},addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'guestbook.js'),'utf8'),{window,document,URL});
  assert.equal(received,0);head.children[0].onerror();assert.equal(received,0);window.hcb_user.onload();assert.equal(received,0);window.hcb_user.ON_COMMENT();assert.equal(received,1);
});
