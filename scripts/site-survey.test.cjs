const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
function harness(value=''){
 const events={},status={},retry={addEventListener(){}},message={value,setAttribute(){},dispatchEvent(){this.changed=true;},focus(){this.focused=true;}},window={top:{},CeyhaniCookies:{allows:()=>false}};
 const section={querySelector:s=>s==='[role="status"]'?status:retry};
 const document={querySelector:s=>s==='#ziyaretci-defteri'?section:s==='#hcb_form_content'?message:null,addEventListener:(n,f)=>events[n]=f,head:{appendChild(){throw Error('No external script should load before consent');}}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'guestbook.js'),'utf8'),{document,window,Event:class{}});return {window,events,message,status};
}
test('survey draft prefills only an empty guestbook, never publishes and consumes its in-memory handoff',()=>{const h=harness();h.window.top.CeyhaniSurveyDraft='Âşık Ceyhani — Site değerlendirmesi\nGenel puan: 5 / 5';h.events['ceyhani-survey-draft']();assert.match(h.message.value,/5 \/ 5/);assert.ok(h.message.changed&&h.message.focused);assert.equal(h.window.top.CeyhaniSurveyDraft,undefined);assert.match(h.status.textContent,/Henüz yayımlanmadı/);});
test('existing visitor message is preserved and an unrelated handoff is ignored',()=>{const h=harness('Kendi hatıram');h.window.top.CeyhaniSurveyDraft='Âşık Ceyhani — Site değerlendirmesi';h.window.hcb_user.onload();assert.equal(h.message.value,'Kendi hatıram');assert.ok(h.window.top.CeyhaniSurveyDraft);h.message.value='';h.window.top.CeyhaniSurveyDraft='İlgisiz metin';h.events['ceyhani-survey-draft']();assert.equal(h.message.value,'');});
test('all site pages expose the survey with the same controller and stylesheet',()=>{for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){const html=fs.readFileSync(path.join(root,f),'utf8');assert.equal((html.match(/data-site-survey/g)||[]).length,1,f);assert.match(html,/site-survey\.js\?v=1/,f);assert.match(html,/site-survey\.css\?v=1/,f);}});

