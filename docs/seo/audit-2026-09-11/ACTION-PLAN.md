# STL Teknoloji — Öncelikli Aksiyon Planı

2026-09-11 denetiminden. Sıra: etki bölü efor.

KAPSAM: yalnızca SEO ve GEO. Sitenin görsel tasarımı ve yerleşimi olduğu gibi kalıyor. Tasarım
değişikliği gerektiren maddeler (çerez bandı yerleşimi, dokunma hedefi boyutları, ekran üstü yerleşim,
punto büyüklükleri) bu plandan çıkarıldı ve aşağıda ayrı bir başlıkta yalnızca bilgi olarak duruyor.

## KRİTİK — hemen

### 1. KVKK ve GDPR sayfalarındaki boş hukuki şablonu doldur
Dosya: src/content/legal.ts:38 (TR), :70 (EN)
Canlıda: "XX Ticaret Sicili nezdinde 00000 sicil numarası ile kayıtlı, 0000000000000000 Mersis
numaralı". Veri sorumlusu kimliği KVKK'da zorunlu. Gerçek ticaret sicil ve MERSİS numaralarını al ve
yaz. Şemaya identifier/vatID olarak ancak bundan sonra ekle.
Efor: düşük. Blokaj: gerçek numaralar gerekiyor.

### 2. Mobil LCP'yi düzelt
Şu an ana sayfa 7,98 sn, /wexta 15,9 sn. Hedef 2,5 sn altı. Hiçbiri görünümü değiştirmez, aynı
görselin daha küçük varyantları servis edilir.
a. Tüm hero ve ürün görsellerine srcset + sizes. Vite'da vite-imagetools varyantları build'de üretir.
b. Kalan 17 JPEG'i WebP'ye çevir.
c. wexta-cover.jpg'yi yeniden sıkıştır. 485 KB, teslim boyutunda 150 KB altında olmalı.
d. gradient-koyu.png (302 KB) CSS linear-gradient olsun. Çıktı pikselleri aynı kalır.
e. Sayfa başına gerçek LCP görseli için <link rel="preload" as="image" fetchpriority="high">.
Önce /wexta ve /oxyra, en ağır sayfalar.
Efor: orta. Tek başına en büyük teknik kazanç.

## YÜKSEK — bu hafta

### 3. createRoot yerine hydrateRoot
Dosya: src/main.tsx
Önce scripts/prerender.mjs'teki 3 kasıtlı SSR/CSR farkını uzlaştır, yoksa hydration uyuşmazlık verip
zaten tam yeniden render'a düşer:
- 400 karakterden uzun path[d] öznitelikleri export-map SVG'sinden çıkarılıyor
- çerez bandı anlık görüntüden çıkarılıyor
- [data-reveal] elemanları anlık görüntüde is-in'e zorlanıyor
Efor: orta. İçerik indekslemesi risk altında değil, bu tamamen CWV meselesi.

### 4. Ana sayfa sayaçlarını statik HTML'e yaz
Prerender çıktısında "0", "0 m²", "0" görünüyor. Gerçek değerler (2016, 35.000 m², 20 ülke) yalnızca JS
animasyonuyla geliyor. Sitenin en alıntılanabilir üç sayısı tarayıcı ve AI motoru için sıfırlanmış
durumda. Görsel değişmeden, başlangıç değerini gerçek sayı yapıp animasyonu oradan başlat.
Efor: düşük.

### 5. Kardeş sitelerden geri link
fressihome.com ve beautynetkorea.com.tr ana şirkete hiç link vermiyor. İkisi de sizin.
Footer'a gerçek bir anchor link ekle: "STL Teknoloji markasıdır" + kurumsal link.
wexta için çalışan bir alan adı al, ya da en azından Trendyol ve Evidea satıcı profillerine üretici
atfı ekle. oxyra.com üçüncü şahsa ait, kullanmaya çalışma.
Efor: çok düşük. Denetimdeki en yüksek güvenli en ucuz kazanç. Hem backlink hem GEO varlık doğrulaması.

### 6. Müşteri logosu duvarını metne taşı
Turkish Airlines, AJet, DeFacto, Watsons, Slazenger, BİM, LC Waikiki, Kiğılı, D'S Damat şu an yalnızca
görsel alt metninde. Logolara dokunmadan, bu isimleri anan görünür bir cümle ekle. Hem otoriteyi hem AI
alıntılanabilirliğini aynı anda düzeltir.
Efor: düşük.

### 7. İletişim formunu gerçek bir endpoint'e bağla
Dosya: src/components/sections/index.tsx:399
Form var ama submit handler window.location.href ile mailto: açıyor. Kod yorumu kabul ediyor:
"Form şimdilik mailto açar (Web3Forms endpoint'i eklenebilir)". Mail istemcisi tanımlı olmayan her
cihazda talep sessizce kayboluyor. Formun görünümü değişmez, yalnızca handler değişir.
Efor: düşük.

## ORTA — bu ay

### 8. "20 ülke" iddiasını kapat
5+ yerde ve llms.txt'te geçiyor ama ihracat bölümü "Ülke listesi güncellenecektir." diyor. Gerçek ülke
adlarını yaz ya da cümleyi kaldır. Doğrulanamayan sayısal iddia AI alıntı güvenini düşürüyor.
Aynı şekilde Oxyra'daki "ödüllü tasarım" ya ödülün ve kurumun adını versin ya da çıksın.

