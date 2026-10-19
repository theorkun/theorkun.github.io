const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const tracks=[{id:'first',title:'Birinci <türkü>',source:'assets/music/first.mp3'},{id:'second',title:'İkinci Türkü',source:'assets/music/second.mp3'},{id:'third',title:'Son Türkü',source:'assets/music/third.mp3'}];
class Node{
  constructor(){this.listeners={};this.nodes={};this.attrs={};this.hidden=false;this.value='';const classes=new Set();this.classList={toggle:(k,on)=>on?classes.add(k):classes.delete(k)};}
  querySelector(k){if(!this.nodes[k]){this.nodes[k]=new Node();if(k==='.ap-panel')this.nodes[k].hidden=true;}return this.nodes[k];}
  setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,fn){this.listeners[k]=fn;}appendChild(n){this.child=n;}focus(){this.focused=true;}
}
async function harness({blockFirst=false,functional=false,stored=null,child=false}={}){
  const nodes=[],sources=[],writes=[],listeners={},events=[];let fetches=0;
  const document={body:new Node(),hidden:false,createElement:()=>new Node(),querySelector:()=>null,addEventListener:(k,fn)=>listeners[k]=fn,dispatchEvent:e=>events.push(e.type)};
  class Audio{
    constructor(){this.listeners={};this.currentTime=0;this.duration=NaN;this.volume=1;this.plays=0;this.pauses=0;nodes.push(this);}
    set src(v){this.url=v;sources.push(v);this.currentTime=0;this.duration=200;this.listeners.loadedmetadata?.();}get src(){return this.url;}
    addEventListener(k,fn){this.listeners[k]=fn;}
    async play(){this.plays++;if(blockFirst&&this.plays===1)throw Object.assign(Error('blocked'),{name:'NotAllowedError'});this.listeners.playing?.();}
    pause(){this.pauses++;}
  }
  const window={addEventListener:(k,fn)=>listeners[k]=fn,CeyhaniCookies:{read:()=>functional&&stored?JSON.stringify(stored):null,write:(...args)=>{if(functional)writes.push(JSON.parse(args[2]));}}};window.parent=child?{ceyhaniNavigation:{},ceyhaniMusic:{startIfWanted:()=>events.push('parent-play')}}:window;
  const context=vm.createContext({window,document,Audio,Event:class{constructor(type){this.type=type;}},fetch:async url=>{fetches++;assert.equal(url,'assets/audio-playlist.json');return {ok:true,json:async()=>({tracks,volume:0.35})};}});
  await vm.runInContext(fs.readFileSync(path.join(root,'audio-playlist.js'),'utf8'),context);
  const widget=document.body.child,$=s=>widget.querySelector(s);
  return {nodes,sources,writes,listeners,events,window,document,fetches:()=>fetches,$,click:async name=>$(`[data-ap="${name}"]`).listeners.click(),select:async i=>$('.ap-tracks').listeners.click({target:{closest:()=>({dataset:{audioIndex:String(i)}})}})};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));
