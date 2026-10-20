(() => {
const poetrySection = document.querySelector('#siirleri');
if (poetrySection) {
  const existingLayout = poetrySection.querySelector('.poem-layout');
  const societalPoems = poetrySection.querySelectorAll('.societal-poem, .poem-layout, .manuscript');
  societalPoems.forEach(poem => poem.remove());
  const cards = [
    {
      "title": "YETMEZMİ BE",
      "author": "Aşık Ceyhani",
      "preview": "Şikayetim sana yarim",
      "poem": "Şikayetim sana yarim\nÇektirdiğin yetmezmi be\nGözlerimden sicim gibi\nDöktürdüğün yetmezmi be\n\nKaybettim gözden ferimi\nBilsen nolur değerimi\nAşkın ile ciğerimi\nYaktırdığın yetmezmi be\n\nCeyhaniye yapma oyun\nBu işte çok senin payın\nEllerin içinde boyun\nBüktürdüğün yetmezmi be\n\n12.07.2025"
    },
    {
      "title": "ŞEREFSİZ",
      "author": "Aşık Ceyhani",
      "preview": "Yalaka yağdanlık iki yüzlüdür",
      "poem": "Yalaka yağdanlık iki yüzlüdür\nDost görünür ama düşman şerefsiz\nBol palavra sıkar yalan sözlüdür\nKahpelikten olmaz pişman şerefsiz\n\nGüvenip dönersen sırtından vurur\nDostum bilirsinde arkadan ürür\nAtarsan kemiği havlamaz durur\nKemik ile olur şişman şerefsiz\n\nAraman bunlarda vijdan yoktur ki\nHer sözü hazmeder mide boktur ki\nÖyle fazladır öyle çoktur ki\nÇekmez günahını beş man şerefsiz\n\nCeyhani bunlara verilmez değer\nKula kulluk yapar boynunu eğer\nNe yürek bulunur nede var ciğer\nOlunmaz sizinle eşmen şerefsiz\n\n( eşmen ) arkadaş, yoldaş demektir.\n\n12.07.2025"
    },
    {
      "title": "SEVİYORUM",
      "author": "Aşık Ceyhani",
      "preview": "Selvi boylu ince belli",
      "poem": "Selvi boylu ince belli\nYar seni çok seviyorum\nİnanmıyorsan Allah’a\nSor seni çok seviyorum\n\nYoktur cihanda benzerin\nMelekler yoldaşın senin\nSol yüzünde iki benin\nVar seni çok seviyorum\n\nSevdan yapıştı canıma\nHasret kaldım cananıma\nHem dinim hem imanıma\nGör seni çok seviyorum\n\nDeme aşkın gereğine\nAtma beni ırağına\nCeyhaniyi yüreğine\nÖr seni çok seviyorum\n\n11.07.2025"
    },
    {
      "title": "DEĞİL TABİ",
      "author": "Aşık Ceyhani",
      "preview": "Barış diye tutturanlar",
      "poem": "Barış diye tutturanlar\nSinler sizden değil tabi\nPkk nın katlettiği\nBinler sizden değil tabi\n\nPusu kurup yaktıkları\nTürlü mermi sıktıkları\nMehmetçikten döktükleri\nKanlar sizden değil tabi\n\nŞehit yakını sancılı\nAğlar analı bacılı\nYaşadığı o acılı\nGünler sizden değil tabi\n\nDer Cayhani söyle neden\nDönmüyor toprağa giden\nBayrağa sarılı beden\nCanlar sizden değil tabi\n\n10.07.2025"
    },
    {
      "title": "BUNADA ŞÜKÜR  😀",
      "author": "Aşık Ceyhani",
      "preview": "Otuz yıl çalıştım belim büküldü",
      "poem": "Otuz yıl çalıştım belim büküldü\nHamdolsun halime bunda şükür\nYeni alamıyom pabuç söküldü\nHamdolsun halime bunada şükür.\n\nEmekli olmuştum bir heves ile\nGeçinmek dert oldu bitmiyor çile\nPazara giderim dolmuyor file\nHamdolsun halime bunada şükür.\n\nYalancıktan mutlu görünüyorum\nİnsan saymıyorlar yeriniyorum\nPadişahım için sürünüyorum\nHamdolsun halime bunada şükür\n\nBir dilim karpuzu beş kişi yerim\nSonunda yarabbi çok şükür derim\nArabaya binmem yaya giderim\nHamdolsun halime bunada şükür\n\nBU işe bir çözüm bulamıyorum\nBirileri gibi çalamıyorum\nMakarnayı bile alamıyorum\nHamdolsun halime bunada şükür.\n\nSarayımda vardır hanlar hamamlar\nCeyhani doymuyor doymaz yanyamlar\nZam yok maaşıma artıyor gamlar\nHamdolsun halime bunada şükür.\n\n03.07.2025"
    },
    {
      "title": "KİME NE FAYDASI OLDU ?",
      "author": "Aşık Ceyhani",
      "preview": "Uzun yıllar başımızda",
      "poem": "Uzun yıllar başımızda\nKime ne faydası oldu ?\nZehir oldu aşımızda\nKime ne faydası oldu ?\n\nDoymuyor saraya köşke\nAdaletli olsa keşke\nKendi yandaşından başka\nKime ne faydası oldu ?\n\nOrtaktı işin başında\nHocasıydı her işinde\nFetöcülerin dışında\nKime ne faydası oldu ?\n\nVarmı hukuk ve adalet\nHiç hoş değil, bu delalet\nÇıkarına eder alet\nKime ne faydası oldu ?\n\nYoksulluklar çoğalıyor\nSabır deyip oyalıyor\nEmekliler, kan ağlıyor\nKime ne faydası oldu ?\n\nCeyhaniyim budur halin\nBelli değil sağın solun\nHer yöne dönüyor dilin\nKime ne faydası oldu ?\n\n17.05.2025"
    },
    {
      "title": "güzel",
      "author": "Aşık Ceyhani",
      "preview": "Türkiyeyi gezeli",
      "poem": "Türkiyeyi gezeli\nGörmedim ben ezeli\nKoca dünyayı gezsen\nYok yarimden güzeli\n\nOy ninnoşom ninnoşum\nSeni sevdim bir hoşum\nRakı içmedim amma\nGözlerinden sahoşum\n\nHem sararardım hem soldum\nKız peşinden yoruldum\nSeni sevmişim diye\nDerdinden verem oldum\n\n11.02.2025"
    },
    {
      "title": "ÖLDÜR BENİ",
      "author": "Aşık Ceyhani",
      "preview": "Güzel gözlerini sevdiğim dilber",
      "poem": "Güzel gözlerini sevdiğim dilber\nYa güldür yüzümü ya öldür beni\nNeler çekiyorum aşkından neler\nYa güldür yüzümü ya öldür beni\n\nBenim ile aşkın cengine girme\nÇekip kılıcını boynuma vurma\nGözünü severim ortada durma\nYa güldür yüzümü ya öldür beni\n\nÇekerim sevdanı ben senelerce\nAkar göz yaşlarım inceden ince\nİşkence bu yaptığın yar işkence\nYa güldür yüzümü ya öldür beni\n\nCeyhaniyim yapıyorum sana ün\nÇıkma yükseklere Engin ol Engin\nNe sevdiğin belli ne sevmediğin\nYa güldür yüzümü ya öldür beni.\n\n06.10.2024"
    },
    {
      "title": "GEÇMİYOR",
      "author": "Aşık Ceyhani",
      "preview": "Sen yoksun yarim burada",
      "poem": "Sen yoksun yarim burada\nGeçmiyor günler geçmiyor\nDoğmaz güneş bu arada\nGeçmiyor günler geçmiyor\nHasretin veriyor çile\nÇekiyorum bile bile\nBir günüm bedel bir yıla\nGeçmiyor günler geçmiyor\nYıla dönüyor bir ayım\nBen bende değilim zayım\nSanki sensiz zindandayım\nGeçmiyor günler geçmiyor\nCeyhani çekmeyen bilmez\nAh ederim yüzüm gülmez\nBeklerim selamın gelmez\nGeçmiyor günler geçmiyor\n\n29.09.2024"
    },
    {
      "title": "BUNLAR",
      "author": "Aşık Ceyhani",
      "preview": "Hırsızlar kılıktan kılığa girdi",
      "poem": "Hırsızlar kılıktan kılığa girdi\nKuzu postu giymiş çakaldır onlar\nHak etmeden alıp yutmaktır derdi\nKuzu postu giymiş çakaldır bunlar\n\nHiç insandan çakal olurmu deme\nYaptıklarına bak oluyor ama\nYeterki süt olsun fark etmez meme\nKuzu postu giymiş çakaldır onlar\n\nKarınları doyar açtır gözleri\nBaşından sonuna yalan sözleri\nHiç utanma  olmaz pişkin yüzleri\nKuzu postu giymiş çakaldır bunlar\n\nCeyhani söyleme sözü boşuna\nMundar olanların gitmez hoşuna\nTakılmış  giderler  birin peşine\nKuzu postu giymiş çakaldır bunlar\n\n10.09.2024"
    },
    {
      "title": "SONU BİTMİYOR",
      "author": "Aşık Ceyhani",
      "preview": "Anamdan doğalı düştüm bu yola",
      "poem": "Anamdan doğalı düştüm bu yola\nYürürüm yürürüm sonu bitmiyor\nUykular dışında vermedim mola\nYürürüm yürürüm sonu bitmiyor\n\nAman dilediğim oldu ellerden\nÇok taşlandım yamuk yumuk dillerden\nGahı çamur gahı tozlu yollardan\nYürürüm yürürüm sonu bitmiyor\n\nAra sıra kaderime darıldım\nBulanıktım aka aka duruldum\nYüce yüce dağ aşmaktan yoruldum\nYürürüm yürürüm sonu bitmiyor\n\nCeyhani  salından kimler tutacak\nVakit akşam üstü güneş batacak\nÇok yaklaştım bugün yarın bitecek\nYürürüm yürürüm sonu bitmiyor\n\n08.09.2024"
    },
    {
      "title": "MİLLET",
      "author": "Aşık Ceyhani",
      "preview": "Yalanım var ise vurun yüzüme",
      "poem": "Yalanım var ise vurun yüzüme\nSizden öncesini arıyor millet\nİtirazı olan varsa sözüme\nYaşıyor olanı görüyor millet\n\nHadi ben yalanım doğruyu sen de\nGerçeği bileyim sayende bende\nDaha ucuz almak için, şimdide\nEkmek kuyruğuna giriyor millet\n.\nSadaka verirsin bize yılda bir\nDertlerimiz aynı bizde çile bir\nGit pazara halkı dinle hele bir\nArkandan beddua veriyor millet\n\nEmekli toruna açar oldu el\nCeyhani seslenir gel insafa gel\nNe kemer kalmıştır ne sıkacak bel\nYokluğun altında eriyor millet\n\n29.08.2024"
    },
    {
      "title": "GÖZÜMSÜN",
      "author": "Aşık Ceyhani",
      "preview": "Bulanıktım duruldum",
      "poem": "Bulanıktım duruldum\nKız peşinden yoruldum\nGülüşün güzel ama\nGözlerine vuruldum\n\nOy ninnoşum ninnoşum\nSevdan ile bir hoşum\nRakı içmedim amma\nGözlerinden sarhoşum\n\nAtaşım var tütemem\nYanar yanar bitemem\nÖyle sevdim ki seni\nNe yapsanda atamam\n\nCeyhaniyim sızımsın\nYüreğimde közümsün\nŞu Cihana değişmem\nBenim iki gözümsün\n\n28.08.2024"
    },
    {
      "title": "SENİN YÜZÜNDEN",
      "author": "Aşık Ceyhani",
      "preview": "Bitmiyor içimde sızım",
      "poem": "Bitmiyor içimde sızım\nSenin yüzünden yüzünden\nGece gündüz uykusuzum\nSenin yüzünden yüzünden\n\nİdamsa sevmenin suçu\nAs boynumdan dola saçı\nGözlerine vuruldum ben\nİşledim yar ben bu suçu\n\nGam kederle dolu destim\nLal eyledin bende sustum\nEy sevdiğim sana küstüm\nSenin yüzden yüzünden\n\nBu Ceyhani sana aşık\nSensin bu gönlüme ışık\nCiğerlerim delik deşik\nSenin yüzünden yüzünden\n\n26.08.2024"
    },
    {
      "title": "BENİM SEVDİĞİM SEVDİĞİM",
      "author": "Aşık Ceyhani",
      "preview": "Hoş bakışlı tatlı dili",
      "poem": "Hoş bakışlı tatlı dili\nBenim sevdiğim sevdiğim\nSelvi boylu ince belli\nBenim sevdiğim sevdiğim\n\nGeldiği yer acep nere\nGöktenmi indin bu yere\nBenziyorsun meleklere\nBenim sevdiğim sevdiğim\n\nİki yanağın gamzeli\nSevmişim seni ezeli\nAdananın en güzeli\nBenim sevdiğim sevdiğim\n\nCeyhani sevdanı çeker\nHasretinden boyun büker\nÇiğ düşmüş Gül gibi kokar\nBenim sevdiğim sevdiğim\n\n26.08.2024"
    },
    {
      "title": "ÖLME",
      "author": "Aşık Ceyhani",
      "preview": "Ne acılar çektim senin yüzünden",
      "poem": "Ne acılar çektim senin yüzünden\nBana yaptığını çekmeden ölme\nHiç eksik olmasın aksın gözünden\nKan ile yaşları dökmeden ölme\n\nDuman çöksün gözleriyin ferine\nCiğer yaraların insin derine\nSevenin kalmasın düşmanlarına\nEl açıpta boyun bükmeden ölme\n\nMorarsın bedenin olsun kapkara\nHayal edip eski günleri ara\nBiri gelir diye sen kapılara\nUmutla bekleyip bakmadan ölme\n\nKökten yıkılasın kurusun dalın\nEğrilsin kolların çot olsun elin\nBacağın tutmasın kırılsın belin\nHer yerinde yara çıkmadan ölme\n\nÖlünce olmasın tutan yasını\nBıraktı  Ceyhani yar sevdasını\nAlmasın Azrail son nefesini\nO tatlı canından bıkmadan  ölme\n\n24.08.2024"
    },
    {
      title: 'TURNAM',
      author: 'Aşık Ceyhani',
      preview: 'Adanaya doğru uçan',
      poem: `Adanaya doğru uçan
Turnam yare selam söylen
İçimde yaralar açan
Turnam yare selam söylen

Tutar titredir sarası
Hekimlerde yok çaresi
Ömür boyu iyileşmez
Derindir sevda yarası

Çok çekti kendini naza
Nola bir gün selam yaza
Kırgınım o vefasıza
Turnam yare selam söylen

Der Ceyhani gidin hemen
İçimde kalmasın güman
Ora vardığınız zaman
Turnam yare selam söylen

30.08.2025`
    },
    {
      title: 'VURGUN YEDİM',
      author: 'Aşık Ceyhani',
      preview: 'Ne denizden nede gölden',
      poem: `Ne denizden nede gölden
Kaderimden vurgun yedim
Ne düşmandan nede elden
Kaderimden vurgun yedim.

Yıllar oldu güldürmedi
Süründürür öldürmedi
Düşman imiş bildirmedi
Kaderimden vurgun yedim

Attı yere belim kırdı
Binbir türlü çile verdi
Beni ciğerimden vurdu
Kaderimden vurgun yedim

Ceyhani der zora düştüm
Bülbül gibi zara düştüm
Ağustosta kara düştüm
Kaderimden vurgun yedim.

13.08.2025`
    },
    {
      title: 'SENDEN',
      author: 'Aşık Ceyhani',
      preview: 'Seni tanımadan yoktu bir derdim',
      poem: `Seni tanımadan yoktu bir derdim
Çektiğim ızdırap bu acı senden
Hiç halim kalmadı bittim tükendim
İstemem versende o gücü senden

Bana çektirdiğin yok hiç bir dinde
Bugünde böylesin böyleydin dünde
Vijdansız olmanın ödülü sende
Kimseler alamaz yar tacı senden

Ne verdinki başka dertle acıdan
Razı olmam alsan,dar ağacından
İçine katılmış sevgi harcından
Şu gönlüme olmaz sıvacı senden

Ceyhani görmedim hiç senden vefa
Yıllarca çektirdin gam ile cefa
Bir tek sende olsa yarama şifa
Ölsemde istemem ilacı senden.

11-08-2025`
    },
    {
      title: 'DİYEMİ',
      author: 'Aşık Ceyhani',
      preview: 'Sorarım siz niye vekil oldunuz',
      poem: `Sorarım siz niye vekil oldunuz
Ceylan koltuklarda yatın diyemi ?
Birer birer o meclise doldunuz
Ballı maaşları yutun diyemi ?

Yazık ulan size vallahi yazık
Sayenizde halkın geçimi bozuk
Gençler ve yaşlımız canından bezik
Bu millete kazık atın diyemi ?

Emekli can çeker artar çilesi
İsyan eder çoğu gelir ölesi
Olmuşsunuz genel başkan kölesi
Milleti kenara itin diyemi ?

Ettiniz ülkeyi oldu harabe
Talihsiz milletiz çaldık garebe
Sahiller madenler gitti araba
Parsel parsel bölüp satın diyemi ?

Olmamalı sizden millet vekili
Hepiniz bir yerden alır akılı
Fransız markası parfüm kokulu
Burcu burcu kokup tütün diyemi ?

Türkiyeli değil Türktür özümüz
Korkunç ihaneti görür gözümüz
Hepinize gelsin budur sözümüz
Terörle el ele tutun diyemi ?

Ceyhani velkelam sözün kısası
Firavun oldunuz yok bir musası
Sanki gazi meclis kumar masası
Yalan ile halkı ütün diyemi?

10-08-2025`
    },
    {
      title: 'DEDİ',
      author: 'Aşık Ceyhani',
      preview: 'Bugün ben bir güzel gördüm',
      poem: `Bugün ben bir güzel gördüm
Adın sordum pınar dedi
Dedim nerelisin söyle
Köyüm ulu Çınar dedi

Hilale benziyor kaşı
Yıldızlar olmuş yoldaşı
Şafkı vurur yer yüzüne
Sandım sabahın güneşi

Ceyhani bitmez kederin
Sevdamla yanarsa serin
Gözlerime derin derin
Bakma için yanar dedi

10.08.2025`
    },
    {
      title: 'KARAR ALDINIZ',
      author: 'Aşık Ceyhani',
      preview: 'Komisyon millete açık dediniz',
      poem: `Komisyon millete açık dediniz
On yıl açıklanmaz karar aldınız
Halka verdiğiniz sözü yediniz
On yıl açıklanmaz karar aldınız

Sözüm hepinize değil üçüne
Apo sizi ortak etti suçuna
Halka gizli serbest katil piçine
On yıl açıklanmaz karar aldınız

Türklük gömleğini bir bir soydunuz
Zehirin adını şifa koydunuz
Teröristler ne der ise uydunuz
On yıl açıklanmaz karar aldınız

Sizden büyük millet vardır biliniz
Kızıl arı yapmış bozuk balınız
Eyleminiz başka başka diliniz
On yıl açıklanmaz karar aldınız

Size ne söylesem az gelir az
Vallahi kaz sizden akıllıdır kaz
İçiniz kapkara dışınız beyaz
On yıl açıklanmaz karar aldınız

Ceyhani şehitler ölmez diyen siz
Şehit kanı yerde kalmaz diyen siz
Gizli bir görüşme olmaz diyen siz
On yıl açıklanmaz karar aldınız

09.08.2025`
    },
    {
      title: 'HATIRLA',
      author: 'Aşık Ceyhani',
      preview: 'Çıkmaza düşerse yolun',
      poem: `Çıkmaza düşerse yolun
Beni hatırla hatırla
Tutmayınca elin kolun
Beni hatırla hatırla

İçini kaplarsa hüzün
Bakıpta görmezse gözün
Gün olur tutmazsa dizin
Beni hatırla hatırla

Poyraz vurmuş gül olursan
Yana yana kül olursan
Yarin için el olursan
Beni hatırla hatırla

Çok çektirdin üzdün beni
Elbet ahım tutar seni
Ceyhani der düşün beni
Beni hatırla hatırla

04.08.2025`
    },
    {
      title: 'AĞLA GÖZÜM AĞLA',
      author: 'Aşık Ceyhani',
      preview: 'Sinemde dert sıra sıra',
      poem: `Sinemde dert sıra sıra
Ağla iki gözüm ağla
Tabiplerde yoktur çare
Ağla iki gözüm ağla

Ağla iki gözüm ağla
Ağlada gönlünü eğle
Kaderden vurgun yemişim
Çağlayanlar gibi çağla

Göz yaşları türlü türlü
Kimi arı kimi kirli
Engin ol olma kibirli
Ağla iki gözüm ağla

Ceyhaniyim erir özüm
Kötü kaderime sözüm
Doğdum doğalı mutsuzum
Ağla iki gözüm ağla

04-08-2025`
    },
    {
      title: 'OY OY TÜRKİYEM',
      author: 'Aşık Ceyhani',
      preview: 'Yandı güzel yurdum yandı',
      poem: `Yandı güzel yurdum yandı
Oy oy oy Türkiyem
Yeşil dağlar küle döndü
Oy oy oy Türkiyem

Gökten cehennemmi indi
Börtü böcek hepsi yandı
Dağlarda canlı kalmadı
Oy oy oy Türkiyem

Bulut yok yağmur indirsin
Feryat figanı dindirsin
Uçak az nasıl söndürsün
Oy oy oy Türkiyem

Ceyhani bu nasıl acı
Yüreğimde bitmez sancı
Devletin yetmiyor gücü
Oy oy oy Türkiyem

28.07.2025`
    },
    {
      title: 'ONUN',
      author: 'Aşık Ceyhani',
      preview: 'Ben o yari nerde olsa tanırım',
      poem: `Ben o yari nerde olsa tanırım
Güzeller içinde ünü var onun
Hemi nişanıdır hemide süsü
Sol yüzünde bir tek beni var onun

Burnu fındık gibi yanağı allı
Kahve rengi gözlü selvi endamlı
Ne karadır nede sarıdır kendi
Buğday irenginde teni var onun

Ceyhani sevdiğim güzeller piri
Tatlı dil güler yüz özellikleri
Saymak ile bitmez güzellikleri
Bir değil beş değil bini var onun

23-07-2025`
    },
    {
      title: 'DÜŞTÜM',
      author: 'Aşık Ceyhani',
      preview: 'Nasıl bir sevdaymış böyle',
      poem: `Nasıl bir sevdaymış böyle
Çaresizim zora düştüm
Yaradanım yardım eyle
Kerem gibi kora düştüm

Öyle kor ki yok ataşı
Düşse yakar suyla taşı
Gül vurmuş yaralı döşü
Bülbül gibi zara düştüm

Sürdü zora kervanımı
O yar yazdı fermanımı
Hiç koymadı dermanımı
Bir vijdanı köre düştüm

Bade diye zehir içip
Ceyhani ben benden geçip
Viran oldu gönül göçüp
Kalbi katı yare düştüm

21.07.2025`
    },
    {
      title: 'SENDEN',
      author: 'Aşık Ceyhani',
      preview: 'Yıllarca peşinden  boşa koşmuşum',
      poem: `Yıllarca peşinden  boşa koşmuşum
Gayrı hiç umudum kalmadı senden
Sen sevda çeşmesi bende bir kova
Bekliyorum ama dolmadı senden.

Aşkın zinciriyle bağladın beni
Yaktın yüreğimi dağladın beni
Yar seni seveli ağladın beni
Bir kerecik yüzm gülmedi senden

Hasretinden arşa çıktı figanım
Kurudu damarım çekildi kanım
Yaralarım azdı sızlar her yanım
Derdime bir çare gelmedi senden

Hep seni düşündüm gün ile ayla
Kına yak eline çık seyran eyle
Bir selam yazdınmı vijdansız söyle
Ceyhani hiç selam almadı senden

17.07.2025`
    },
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
    },
{
    "title": "Selam verdim almıyorsun",
    "author": "Aşık Ceyhani",
    "preview": "Selam verdim almıyorsun",
    "poem": "Selam verdim almıyorsun\nBurnunmu büyüdü senin\nDost kıymeti bilmiyorsun\nBurnunmu büyüdü senin\n\nBu hal firavunun hali\nEdiyorsun beni deli\nAynı gargamel misali\nBurnunmu büyüdü senin.\n\nGayrı selam vermem sana\nDönüpte bakmam o yana\nSultanmı oldun cihana\nBurnunmu büyüdü senin\n\nCeyhaniyi kırıyorsun\nCiğerimden vuruyorsun\nKendin büyük görüyorsun\nBurnunmu büyüdü senin\n\n19.08.2024"
  },
  {
    "title": "Hasretin sinemi yakıp kavurur",
    "author": "Aşık Ceyhani",
    "preview": "Hasretin sinemi yakıp kavurur",
    "poem": "Hasretin sinemi yakıp kavurur\nGözlerimin suyu akar sevdiğim\nMejnunmuyum yada divanemiyim\nAşkın beni kökten yıkar sevdiğim\n\nSevip sevilmeyi yar sende buldum\nSevdan söyletiyor sevdanla çaldım\nGüzel gözleriyin esiri oldum\nİlla beni sana çeker sevdiğim\n\nZülüfün sallanır yar lüle lüle\nKokusu benzermi açılmış güle\nSen zaten bellisin hayalin bile\nBana burcu burcu kokar sevdiğim.\n\nBu ceyhani senin sevdanı çeker\nElleri koynunda boynunu büker\nAşkın öyle ateş güneşi yakar\nKorkarım suyuda yakar sevdiğim\n\n18.08.2024"
  },
  {
    "title": "BOŞ BANA",
    "author": "Aşık Ceyhani",
    "preview": "Unumu eledim eleği astım",
    "poem": "Unumu eledim eleği astım\nYalan dünya gelmez gayrı hoş bana\nDeli poyraz gibi yıllarca estim\nYaz aylarım bile şimdi kış bana\n\nYıldım bağırmaktan kısıldı sesim\nMerdiven çıkamam yetmez nefesim\nHepsi sizin olsun yoktur hevesim\nKonaklar saraylar gelir boş bana\n\nBir kuşum dalımdan uçmuş gibiyim\nYazlıktan kışlağa göçmüş gibiyim\nGüneşte gölgeden geçmiş gibiyim\nYaşadığım günler sanki düş bana\n\nCeyhani almadım türlü hazları\nÇekemez oldum ben cilve nazları\nİstemem cenette huri kızları\nSevdiceğim olsun orda eş\n\n30.04.2024"
  },
  {
    "title": "Bütün insanları sınav etseler",
    "author": "Aşık Ceyhani",
    "preview": "Bütün insanları sınav etseler",
    "poem": "Bütün insanları sınav etseler\nKimi sıfır alır kimi on çeker\nHer kafa içinde bir beyin vardır\nKimi gram gelmez kimi ton çeker.\n\nSakın cahillerin  attığı taştan\nÇıkarır insanı çileden baştan\nAvcı avı vurmuş kan akar döşten\nZalim sevinirken mazlum can çeker.\n\nİnsanlığa karşı yapar hatalar\nGörmezden gelirler suçu öteler\nİt iti ısırmaz demiş atalar\nBilir birbirini çünkü kan çeker.\n\n21.04.2024"
  },
  {
    "title": "CANIM SIKILIYOR",
    "author": "Aşık Ceyhani",
    "preview": "Ne keyfim var nede neşem",
    "poem": "Ne keyfim var nede neşem\nCanım sıkılıyor benim\nGücüm yok yürüyüp koşam\nCanım sıkılıyor benim.\n\nİpek kumaş giyenler var\nŞükür edin diyenler var\nHakkımızı yiyenler var\nCanım sıkılıyor benim\n\nHer şeye kafa yormaktan\nBıktım strese girmekten\nOturup evde durmaktan\nCanım sıkılıyor benim.\n\nİstakozla doyanlar var\nMidemizi oyanlar var\nMemleketi soyanlar var\nCanım sıkılıyor benim.\n\nBulanığım değil arı\nÇekiyorum Ahu zarı\nEttim ben benden firarı\nCanım sıkılıyor benim.\n\nBu Ceyhani gayrı ölsün\nÜzerine toprak dolsun\nBöyle hayat olmaz olsun\nCanım sıkılıyor benim\n\n16.04.2024"
  },
  {
    "title": "Öldürün beni",
    "author": "Aşık Ceyhani",
    "preview": "Erenler zehir getirin",
    "poem": "Erenler zehir getirin\nBal ile öldürmen beni\nBağrıma diken batırın\nGül ile öldürmen beni\n\nYar diyerek yana yana\nCan veririm ben  canana\nSevdiceğim kıysın bana\nEl ile öldürmen beni\n\nBir aşktır düştü özüme\nYanarım kendi közüme\nLeyla görünüp gözüme\nÇöl ile öldürmen beni\n\nYar aşkıyla düştüm gama\nSaldı beni demden deme\nAsın kesin yüzün ama\nDil ile öldürmen beni\n\n02.04.2024"
  },
  {
    "title": "Heyacan basıyor seni  görünce",
    "author": "Aşık Ceyhani",
    "preview": "Heyacan basıyor seni  görünce",
    "poem": "Heyacan basıyor seni  görünce\nSara tutmuş gibi titrer her yanım\nSenin ile bir sohbete girince\nDilim lal oluyor çekilir kanım.\n\nSevdiğim mah yüzün bana göstersen\nBaşım alıp yar bağrına yastarsan\nKavuşmamız için kurban istersen\nKes boynumdan feda olsun bu canım.\n\nBilirim sevdiğim bana kıymazsın\nSen meleksin şeytanlara uymazsın\nDuymayanlar duydu bir sen duymazsın\nSemayı titretir feryat figanım.\n\n02.04.2024"
  },
  {
    "title": "DÜNYA",
    "author": "Aşık Ceyhani",
    "preview": "Bir yanın ateştir bir yanın buzlu",
    "poem": "Bir yanın ateştir bir yanın buzlu\nDondurursun hemde yakarsın dünya\nKim bilir içinde ne sırlar gizli\nBir baştan bir başa akarsın dünya\n\nBilemedim nedir sendeki coşku\nVirana çevirin sarayı köşkü.\nZalime verirsin  serveti aşkı\nParayla kendine çekersin dünya.\n\nHeves bırakmadın sana bakmaya\nMahkum ettin böyle yaşlar dökmeye\nDaha doymadınmı beni yakmaya\nÜzerime korlar dökersin dünya.\n\nCeyhaniyi koydun çileye gama\nGönlüm yırtılmıştır tutmuyor yama\nBilirim azrail değilsin ama\nRuhumu kökünden sökersin dünya.\n\n14.09.2023"
  },
  {
    "title": "YAVAŞ YAVAŞ",
    "author": "Aşık Ceyhani",
    "preview": "Geçipte karşıma tebessüm eyle",
    "poem": "Geçipte karşıma tebessüm eyle\nAla gözlüm nolur gül yavaş yavaş.\nPerişanım sensiz çekerim böyle\nHergün eriyorum bil yavaş yavaş.\n\nEsen ürüzgarda kokun kokuyor\nMest eyleyip beni sana çekiyor.\nSicim gibi gözüm yaşı akıyor\nZülfün mendil eyle sil yavaş yavaş.\n\nHasretinden böyle canım ezgindir\nGüldür gayrı nolur gönül üzgündür.\nİlaç kar etmiyor yaram azgındır\nDerdime lokman ol gel yavaş yavaş.\n\nCeyhani yar diye diye sızlarsın\nGelir diye çıkar yolu gözlersin\nAçılmış sinende benden gizlersin\nGoncaları dersin el yavaş yavaş.\n\n14.08.2023"
  },
  {
    "title": "Kız seni canımdan fazla sevmiştim",
    "author": "Aşık Ceyhani",
    "preview": "Kız seni canımdan fazla sevmiştim",
    "poem": "Kız seni canımdan fazla sevmiştim\nBen sana kendimi sevdiremedim\nRuhumla, bedenim özle sevmiştim\nBen sana kendimi sevdiremedim.\n\nBenimkisi hayal düşümüş meğer\nSevdan  dertlerime başımış meğer\nTaşıdığın kalbin daşımış meğer\nBen sana kendimi sevdiremedim.\n\nMecnuna sevdirdim keşe sevdirdim\nAklını yitirmiş başa sevdirdim\nDağlara toprağa taşa sevdirdim\nBen sana kendimi sevdiremedim.\n\nCeyhani gönlümün sen oldun ilki\nDeseydin ölürdüm sen bana ölki\nBir gavuru sevsem severdi belki\nBen sana kendimi sevdiremedim.\n\n25.02.2023"
  },
  {
    "title": "GÜL PERİ",
    "author": "Aşık Ceyhani",
    "preview": "Hemi gülsün hemde peri",
    "poem": "Hemi gülsün hemde peri\nAdını Gül peri koydum\nSevdiğim gözümün feri\nAdını Gül peri koydum.\n\nAçtın gönlümde yara kız\nBu yaraya bi çare kız\nRuhuma gıda  Kara kız\nAdını Gül peri koydum.\n\nCeyhani derdim azalı\nDeğildim böyle ezeli\nGözümde dünya güzeli\nAdını Gül peri koydum.\n\n08.09.2022"
  },
  {
    "title": "FAYDA BEKLEME",
    "author": "Aşık Ceyhani",
    "preview": "Karekteri bozuk olan",
    "poem": "Karekteri bozuk olan\nKullardan fayda bekleme\nSözlerinde varsa yalan\nDillerden fayda bekleme.\n\nTürlü renklere bezenen\nHaram lokmaya özenen\nYetim hakkına uzanan\nEllerden fayda bekleme.\n\nAvanta peşinde gezen\nGarip gurabayı ezen\nSazda tutmuyorsa düzen\nTellerden fayda bekleme.\n\nSel suyu bulanık akar\nBir kibrit ormanı yakar\nArıya verdiysen şeker\nBallardan fayda bekleme\n\nCeyhani insanlık arar\nVerirse çevreye zarar\nSakal bıyık neye yarar\nKıllardan fayda bekleme.\n\n13.08.2022"
  },
  {
    "title": "SENİ GÖRÜNCE",
    "author": "Aşık Ceyhani",
    "preview": "Neden bilmem ama böyle oluyom",
    "poem": "Neden bilmem ama böyle oluyom\nHeyacan tutuyor seni görünce\nNefesim kesilir sanki ölüyom\nHeyacan tutuyor seni görünce\n\nDilim zor dönüyor ağzım kuruyor\nNabız yükseliyor kalbim vuruyor\nGözlerim dünyayı bir hoş görüyor\nHeyacan tutuyor seni görünce.\n\nÇok düşündüm acep olaki neden\nIslatır yüzümü ter olup geden\nTir tir titriyorum durmuyor beden\nHeyacan tutuyor seni görünce.\n\nSevdanla yanmışım dönmüşüm küle\nBir kıvılcım iner boyunumdan bele\nSen zaten bellisin resminde bile\nHeyacan tutuyor seni görünce\n\nCeyhaniyim seni göresim gelir\nYana düşen zülfün öresim gelir\nYüzümü yüzüne süresin gelir\nHeyacan tutuyor seni görünce.\n04-08-2022"
  },
  {
    "title": "Yusufu kuyuya atanlar gibi",
    "author": "Aşık Ceyhani",
    "preview": "Yusufu kuyuya atanlar gibi",
    "poem": "Yusufu kuyuya atanlar gibi\nSende beni aşka attın Kara kız\nEsir alıp köle tutanlar gibi\nSende beni öyle ettin Kara kız.\n\nSana söylüyorum duy kahve gözlü\nHasretin çekerim yar gizli gizli\nÖmrümde görmedim sen gibi nazlı\nBakıp kaşlarını çattın Kara kız.\n\nAşk nedir bilmezdim senden eveli\nCeyhani mahlasım,ben durmuş ali\nOlmuşum sayende serseri deli\nBeni türlü hale kattın Kara kız.\n04-08-2022"
  },
  {
    "title": "Süphandereli",
    "author": "Aşık Ceyhani",
    "preview": "Bu sözlerim sana süphandereli",
    "poem": "Bu sözlerim sana süphandereli\nBu kadar siyaset yapma be gardaş\nTürk değilmi bunlar söyle nereli\nBu kadar siyaset yapma be gardaş\n\nHasta olduğunda kime gidersin\nTabipler olmasa bilmem nidersin\nDoktorlara neden sen kin güdersin\nBu kadar siyaset yapma be gardaş.\n\nTÜSİAD dediğin cumhur yanlısı\nÖdüller verdiler devlet şanlısı\nHükümeti över değil kanlısı\nBu kadar siyaset yapma be gardaş\n\nCeyhani tabipler başımın tacı\nOnlar olmaz ise hayat çok acı\nHükümetler gider onlar kalıcı\nBu kadar siyaset yapma be gardaş.\n22.07.2022"
  },
  {
    "title": "Sevda seni benden beter",
    "author": "Aşık Ceyhani",
    "preview": "Sevda seni benden beter",
    "poem": "Sevda seni benden beter\nEder inşallah inşallah\nNere gitsen senle gider\nKeder inşallah inşallah\n\nSevdanla çektirin bana\nKeyf alırsın kana kana\nKötü vursun birgün sana\nKader inşallah inşallah\n\n19.07.2022"
  },
  {
    "title": "TURNALAR",
    "author": "Aşık Ceyhani",
    "preview": "Adana’ya doğru giden turnalar",
    "poem": "Adana’ya doğru giden turnalar\nKara kıza benden selam söyleyin\nSevdası sinemde açtı yaralar\nKara kıza benden selam söyleyin\n\nSevip sevilmenin  olmuyor yaşı\nGitmiyor aklımdan hayali düşü\nSİze yalvarırım ey turna kuşu\nKara kıza benden selam söyleyin\n\nCeyhani sevdiğim başımın tacı\nGizli Sevda verir ruhuma acı\nO yar ile bana olun aracı\nKara kıza benden selam söyleyin\n\n26.06.2022"
  },
  {
    "title": "EĞER",
    "author": "Aşık Ceyhani",
    "preview": "Bade diye bana uzatsan zehir",
    "poem": "Bade diye bana uzatsan zehir\nİçerim yanımda olursan eğer.\nYolumuza engel olsada nehir\nGeçerim yanımda olursan eğer.\n\nBile geçirelim baharı kışı\nBeraber kuralım hayali düşü\nOlalım sevdiğim muhabbet kuşu\nUçarım yanımda olursan eğer.\n\nGadanı alayım düşürme zora\nAçarsan kapanmaz sinemde yara\nİste bu diyardan başka diyara\nGöçerim yanımda olursan eğer.\n\nCeyhani boş yere geçmesin hayat\nSenin ile bulsun ömrüm nihayet\nTut elimden gidek der isen şayet\nKaçarım yanımda olursan eğer.\n06.05.2022"
  },
  {
    "title": "ALKIŞ TUTUYOR",
    "author": "Aşık Ceyhani",
    "preview": "Dünyadamı  böyle yoksa bizdemi",
    "poem": "Dünyadamı  böyle yoksa bizdemi\nEzilen ezene alkış tutuyor\nAkıldamı sorun yoksa gözdemi\nEzilen ezene alkış tutuyor\n\nYalancı her yöne çevirir dili\nNe söylese  alkış tutuyor deli\nHani şu deveyle diken misali\nEzilen ezene alkış tutuyor\n\nBardağı bardakla kırma hilesi\nKarıştır kinleştir işin alası\nBöylesine derim çağın kölesi\nEzilen ezene alkış tutuyor.\n\nAdalet yok olmuş ezen ezene\nHiç insan denirmii gavli bozana\nCeyhani isyanım böyle düzene\nEzilen ezene alkış tutuyor.\n30-4-2020"
  },
  {
    "title": "Göz yaşlarım ince ince",
    "author": "Aşık Ceyhani",
    "preview": "Göz yaşlarım ince ince",
    "poem": "Göz yaşlarım ince ince\nAkıyor seni görünce\nNeredeydin senelerce\nYenimi çıktın karşıma.\n\nVurdu kader yara açtı\nTohum gibi yere saçtı\nDer Ceyhani gençlik geçti\nYenimi çıktın karşıma\n13.03.2022"
  },
  {
    "title": "KARA KIZ",
    "author": "Aşık Ceyhani",
    "preview": "Ölüp geri gelsem dünyaya bida",
    "poem": "Ölüp geri gelsem dünyaya bida\nSeni seveceğim  gene Kara Kız.\nMalımı mülkümü alsında hüda\nYalnız seni versin bana Kara Kız.\n\nCeyhaniyim beni gelip görseler\nAyağıma bu dünyayı serseler\nHuri kızlarıyla peri verseler\nDeğişmemki seni buna Kara kız.\n13.03.2022"
  },
  {
    "title": "BOŞ OLDUĞUNU",
    "author": "Aşık Ceyhani",
    "preview": "Sizin gibi bende gezdim bir zaman",
    "poem": "Sizin gibi bende gezdim bir zaman\n Sanmıştım dünyanın hoş olduğunu.\nBen yanıldım sizler aman ha aman\nKabirde anladım boş olduğunu\n\nNerde benim aklım alıp kandıran\nTürlü süsleriyle başım döndüren.\nBilirmisin cehennemi söndüren\n ALLAH  için akan  yaş olduğunu\n\nDünyada fazla mal  burada zulüm.\nHesabı zorumuş dönmüyor dilim.\nNerede servetim sermayem malım\nAnladımki iki taş  olduğunu\n\nİbret al Ceyhani göçüp gideni\nTerk etmesin sakın aklın bedeni.\nNarı cehenneme girme  nedeni\nUnutma akılsız  baş  olduğunu.\n\n24.12.2021"
  },
  {
    "title": "ADAM OL ADAM",
    "author": "Aşık Ceyhani",
    "preview": "Çıksada önüne çeşitli engel",
    "poem": "Çıksada önüne çeşitli engel\nHedefine giden adam ol adam.\nUçma yükseklerde engine ingel.\nHedefine giden adam ol adam.\n\nBelki sana hain diyenler olur\nKınayanlar olur yerenler olur.\nVaz geç diye akıl verenler olur\nHedefine giden adam ol adam.\n\nDoğruları haykır sakın sıkılma\nTehditlerden korkup iki bükülme\nCan ver ama sakın yere yıkılma\nHedefine giden adam ol adam.\n\nCeyhani örnek ol hep duruşunla\nIşık saç etrafa bu görüşünle.\nDeğer kazanaman lira kuruşunla\nHedefine giden adam ol adam\n\n28.09.2021"
  },
  {
    "title": "GELSENE",
    "author": "Aşık Ceyhani",
    "preview": "Gönlümün sultanı başımın tacı",
    "poem": "Gönlümün sultanı başımın tacı\nHasretinden hasta oldum gelsene.\nBana şifa vermez doktor ilacı\nHazan yemiş gibi soldum gelsene.\n\nBedenim kıpramaz dondu kasıldı\nÇıkmıyor avazım sesim kısıldı.\nYemem içemem bitti hepsi kesildi\nBir deri bir kemik kaldım gelsene.\n\nGünlerdir beklerim ben beni üzdüm\nDuramam sözümde gavili bozdum.\nBelki okun diye mektuplar yazdım\nPosta ile haber saldım gelsene.\n\nAzrail acımaz gözüm yaşına\nÖleceğim belli oldu aşina.\nBir fatiha oku mezar başına\nSevdiğim ceyhani öldü gelsene.\n24.08.2021"
  },
  {
    "title": "Karıştı izleri bilinmez oldu",
    "author": "Aşık Ceyhani",
    "preview": "Karıştı izleri bilinmez oldu",
    "poem": "Karıştı izleri bilinmez oldu\nÇakal belli değil kurt belli değil\nHer yanımız insan benzeri doldu\nKalleş belli değil mert belli değil.\n\nAklı boş çoğaldı, sardı ulusu\nKonuşmaya korkar aklı dolusu\nBirbirine girmiş türlü çalısı\nPıynar belli değil murt belli değil.\n\nDost dediğin  güven vermiyor dosta\nGüçlüler zayıfa koyuyor posta\nCeyhaniyim bitmiş insanlık hasta\nŞifa belli değil dert belli değil.\n\n22.08.2021"
  },
  {
    "title": "Demirkazığın",
    "author": "Aşık Ceyhani",
    "preview": "Etekleri yeşil üzeri beyaz",
    "poem": "Etekleri yeşil üzeri beyaz\nNe güzel süsü var demirkazığın\nGündüzleri serin gecesi ayaz\nSeherde sisi var demirkazığın\n\nTürlü kuş sesleri gelir koyakta\nArı var çiçekte morunda akta\nBeş vakit kıyamda durur ayakta\nBuluttan fesi var demirkazığın.\n\nOlsada söylese bu dağın dili\nNe kavimler gördü acep kim bili\nBurcu burcu kokar nergizi gülü\nSormayın nesi var demirkazığın\n\nCeyhaniyim burda neler var neler\nGeyikler kuzlamış oğlağı meler\nŞu anda inceden yağmur çiseler\nDumanlı pusu var demirkazığın.\n\n14.05.2014"
  },
  {
    "title": "Nasıl bir illetmiş hapsolduk eve",
    "author": "Aşık Ceyhani",
    "preview": "Nasıl bir illetmiş hapsolduk eve",
    "poem": "Nasıl bir illetmiş hapsolduk eve\nSıkıldım ben böyle günden usandım\nKalmadı gönlümde döküldü sıva\nHem bu günden hemde dünden usandım\n\nİçimdeki gamı derdi dökemem\nGelenim var diye yola bakamam\nKapanıp kalmışım evden çıkamam\nBir evin içinde dönden usandım.\n\nLebalep diyerek tutmuştu kaydı\nRizede başlattı her yere yaydı\nSonrada milleti içeri koydu\nBurdan söylüyorum senden usandım.\n02.05.2021"
  },
  {
    "title": "ZEYNO",
    "author": "Aşık Ceyhani",
    "preview": "Güzel gülüşüne güzel gözüne",
    "poem": "Güzel gülüşüne güzel gözüne\nVuruldum neyleyim sana be Zeyno\nDoyamam bakmaya o mah yüzüne\nOlurum görünce fena be Zeyno\n\nSana olan sevgim göğe erişti\nYanar ciğerlerim soldu kırıştı\nYüreğimden geçip cana karıştı\nAdın damarımda kana be Zeyno\n27.04.2021"
  },
  {
    "title": "SEVDİĞİM",
    "author": "Aşık Ceyhani",
    "preview": "Sarıp sarmalayıp bana dokunsan",
    "poem": "Sarıp sarmalayıp bana dokunsan\nTene değil girsen kalbe sevdiğim.\nDuam olup hep dilimde okunsan\nGitme ömür boyu kal be sevdiğim.\n\nCananım ol benim ahirde burda\nAdın derman verir bendeki derde.\nAcı şu halime bırakma narda\nEyleme beni sen kül be sevdiğim.\n\nMaşuk ister daim yare kavuşmak\nYakışmaz sevene kavga döğüşmek.\nRuhuma gıdadır senle sevişmek\nBen bülbülüm sende gül' be sevdiğim.\n\nEzeli gönlümde benim birimsin\nÜryanım dünyada birtek varımsın.\nHer iki cihanda yarsın yarimsin\nCeyhani kapında kul be sevdiğim\n\n01.02.2021"
  },
  {
    "title": "ÇAY PARASI VERE VERE USANDIM",
    "author": "Aşık Ceyhani",
    "preview": "Bugün ellibirde gene ütüldüm",
    "poem": "Bugün ellibirde gene ütüldüm\nÇay parası vere vere usandım\nKumpasa uğradım gardaş satıldım\nÇay parası vere vere usandım.\n\nMisis ile Adana’nın arası\nÖldürüyor ütülmenin yarası\nGetti çocukların ekmek parası\nÇay parası vere vere usandım.\n\nOn iki çay içtik,cola gerisi\nBilmem kaçı siyah,üçtü sarısı\nBitirdim maaşı uçtu yarısı\nÇay parası vere vere usandım.\n\nCeyhani sıkıntım başıma vurdu\nBoşaldı cüzdanım dostlarım gördü\nSağolsun kahveci biraz borç verdi\nÇay parası vere vere usandım.\n\n27.01.2021"
  },
  {
    "title": "BENİM",
    "author": "Aşık Ceyhani",
    "preview": "Dokunmayın nolur bırakın aksın",
    "poem": "Dokunmayın nolur bırakın aksın\nGözlerimden yaşı silmeyin benim\nBırakın ortada cenazem koksun\nBedenime çukur,bulmayın benim.\n\nSavurdunuz beni ordan oraya\nAcımayıp bıraktınız araya\nYüreğimde açtığınız yaraya\nİstemiyom merhem olmayın benim.\n\nEklediniz bin bir,benim sözüme\nDom dom kurşunları atıp izime.\nPişmiş kelle gibi, bakıp yüzüme\nYalandan yüzüme gülmeyin benim.\n\nİstediniz beni mutlu olmasın\nCeyhani ağlasın yüzü gülmesin\nMezarım olursa kimse bilmesin\nİstemem kabrime gelmeyin benim.\n23.01.2021"
  },
  {
    "title": "GELİR SANA DOĞRU (16.01.2021)",
    "author": "Aşık Ceyhani",
    "preview": "Deli gönlüm aşk nehrine",
    "poem": "Deli gönlüm aşk nehrine\nDüştü gelir sana doğru\nAklımı başımdan aldın\nŞaştı gelir sana doğru.\n\nSanma sana çok ırağım\nSensin benim son durağım.\nSevgin ile bu yüreğim\nTaşdı gelir sana doğru.\n\nCeyhani'ye sensin sebep\nSoruyorum vermen cevap\nCiğerlerim oldu kebap\nPişdi  gider  sana doğru.\n16.01.2021"
  },
  {
    "title": "GELİR SANA DOĞRU (27.11.2020)",
    "author": "Aşık Ceyhani",
    "preview": "Deli gönlüm aşk nehrine",
    "poem": "Deli gönlüm aşk nehrine\nDüştü gelir sana doğru\nAklımı başımdan aldın\nŞaştı gelir sana doğru.\n\nSanma sana çok ırağım\nSensin benim son durağım.\nSevgin ile bu yüreğim\nTaşdı gelir sana doğru.\n\nCeyhani'ye sensin sebep\nSoruyorum vermen cevap\nCiğerlerim oldu kebap\nPişTi  gider  sana doğru.\n\n27.11.2020"
  },
  {
    "title": "DOKTOR BEY",
    "author": "Aşık Ceyhani",
    "preview": "Düşmüyor tansiyon başım dönüyor",
    "poem": "Düşmüyor tansiyon başım dönüyor\nDengesizim düştüm yere doktor bey.\nGözlerim dumanlı feri sönüyor\nGörürüm etrafı kara doktor bey.\n\nSanırım azrail beni yokluyor\nHaktan alacağı emri bekliyor.\nKalbim dayanmıyor küt küt tıklıyor\nCiğerlerim zaten yara doktor bey.\n\nÇokmu ağır durum söyle bileyim\nDuamı edeyim hazır olayım\nGurbette yavrum var haber salayım.\nGelsin çocuklarım bura doktor bey\n\nCeyhani ne oldu böyle bilmedim\nHüzünden olurmu çünkü gülmedim.\nÖlmekten hiç korkmam murad almadım\nÇok oldu düşeli nara doktor bey."
  }
  ];

  const existingGrid = poetrySection.querySelector('.poem-grid');
  const grid = document.createElement('div');
  grid.className = 'poem-grid';
  const previewLimit = Number(poetrySection.dataset.previewLimit);
  const visibleCards = previewLimit > 0 ? cards.slice(0, previewLimit) : cards;
  visibleCards.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'poem-card';
    if (item.title === 'Yüzüm Gülmedi') button.classList.add('poem-card--manuscript');
    button.dataset.title = item.title;
    button.dataset.author = item.author;
    button.dataset.poem = item.poem;
    button.dataset.manuscript = item.title === 'Yüzüm Gülmedi' ? 'assets/siir.jpg' : '';
    button.innerHTML = `<span class="poem-card__tag">${item.author}</span><img class="poem-card__saz" src="assets/saz-motifi.svg" alt="" aria-hidden="true" width="80" height="144"><strong>${item.title}</strong><p>${item.preview}</p>`;
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
})();
