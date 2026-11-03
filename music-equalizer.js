(() => {
  const presets = {balanced:[0,0,0],bass:[4,0,-1],vocal:[-2,3,1]};
  const bands = ['bass','mid','treble'];
  const clamp = value => Number.isFinite(value) ? Math.max(-6,Math.min(6,value)) : 0;
  window.createCeyhaniEqualizer = (audio, saved, changed) => {
    const Context = window.AudioContext || window.webkitAudioContext;
    let preset = Object.hasOwn(presets,saved?.preset) ? saved.preset : saved?.preset==='custom' ? 'custom' : 'balanced';
    let values = preset==='custom' ? bands.map(b=>clamp(saved?.bands?.[b])) : [...presets[preset]];
    const echo={enabled:saved?.echo?.enabled===true,amount:Number.isFinite(saved?.echo?.amount)?Math.max(0,Math.min(100,saved.echo.amount)):25};
    let playing=false;
    let graph=null, building=null, notice='';
    const getState=()=>({preset,bands:Object.fromEntries(bands.map((b,i)=>[b,values[i]])),echo:{...echo},supported:!!Context,active:!!graph,notice});
    function apply(){
      if(!graph)return;
      values.forEach((v,i)=>graph.filters[i].gain.setTargetAtTime(v,graph.context.currentTime,.025));
      if(echo.enabled&&!graph.echo){
        const delay=graph.context.createDelay(1),tone=graph.context.createBiquadFilter(),wet=graph.context.createGain(),feedback=graph.context.createGain();
        delay.delayTime.value=.24;tone.type='lowpass';tone.frequency.value=3200;wet.gain.value=0;feedback.gain.value=0;
        graph.filters[2].connect(delay);delay.connect(tone);tone.connect(wet);wet.connect(graph.output);tone.connect(feedback);feedback.connect(delay);
        graph.echo={delay,tone,wet,feedback};
      }
      const wet=echo.enabled?echo.amount/100*.35:0;
      if(graph.echo){
        graph.echo.wet.gain.setTargetAtTime(playing?wet:0,graph.context.currentTime,.025);
        graph.echo.feedback.gain.setTargetAtTime(playing&&echo.enabled ? .28 : 0,graph.context.currentTime,.025);
      }
      // Leave headroom when a band is boosted, rather than increasing peak volume.
      graph.output.gain.setTargetAtTime(Math.pow(10,-Math.max(0,...values)/20)/(1+wet/(1-.28)),graph.context.currentTime,.025);
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
    function setEcho(enabled,amount=echo.amount){
      if(!Context||typeof enabled!=='boolean'||!Number.isFinite(amount))return Promise.resolve(false);
      echo.enabled=enabled;echo.amount=Math.max(0,Math.min(100,amount));notice='';apply();changed();
      return graph||enabled?ensureGraph():Promise.resolve(true);
    }
    return {getState,select,setBand,setEcho,setPlaying(value){playing=value===true;apply();},resume:()=>graph||preset!=='balanced'||echo.enabled?ensureGraph():Promise.resolve(true)};
  };
})();
