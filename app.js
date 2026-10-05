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
