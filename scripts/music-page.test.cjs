const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');const root=path.join(__dirname,'..');
class Node{
  constructor(){this.listeners={};this.attrs={};this.nodes={};this.value='';this.hidden=false;this.disabled=true;this.dataset={};this.style={setProperty:(k,v)=>this.style[k]=v};this.classList={toggle(){}};this.rows=[];this.changes=0;}
  addEventListener(k,fn){this.listeners[k]=fn;}setAttribute(k,v){this.attrs[k]=v;}focus(){this.focused=true;}
  querySelector(k){return this.nodes[k]??=new Node();}querySelectorAll(){return this.rows;}
  set innerHTML(text){this.html=text;this.changes++;this.rows=[...text.matchAll(/data-music-index="(\d+)"/g)].map(m=>{const row=new Node();row.dataset.musicIndex=m[1];return row;});}get innerHTML(){return this.html;}
}
function harness({child=false,delayed=false}={}){
  const ids=[...fs.readFileSync(path.join(root,'muzikler.html'),'utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]);const nodes=Object.fromEntries(ids.map(id=>[id,new Node()]));
  const calls=[],handlers={},timers=[];let callback,unsubscribed=0;
  const state={tracks:[{id:'turkleriz',title:'Türkleriz Biz',artist:'Aşık Ceyhani'},{id:'other',title:'Saz <Türkü>',artist:'Aşık Ceyhani'}],index:0,mode:'playing',position:30,duration:200,volume:0.35,shuffle:false,repeat:'all',status:'Şimdi çalıyor'};
  const publish=()=>callback?.(state);
  const api={getState:()=>state,subscribe:fn=>{callback=fn;fn(state);return()=>{callback=null;unsubscribed++;};},togglePlay:()=>{calls.push('toggle');state.mode=state.mode==='playing'?'paused':'playing';publish();},select:i=>{calls.push(['select',i]);state.index=i;state.mode='playing';publish();},next:()=>calls.push('next'),previous:()=>calls.push('previous'),toggleShuffle:()=>{calls.push('shuffle');state.shuffle=!state.shuffle;publish();},cycleRepeat:()=>{calls.push('repeat');state.repeat='one';publish();},seek:n=>{calls.push(['seek',n]);state.position=n;publish();},setVolume:n=>{calls.push(['volume',n]);state.volume=n;publish();}};
  const host=delayed?{}:{ceyhaniMusic:api};
  const window={...(!child?host:{}),addEventListener:(k,fn)=>handlers[k]=fn,location:{reload(){calls.push('reload');}}};window.parent=child?{ceyhaniNavigation:{},...host}:window;
  const main=new Node();main.rows=[nodes.musicPlay,nodes.musicPrevious,nodes.musicNext,nodes.musicVolume];
  const document={getElementById:id=>{assert.ok(nodes[id],id);return nodes[id];},querySelector:()=>main,addEventListener:(k,fn)=>handlers[k]=fn};
  const context=vm.createContext({window,document,setInterval:fn=>{timers.push(fn);return 1;},clearInterval:()=>calls.push('clearTimer'),Audio:class{constructor(){throw Error('A second audio instance must not be created');}}});
  vm.runInContext(fs.readFileSync(path.join(root,'music-page.js'),'utf8'),context);
  return {nodes,api,state,calls,handlers,timers,window,publish,unsubscribed:()=>unsubscribed,click:id=>nodes[id].listeners.click(),choose:i=>nodes.musicTracks.listeners.click({target:{closest:()=>({dataset:{musicIndex:String(i)}})}})};
}
test('music page uses the shared player, displays the current track, and preserves row nodes while playback progresses',()=>{
  const h=harness({child:true});assert.equal(h.nodes.musicCurrent.textContent,'Türkleriz Biz');assert.match(h.nodes.musicTracks.innerHTML,/Saz &lt;Türkü&gt;/);assert.equal(h.nodes.musicPlay.attrs['aria-label'],'Müziği durdur');
  const changes=h.nodes.musicTracks.changes;h.state.position=60;h.publish();assert.equal(h.nodes.musicPosition.textContent,'1:00');assert.equal(h.nodes.musicTracks.changes,changes);
  h.click('musicPlay');assert.equal(h.nodes.musicPlay.attrs['aria-label'],'Müziği çal');assert.equal(h.nodes.musicTracks.changes,changes);
  h.choose(1);assert.deepEqual(h.calls.at(-1),['select',1]);assert.equal(h.nodes.musicCurrent.textContent,'Saz <Türkü>');h.choose(1);assert.equal(h.calls.at(-1),'toggle');
  h.click('musicNext');h.click('musicPrevious');assert.ok(h.calls.includes('next'));assert.ok(h.calls.includes('previous'));
});
test('search, seeking, volume and repeat controls update the existing playback controller',()=>{
  const h=harness();h.nodes.musicSearch.value='bulunmaz';h.nodes.musicSearch.listeners.input();assert.equal(h.nodes.musicEmpty.hidden,false);assert.equal(h.nodes.musicResults.textContent,'0 / 2 türkü');
  h.click('musicClearSearch');assert.equal(h.nodes.musicEmpty.hidden,true);assert.equal(h.nodes.musicSearch.focused,true);
  h.nodes.musicSeek.value=50;h.nodes.musicSeek.listeners.input();assert.deepEqual(h.calls.at(-1),['seek',100]);assert.equal(h.nodes.musicSeek.style['--played'],'50%');
  h.nodes.musicVolume.value=60;h.nodes.musicVolume.listeners.input();assert.deepEqual(h.calls.at(-1),['volume',0.6]);assert.equal(h.nodes.musicVolumeValue.textContent,'60%');
  h.click('musicShuffle');assert.equal(h.nodes.musicShuffle.attrs['aria-pressed'],'true');h.click('musicRepeat');assert.equal(h.nodes.musicRepeat.textContent,'Bu türkü');
});
test('controller readiness and iframe teardown are handled without retaining a dead page subscription',()=>{
  const h=harness({delayed:true});assert.equal(h.timers.length,1);h.window.ceyhaniMusic=h.api;h.handlers['ceyhani-music-ready']();assert.equal(h.nodes.musicPlay.disabled,false);assert.ok(h.calls.includes('clearTimer'));
  h.handlers.pagehide();assert.equal(h.unsubscribed(),1);
});
test('every page links to Türküler in the menu and frame navigation recognizes its route',()=>{
  for(const file of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){const html=fs.readFileSync(path.join(root,file),'utf8');assert.match(html,/href="muzikler.html">Türküler<\/a>/,file);}
  const html=fs.readFileSync(path.join(root,'muzikler.html'),'utf8');assert.match(html,/class="active" aria-current="page" href="muzikler.html"/);assert.match(fs.readFileSync(path.join(root,'site-navigation.js'),'utf8'),/'muzikler.html'/);
});
