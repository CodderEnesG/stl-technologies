# STL Teknoloji — Tam SEO Denetimi

Tarih: 2026-09-11
Site: https://www.stlteknoloji.com
Kapsam: sitemap'teki 14 URL'in tamamı (TR + EN)
Yöntem: 9 uzman ajan paralel, artı doğrudan doğrulama
Kapsam: yalnızca SEO ve GEO. Sitenin görsel tasarımı ve yerleşimi olduğu gibi kalıyor.

## SEO Sağlık Skoru: 63/100

| Kategori | Ağırlık | Skor | Katkı |
|---|---|---|---|
| Teknik SEO | 22% | 84 | 18.5 |
| İçerik Kalitesi | 23% | 50 | 11.5 |
| Sayfa İçi SEO | 20% | 74 | 14.8 |
| Şema / Yapısal Veri | 10% | 68 | 6.8 |
| Performans (CWV) | 10% | 42 | 4.2 |
| AI Arama Hazırlığı | 10% | 52 | 5.2 |
| Görseller | 5% | 45 | 2.3 |

Altyapı çok iyi. İçerik derinliği ve mobil performans zayıf.

## İşletme profili

B2B üretici ve teknoloji şirketi. Dört tüketici markası: wexta (valiz), Fressi (küçük ev aletleri),
BNK / Beauty Net Korea (Kore kozmetik), Oxyra (gaming ekipmanı). Arnavutköy İstanbul'da 35.000 m² tesis.
2016 kuruluş. Yerel hizmet işletmesi değil, e-ticaret yok.

## En kritik 5 sorun

1. KVKK ve GDPR sayfalarında veri sorumlusu kimliği canlıda boş şablon: "XX Ticaret Sicili nezdinde
   00000 sicil numarası ile kayıtlı, 0000000000000000 Mersis numaralı". Hukuki açıklama kusuru.
   Kaynak: src/content/legal.ts:38 ve :70.
2. Mobil LCP felaket: ana sayfa 7.98 sn, /wexta 15.9 sn. Eşik 2.5 sn. Masaüstü sorunsuz (0.8-1.2 sn).
   Tek sebep görsel ağırlığı: 82 görselde 9 MB, hiçbir yerde srcset yok.
3. src/main.tsx `createRoot` kullanıyor, `hydrateRoot` değil. Prerender edilen DOM'u React tamamen
   söküp yeniden kuruyor. Prerender yatırımının CWV getirisi sıfırlanıyor.
4. wexta ve Oxyra'nın hiçbir satın alma yolu yok. Fressi ve BNK kendi mağaza alan adlarına bağlanıyor ve
   bu çalışıyor. wexta ve Oxyra'da karşılığı yok, marka sorguları tamamen Trendyol ve rakiplere gidiyor.
5. Çerez bandı 6 sayfanın 3'ünde birincil içeriği örtüyor. /oxyra masaüstünde H1'in kendisini kesiyor,
   /bnk mobilde birincil CTA'yı tamamen gizliyor.

## En kolay 5 kazanç

1. Kardeş sitelerden geri link. fressihome.com ve beautynetkorea.com.tr ana şirkete hiç link vermiyor.
   Footer'a tek bir anchor link. Maliyet sıfır, tamamen sizin kontrolünüzde.
2. Dört legal sayfanın meta description'ı başlığı tekrarlıyor. Her sayfanın zaten iyi yazılmış ve
   kullanılmayan bir og:description'ı var. Kopyala yapıştır.
3. Tüm img etiketlerine width ve height. Ana sayfada 40 görselin 31'inde, /wexta'da 27'sinin 27'sinde yok.
4. 17 JPEG'i WebP'ye çevir, gradient-koyu.png'yi (302 KB) CSS gradient yap. Site genelinde ~1.5 MB.
5. Ana sayfadaki sayaçlar prerender HTML'de "0", "0 m²", "0" olarak geliyor. Gerçek değerler sadece JS
   animasyonuyla beliriyor. Statik HTML'e gerçek sayıları yaz.

## Teknik SEO — 84/100

Sağlam. Canonical'lar kusursuz, hreflang 14 URL'de tam karşılıklı, x-default doğru. robots.txt AI
tarayıcılarını açıkça izinli yapıyor. Bilinmeyen yollar gerçek 404 döndürüyor, tipik Vite SPA'nın
soft-404'ü değil. Eski siteden 51 yönlendirme test edildi, hepsi 200'e iniyor. Güvenlik başlıkları
güçlü, sadece CSP eksik. Prerender gerçekten çalışıyor: #root içinde gerçek içerik ve sayfa başına tam
1 H1.

