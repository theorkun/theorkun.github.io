const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'assets/youtube-videos.json'),'utf8'));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const playIcon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false"><path d="M9 5.5 18.5 12 9 18.5z" fill="currentColor" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
function card(video,index){
 if(video.category==='documentary'){
  const cover=video.cover;
  if(!cover||!/^assets\/yoruk-obalari-(?:960|1920|4k)\.jpg$/.test(cover.source)||!fs.existsSync(path.join(root,cover.source)))throw Error('Documentary cover missing');
  const sources=(cover.sources||[]).map(item=>{if(!/^assets\/yoruk-obalari-(?:960|1920|4k)\.jpg$/.test(item.source)||!fs.existsSync(path.join(root,item.source))||!Number.isSafeInteger(item.width))throw Error('Invalid documentary source');return esc(item.source)+' '+item.width+'w';}).join(', ');
  const responsive=sources?` srcset="${sources}" sizes="(max-width:760px) calc(100vw - 40px), (max-width:1200px) calc(100vw - 110px), 1100px"`:'';
  return `<button class="channel-video-card documentary-card" type="button" data-video-id="${video.id}" data-video-title="${esc(video.title)}" data-video-start="0" aria-label="Yörük Obalarımız belgesel kaydını oynat" aria-pressed="false"><span class="documentary-poster" aria-hidden="true"><img src="${cover.source}"${responsive} alt="" width="${cover.width}" height="${cover.height}" loading="lazy" decoding="async"><span class="documentary-play">${playIcon}</span></span><span class="documentary-caption"><span class="documentary-caption-copy"><small>BELGESEL NİTELİĞİNDE ARŞİV KAYDI · ${esc(video.duration)}</small><strong>Yörük Obalarımız — Çukurova Âşıklarımız</strong></span><span class="documentary-watch">Belgeseli izle <span aria-hidden="true">↗</span></span></span></button>`;
 }
 const seed=Array.from(video.id).reduce((sum,c)=>sum+c.charCodeAt(0),0);
 const cover=video.id==='SrtNM1QpjCk'?catalogue.coverPhotos.find(p=>p.source==='assets/ceyhani-album-netlestirilmis.jpg'):catalogue.coverPhotos[index%catalogue.coverPhotos.length];
 if(!cover||!/^assets\/(?:photos\/[a-z-]+\.jpg|ceyhani-album-netlestirilmis\.jpg)$/.test(cover.source)||!fs.existsSync(path.join(root,cover.source)))throw Error('Invalid cover photo');
 const title=video.id==='fzIIszXMnaw'?'Yörük Obalarımız · Çukurova Âşıklarımız':video.title.replace(/^a[şs][ıiİI]k\s+ceyhan[ıiİI]\s*[-–—:]*\s*/iu,'').trim();
 const start=Number.isSafeInteger(video.startSeconds)?` data-video-start="${video.startSeconds}"`:'';
 return `<button class="channel-video-card" type="button" data-video-id="${video.id}" data-video-title="${esc(video.title)}"${start} aria-label="${esc(video.title)} videosunu oynat" aria-pressed="false"><span class="channel-video-thumbnail video-cover video-cover-tone-${seed%4}${title.length>35?' video-cover-long':''}" aria-hidden="true"><img src="${cover.source}" alt="" loading="lazy" decoding="async" width="${cover.width}" height="${cover.height}" style="object-position:${esc(cover.position)}"><span class="video-cover-edition">${String(index+1).padStart(2,'0')} · SES VE GÖRÜNTÜ ARŞİVİ</span><span class="video-cover-copy"><span class="video-cover-artist">AŞIK CEYHANİ</span><strong class="video-cover-heading">${esc(title)}</strong><span class="video-cover-rule"></span></span><span class="channel-video-play">${playIcon}</span>${video.duration?`<span class="channel-video-duration">${esc(video.duration)}</span>`:''}</span><span class="channel-video-title">${esc(video.title)}</span></button>`;
}
const regular=catalogue.videos.filter(v=>v.category!=='documentary');
const documentaries=catalogue.videos.filter(v=>v.category==='documentary');
const cards=regular.map(video=>card(video,catalogue.videos.indexOf(video))).join('');
const file=path.join(root,'videolar.html');let html=fs.readFileSync(file,'utf8');
const grid=/(<div id="channel-video-grid" class="channel-video-grid">)[\s\S]*?(<\/div><p id="channel-no-results")/;
if(!grid.test(html))throw Error('Video grid not found');
html=html.replace(grid,(_,open,close)=>open+cards+close);
html=html.replace(/<section id="channel-documentary"[\s\S]*?<\/section>\s*<div id="channel-archive-heading"[\s\S]*?<\/div>\s*/,'');
const feature=`<section id="channel-documentary" class="channel-documentary" aria-labelledby="documentary-heading"><div class="documentary-section-heading"><div><p class="documentary-eyebrow">KÜLTÜRÜN VE HATIRALARIN İZİNDE</p><h2 id="documentary-heading">Belgesel &amp; Kültür Arşivi</h2></div><p>${esc(documentaries[0]?.description||'')}</p></div><div id="channel-documentary-grid">${documentaries.map(video=>card(video,catalogue.videos.indexOf(video))).join('')}</div></section><div id="channel-archive-heading" class="channel-archive-heading"><h2>Türküler ve Sahne Kayıtları</h2><p>${regular.length} video</p></div>\n`;
html=html.replace('<div id="channel-video-grid" class="channel-video-grid">',feature+'<div id="channel-video-grid" class="channel-video-grid">');
html=html.replace('aria-controls="channel-video-grid"','aria-controls="channel-documentary channel-video-grid"');
html=html.replace(/videos\.js\?v=[a-z0-9-]+/g,'videos.js?v=documentary-1');
if(!html.includes('href="video-covers.css'))html=html.replace('<link rel="stylesheet" href="video-player.css?v=1">','<link rel="stylesheet" href="video-player.css?v=1"><link rel="stylesheet" href="video-covers.css?v=1">');
html=html.replace(/video-covers\.css\?v=[a-z0-9-]+/g,'video-covers.css?v=play-icons-1');
fs.writeFileSync(file,html);
console.log('Rendered '+catalogue.videos.length+' video covers');
