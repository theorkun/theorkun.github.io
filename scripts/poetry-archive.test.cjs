const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),script=fs.readFileSync(path.join(root,'poetry.js'),'utf8'),cards=vm.runInNewContext('('+script.match(/const cards = (\[[\s\S]*?\n  \]);/)[1]+')'),archive=JSON.parse(fs.readFileSync(path.join(root,'assets/poetry-discovery.json'),'utf8'));
test('all 69 poems have matching search metadata while existing links remain stable',()=>{
 assert.equal(cards.length,69);assert.equal(archive.poems.length,69);cards.forEach((card,i)=>{assert.equal(archive.poems[i].title,card.title);assert.ok(Number.isInteger(archive.poems[i].poemNo));assert.ok(card.poem.trim()&&card.preview.trim());});
 assert.equal(archive.poems.find(p=>p.title==='GÜN').poemNo,36);assert.equal(cards.filter(c=>c.title==='GÜN').length,1);assert.equal(archive.poems.find(p=>p.title==='Yüzüm Gülmedi').poemNo,37);assert.equal(archive.poems.find(p=>p.title==='Yüzüm Gülmedi').bookPage,10);
 assert.equal(new Set(archive.poems.map(p=>p.poemNo)).size,69);
 archive.daily.forEach(item=>assert.equal(archive.poems.find(p=>p.poemNo===item.poemNo).title,item.title));
});
test('supplied verse wording, incomplete line and one retained version are preserved',()=>{
 const first=cards.find(c=>c.title==='Selam verdim almıyorsun');assert.equal(first.title,'Selam verdim almıyorsun');assert.match(first.poem,/Burnunmu büyüdü senin/);assert.ok(first.poem.endsWith('19.08.2024'));
 const bos=cards.find(c=>c.title==='BOŞ BANA');assert.ok(bos.poem.endsWith('Sevdiceğim olsun orda eş\n\n30.04.2024'));
 const retained=cards.filter(c=>c.title.startsWith('GELİR SANA DOĞRU'));assert.equal(retained.length,1);assert.equal(retained[0].title,'GELİR SANA DOĞRU');assert.ok(retained[0].poem.endsWith('16.01.2021'));assert.ok(!cards.some(c=>c.poem.endsWith('27.11.2020')));
 const nature=archive.poems.find(c=>c.title==='Demirkazığın');assert.equal(nature.theme,'Doğa');assert.ok(cards.find(c=>c.title===nature.title).poem.endsWith('14.05.2014'));
 const doctor=cards.at(-1);assert.equal(doctor.title,'DOKTOR BEY');assert.doesNotMatch(doctor.poem,/\d{1,2}[.-]\d{1,2}[.-]\d{4}/);
});
test('all poems exist in HTML fallback without topic controls',()=>{
 const html=fs.readFileSync(path.join(root,'siirler.html'),'utf8');assert.doesNotMatch(html,/poem-category|Konu başlıkları/);assert.match(html,/poetry.js\?v=archive-69/);
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');for(const card of cards)assert.ok(html.includes(`data-title="${escape(card.title)}"`),card.title);
});

test('requested poems are absent from rendered pages and discovery data; their old IDs are not reassigned',()=>{
 const removed=['MİLLET','KİME NE FAYDASI OLDU','DEĞİL TABİ','KARAR ALDINIZ','DİYEMİ','BUNADA ŞÜKÜR'];
 for(const title of removed){assert.ok(!cards.some(c=>c.title.startsWith(title)));assert.ok(!archive.poems.some(c=>c.title.startsWith(title)));assert.ok(!archive.daily.some(c=>c.title.startsWith(title)));for(const page of ['index.html','siirler.html'])assert.ok(!fs.readFileSync(path.join(root,page),'utf8').includes(title));}
 for(const id of [4,5,6,12,20,22])assert.ok(!archive.poems.some(p=>p.poemNo===id));
 assert.ok(archive.archived.some(p=>p.poemNo===5));
 assert.ok(archive.archived.some(p=>p.poemNo===20));
 const discovery=fs.readFileSync(path.join(root,'site-discovery.js'),'utf8');assert.match(discovery,/archive\.poems\[index\]\?\.poemNo/);assert.match(discovery,/poem => poem.poemNo === Number/);
});