### 9. Marka sayfalarını derinleştir
Hepsi kapsam eşiğinin altında, Oxyra 215 kelimeyle kritik seviyede. 800 kelime civarına çıkar: bakım,
garanti, beden ve malzeme derinliği. Mevcut bölüm yapısı korunarak metin uzatılabilir.

### 10. Hakkımızda sayfası
800-1200 kelime: adıyla yönetim, gerçekten sahip olunan sertifikalar, zaman çizelgesi, kalite kontrol
süreci. Mevcut Organization JSON-LD'sinin doğal iniş hedefi olur. Ardından 3-5 vaka çalışması,
150-300 kelime, zaten var olan müşteri ilişkilerinden.

### 11. /fason-uretim sayfası
"valiz üreticisi", "fason üretim istanbul" gibi B2B sorgularını özel üretici hizmet sayfaları kazanıyor.
Sitede hiç yok. Logo duvarını, kapasiteyi ve THY ödülünü öne çıkaran bir sayfa kur. Ardından europages,
fasonuretim.tr ve ZUCDER'e kaydol.

### 12. Tüm img etiketlerine width ve height
Ana sayfada 40'ın 31'inde, /wexta'da 27'nin 27'sinde yok. Laboratuvarda CLS şu an geçiyor ama bu
tetiklenmemiş gizli risk. Öznitelik eklemek görünümü değiştirmez.

### 13. Şema grafiğini onar
Saf metadata, görünen hiçbir şey değişmiyor.
- en.html'deki Organization'ı ayrı @id yerine kanonik #organization ile birleştir, 7 EN sayfasındaki
  publisher referansını da güncelle
- her Brand'e kanonik @id ver, diğer her yerde stub referans kullan
- 4 legal sayfaya BreadcrumbList ekle
- Organization'a areaServed ve foundingLocation ekle, ikisi de sitedeki gerçek veriden
- sameAs'e LinkedIn ekle, gerçek profil varsa YouTube

### 14. Legal sayfaların meta description'ı
Dördü de başlığı tekrarlıyor. Her birinin zaten iyi yazılmış kullanılmayan bir og:description'ı var.
Kopyala. Efor: önemsiz.

### 15. Görsel alt metinleri
Hero görseli wexta-cover.jpg fetchpriority=high taşıyor ve alt metni boş. Ürün fotoğraflarının alt
metinleri ya boş ya sadece marka adı. Görsel aramada tamamen görünmez durumdalar. Marka wordmark
SVG'lerinde de alt yok.

### 16. Google Fonts @import'unu temizle
src/index.css satır 1 altı aile çekiyor (Manrope, Inter, Nunito, Playwrite NO, Figtree, Poppins),
preconnect yok, üçüncü taraf kritik yol. Hangilerinin gerçekten render edildiğini denetle, kullanılanları
self-host edip preload et, kalanını kaldır. Kullanılan yüzler aynı kaldığı sürece görünüm değişmez.

## DÜŞÜK — biriktir

17. wexta 9 serisi için ProductGroup, Oxyra Mooncha için Product, BNK çok satanları için ItemList şeması
18. Anchor metinlerine kategori kelimeleri: "valiz", "küçük ev aletleri". wexta'ya "bavul" eşanlamlısı
19. BNK'daki 3 "Yakında" blog kartını ya yayınla ya kaldır
20. 2023 katalog PDF'ini tazele ya da tarih etiketi koy. 6,2 MB, sıkıştırılabilir
21. vercel.json'a Content-Security-Policy başlığı
22. /admin için robots.txt Disallow ile noindex çakışmasını çöz, gerçek kimlik doğrulama koy
23. IndexNow kur, 14 kanonik URL'i gönder. 51 eski yönlendirme yeni taşındığı için değerli
24. sitemap lastmod'unu gerçek sayfa değişiklik tarihine bağla
25. Marka pasajlarını 134-167 kelimeye çıkar, AI alıntısı için ideal uzunluk
26. İTO, TOBB, TİM ve ihracat birliği kayıtlarını kontrol et ve tamamla
27. Supabase site_content isteğinin boyamadan sonra metin değiştirip değiştirmediğini doğrula

## Kapsam dışı bırakılanlar

Denetimde çıktı ama tasarıma dokunduğu için uygulanmayacak. Kayıt olsun diye duruyor:
- Çerez bandı /oxyra masaüstünde H1'i kesiyor, /bnk mobilde birincil CTA'yı gizliyor
- Mobil dokunma hedefleri küçük: dil değiştirici 42x30, hamburger 40x40, çerez düğmeleri 104x42
- Ana sayfada ekranın üstünde şirketi anlatan görünür metin yok, yalnızca marka karoları
- Ana sayfanın tek H1'i sr-only. SEO açısından geçerli, yalnızca görsel bir eksiklik
- Bölüm üstü etiketleri 11-12px ve opacity düşük

## Ölçümü mümkün kılmak için

Denetimin en büyük kısıtı veri yokluğuydu. Şunlar kurulmadan ilerleme ölçülemez:
- Google Search Console doğrulaması ve API kimlik bilgisi. İndeksleme durumu, tıklama, gösterim, pozisyon
- PageSpeed Insights API anahtarı. CrUX saha verisi, laboratuvar değil gerçek kullanıcı CWV
- GA4 API erişimi. Organik trafik eğilimi
Üçü de ücretsiz. Bir sonraki denetimden önce yapılmalı.