test('one audio instance autoplays one selected local file, with no YouTube permission or other tracks preloaded',async()=>{
  const h=await harness();assert.equal(h.nodes.length,1);assert.equal(h.nodes[0].preload,'none');assert.deepEqual(h.sources,[tracks[0].source]);assert.equal(h.nodes[0].plays,1);assert.equal(h.$('[data-ap="play"]').attrs['aria-label'],'Müziği durdur');assert.match(h.$('.ap-tracks').innerHTML,/Birinci &lt;türkü&gt;/);assert.equal(h.writes.length,0);
});
test('blocked autoplay starts with a gesture, while an explicit pause prevents restarting on later gestures',async()=>{
  const h=await harness({blockFirst:true});assert.match(h.$('.ap-status').textContent,/sayfaya dokunun/);
  h.listeners.pointerdown({type:'pointerdown',target:{closest:()=>null}});await settle();assert.equal(h.nodes[0].plays,2);
  await h.click('play');h.listeners.pointerdown({type:'pointerdown',target:{closest:()=>null}});await settle();assert.equal(h.nodes[0].plays,2);assert.match(h.$('.ap-status').textContent,/durduruldu/);
});
test('track selection, next and previous replace the same audio source; minimizing preserves playback',async()=>{
  const h=await harness();await h.select(1);assert.equal(h.nodes[0].src,tracks[1].source);await h.click('next');assert.equal(h.nodes[0].src,tracks[2].source);await h.click('previous');assert.equal(h.nodes[0].src,tracks[1].source);
  h.nodes[0].currentTime=20;await h.click('previous');assert.equal(h.nodes[0].currentTime,0);assert.equal(h.nodes[0].src,tracks[1].source);
  h.$('.ap-open').listeners.click();assert.equal(h.$('.ap-panel').hidden,false);const pauses=h.nodes[0].pauses;await h.click('minimize');assert.equal(h.$('.ap-panel').hidden,true);assert.equal(h.nodes[0].pauses,pauses);
});
test('ended tracks advance automatically, repeat-one restarts, and repeat-off ends the queue',async()=>{
  const h=await harness();h.nodes[0].listeners.ended();await settle();assert.equal(h.nodes[0].src,tracks[1].source);
  await h.click('repeat');h.nodes[0].currentTime=200;h.nodes[0].listeners.ended();await settle();assert.equal(h.nodes[0].src,tracks[1].source);assert.equal(h.nodes[0].currentTime,0);
  await h.click('repeat');await h.select(2);const plays=h.nodes[0].plays;h.nodes[0].listeners.ended();await settle();assert.equal(h.nodes[0].plays,plays);assert.match(h.$('.ap-status').textContent,/Liste tamamlandı/);
});
test('shuffle visits each track, search filters the list, and seeking and volume affect only the active audio',async()=>{
  const h=await harness();await h.click('shuffle');const heard=new Set([h.nodes[0].src]);for(let i=0;i<2;i++){await h.click('next');heard.add(h.nodes[0].src);}assert.equal(heard.size,3);
  h.$('.ap-search input').value='bulunamaz';h.$('.ap-search input').listeners.input();assert.equal(h.$('.ap-empty').hidden,false);
  h.$('.ap-progress input').value=50;h.$('.ap-progress input').listeners.input();assert.equal(h.nodes[0].currentTime,100);
  h.$('.ap-volume').value=20;h.$('.ap-volume').listeners.input();assert.equal(h.nodes[0].volume,0.2);
});
test('saved position and paused choice require functional consent; navigation children delegate gestures without fetching audio',async()=>{
  const h=await harness({functional:true,stored:{kind:'mp3',id:'second',position:44,volume:0.2,mode:'paused',repeat:'off'}});assert.equal(h.sources.length,0);assert.equal(h.nodes[0].plays,0);await h.click('play');assert.equal(h.nodes[0].src,tracks[1].source);assert.equal(h.nodes[0].currentTime,44);assert.ok(h.writes.some(w=>w.position===44));
  const child=await harness({child:true});assert.equal(child.nodes.length,0);assert.equal(child.fetches(),0);child.listeners.pointerdown({type:'pointerdown',target:{closest:()=>null}});assert.ok(child.events.includes('parent-play'));
});
test('failed audio can be retried, and opening a video pauses playback',async()=>{
  const h=await harness();h.nodes[0].listeners.error();assert.match(h.$('.ap-status').textContent,/yüklenemedi/);await h.click('play');assert.equal(h.sources.length,2);assert.match(h.$('.ap-status').textContent,/Şimdi çalıyor/);
  h.listeners['ceyhani-pause-music']();assert.match(h.$('.ap-status').textContent,/Video için/);assert.equal(h.$('[data-ap="play"]').attrs['aria-label'],'Müziği çal');
});
test('all eleven recordings include the original Turkleriz first, exclude duplicates and use an image-free MP3 list on every page',()=>{
  const data=JSON.parse(fs.readFileSync(path.join(root,'assets/audio-playlist.json'),'utf8'));assert.equal(data.tracks.length,11);assert.equal(new Set(data.tracks.map(t=>t.id)).size,11);
  assert.equal(data.tracks[0].title,'Türkleriz Biz');assert.equal(data.tracks[0].source,'assets/ceyhani-turkleriz.mp3');
  for(const t of data.tracks){const bytes=fs.readFileSync(path.join(root,t.source));assert.equal(bytes.length,t.bytes);assert.ok(bytes.length>100000);assert.ok(bytes.subarray(0,3).toString()==='ID3'||bytes[0]===255);}
  for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){const html=fs.readFileSync(path.join(root,name),'utf8');assert.match(html,/src="audio-playlist.js\?v=1"/);assert.doesNotMatch(html,/src="youtube-playlist.js/);}
});
