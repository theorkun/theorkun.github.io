const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..'),key='ceyhani-cookie-consent-v1';
const categories=['functional','statistics','media','comments'];
const choice=values=>({version:1,at:Date.now(),...Object.fromEntries(categories.map(c=>[c,false])),...values});
class Node{
  constructor(){this.listeners={};this.dataset={};this.hidden=false;this.open=false;this.children=[];this.elements=Object.fromEntries(categories.map(c=>[c,{checked:false}]));}
  setAttribute(k,v){this[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}appendChild(n){this.children.push(n);}focus(){}showModal(){this.open=true;}close(){this.open=false;}querySelectorAll(){return [];}
  insertAdjacentElement(_,node){this.children.push(node);}
  querySelector(k){return (this.queries??={})[k]??=((k==='form')?new Node():new Node());}
}
function harness(value,{blocked=false}={}){
  const data=new Map(value?[ [key,JSON.stringify(value)] ]:[]),session=new Map([['ceyhani-background-music','music'],['ceyhani-visitor-counted-v1','counted']]);data.set('ceyhani-accessibility','settings');
  const storage=map=>({getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(blocked)throw Error('denied');map.set(k,v);},removeItem:k=>map.delete(k)});
  const handlers={},windowHandlers={},body=new Node(),head=new Node(),images=[Object.assign(new Node(),{dataset:{mediaSrc:'https://i.ytimg.com/example.jpg'}})];let reloads=0;
  const document={body,head,activeElement:new Node(),createElement:()=>new Node(),addEventListener:(k,fn)=>handlers[k]=fn,querySelectorAll:()=>images,querySelector:()=>null};
  const window={localStorage:storage(data),sessionStorage:storage(session),location:{protocol:'http:',origin:'http://local',reload:()=>reloads++},addEventListener:(k,fn)=>windowHandlers[k]=fn};window.top={location:{reload:()=>reloads++}};
  const context=vm.createContext({window,document,localStorage:window.localStorage,sessionStorage:window.sessionStorage,Date,console,URL});
  const run=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
  run('cookie-consent.js');
  return {context,window,document,data,session,images,run,handlers,windowHandlers,reloads:()=>reloads,ui(){handlers.DOMContentLoaded();return {panel:body.children[0],banner:body.children[1]};}};
}
test('optional storage is off before a valid decision; malformed and expired decisions are ignored',()=>{
  for(const value of [null,choice({at:Date.now()-181*86400000,media:true}),choice({version:99,statistics:true}),{version:1,at:Date.now(),media:true}]){
    const h=harness(value);for(const c of categories)assert.equal(h.window.CeyhaniCookies.allows(c),false);
    assert.equal(h.data.has('ceyhani-accessibility'),false);assert.equal(h.session.has('ceyhani-visitor-counted-v1'),false);
    h.window.CeyhaniCookies.write('localStorage','example','value');assert.equal(h.data.has('example'),false);
    const ui=h.ui();assert.equal(ui.banner.hidden,false);assert.equal(h.images[0].src,undefined);
  }
});
test('accept, reject and category selection persist explicit booleans and reload the entire navigation shell',()=>{
  for(const action of ['accept','reject']){
    const h=harness(null),ui=h.ui();ui.banner.listeners.click({target:{closest:()=>({dataset:{cookie:action}})}});
    const saved=JSON.parse(h.data.get(key));for(const c of categories)assert.equal(saved[c],action==='accept');assert.equal(h.reloads(),1);
  }
  const h=harness(choice({functional:true,media:true})),ui=h.ui();h.window.CeyhaniCookies.open();const form=ui.panel.querySelector('form');
  assert.equal(form.elements.media.checked,true);assert.equal(form.elements.statistics.checked,false);
  form.elements.media.checked=false;form.elements.comments.checked=true;form.listeners.submit({preventDefault(){}});
  const next=JSON.parse(h.data.get(key));assert.equal(next.media,false);assert.equal(next.comments,true);assert.equal(next.statistics,false);assert.equal(h.reloads(),1);
  const after=harness(next);assert.equal(after.window.CeyhaniCookies.allows('media'),false);assert.equal(after.window.CeyhaniCookies.allows('comments'),true);
});
test('storage failure stays visible without recording a fictitious acceptance',()=>{
  const h=harness(null,{blocked:true}),ui=h.ui();ui.banner.listeners.click({target:{closest:()=>({dataset:{cookie:'accept'}})}});
  assert.equal(h.window.CeyhaniCookies.decided(),false);assert.equal(h.reloads(),0);assert.equal(ui.panel.querySelector('.cookie-error').hidden,false);
});
test('counter, YouTube API, thumbnails and comments make no external request without their category',()=>{
  const h=harness(null);let opens=0;h.window.CeyhaniCookies.open=()=>opens++;
  h.context.fetch=()=>{throw Error('Unexpected network request');};h.run('visitor-counter.js');
  const nodes=Object.fromEntries(['channel-video-grid','video-search','channel-show-more','channel-video-count','channel-no-results','channel-player','channel-now-playing','channel-watch-link','channel-player-status','channel-video-dialog','channel-player-close'].map(id=>['#'+id,new Node()]));
  const card=new Node();card.dataset={videoId:'abcdefghijk',videoTitle:'Türkü'};nodes['#channel-video-grid'].querySelectorAll=()=>[card];nodes['#video-search'].value='';
  h.document.querySelector=id=>nodes[id]||null;h.run('videos.js');assert.equal(h.document.head.children.length,0);assert.equal(nodes['#channel-player'].src,undefined);
  card.listeners.click();assert.equal(opens,1);assert.equal(nodes['#channel-video-dialog'].open,false);
  const section=new Node();h.document.querySelector=id=>id==='#ziyaretci-defteri'?section:null;h.run('guestbook.js');assert.equal(h.document.head.children.length,0);section.querySelector('.guestbook-retry').listeners.click();assert.equal(opens,2);
  const accepted=harness(choice({media:true}));accepted.ui();assert.match(accepted.images[0].src,/i.ytimg.com/);
});
test('all HTML entry pages have consent controls and no eager external resource URLs',()=>{
  for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
    const html=fs.readFileSync(path.join(root,name),'utf8');assert.match(html,/src="cookie-consent.js\?v=1"/);assert.match(html,/data-cookie-settings/);
    assert.doesNotMatch(html,/<(?:img|iframe|script)\b[^>]*\ssrc="https?:/i);
  }
});
test('allowed services load independently and revocation removes their local records on the next page load',async()=>{
  const h=harness(choice({statistics:true,comments:true}));let endpoint='';const legal=new Node();
  h.document.querySelector=id=>id==='.footer-legal'?legal:null;
  h.context.fetch=async url=>{endpoint=url;return {ok:true,json:async()=>({value:42})};};h.run('visitor-counter.js');
  await new Promise(resolve=>setImmediate(resolve));assert.match(endpoint,/countapi.*\/get\//);assert.match(legal.querySelector('.copyright').children[0].textContent,/42/);
  h.session.delete('ceyhani-visitor-counted-v1');h.run('visitor-counter.js');await new Promise(resolve=>setImmediate(resolve));assert.match(endpoint,/countapi.*\/hit\//);assert.equal(h.session.get('ceyhani-visitor-counted-v1'),'counted');
  const section=new Node();h.document.querySelector=id=>id==='#ziyaretci-defteri'?section:null;h.run('guestbook.js');assert.equal(h.document.head.children.length,1);assert.match(h.document.head.children[0].src,/htmlcommentbox.com\/jread/);assert.equal(h.window.CeyhaniCookies.allows('media'),false);
  const ui=h.ui();h.window.CeyhaniCookies.open();ui.panel.querySelector('form').elements.comments.checked=false;ui.panel.querySelector('form').elements.statistics.checked=false;ui.panel.querySelector('form').listeners.submit({preventDefault(){}});
  const after=harness(JSON.parse(h.data.get(key)));assert.equal(after.session.has('ceyhani-visitor-counted-v1'),false);assert.equal(after.window.CeyhaniCookies.allows('comments'),false);assert.equal(after.window.CeyhaniCookies.allows('statistics'),false);
});
