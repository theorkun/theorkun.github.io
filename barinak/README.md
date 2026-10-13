# Sarıçam Belediyesi Barınak Takip Sistemi

Sarıçam Belediyesi Hayvan Bakımevi için hazırlanmış kapsamlı, tarayıcı tabanlı yönetim panelidir.

Uygulama; hayvan kayıtları, sağlık ve aşı takibi, envanter hareketleri, kapasite, sahiplendirme başvuruları, personel görevleri, vatandaş ihbarları, raporlar, kullanıcı rolleri ve JSON yedekleme özelliklerini içerir.

## Çalıştırma

Node.js 22.5 veya üzeri gereklidir. Ek paket kurulumu gerekmez:

```bash
npm start
```

Ardından `http://localhost:8080` adresini açın. VS Code içinde **Barınak sistemini çalıştır** hata ayıklama yapılandırması da kullanılabilir.

Veriler `data/barinak.db` SQLite veritabanında saklanır. İlk çalıştırmada örnek veriler otomatik aktarılır. Yönetim ekranından ayrıca JSON yedeği indirilebilir ve geri yüklenebilir.

Yerel geliştirme giriş bilgileri:

- Kullanıcı adı: `admin`
- Şifre: `admin123`

Canlı ortamda varsayılan şifreyi kullanmayın. `ADMIN_USERNAME` ve güçlü bir `ADMIN_PASSWORD` ortam değişkeni tanımlayın.

## Render ile yayınlama

Projede bulunan `render.yaml`, Node servisini, sağlık kontrolünü ve SQLite için 1 GB kalıcı diski tanımlar.

1. Projeyi bir GitHub deposuna gönderin.
2. Render panelinde **New > Blueprint** seçin ve depoyu bağlayın.
3. Blueprint'i oluşturun. Yönetici şifresi Render tarafından güvenli biçimde üretilir.
4. Oluşturulan servisin **Environment** ekranından `ADMIN_PASSWORD` değerini görüntüleyin veya kendi güçlü şifrenizle değiştirin.
5. Dağıtım tamamlandığında verilen `onrender.com` adresinden giriş yapın.

SQLite dosyası Render'da `/opt/render/project/src/data` kalıcı diskinde tutulur.
