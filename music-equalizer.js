(() => {
  const presets = {balanced:[0,0,0],bass:[4,0,-1],vocal:[-2,3,1]};
  const bands = ['bass','mid','treble'];
  const clamp = value => Number.isFinite(value) ? Math.max(-6,Math.min(6,value)) : 0;
  window.createCeyhaniEqualizer = (audio, saved, changed) => {
    const Context = window.AudioContext || window.webkitAudioContext;
    let preset = Object.hasOwn(presets,saved?.preset) ? saved.preset : saved?.preset==='custom' ? 'custom' : 'balanced';
    let values = preset==='custom' ? bands.map(b=>clamp(saved?.bands?.[b])) : [...presets[preset]];
    let graph=null, building=null, notice='';
    const getState=()=>({preset,bands:Object.fromEntries(bands.map((b,i)=>[b,values[i]])),supported:!!Context,active:!!graph,notice});
    function apply(){
      if(!graph)return;
      values.forEach((v,i)=>graph.filters[i].gain.setTargetAtTime(v,graph.context.currentTime,.025));
      // Leave headroom when a band is boosted, rather than increasing peak volume.
      graph.output.gain.setTargetAtTime(Math.pow(10,-Math.max(0,...values)/20),graph.context.currentTime,.025);
    }
    async function ensureGraph(){
      if(!Context)return false;
      if(graph){
        try{await graph.context.resume();notice='';apply();changed();return true;}
        catch(_){notice='Ses ayarını etkinleştirmek için yeniden bir hazır ayara dokunun.';changed();return false;}
      }
      if(building)return building;
      building=(async()=>{
        let context,source;
        try{
          context=new Context();
          await context.resume();
          const filters=[['lowshelf',200],['peaking',1200],['highshelf',4000]].map(([type,hz])=>{
            const filter=context.createBiquadFilter();filter.type=type;filter.frequency.value=hz;filter.Q.value=.7;return filter;
          });
          const output=context.createGain();
          filters[0].connect(filters[1]);filters[1].connect(filters[2]);filters[2].connect(output);output.connect(context.destination);
          source=context.createMediaElementSource(audio);source.connect(filters[0]);
          graph={context,source,filters,output};notice='';apply();changed();return true;
        }catch(_){
          // If routing fails after the source was claimed, preserve dry playback.
          if(source){try{source.disconnect();source.connect(context.destination);}catch(_){} }
          else if(context){try{await context.close();}catch(_){} }
          notice='Ekolayzır uygulanamadı. Normal sesle dinlemeye devam edebilirsiniz.';changed();return false;
        }finally{building=null;}
      })();
      return building;
    }
    function select(name){
      if(!Context || (!Object.hasOwn(presets,name)&&name!=='custom'))return Promise.resolve(false);
      preset=name;if(name!=='custom')values=[...presets[name]];
      notice='';apply();changed();return ensureGraph();
    }
    function setBand(name,value){
      const i=bands.indexOf(name);if(!Context||i<0||!Number.isFinite(value))return Promise.resolve(false);
      preset='custom';values[i]=clamp(value);notice='';apply();changed();return ensureGraph();
    }
    return {getState,select,setBand,resume:()=>graph||preset!=='balanced'?ensureGraph():Promise.resolve(true)};
  };
})();
