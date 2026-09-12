# Uygulananlar — 2026-09-11 gecesi

Denetimin aksiyon planından hayata geçirilenler. Hepsi çalışma ağacında, commit edilmedi.
Sitenin görsel tasarımına dokunulmadı; her sayfa ekran görüntüsüyle karşılaştırıldı.

## Ölçülen sonuç

Mobil, 390px, 4x CPU yavaşlatma, yavaş 4G, 3 koşunun ortancası.

| Sayfa | LCP önce | LCP sonra |
|---|---|---|
| / | 7.976 ms | 2.456 ms |
| /wexta | 15.936 ms | 4.400 ms |
| /oxyra | ölçülmedi | 1.996 ms |

Mobil görsel yükü:

| Sayfa | Önce | Sonra |
|---|---|---|
| /oxyra | 2,80 MB | 0,27 MB |
| /wexta | 3,10 MB | 0,99 MB |
| /fressi | 1,65 MB | 0,46 MB |
| / | 1,19 MB | 0,44 MB |
| /bnk | 1,07 MB | 0,50 MB |

CLS her sayfada 0,02'nin altında. FCP ana sayfada 2.676 ms'den 2.272 ms'ye indi.

## 1. Duyarlı görsel hattı — YENİ

`scripts/images.mjs` her fotoğraf için 480/960/1440 genişliklerinde WebP üretir ve gerçek piksel
boyutlarını `src/data/imageManifest.ts` kataloğuna yazar. `pnpm run images` ile elle çalışır, çıktı
depoya işlenir. Vercel derlemesine yeni bağımlılık eklenmedi.

