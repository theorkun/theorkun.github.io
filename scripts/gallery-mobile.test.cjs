const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
test('all 14 photographs have matching originals, full-frame layout and lazy loading',()=>{
 const html=fs.readFileSync(path.join(root,'fotograflar.html'),'utf8');
 const cards=[...html.matchAll(/<figure class="archive-card">[\s\S]*?<\/figure>/g)];assert.equal(cards.length,14);assert.match(html,/14 fotoğraf/);
 cards.forEach(([card])=>{const source=/data-image="([^"]+)"/.exec(card)[1];assert.ok(fs.existsSync(path.join(root,source)),source);assert.ok(card.includes(`src="${source}"`));assert.match(card,/loading="lazy"/);});
 const css=fs.readFileSync(path.join(root,'photo-gallery.css'),'utf8');assert.match(css,/object-fit:contain/);assert.match(css,/height:calc\(100% - 36px\)/);assert.doesNotMatch(css,/opacity:0[^}]*\.archive-card/);
});
test('scroll reveal colours visible photographs once and disconnects on navigation',()=>{
 const events={},observed=[],unobserved=[];let callback,disconnected=false;
 const cards=[0,1].map(()=>({revealed:false,classList:{add(name){assert.equal(name,'is-revealed');},contains(){return false;}}}));
 class Observer{constructor(fn,options){callback=fn;assert.equal(options.threshold,.15);}observe(card){observed.push(card);}unobserve(card){unobserved.push(card);}disconnect(){disconnected=true;}}
 const context={window:{IntersectionObserver:Observer,addEventListener:(name,fn)=>events[name]=fn},document:{querySelectorAll:()=>cards},IntersectionObserver:Observer};
 vm.runInNewContext(fs.readFileSync(path.join(root,'photo-gallery.js'),'utf8'),context);
 assert.equal(observed.length,2);callback([{target:cards[0],isIntersecting:false},{target:cards[1],isIntersecting:true}]);assert.deepEqual(unobserved,[cards[1]]);
 events.pagehide();assert.ok(disconnected);events.pageshow({persisted:true});assert.equal(observed.length,4);
 // Missing observer support never hides any photo or crashes the page.
 vm.runInNewContext(fs.readFileSync(path.join(root,'photo-gallery.js'),'utf8'),{window:{},document:{querySelectorAll:()=>cards}});
});
test('every page exposes Türküler on mobile; only relevant pages load poetry and YouTube code',()=>{
 for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){const html=fs.readFileSync(path.join(root,name),'utf8');
  assert.match(html,/<a class="mobile-turkuler" href="muzikler.html"/);assert.match(html,/href="muzikler.html">Türküler<\/a>/);
  assert.equal(html.includes('src="poetry.js?'),html.includes('id="siirleri"'),name);
  if(html.includes('src="poetry.js?'))assert.ok(html.indexOf('src="poetry.js?')<html.indexOf('src="app.js?'));
  assert.equal(html.includes('src="youtube-api.js?'),name==='videolar.html',name);
  assert.equal(html.includes('src="site-discovery.js?'),html.includes('id="siirleri"')||html.includes('id="daily-verse"'),name);
 }
 assert.ok(fs.statSync(path.join(root,'app.js')).size<5000);
 const css=fs.readFileSync(path.join(root,'reference.css'),'utf8');assert.match(css,/@media\(max-width:760px\)\{\s*body>header>\.mobile-turkuler\{display:inline-flex/);
});
