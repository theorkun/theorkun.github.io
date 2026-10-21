const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
class Node{
  constructor(){this.listeners={};this.dataset={};this.value='';this.hidden=false;this.open=false;}
  addEventListener(name,fn){this.listeners[name]=fn;}setAttribute(name,value){this[name]=value;}
  showModal(){this.open=true;}close(){this.open=false;this.listeners.close?.();}focus(){}
  cloneNode(){const n=new Node();n.src=this.src;n.title=this.title;return n;}
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
async function harness({api='ready',allowed=true}={}){
  const names=['channel-video-grid','video-search','channel-show-more','channel-video-count','channel-no-results','channel-player','channel-now-playing','channel-watch-link','channel-player-status','channel-video-dialog','channel-player-close','channel-media-notice','channel-player-retry'];
  const nodes=Object.fromEntries(names.map(name=>['#'+name,new Node()])),cards=[new Node(),new Node()],instances=[];
  cards[0].dataset={videoId:'fzIIszXMnaw',videoTitle:'Yörük Obalarımız',videoStart:'676'};
  cards[1].dataset={videoId:'SrtNM1QpjCk',videoTitle:'Önceki türkü'};
  nodes['#channel-video-grid'].querySelectorAll=()=>cards;
  const frame={replaceChildren(next){next.parentElement=frame;nodes['#channel-player']=next;}};
  nodes['#channel-player'].parentElement=frame;
  let loads=0,opens=0;
  const window={location:{protocol:'http:',origin:'http://localhost:8080'},CeyhaniCookies:{allows:()=>allowed,open:()=>opens++},CeyhaniYouTube:{load:()=>{loads++;return api==='ready'?Promise.resolve():api==='reject'?Promise.reject(Error('blocked')):new Promise(()=>{});}},YT:{Player:class{
    constructor(node,options){this.node=node;this.events=options.events;this.destroyed=false;instances.push(this);options.events.onReady();}
    destroy(){this.destroyed=true;}pauseVideo(){}
  }}};
  const document={querySelector:id=>nodes[id],addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'videos.js'),'utf8'),{window,document,URL});
  await settle();return {nodes,cards,instances,loads:()=>loads,opens:()=>opens};
}
test('external media is not initialized until a video is selected; iframe playback also works without the API',async()=>{
  const h=await harness({api:'pending'});assert.equal(h.loads(),0);assert.equal(h.nodes['#channel-player'].src,undefined);
  h.cards[0].listeners.click();const url=new URL(h.nodes['#channel-player'].src);
  assert.equal(url.searchParams.get('autoplay'),'1');assert.equal(url.searchParams.get('start'),'676');assert.equal(h.nodes['#channel-video-dialog'].open,true);
  assert.equal(new URL(h.nodes['#channel-watch-link'].href).searchParams.get('t'),'676s');
});
test('retry creates a fresh player using the alternate official embed domain, and switching videos resets its start',async()=>{
  const h=await harness();h.cards[0].listeners.click();await settle();const first=h.instances[0],iframe=h.nodes['#channel-player'];
  h.nodes['#channel-player-retry'].listeners.click();await settle();
  assert.notEqual(h.nodes['#channel-player'],iframe);assert.equal(first.destroyed,true);assert.equal(new URL(h.nodes['#channel-player'].src).hostname,'www.youtube-nocookie.com');
  assert.equal(new URL(h.nodes['#channel-player'].src).searchParams.get('start'),'676');
  h.cards[1].listeners.click();await settle();const url=new URL(h.nodes['#channel-player'].src);
  assert.equal(url.hostname,'www.youtube.com');assert.equal(url.searchParams.has('start'),false);assert.equal(new URL(h.nodes['#channel-watch-link'].href).searchParams.has('t'),false);
});
test('error codes are visible and obsolete player events cannot overwrite a new selection',async()=>{
  const h=await harness();h.cards[0].listeners.click();await settle();const old=h.instances[0];old.events.onError({data:153});
  assert.equal(h.nodes['#channel-player-status'].hidden,false);assert.match(h.nodes['#channel-player-status'].textContent,/153/);
  h.cards[1].listeners.click();await settle();assert.equal(h.nodes['#channel-player-status'].hidden,true);
  old.events.onError({data:100});assert.equal(h.nodes['#channel-player-status'].hidden,true);
  h.instances.at(-1).events.onError({data:5});assert.match(h.nodes['#channel-player-status'].textContent,/Tarayıcı/);
  h.instances.at(-1).events.onStateChange({data:1});assert.equal(h.nodes['#channel-player-status'].hidden,true);
});
test('rapid selection and closing cancel pending API setup and unload the iframe',async()=>{
  const h=await harness();h.cards[0].listeners.click();h.cards[1].listeners.click();await settle();assert.equal(h.instances.length,1);assert.match(h.instances[0].node.src,/SrtNM1QpjCk/);
  h.nodes['#channel-video-dialog'].close();assert.equal(h.nodes['#channel-player'].src,'about:blank');assert.equal(h.instances[0].destroyed,true);
  const closed=await harness();closed.cards[0].listeners.click();closed.nodes['#channel-video-dialog'].close();await settle();assert.equal(closed.instances.length,0);
});
test('API loading failure leaves the plain iframe available and offers a useful fallback',async()=>{
  const h=await harness({api:'reject'});h.cards[0].listeners.click();await settle();assert.equal(h.nodes['#channel-video-dialog'].open,true);assert.match(h.nodes['#channel-player'].src,/\/embed\/fzIIszXMnaw/);assert.match(h.nodes['#channel-player-status'].textContent,/Yeniden dene/);
});
test('disabled consent is explained without loading external media',async()=>{
  const denied=await harness({allowed:false});assert.equal(denied.nodes['#channel-media-notice'].hidden,false);denied.cards[0].listeners.click();assert.equal(denied.opens(),1);assert.equal(denied.loads(),0);assert.equal(denied.nodes['#channel-video-dialog'].open,false);
});
test('manual video appears once, starts at zero and has retry and external watch controls',()=>{
  const catalogue=JSON.parse(fs.readFileSync(path.join(root,'assets/youtube-videos.json'),'utf8')),html=fs.readFileSync(path.join(root,'videolar.html'),'utf8');
  const entries=catalogue.videos.filter(v=>v.id==='fzIIszXMnaw');assert.equal(entries.length,1);assert.equal(entries[0].startSeconds,0);assert.equal(entries[0].manual,true);
  assert.equal(catalogue.videos.length,44);assert.equal((html.match(/class="channel-video-card"/g)||[]).length,44);
  assert.match(html,/data-video-id="fzIIszXMnaw"[^>]*data-video-start="0"/);assert.match(html,/id="channel-player-retry"/);assert.match(html,/id="channel-watch-link"/);
});