Açıklar: createRoot yerine hydrateRoot; dekoratif ExportMap chunk'ı (104 KB) ana sayfada koşulsuz
modulepreload ediliyor; /admin hem robots.txt'de Disallow hem noindex, ikisi birbirini iptal ediyor;
CSP yok; IndexNow yok.

Not: "her sayfada 2 H1" bulgusu incelendi ve reddedildi. İkinci H1 prerender.mjs:222'nin enjekte ettiği
<noscript> bloğunda. Googlebot JS ile render ettiği için hiç görmüyor.

## İçerik — 50/100

E-E-A-T toplamı 44/100. Hakkımızda sayfası yok, ekip sayfası yok, vaka çalışması yok, blog yok. Sadece
ana sayfada gömülü ~100 kelimelik "Biz Kimiz" paragrafı.

Tüm ticari sayfalar kapsam eşiğinin altında: Oxyra 215 kelime (TR), BNK 360, ana sayfa 360, wexta 500,
Fressi 514. Hiçbir sertifika (ISO, CE) hiçbir yerde adı geçmiyor. Fressi elektrikli ev aleti satıyor ve
CE işareti AB'de tipik olarak yasal zorunluluk. Müşteriyle teyit edilmeli.

En büyük kaçırılmış fırsat: gerçek ve güçlü müşteri logosu duvarı (Turkish Airlines, AJet, DeFacto,
Watsons, Slazenger, BİM, LC Waikiki, Kiğılı, D'S Damat) sadece görsel alt metninde duruyor. Taranabilir
metinde hiç geçmiyor, gövde metni sadece "Türkiye'nin önde gelen tekstil markaları" diyor.

Oxyra "ödüllü tasarım" diyor ama hiçbir ödül veya kurum adı yok. BNK'da 3 adet kalıcı "Yakında" blog
kartı canlıda. wexta 2023 tarihli 6.2 MB katalog PDF'ine bağlanıyor, tazelik işareti yok.

## Sayfa İçi — 74/100

Başlıklar 35-59 karakter, hepsi iyi. Marka sayfası açıklamaları güçlü. Sayfa başına tam 1 H1 ve marka
sayfalarında H1 > H2 > H3 hiyerarşisi doğru.

Sorunlar: ana sayfa ve /en'de görünür H1 yok, tek H1 sr-only ve title ile birebir aynı. Ana sayfa hero
sloganları <p> içinde, başlık ağırlığı taşımıyor. Dört legal sayfanın açıklaması başlığı tekrarlıyor.
İç link grafiği düz ve eksiksiz, her sayfa her sayfaya bağlı, ama anchor metinleri marka adı ve slogan.
"valiz", "küçük ev aletleri" gibi kategori anchorları hiç yok. wexta'da "bavul" eşanlamlısı hiç geçmiyor.

## Şema — 68/100

14 sayfanın hepsinde geçerli JSON-LD, tek bir parse hatası yok. Organization + Corporation, WebSite,
BreadcrumbList, ContactPoint, PostalAddress hepsi doğru. Canonical eşleşmesi ve inLanguage tam.

İki yapısal hata: Organization iki farklı @id altında ikiye bölünmüş (#organization ve en#organization),
bu iki ayrı kuruluş gibi okunuyor. Ve 16 Brand düğümünün hiçbirinde @id yok, yani ana sayfadaki wexta ile
/wexta'daki wexta'nın aynı varlık olduğunu hiçbir şey söylemiyor.

Kullanılmayan fırsatlar: wexta'nın 9 gerçek serisi ProductGroup için ders kitabı örneği. Oxyra Mooncha
koltuğunun somut teknik özellikleri Product için yeterli. BNK'nın 8 çok satanı ItemList. areaServed ve
foundingLocation zaten sitedeki gerçek veriden eklenebilir.

## Performans — 42/100

Sadece laboratuvar verisi. Google API anahtarı yok, CrUX saha verisi alınamadı.

| Sayfa / cihaz | TTFB | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|
| Ana sayfa masaüstü | 55ms | 764ms | 812ms | 0.0001 | 0ms |
| Ana sayfa mobil | 112ms | 1644ms | 7976ms | 0.0088 | 0ms |
| /wexta masaüstü | 168ms | 1028ms | 1232ms | 0.0006 | 0ms |
| /wexta mobil | 66ms | 1392ms | 15936ms | 0.0010 | 3ms |

TTFB her yerde mükemmel. JS ve CSS sorun değil: ana sayfa 178 KB JS, tek 12 KB CSS, TBT sıfır. Sorun
tamamen görsel. Ayrıca src/index.css'in ilk satırı altı Google Fonts ailesini @import ediyor
(Manrope, Inter, Nunito, Playwrite NO, Figtree, Poppins), preconnect yok, üçüncü taraf kritik yol.

src/content/remote.ts her ziyaretçi sayfa yüklemesinde Supabase'e istek atıp admin panelinden düzenlenen
metinleri çekiyor. Güvenli başarısız oluyor ama boyamadan sonra metin değiştirebiliyor.

## AI Arama Hazırlığı — 52/100

Teknik taban çok iyi, otorite tavanı zayıf. robots.txt tüm AI tarayıcılarını açıkça izinli yapıyor ve
/llms.txt zaten var, iyi yazılmış.

Zayıflık alıntılanabilirlikte: her "hakkında" pasajı 28-52 kelime, ideal alıntı uzunluğunun üçte biri.
"20 ülkeye ihracat" iddiası 5+ yerde tekrar ediyor ama ihracat bölümü "Ülke listesi güncellenecektir."
yazıyor. Destekleyen tek bir ülke adı yok.

Dışarıdan doğrulama yok: sameAs sadece Instagram, kardeş siteler geri link vermiyor, wexta ve Oxyra'nın
bağımsız web varlığı yok.

## Görseller — 45/100

82 benzersiz görsel, 9.00 MB. 43 WebP, 20 SVG, 17 JPEG, 2 PNG.

Sayfa yükleri: /wexta 3.10 MB, /oxyra 2.80 MB, /fressi 1.65 MB, ana sayfa 1.19 MB, /bnk 1.07 MB.

Hiçbir yerde srcset, sizes veya <picture> yok. 390 piksellik telefon, masaüstüyle aynı 485 KB hero'yu
indiriyor. En büyük LCP adayı wexta-cover.jpg 485 KB ve alt metni boş. gradient-koyu.png bir gradient ve
302 KB.

## Geri Linkler — veri yetersiz

Tier 0. Moz, Bing Webmaster ve DataForSEO yok. Common Crawl stlteknoloji.com'u hiç görmüyor, bu sıfır
backlink kanıtı değil sadece bu ücretsiz örneğin kaydı olmadığı anlamına geliyor.

Doğrudan doğrulanan tek şey ve en değerlisi: fressihome.com ve beautynetkorea.com.tr ana şirkete link
vermiyor. Fressi sadece linksiz künye metninde adı geçiriyor, BNK ana sayfasında STL hiç geçmiyor.
wexta.com.tr çözümlenmiyor. oxyra.com üçüncü şahsa ait park edilmiş satılık sayfa.

## Arama Deneyimi (SXO) — 41/100

Test edilen 8 gerçekçi sorgunun sadece 1'inde rekabetçi (stl teknoloji). Diğer 7'sinde görünmez.

İki kök sebep: wexta ve Oxyra'nın satın alma yolu yok; ve hiçbir B2B/fason üretim sayfası yok.
"valiz üreticisi", "fason üretim istanbul" gibi sorguları özel üretici hizmet sayfaları ve B2B dizinleri
kazanıyor (europages, fasonuretim.tr, ZUCDER).

Ayrı bir risk: "beauty net korea" aynı adlı alakasız bir Güney Koreli K-beauty toptancısıyla çakışıyor.

## Sitemap — temiz

XML geçerli, 14 URL, hreflang tam karşılıklı, yetim URL yok, linklenip sitemap'te olmayan sayfa yok.
Tek kusur: lastmod 14 URL'de aynı (build tarihi). priority kullanılıyor ama Google 2020'den beri
yok sayıyor.

## Denetimin sınırları

Google API kimlik bilgisi yok: CrUX saha verisi, Search Console indeksleme durumu, GA4 organik trafik
alınamadı. Moz ve Bing Webmaster yok, backlink profili ölçülemedi. DataForSEO yok, gerçek SERP
pozisyonu ölçülemedi. SXO analizi web arama sonuçlarına dayanıyor, yakalanmış SERP HTML'ine değil, bu
yüzden önem dereceleri yönseldir. Tüm CWV sayıları laboratuvar, saha değil.