`src/components/Img.tsx` katalogdan `srcset`, `sizes`, `width` ve `height` üretir. 56 `<img>` etiketi
buna taşındı. Katalogda olmayan görsel (logo SVG'leri) düz `<img>` olarak çıkar.

`width`/`height` her fotoğrafta artık var; CLS riski kapandı. Hero 497 KB'dan 44 KB'a (480w) indi.

## 2. Ana sayfa sayaçları

`CountUp` ilk render'da hedef değeri basıyor, sıfırı değil. Ekran dışındaysa sıfıra inip görünüme
girince sayıyor; zaten ekrandaysa animasyon hiç oynamıyor (gerçek sayıyı görüp sonra sıfıra düşmek
yanıp sönme olurdu). Ön-render betiği `data-countup` ile metni sabitliyor.

Statik HTML'de artık `2016`, `35.000 m²`, `20` var. Önceden üçü de `0` idi.

## 3. Legal sayfaların meta açıklaması

Kök neden ön-render değilmiş: `src/pages/Legal.tsx` istemcide açıklama olarak `doc.title`
geçiriyordu, `doc.description` değil. Ön-render doğru metni yazıyor, React üstüne başlığı basıyordu.

Dört açıklama ayrıca 180-188 karakterden 134-144 karaktere kısaltıldı, arama sonucunda kesilmesin diye.

## 4. Şema grafiği onarıldı

- Organization tek `@id` altında toplandı. Önceden TR ve EN ana sayfaları iki ayrı kuruluş
  tanımlıyordu (`/#organization` ve `/en#organization`), bu varlık birleştirmesini bölüyordu.
- Dört markaya kanonik `@id` verildi, diğer her yer referans veriyor. Önceden 16 bağlantısız Brand
  düğümü vardı ve hiçbir şey aynı marka olduklarını söylemiyordu.
- Dört legal sayfaya `BreadcrumbList` eklendi.
- Organization'a `areaServed` ve `foundingLocation` eklendi, ikisi de sitedeki doğrulanmış veriden.
- Uydurma veri eklenmedi: `vatID`, `numberOfEmployees` ve `award` müşteriden gerçek değer gelene
  kadar yok.

## 5. Kaydırma animasyonları JavaScript'siz istemcide içeriği gizlemiyor

`[data-reveal]` başlangıç saydamlığı artık `html.js` ile kapılı; sınıfı `index.html`'deki satır içi
betik boyamadan önce ekliyor. JavaScript çalıştırmayan tarayıcı (arama ve AI tarayıcıları dahil)
içeriği görüyor.

`Reveal` bileşeni `is-in` sınıfını artık React ile render ediyor, doğrudan DOM'a yazmıyor. Eski hâli
bayat düğüme yazabildiği için bölümler kalıcı olarak saydam kalabiliyordu.

## 6. Font yükleme

Altı Google Fonts ailesi `src/index.css`'in ilk satırında `@import` ile geliyordu: tarayıcı önce site
CSS'ini indirip ayrıştırmadan font isteğini başlatamıyordu. `index.html`'e `<link>` ve iki
`preconnect` olarak taşındı. Ana sayfa FCP 2.676 ms'den 2.272 ms'ye indi.

Altı ailenin hepsi gerçekten kullanılıyor, bu yüzden hiçbiri kaldırılmadı.

## 7. Sitemap

`lastmod` artık sayfayı üreten dosyalara dokunan son commit'in tarihi. Önceden 14 adresin hepsi
derleme tarihini taşıyordu. Legal sayfalar şimdi 2026-09-08, diğerleri 2026-09-10 gösteriyor.

`<priority>` kaldırıldı: Google 2020'den beri yok sayıyor.

## 8. robots.txt — /admin

`Disallow: /admin` kaldırıldı. Sayfa zaten `noindex, nofollow` taşıyor; taramayı engellemek Google'ın
o etiketi görmesini de engelliyordu, yani adres dışarıdan keşfedilirse yine dizine girebiliyordu.
Panelin önünde gerçek Supabase parola doğrulaması var. Yan fayda: yönetim adresi artık herkese açık
bir dosyada ilan edilmiyor.

## 9. IndexNow

`scripts/indexnow.mjs` kanonik adresleri Bing, Yandex, Naver ve Seznam'a bildirir. Doğrulama dosyası
ön-render sırasında yazılıyor. `pnpm run indexnow` ile, dağıtım canlıya çıktıktan SONRA çalıştırılır.
Google IndexNow kullanmıyor, orası Search Console üzerinden ilerler.

## 10. Content-Security-Policy

`vercel.json`'a eklendi. Yerelde beş sayfada, çerez onayı verilmiş hâlde test edildi, sıfır ihlal.
GA4, Google Fonts ve Supabase kaynakları açıkça izinli.

## 11. İçerik — GEO

Müşteri logoları artık düz metinde de geçiyor. "Türkiye'nin önde gelen tekstil markaları" cümlesi
Turkish Airlines, AJet, DeFacto, LC Waikiki, Watsons, BİM, Slazenger, Kiğılı ve D'S Damat adlarını
anıyor. İddia seviyesi değiştirilmedi; bu isimler zaten logo şeridinde ve alt metinlerinde vardı.

Alt bilgideki marka bağlantılarına kategori kelimeleri eklendi (`sr-only`): "Valiz ve seyahat",
"Küçük ev aletleri", "Kore cilt bakımı", "Oyuncu koltuğu ve gaming ekipmanları". Ekranda görünmez,
bağlantı metnine dahildir. Hem ekran okuyucu hem arama motoru için açıklayıcı.

## 12. Ön-render betiğinde bulunan hata

Betik şablonu `dist/index.html`'den okuyor ama ana sayfayı da aynı dosyaya yazıyordu. Derlemeden
sonra ikinci kez çalıştırılınca kendi çıktısını şablon sanıp etiketleri üst üste biriktiriyordu.
Temiz kopya artık `dist/.prerender-shell.html`'de tutuluyor. `pnpm prerender` idempotent.

## Denenip geri alınanlar

**hydrateRoot.** Ön-render edilen DOM'u devralmak yerine ikizliyordu: `#root` altında biri
ön-render'dan kalan öksüz, diğeri React'in kurduğu iki ağaç, sayfadaki her görsel ve bağlantı iki
kez, ana sayfa hero'su boş. Sebep rotaların `lazy` ile yüklenmesi ve yönlendiriciye `HydrateFallback`
verilmemiş olması: React Router ilk render'da boş dönüyor, chunk gelince gerçek ağacı ekliyor.

Gerçek çözüm yönlendiriciyi değiştirmek — ya eşleşen rotayı eager yapmak (ilk paketi ~30 KB gzip
büyütür, mobilde yeni düzelttiğimiz LCP'yi geri bozabilir) ya da React Router'ın SSR kipine geçmek.
Bu işin kapsamı dışında. `src/main.tsx` içinde not olarak duruyor.

**LCP görseli için preload.** Ölçümde zarar verdi: `/wexta` LCP 4.396 ms'den 5.296 ms'ye çıktı,
`/oxyra` CLS 0,0094'ten 0,0941'e. Muhtemelen çift indirme. Geri alındı.

## Düzeltilen yanlış bulgular

**"Her sayfada iki H1."** İkinci H1 ön-render betiğinin enjekte ettiği `<noscript>` bloğunda.
Googlebot JavaScript ile render ettiği için onu hiç görmüyor. Her sayfada gerçekte tam bir H1 var.

**"Görsellerin alt metni boş."** 58 etiketin 32'sinde gerçek alt var, 24'ünde `alt=""` ve yanında
`aria-hidden` (bilinçli dekoratif, doğru kullanım). Gerçekten eksik olan iki taneydi, biri de zaten
`aria-hidden` bir kapsayıcının içindeydi. Hero'nun boş alt'ı da hata değil: üstünde wordmark ve
slogan var, anlamı onlar taşıyor. Yalnızca BNK yazı kartına başlık alt'ı eklendi.

## Sırada bekleyenler

Müşteriden veri gerektirenler:
- KVKK/GDPR metnindeki ticaret sicil ve MERSİS numaraları (kullanıcı kararıyla şimdilik olduğu gibi)
- 20 ihracat ülkesinin listesi — iddia sitede beş yerde geçiyor, altında "Ülke listesi
  güncellenecektir." yazıyor
- Sahip olunan sertifikalar (ISO, CE)
- Oxyra'daki "ödüllü tasarım" ifadesinin dayanağı
- LinkedIn ve YouTube profilleri (varsa `sameAs`'e eklenecek)

Karar gerektirenler:
- İletişim formu hâlâ `mailto:` açıyor, backend yok (`src/components/sections/index.tsx`)
- Hakkımızda sayfası, vaka çalışmaları, /fason-uretim B2B sayfası
- fressihome.com ve beautynetkorea.com.tr'den ana şirkete geri link
- wexta ve Oxyra için satın alma yolu

Ölçüm altyapısı (üçü de ücretsiz, bir sonraki denetimden önce kurulmalı):
- Google Search Console API
- PageSpeed Insights anahtarı (CrUX saha verisi)
- GA4 API
