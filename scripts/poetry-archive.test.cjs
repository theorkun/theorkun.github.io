const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),script=fs.readFileSync(path.join(root,'poetry.js'),'utf8'),cards=vm.runInNewContext('('+script.match(/const cards = (\[[\s\S]*?\n  \]);/)[1]+')'),archive=JSON.parse(fs.readFileSync(path.join(root,'assets/poetry-discovery.json'),'utf8'));
test('all 75 poems have matching search metadata while existing links remain stable',()=>{
 assert.equal(cards.length,75);assert.equal(archive.poems.length,75);cards.forEach((card,i)=>{assert.equal(archive.poems[i].title,card.title);assert.equal(archive.poems[i].poemNo,i+1);assert.ok(card.poem.trim()&&card.preview.trim());});
 assert.equal(cards[35].title,'GÜN');assert.equal(cards.filter(c=>c.title==='GÜN').length,1);assert.equal(cards[36].title,'Yüzüm Gülmedi');assert.equal(archive.poems[36].bookPage,10);
 archive.daily.forEach(item=>assert.equal(cards[item.poemNo-1].title,item.title));
});
test('supplied verse wording, incomplete line and one retained version are preserved',()=>{
 const first=cards[42];assert.equal(first.title,'Selam verdim almıyorsun');assert.match(first.poem,/Burnunmu büyüdü senin/);assert.ok(first.poem.endsWith('19.08.2024'));
 const bos=cards.find(c=>c.title==='BOŞ BANA');assert.ok(bos.poem.endsWith('Sevdiceğim olsun orda eş\n\n30.04.2024'));
 const retained=cards.filter(c=>c.title.startsWith('GELİR SANA DOĞRU'));assert.equal(retained.length,1);assert.equal(retained[0].title,'GELİR SANA DOĞRU');assert.ok(retained[0].poem.endsWith('16.01.2021'));assert.ok(!cards.some(c=>c.poem.endsWith('27.11.2020')));
 const nature=archive.poems.find(c=>c.title==='Demirkazığın');assert.equal(nature.theme,'Doğa');assert.ok(cards[nature.poemNo-1].poem.endsWith('14.05.2014'));
 const doctor=cards.at(-1);assert.equal(doctor.title,'DOKTOR BEY');assert.doesNotMatch(doctor.poem,/\d{1,2}[.-]\d{1,2}[.-]\d{4}/);
});
test('new poems also exist in HTML fallback and the nature filter is available',()=>{
 const html=fs.readFileSync(path.join(root,'siirler.html'),'utf8');assert.match(html,/<option>Doğa<\/option>/);assert.match(html,/poetry.js\?v=archive-75/);
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');for(const card of cards.slice(42))assert.ok(html.includes(`data-title="${escape(card.title)}"`),card.title);
});
