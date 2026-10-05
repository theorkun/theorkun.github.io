const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));
const poetrySection = document.querySelector('#siirleri');
if (poetrySection) {
  const existingLayout = poetrySection.querySelector('.poem-layout');
  const societalPoems = poetrySection.querySelectorAll('.societal-poem, .poem-layout, .manuscript');
  societalPoems.forEach(poem => poem.remove());
  const cards = [
    {
      title: 'YANARIM',
      author: 'Aşık Ceyhani',
      preview: 'Elindedir fermanım',
      poem: `Elindedir fermanım
Kız kalmadı dermanım
Yar aşkınla tutuştum
İçin için yanarım

Mecnun oldum aşkından
Gözlerinden kaşından
Bakışların gitmiyor
Hayalimden düşümden

Sevdan gitmiyor baştan
Vurdun kız beni döşten
Bir deri kemik kaldım
Kesildim ekmek aştan

Yardım eyle yaradan
Ölürüm bu yaradan
Kız sevdayın yüzünden
Gideceğim buradan

Vaz geçmez bu Ceyhani
Sözüne oldum gani
Düşündüm bulamadım
Niye sevmezsin beni

Yüreğime koydun gam
Evlerinin önü çam
Yar seni sevdim diye
Düşman oldu Sarıçam

30-10-2025`
    },
    {
      title: 'SEVSİN SENİ',
      author: 'Aşık Ceyhani',
      preview: 'Kız peşinden koşa koşa',
      poem: `Kız peşinden koşa koşa
Yoruldum güzel yoruldum
Kalbimi çevirdin taşa
Yoruldum güzel yoruldum

Sevdanla geçirdim dünü
Hemi dünü hem bu günü
Cilvenden usandım yıldım
Kim severse sevsin seni

Deli divane edenim
Aklım gitti sen nedenim
Hemi gönlüm hem bedenim
Yoruldum güzel yoruldum

İlk aşkımsın bil sen bunu
Hep çektin yar zora beni
Nazından yıldı Ceyhani
Kim severse sevsin seni

13-01-2024`
    },
    {
      title: 'ÇEKERİM',
      author: 'Aşık Ceyhani',
      preview: 'Çaresiz bir derde düştüm çekerim',
      poem: `Çaresiz bir derde düştüm çekerim
Yıllar koydum geçmez yılın üstüne
Belki gelin diye hergün bakarım
Oturdum beklerim yolun üstüne

Yıllar geçti sönmez içimdeki kor
Kör olsun kaderin iki gözü kör
Bülbülüm kondurmaz dalına o yar
Kondurmuş kargayı gülün üstüne

Aşık olan yarin aşkıyla yanmış
Kimi Kerem ile Aslı’ya dönmüş
Nasıl bulmuş ise gelipte konmuş
Bir yaban arısı balın üstüne

Sevdiğim sarartıp beni soldurma
Çektirdiğin yeter candan yıldırma
Ceyhaniyi ömür boyu kaldırma
Uzatta yatayım kolun üstüne

09.10.2025`
    },
    {
      title: 'SOLDURDUN BENİ',
      author: 'Aşık Ceyhani',
      preview: 'Güzel gözlerine tutulu kaldım',
      poem: `Güzel gözlerine tutulu kaldım
Aşkınla söyledip çaldırdın beni
Son baharda düşen yaprak misali
Yel vurmuş gül gibi soldurdun beni

Hiç umrunda değil derde saldığın
Olmadı yarama merhem çaldığın
İçinde sevdanla senin olduğun
Kaynayan kazana daldırdın beni

Don vurdu kurudu gülüm kalmadı
Peşinde koşmaktan halim kalmadı
Bana etmediği zulüm kalmadı
Canımdan bezdirip yıldırdın beni

Razıyım sevdiğim kölen olmaya
Kölen olup hep yanında kalmaya
Azrail gelmesin  canım almaya
Der Ceyhani zaten öldürdün beni

30.09.2025`
    },
    {
      title: 'KÖYLÜ GÜZELİ',
      author: 'Aşık Ceyhani',
      preview: 'Göksu kenarında gördüm bir suna',
      poem: `Göksu kenarında gördüm bir suna
Sordum fekeliymiş köylü güzeli
Işıldıyor yüzü dönmüştür güne
Sordum fekeliymiş köylü güzeli.

Başında eşalpı yakışmış yüze
Tarifin sığmıyor saz ile söze
Serdi yüreğimi kor olmuş köze
Sordum fekeliymiş köylü güzeli.

Yeni doğmuş aya benziyor kaşı
Erciyes tepesi gibidir döşü
Mest eyledi beni bakıp gülüşü
Sordum fekeliymiş köylü güzeli.

Güzelliğin baki sende silinmez
Hurimi perimi neysin bilinmez
Ceyhani böylesi burda bulunmaz
Sordum fekeliymiş köylü güzeli.

Aşık Ceyhani
28.09.2025`
    },
    {
      title: 'YÜZÜM GÜLMÜYOR',
      author: 'Aşık Ceyhani',
      preview: 'Vicdansıza gönül verme',
      poem: `Vicdansıza gönül verme
Hiç kadri kıymet bilmiyor
Sır verip önüne serme
Derdine derman olmuyor

Türlü dert verir özüne
Yaşlar indirir gözüne
Kulak vermez bir sözüne
Tatlı kelamdan almıyor

Ceyhani aktım çağladım
Aşkıyla gönül dağladım
Doğarken bile ağladım
Yaşarken yüzüm gülmüyor

27.09.2025`
    },
    {
      title: 'OLDUM',
      author: 'Aşık Ceyhani',
      preview: 'Kayboldu gözümün feri',
      poem: `Kayboldu gözümün feri
Yakını göremez oldum
Elimi tutmadan biri
Evime giremez oldum

Ararım eski halimi
Kaldıramıyom kolumu
Yıkarım ama elimi
Yüzüme süremez oldum

Ruhum bedenim yoruldu
Gönlüm feleğe darıldı
Düştümde belim kırıldı
Ayakta duramaz oldum

Ceyhani çoğaldı acım
Yıkıldı tahtımla tacım
Kendime yetmiyor gücüm
Bir işe yaramaz oldum

20.09.2025`
    },
    {
      title: 'GÜN',
      author: 'Aşık Ceyhani',
      preview: 'Nasıl devirdeyiz tarif edeyim',
      poem: `Nasıl devirdeyiz tarif edeyim
Tosunla düvenin gırıştığı gün
Borcu olan demez borcum ödeyim
Alacaklı borçlu darıştığı gün.

Yalan dolan ile çürüdü özler
Nefis esir almış görmüyor gözler
Birbirine girmiş seçilmez izler
At ile it izi garıştığı gün

Gün güne çoğalır gözde çapaklar
Kapattı gözleri şişti kapaklar
Birbirine düşman olan köpekler
Kemikler başında barıştığı gün.

Hırsız çekilmiyor gayrı hesaba
Hakem taraflıdır  bozuk müsaba
Kurban alkış tutar olmuş kasaba
Bıçağın iliğe eriştiği gün.

İşte  Ceyhaniyi  bunlardır üzen
Nedense hep haklı,  mazlumu ezen.
Nerede adalet, nerede düzen
Tosbayla tavşanın yarıştığı gün

13.09.2021`
    },
    {
      title: 'Yüzüm Gülmedi',
      author: 'Aşık Ceyhani',
      preview: 'Anamdan doğdum doğalı',
      poem: 'Anamdan doğdum doğalı\nYüzüm gülmedi gülmedi.\nKendi kendimi bileli\nYüzüm gülmedi gülmedi.\n\nYol vermiyor sıra dağlar\nArasında sular çağlar.\nHer gün iki gözüm ağlar\nYüzüm gülmedi gülmedi.\n\nDüşmanlarım yolumu bekler\nDert üstüne dertler ekler.\nSaçlarıma düştü aklar\nYüzüm gülmedi gülmedi.\n\nDurmuş Ali gerçek adım\nCeyhani’yi sonra koydum.\nO yar gitmiş elden duydum\nYüzüm gülmedi gülmedi.'
    },
    {
      title: 'Cumadan Cumaya',
      author: 'Aşık Ceyhani',
      preview: 'Cumadan cumaya mesaj at yeter',
      poem: 'Her türlü günahtan arınmak için\nCumadan cumaya mesaj at yeter\nKötüysende iyi görünmek için\nCumadan cumaya mesaj at yeter\n\nAdaletsiz olup olsanda fena\nKıymışsan hayvana ve insana\nCehennem kapısı kapanır sana\nCumadan cumaya mesaj at yeter\n\nHiç korkma faizi alıp yediysen\nBeytül maldan gizli çalıp yediysen\nMazlumun hakkını bilip yediysen\nCumadan cumaya mesaj at yeter\n\nCeyhani hak yolu bulup yürü\nGünahlardan sakın, gönlünü temiz tut\nCumadan cumaya mesaj at yeter.'
    },
    {
      title: 'Yel Yel',
      author: 'Aşık Ceyhani',
      preview: 'Yel yel savrulup dolaşıyor',
      poem: 'Yel yel savrulup dolaşıyor,\nDertlerim dağları aşıyor.\nAşkın ateşi yüreğimde,\nCeyhani yine hasret çeker.\n\nGönül bağımı yola saldım,\nYar için her gece ağladım.\nKırık bir sığla dağladım,\nCeyhani yine hasret çeker.'
    },
    {
      title: 'Olur',
      author: 'Aşık Ceyhani',
      preview: 'Ahlâğın bittiği yerde',
      poem: 'Ahlâğın bittiği yerde,\nHalkın kalbi ağrıyor.\nHakkı koru, sevgiye bak,\nCeyhani, gönlü temiz tut.\n\nZulme diren kapını örtme,\nKötülükten yana dönme.\nYolu doğruya dönüştürme,\nCeyhani, gönlü temiz tut.'
    },
    {
      title: 'YAŞ ATMIŞA DAYANINCA',
      author: 'Aşık Ceyhani',
      preview: 'Yaş atmışa dayanınca',
      poem: 'Yaş atmışa dayanınca\nKırışıklar belli olur\nSaç beyaza boyanınca\nÇoğu gider kelli olur\n\nGeçmiştir o gençlik çağı\nKar borandır gönül dağı\nYürümekte zorlanırsın\nÇözülür dizinin bağı\n\nZor görürsün kendi işin\nDüşer biter ana dişin\nTutamaz olur kaşığın\nGayrı titrek elli olur\n\nYıldan yıla kısar boyun\nAzalır hislerle duyun\nDurduramaz akar suyun\nAğzı burnu selli olur\n\nCeyhani kalkaman şaha\nSona az kaldı bak aha\nVarısa günlarin daha\nGeçmesi çok yelli olur\n\n22-09-2025'
    },
    {
      title: 'Olmuşum Ben',
      author: 'Aşık Ceyhani',
      preview: 'Bu sevdayla sinem yandı',
      poem: 'Bu sevdayla sinem yandı tutuşuyor,\nKerem misaliyim kül olmuşum ben.\nAhu zarımla tüm semayı tutuyor,\nDeli poyraz gibi yel olmuşum ben.\n\nHemi içerimde hemi bedende,\nBir zalimdir beni böyle edende.\nGözüm yaşı deryalara gidende,\nDereler coşturan sel olmuşum ben.\n\nSanki deprem vurdu her yanımı,\nAklım gelir gider kendinden geçik.\nKimi abdal diyor, kimi kaşık,\nEllerin gözünde del olmuşum ben.\n\nRazıyım sözüne, razıyım yar ben,\nCeyhani boynuma dolasan uran.\nİster adak gibi istersen kurban,\nKes boynumu sana, kul olmuşum ben.'
    }
  ];

  const existingGrid = poetrySection.querySelector('.poem-grid');
  const grid = document.createElement('div');
  grid.className = 'poem-grid';
  cards.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'poem-card';
    if (item.title === 'Yüzüm Gülmedi') button.classList.add('poem-card--manuscript');
    button.dataset.title = item.title;
    button.dataset.author = item.author;
    button.dataset.poem = item.poem;
    button.dataset.manuscript = item.title === 'Yüzüm Gülmedi' ? 'assets/siir.jpg' : '';
    button.innerHTML = `<span class="poem-card__tag">${item.author}</span><svg class="poem-card__saz" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M32 5 17 29m4 2L36 7M17 27c-5-2-10 1-11 6-1 5 4 10 9 9 6-1 8-6 5-11m-5 1 7 7m-9-9 4 4m13-22 5 5m-8-2 5 5M8 35l5 5"/></svg><strong>${item.title}</strong><p>${item.preview}</p>`;
    if (item.title === 'Yüzüm Gülmedi') {
      const manuscriptImage = document.createElement('img');
      manuscriptImage.className = 'poem-card__manuscript';
      manuscriptImage.src = 'assets/siir.jpg';
      manuscriptImage.alt = 'Yüzüm Gülmedi şiirinin el yazısı aslı';
      button.appendChild(manuscriptImage);
    }
    grid.appendChild(button);
  });

  if (existingGrid) {
    existingGrid.replaceWith(grid);
  } else if (existingLayout) {
    existingLayout.replaceWith(grid);
  } else {
    poetrySection.appendChild(grid);
  }

  if (poetrySection.querySelector('.societal-poem, .poem-layout, .manuscript')) {
    poetrySection.querySelectorAll('.societal-poem, .poem-layout, .manuscript').forEach(poem => poem.remove());
  }
}
const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  const img = document.querySelector('#large-image');
  img.src = button.dataset.image;
  img.alt = button.dataset.alt;
  document.querySelector('#image-caption').textContent = button.dataset.alt;
  lightbox.showModal();
}));
document.querySelector('#close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  const rect = lightbox.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close();
});
const poemDialog = document.querySelector('#poem-dialog');
const poemTitle = document.querySelector('#poem-title');
const poemAuthor = document.querySelector('#poem-author');
const poemContent = document.querySelector('#poem-content');
const poemManuscript = document.querySelector('#poem-manuscript');
const poemClose = document.querySelector('#poem-close');
if (poemDialog && poemClose) {
  document.querySelectorAll('.poem-card').forEach(card => card.addEventListener('click', () => {
    poemTitle.textContent = card.dataset.title;
    poemAuthor.textContent = card.dataset.author;
    poemContent.innerHTML = card.dataset.poem.split('\n\n').map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join('');
    poemManuscript.hidden = !card.dataset.manuscript;
    poemDialog.classList.toggle('poem-dialog--manuscript', Boolean(card.dataset.manuscript));
    poemDialog.showModal();
  }));
  poemClose.addEventListener('click', () => poemDialog.close());
  poemDialog.addEventListener('click', event => {
    const rect = poemDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) poemDialog.close();
  });
}
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    nav.querySelectorAll('a').forEach(link => {
      const active = link.getAttribute('href') === '#' + entry.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
