(() => {
  const trigger = document.querySelector('[data-site-survey]');
  if (!trigger) return;
  const dialog = document.createElement('dialog');
  dialog.id = 'site-survey';
  dialog.className = 'survey-dialog';
  dialog.setAttribute('aria-labelledby', 'survey-title');
  dialog.innerHTML = `<header class="survey-heading"><div><p class="survey-eyebrow">GÖRÜŞLERİNİZ BİZİM İÇİN DEĞERLİ</p><h2 id="survey-title">Siteyi değerlendir</h2></div><button type="button" class="survey-close" aria-label="Anketi kapat">×</button></header>
    <p class="survey-intro">Bu hatıra arşivini birlikte güzelleştirelim. Yaklaşık bir dakikanızı alır.</p>
    <form novalidate>
      <fieldset><legend>Siteyi genel olarak nasıl buldunuz? <span>(zorunlu)</span></legend><div class="survey-rating">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="rating" value="${n}"><span><b aria-hidden="true">★</b>${n}</span><span class="survey-sr"> / 5 puan</span></label>`).join('')}</div><p class="survey-hint">1: Geliştirilmeli · 5: Çok beğendim</p></fieldset>
      <label class="survey-label" for="survey-favorite">En çok hangi bölümü beğendiniz? <span>(zorunlu)</span></label>
      <select id="survey-favorite" name="favorite"><option value="">Bir bölüm seçin</option>${['Ana sayfa','Hayatı','Videolar','Türküler','Şiirleri','Dijital kitaplık','Fotoğrafları','Kültürel kimlik','Hepsi'].map(v=>`<option>${v}</option>`).join('')}</select>
      <fieldset><legend>Siteyi kullanırken sorun yaşadınız mı? <span>(zorunlu)</span></legend><div class="survey-issues"><label><input type="radio" name="issues" value="Hayır"> Hayır, rahatça kullandım</label><label><input type="radio" name="issues" value="Evet"> Evet, bir sorun yaşadım</label></div></fieldset>
      <label class="survey-label" for="survey-note">Öneriniz veya yaşadığınız sorun <span>(isteğe bağlı)</span></label><textarea id="survey-note" name="note" rows="3" maxlength="700" placeholder="Düşüncelerinizi buraya yazabilirsiniz…"></textarea>
      <p class="survey-privacy">İsim veya e-posta sorulmaz. Paylaştığınız yanıtlar ziyaretçi defterinde herkese açık görünür. Lütfen özel bilgilerinizi yazmayın.</p>
      <p class="survey-error" role="alert" hidden></p><button class="survey-primary" type="submit">Yanıtları hazırla <span aria-hidden="true">→</span></button>
    </form>
    <section class="survey-delivery" hidden aria-labelledby="survey-delivery-title"><h3 id="survey-delivery-title" tabindex="-1">Yanıtlarınız hazır</h3><p>Henüz yayımlanmadı. Yanıtlarınızı ziyaretçi defterine aktarın; oradaki “Mesajı gönder” düğmesine bastığınızda herkese açık paylaşılır.</p><pre class="survey-preview" tabindex="0" aria-label="Paylaşılacak yanıtlar"></pre><button type="button" class="survey-primary survey-copy">Yanıtları kopyala</button><p class="survey-copy-status" role="status"></p><a class="survey-guestbook" href="ceyhaniye-yaz.html#ziyaretci-defteri">Ziyaretçi defterine git →</a><button type="button" class="survey-edit">Yanıtları düzenle</button><p class="survey-privacy">Defter için çerez tercihlerindeki Ziyaretçi defteri izni gerekir. Yanıtlar otomatik doldurulmazsa kopyaladığınız metni mesaj alanına yapıştırabilirsiniz. Mesajlar HTML Comment Box hizmetinde saklanır; hizmetin yayın kuralları geçerlidir.</p></section>
    <p class="survey-thanks">Görüşleriniz, Âşık Ceyhani’nin hatırasını yaşatmamıza katkı sağlıyor.</p>`;
  document.body.appendChild(dialog);
  const form = dialog.querySelector('form');
  const error = dialog.querySelector('.survey-error');
  const delivery = dialog.querySelector('.survey-delivery');
  trigger.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.survey-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger.focus({preventScroll:true}));
  document.addEventListener('ceyhani-page-change', () => { if (dialog.open) dialog.close(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const missing = [!data.get('rating') && ['Lütfen siteye 1 ile 5 arasında bir puan verin.', '[name="rating"]'], !data.get('favorite') && ['Lütfen en beğendiğiniz bölümü seçin.', '#survey-favorite'], !data.get('issues') && ['Lütfen sorun yaşayıp yaşamadığınızı belirtin.', '[name="issues"]']].filter(Boolean);
    error.hidden = !missing.length;
    if (missing.length) { error.textContent = missing.map(item => item[0]).join(' ');form.querySelector(missing[0][1]).focus();return; }
    const body = `Âşık Ceyhani — Site değerlendirmesi\n\nGenel puan: ${data.get('rating')} / 5\nEn beğenilen bölüm: ${data.get('favorite')}\nSorun yaşandı mı: ${data.get('issues')}\nÖneri / sorun: ${String(data.get('note') || '').trim() || 'Belirtilmedi'}`;
    dialog.querySelector('.survey-preview').textContent=body;
    form.hidden=true;delivery.hidden=false;dialog.querySelector('#survey-delivery-title').focus();
  });
  dialog.querySelector('.survey-copy').addEventListener('click', async () => {
    const note = dialog.querySelector('.survey-copy-status');
    try { await navigator.clipboard.writeText(dialog.querySelector('.survey-preview').textContent);note.textContent='Yanıtlar kopyalandı. Ziyaretçi defterine geçebilirsiniz.'; }
    catch (_) { const range=document.createRange();range.selectNodeContents(dialog.querySelector('.survey-preview'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);note.textContent='Otomatik kopyalanamadı. Seçili metni Kopyala komutuyla kopyalayıp deftere yapıştırabilirsiniz.'; }
  });
  dialog.querySelector('.survey-guestbook').addEventListener('click', () => {
    try { window.top.CeyhaniSurveyDraft=dialog.querySelector('.survey-preview').textContent;document.dispatchEvent(new Event('ceyhani-survey-draft')); } catch (_) {}
    dialog.close();
  });
  dialog.querySelector('.survey-edit').addEventListener('click', () => {delivery.hidden=true;form.hidden=false;form.querySelector('input:checked').focus();});
})();

