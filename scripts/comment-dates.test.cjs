const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../comment-dates.js'),'utf8');
function date(text,attrs={}){return {textContent:text,attrs,childElementCount:0,getAttribute(k){return this.attrs[k]||null;},setAttribute(k,v){this.attrs[k]=v;},closest(){return null;}};}
function harness(dates){let changed;const events={},box={querySelectorAll:()=>dates};vm.runInNewContext(source,{document:{getElementById:()=>box},window:{addEventListener:(key,fn)=>events[key]=fn},MutationObserver:class{constructor(fn){changed=fn;}observe(){}disconnect(){}}});return {update:()=>changed(),events};}
test('relative comment dates are Turkish across all common units',()=>{
  const dates=['just now','1 minute ago','2 hours ago','3 days ago','4 weeks ago','5 months ago','6 years ago','an hour ago','yesterday'].map(s=>date(s));harness(dates);
  assert.deepEqual(dates.map(d=>d.textContent),['az önce','1 dakika önce','2 saat önce','3 gün önce','4 hafta önce','5 ay önce','6 yıl önce','1 saat önce','dün']);
});
test('English calendar dates keep printed time while actual ISO instants use Turkey time',()=>{
  const dates=[date('November 3, 2026'),date('Nov 3, 2026 at 12:30 PM'),date('English date',{datetime:'2026-11-03T12:30:00Z'}),date('English date',{datetime:'2026-11-03T12:30:00'})];harness(dates);
  assert.match(dates[0].textContent,/3 Kasım 2026/);assert.match(dates[1].textContent,/3 Kasım 2026.*12:30/);assert.match(dates[2].textContent,/3 Kasım 2026.*15:30/);assert.match(dates[3].textContent,/3 Kasım 2026.*12:30/);
});
test('already Turkish and ambiguous numeric dates stay intact; newly inserted dates are translated',()=>{
  const dates=[date('3 Kasım 2026'),date('02/03/2026')],h=harness(dates);h.update();assert.deepEqual(dates.map(d=>d.textContent),['3 Kasım 2026','02/03/2026']);
  dates.push(date('2 minutes ago',{title:'November 3, 2026'}));h.update();assert.equal(dates[2].textContent,'2 dakika önce');assert.equal(dates[2].attrs.title,'3 Kasım 2026');
});
