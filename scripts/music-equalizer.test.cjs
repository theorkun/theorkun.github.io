const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../music-equalizer.js'),'utf8');
function harness({unsupported=false,fail=false,saved}={}){
  const contexts=[],audio={},nodes=[];let changes=0;
  const param=()=>({value:0,setTargetAtTime(value){this.value=value;}});
  const node=()=>{const n={gain:param(),frequency:param(),Q:param(),targets:[],connect(target){this.targets.push(target);},disconnect(){this.targets=[];}};nodes.push(n);return n;};
  class Context{
    constructor(){contexts.push(this);this.currentTime=1;this.destination={};this.filters=[];}
    async resume(){if(fail)throw Error('denied');this.state='running';}
    async close(){this.closed=true;}
    createBiquadFilter(){const n=node();this.filters.push(n);return n;}
    createGain(){return this.output=node();}
    createMediaElementSource(element){assert.equal(element,audio);return this.source=node();}
  }
  const window={AudioContext:unsupported?undefined:Context};vm.runInNewContext(source,{window});
  const eq=window.createCeyhaniEqualizer(audio,saved,()=>changes++);
  return {eq,contexts,nodes,changes:()=>changes};
}
test('balanced does not create an audio graph until the equalizer is used',async()=>{
  const h=harness();await h.eq.resume();assert.equal(h.contexts.length,0);assert.equal(h.eq.getState().preset,'balanced');
});
test('presets use one audio source and three filters, with gain headroom and a flat reset',async()=>{
  const h=harness();assert.equal(await h.eq.select('bass'),true);
  const c=h.contexts[0];assert.deepEqual(c.filters.map(f=>f.type),['lowshelf','peaking','highshelf']);
  assert.deepEqual(c.filters.map(f=>f.gain.value),[4,0,-1]);assert.ok(c.output.gain.value<1);
  assert.equal(c.source.targets[0],c.filters[0]);assert.equal(c.output.targets[0],c.destination);
  await h.eq.select('vocal');assert.equal(h.contexts.length,1);assert.deepEqual(c.filters.map(f=>f.gain.value),[-2,3,1]);
  await h.eq.select('balanced');assert.deepEqual(c.filters.map(f=>f.gain.value),[0,0,0]);assert.equal(c.output.gain.value,1);
});
test('custom gains are bounded, copied in state and restored without early context creation',async()=>{
  const h=harness({saved:{preset:'custom',bands:{bass:99,mid:-99,treble:2}}});
  assert.equal(h.contexts.length,0);assert.equal(h.eq.getState().bands.bass,6);assert.equal(h.eq.getState().bands.mid,-6);
  await h.eq.setBand('treble',3);assert.equal(h.contexts[0].filters[2].gain.value,3);
  const state=h.eq.getState();state.bands.treble=99;assert.equal(h.eq.getState().bands.treble,3);
  assert.equal(await h.eq.setBand('unknown',1),false);assert.equal(await h.eq.setBand('bass',NaN),false);
});
test('unsupported or denied Web Audio leaves the original audio unclaimed',async()=>{
  const absent=harness({unsupported:true});assert.equal(absent.eq.getState().supported,false);assert.equal(await absent.eq.select('bass'),false);assert.equal(absent.nodes.length,0);
  const failed=harness({fail:true});assert.equal(await failed.eq.select('bass'),false);assert.equal(failed.contexts[0].source,undefined);assert.equal(failed.contexts[0].closed,true);assert.ok(failed.eq.getState().notice);
});
