(() => {
  const normalize = text => text.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  function dateKey(date) {
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    const get = type => Number(parts.find(part => part.type === type).value);
    return Math.floor(Date.UTC(get('year'), get('month') - 1, get('day')) / 86400000);
  }
  fetch('assets/poetry-discovery.json').then(response => {
    if (!response.ok) throw new Error('Arşiv bilgisi yüklenemedi');
    return response.json();
  }).then(archive => {
    const section = document.querySelector('#siirleri');
    const cards = section ? [...section.querySelectorAll('.poem-card')] : [];
    cards.forEach((card, index) => {
      card.id = `siir-${index + 1}`;
      card.dataset.theme = archive.poems[index]?.theme || 'Diğer';
    });
    const search = document.querySelector('#poem-search');
    if (search) {
      const category = document.querySelector('#poem-category');
      const count = document.querySelector('#poem-result-count');
      const empty = document.querySelector('#poem-no-results');
      const reset = document.querySelector('#poem-search-reset');
      function filter() {
        const query = normalize(search.value);
        let visible = 0;
        cards.forEach(card => {
          const text = normalize(`${card.dataset.title} ${card.dataset.poem}`);
          const match = (!query || text.includes(query)) && (!category.value || card.dataset.theme === category.value);
          card.hidden = !match;
          if (match) visible++;
        });
        count.textContent = `${cards.length} şiirden ${visible} tanesi gösteriliyor.`;
        empty.hidden = visible !== 0;
        reset.disabled = !search.value && !category.value;
      }
      search.addEventListener('input', filter);
      category.addEventListener('change', filter);
      reset.addEventListener('click', () => { search.value = ''; category.value = ''; filter(); search.focus(); });
      filter();
      document.querySelector('#poem-discovery-controls').hidden = false;
    }
    const dialog = document.querySelector('#poem-dialog');
    if (dialog) {
      const manuscriptLink = document.createElement('a');
      manuscriptLink.className = 'discovery-manuscript-link';
      manuscriptLink.textContent = 'El yazısını kitapta gör →';
      manuscriptLink.hidden = true;
      dialog.querySelector('.poem-modal-body').appendChild(manuscriptLink);
      cards.forEach(card => card.addEventListener('click', () => {
        const item = archive.poems[Number(card.id.slice(5)) - 1];
        manuscriptLink.hidden = !item?.bookPage;
        if (item?.bookPage) manuscriptLink.href = `kitaplik.html#sayfa-${item.bookPage}`;
      }));
    }
    function openLinkedPoem() {
      const match = /^#siir-(\d+)$/.exec(location.hash);
      if (!match) return;
      const card = cards.find(item => item.id === `siir-${Number(match[1])}`);
      if (!card) return;
      if (search) { search.value = ''; document.querySelector('#poem-category').value = ''; search.dispatchEvent(new Event('input')); }
      card.scrollIntoView({ block: 'center' });
      card.click();
    }
    window.addEventListener('hashchange', openLinkedPoem);
    openLinkedPoem();
    const daily = document.querySelector('#daily-verse');
    if (daily && archive.daily.length) {
      let previousDay;
      function updateVerse() {
        const day = dateKey(new Date());
        if (day === previousDay) return;
        previousDay = day;
        const item = archive.daily[((day % archive.daily.length) + archive.daily.length) % archive.daily.length];
        daily.querySelector('blockquote').textContent = item.verse;
        daily.querySelector('cite').textContent = `Âşık Ceyhani · ${item.title}`;
        daily.querySelector('a').href = `siirler.html#siir-${item.poemNo}`;
        daily.hidden = false;
      }
      updateVerse();
      window.setInterval(updateVerse, 60000);
    }
  }).catch(() => {
    const status = document.querySelector('#poem-discovery-note');
    if (status) status.textContent = 'Arama yüklenemedi; aşağıdaki şiirlerin tamamını okuyabilirsiniz.';
  });
})();
