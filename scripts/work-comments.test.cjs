const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'work-comments-embed.js'),'utf8');
class Node{constructor(){this.classList={add(){}};this.children=[];this.hidden=false;this.listeners={};this.textContent='';this.innerHTML='';}appendChild(n){this.children.push(n);}addEventListener(name,fn){this.listeners[name]=fn;}}
async function embed({type='poem',id='1',consent=true,confirmed=false}={}){
  const nodes=Object.fromEntries(['work-title','work-comment-status','work-comment-content','work-comment-retry'].map(id=>[id,new Node()])),head=new Node(),requests=[];
  const document={body:new Node(),documentElement:{scrollHeight:500},head,getElementById:id=>nodes[id],createElement:()=>new Node()};
  const window={parent:{postMessage(){}},CeyhaniCookies:{allows:()=>consent,open(){}},addEventListener(){}};
  // The consent-denied branch replaces its retry listener before opening settings.
  nodes['work-comment-retry'].cloneNode=()=>nodes['work-comment-retry'];nodes['work-comment-retry'].replaceWith=()=>{};
  vm.runInNewContext(source,{window,document,location:{search:'?'+new URLSearchParams({type,id}),origin:'https://example.test',reload(){}},ResizeObserver:class{observe(){}disconnect(){}},URL,URLSearchParams,Number,setTimeout:()=>1,clearTimeout(){},fetch:async url=>{
    requests.push(url);return {ok:true,json:async()=>url.includes('settings')?{moderationConfirmed:confirmed}:JSON.parse(fs.readFileSync(path.join(root,url.split('?')[0]),'utf8'))};
  }});
  for(let i=0;i<5;i++)await new Promise(r=>setImmediate(r));return {nodes,window,head,requests};
}
test('unconfirmed moderation is a labelled preview without external scripts or a live submit form',async()=>{
  const h=await embed();assert.equal(h.head.children.length,0);assert.match(h.nodes['work-comment-status'].textContent,/henüz açık değil/);assert.match(h.nodes['work-comment-content'].innerHTML,/disabled/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'assets/work-comments-settings.json'))).moderationConfirmed,false);
});
test('no comment-service request is made before comments consent',async()=>{
  const h=await embed({consent:false,confirmed:true});assert.equal(h.head.children.length,0);assert.equal(h.requests.length,1);assert.match(h.nodes['work-comment-status'].textContent,/iznini/);
});
test('different works have distinct canonical threads that do not depend on the current hosting domain',async()=>{
  const first=await embed({confirmed:true}),second=await embed({id:'2',confirmed:true}),track=await embed({type:'track',id:'turkleriz-biz',confirmed:true});
  assert.notEqual(first.window.hcb_user.PAGE,second.window.hcb_user.PAGE);assert.notEqual(first.window.hcb_user.PAGE,track.window.hcb_user.PAGE);
  for(const h of [first,second,track]){assert.match(h.window.hcb_user.PAGE,/^https:\/\/theorkun.github.io\/eser-yorumlari.html\?/);assert.equal(h.head.children.length,1);assert.equal(new URL(h.head.children[0].src).searchParams.get('page'),h.window.hcb_user.PAGE);}
});
test('unknown, removed and malformed work IDs never initialize the service',async()=>{
  for(const options of [{id:'12'},{id:'4'},{id:'99999'},{id:'../bad'},{type:'track',id:'unknown'},{type:'bad'}]){const h=await embed({...options,confirmed:true});assert.equal(h.head.children.length,0);}
});
test('provider errors expose retry and never claim a comment was saved',async()=>{
  const h=await embed({confirmed:true});let received=0;h.window.CeyhaniCommentThanks={received:()=>received++};h.head.children[0].onerror();assert.match(h.nodes['work-comment-status'].textContent,/ulaşılamıyor/);assert.equal(h.nodes['work-comment-retry'].hidden,false);assert.equal(received,0);h.window.hcb_user.ON_COMMENT();assert.equal(received,1);
});
