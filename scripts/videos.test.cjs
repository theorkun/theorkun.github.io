const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
class Node{
  constructor(){this.listeners={};this.dataset={};this.value='';this.hidden=false;this.open=false;}
  addEventListener(name,fn){this.listeners[name]=fn;}setAttribute(name,value){this[name]=value;}
  showModal(){this.open=true;}close(){this.open=false;this.listeners.close?.();}focus(){}
}
async function harness(ready){
  const names=['channel-video-grid','video-search','channel-show-more','channel-video-count','channel-no-results','channel-player','channel-now-playing','channel-watch-link','channel-player-status','channel-video-dialog','channel-player-close'];
  const nodes=Object.fromEntries(names.map(name=>['#'+name,new Node()])),cards=[new Node(),new Node()],calls=[];
  cards[0].dataset={videoId:'fzIIszXMnaw',videoTitle:'Yörük Obalarımız',videoStart:'676'};
  cards[1].dataset={videoId:'SrtNM1QpjCk',videoTitle:'Önceki türkü'};
  nodes['#channel-video-grid'].querySelectorAll=()=>cards;
  const window={location:{protocol:'http:',origin:'http://localhost:8080'},CeyhaniCookies:{allows:()=>true},CeyhaniYouTube:{load:()=>ready?Promise.resolve():new Promise(()=>{})},YT:{Player:class{constructor(node,options){options.events.onReady();}loadVideoById(value){calls.push(value);}stopVideo(){calls.push('stop');}}}};
  const document={querySelector:id=>nodes[id],addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'videos.js'),'utf8'),{window,document,URL});
  await new Promise(resolve=>setImmediate(resolve));
  return {nodes,cards,calls};
}
test('timestamp is preserved in iframe fallback and external YouTube link, with ordinary videos starting at zero',async()=>{
  const h=await harness(false);h.cards[0].listeners.click();
  const embed=new URL(h.nodes['#channel-player'].src),watch=new URL(h.nodes['#channel-watch-link'].href);
  assert.equal(embed.searchParams.get('start'),'676');assert.equal(embed.searchParams.get('autoplay'),'1');assert.equal(watch.searchParams.get('t'),'676s');
  h.nodes['#channel-video-dialog'].close();assert.equal(new URL(h.nodes['#channel-player'].src).searchParams.get('start'),'676');
  h.cards[1].listeners.click();assert.equal(new URL(h.nodes['#channel-player'].src).searchParams.has('start'),false);assert.equal(new URL(h.nodes['#channel-watch-link'].href).searchParams.has('t'),false);
});
test('ready YouTube API receives the timestamp and resets it for the next untimed video',async()=>{
  const h=await harness(true);h.cards[0].listeners.click();assert.equal(h.calls[0].videoId,'fzIIszXMnaw');assert.equal(h.calls[0].startSeconds,676);
  h.cards[1].listeners.click();assert.equal(h.calls[1].videoId,'SrtNM1QpjCk');assert.equal(h.calls[1].startSeconds,0);
});
test('manual video appears once in the catalogue and visible HTML with deferred thumbnail and start time',()=>{
  const catalogue=JSON.parse(fs.readFileSync(path.join(root,'assets/youtube-videos.json'),'utf8')),html=fs.readFileSync(path.join(root,'videolar.html'),'utf8');
  const entries=catalogue.videos.filter(v=>v.id==='fzIIszXMnaw');assert.equal(entries.length,1);assert.equal(entries[0].startSeconds,676);assert.equal(entries[0].manual,true);
  assert.equal(catalogue.videos.length,44);assert.equal((html.match(/class="channel-video-card"/g)||[]).length,44);
  assert.match(html,/data-video-id="fzIIszXMnaw"[^>]*data-video-start="676"/);assert.match(html,/data-media-src="https:\/\/i.ytimg.com\/vi\/fzIIszXMnaw\/hqdefault.jpg"/);
});
