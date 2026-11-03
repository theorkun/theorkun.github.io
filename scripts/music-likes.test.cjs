const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../music-likes.js'),'utf8');
class Node {
  constructor(){this.dataset={};this.attrs={};this.listeners={};this.disabled=false;this.hidden=false;this.children=[];this.count={textContent:''};}
  querySelector(){return this.count;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.listeners[k]=v;}appendChild(n){this.children.push(n);}remove(){}focus(){this.focused=true;}
}
const settle=()=>new Promise(r=>setImmediate(r));
async function harness({offline=false,postFails=false,reduced=false,stored=null,storageBlocked=false}={}){
  const list=new Node(),status=new Node(),retry=new Node(),sort=new Node(),button=new Node(),requests=[];button.dataset={musicLike:'first',trackTitle:'Birinci Türkü'};list.querySelectorAll=()=>[button];
  let value=0,selected=false,animations=0;
  const document={body:new Node(),activeElement:button,documentElement:{classList:{contains:()=>false}},getElementById:id=>({musicTracks:list,musicLikesStatus:status,musicLikesRetry:retry,musicSort:sort}[id]),createElement:()=>{animations++;return new Node();}};
  const window={matchMedia:()=>({matches:reduced}),addEventListener(){}};
  const localStorage={getItem(){if(storageBlocked)throw Error('blocked');return stored;},setItem(k,v){if(storageBlocked)throw Error('blocked');stored=v;}};
  await vm.runInNewContext(source,{window,document,localStorage,crypto:require('node:crypto').webcrypto,Uint8Array,Intl,Set,URLSearchParams,AbortController,setTimeout:()=>1,clearTimeout(){},fetch:async(url,options)=>{
    requests.push({url,options});if(offline||(options.method==='POST'&&postFails))throw Error('offline');
    if(options.method==='POST'){selected=new URLSearchParams(options.body).get('liked')==='1';value=selected?1:0;}
    return {ok:true,json:async()=>({ok:true,counts:{first:value},liked:selected?['first']:[]})};
  }});
  await settle();
  return {window,list,status,retry,sort,button,requests,animations:()=>animations,click:()=>list.listeners.click({target:{closest:()=>button}})};
}
test('shared counts load once; like and unlike follow the server and animate only successful likes',async()=>{
  const h=await harness();assert.equal(h.button.count.textContent,'0');assert.equal(h.requests.length,1);
  await h.click();assert.equal(h.button.count.textContent,'1');assert.equal(h.button.attrs['aria-pressed'],'true');assert.equal(h.animations(),1);
  assert.match(h.requests[1].options.body,/liked=1/);assert.equal(h.requests[1].options.credentials,'omit');
  assert.equal(h.requests[0].url,'https://asikceyhani.com.tr/music-likes.ashx');
  assert.equal(h.requests[0].options.headers['X-Ceyhani-Visitor'],undefined);
  assert.match(h.requests[1].options.headers['X-Ceyhani-Visitor'],/^[a-f0-9]{32}$/);
  await h.click();assert.equal(h.button.count.textContent,'0');assert.equal(h.button.attrs['aria-pressed'],'false');assert.equal(h.animations(),1);
});
test('existing browser identity is sent on reads and writes without third-party cookies',async()=>{
  const token='a'.repeat(32),h=await harness({stored:token});await h.click();
  for(const request of h.requests){assert.equal(request.options.headers['X-Ceyhani-Visitor'],token);assert.equal(request.options.mode,'cors');}
});
test('blocked browser storage still allows voting with the same in-memory identity',async()=>{
  const h=await harness({storageBlocked:true});await h.click();await h.click();
  assert.equal(h.button.count.textContent,'0');assert.equal(h.requests[1].options.headers['X-Ceyhani-Visitor'],h.requests[2].options.headers['X-Ceyhani-Visitor']);
});
test('offline backend shows no fabricated counts and disables ranking and voting',async()=>{
  const h=await harness({offline:true});assert.equal(h.button.count.textContent,'—');assert.equal(h.sort.disabled,true);assert.equal(h.button.disabled,true);assert.equal(h.retry.hidden,false);
  assert.match(h.button.title,/ulaşılamıyor/);assert.doesNotMatch(h.button.attrs['aria-label'],/yükleniyor/);
  await h.click();assert.equal(h.requests.length,1);assert.equal(h.animations(),0);
});
test('failed saves keep the previous count and do not show a success animation',async()=>{
  const h=await harness({postFails:true});await h.click();assert.equal(h.button.count.textContent,'0');assert.equal(h.animations(),0);assert.match(h.status.textContent,/kaydedilemedi/);assert.equal(h.button.disabled,false);
});
test('reduced motion still records the like without spawning a saz animation',async()=>{
  const h=await harness({reduced:true});await h.click();assert.equal(h.button.count.textContent,'1');assert.equal(h.animations(),0);
});
