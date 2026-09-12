# Sabah raporu — 2026-09-11 gecesi

## Kısa özet

SEO sağlık skoru 63'ten 76'ya çıktı. Mobil LCP ana sayfada 7,98 saniyeden 2,46 saniyeye indi.
Aksiyon planından 12 madde uygulandı, 2 madde denendi ve ölçüm sonucu geri alındı, 9 madde sizden
bilgi ya da karar bekliyor.

Sitenin görsel tasarımına dokunulmadı. Her sayfa değişiklik öncesi ve sonrası ekran görüntüsüyle
karşılaştırıldı, fark yok.

## Önce bakmanız gerekenler

**1. Hiçbir şey commit edilmedi.** 294 dosya çalışma ağacında duruyor: 32 değişen kaynak dosya,
4 yeni kaynak dosya, 257 üretilmiş görsel varyantı. Branch `main`, son commit hâlâ `c66c313`.
Commit ve dağıtım sizin kararınız.

**2. Görünür bir metin değişikliği yaptım.** "Türkiye'nin önde gelen tekstil markaları" cümlesi artık
Turkish Airlines, AJet, DeFacto, LC Waikiki, Watsons, BİM, Slazenger, Kiğılı ve D'S Damat adlarını
anıyor (TR ve EN). İddia seviyesini değiştirmedim, bu isimler zaten logo şeridinde ve alt
metinlerindeydi. Ama görünür metin olduğu için onayınızı istiyorum.
Geri almak isterseniz: `src/content/tr.ts` ve `src/content/en.ts`, `whoWeAre.paragraphs` ikinci fıkra.

**3. KVKK metnine dokunmadım.** Boş şablon kalsın dediniz, öyle kaldı.

## Ölçülen sonuç

Mobil, 390px, 4x CPU yavaşlatma, yavaş 4G, üç koşunun ortancası. Hepsi laboratuvar verisi.

| Sayfa | LCP önce | LCP sonra | Durum |
|---|---|---|---|
| Ana sayfa | 7.976 ms | 2.456 ms | eşiğin altında |
| /oxyra | ölçülmedi | 1.996 ms | eşiğin altında |
| /wexta | 15.936 ms | 4.400 ms | hâlâ üstünde |

Mobil görsel yükü /oxyra'da 2,80 MB'dan 0,27 MB'a, /wexta'da 3,10 MB'dan 0,99 MB'a indi.
CLS her sayfada 0,02'nin altında. Ana sayfa FCP 2.676 ms'den 2.272 ms'ye indi.

## Uygulananlar

1. Duyarlı görsel hattı: yeni `scripts/images.mjs` + `src/components/Img.tsx` + üretilmiş katalog.
   56 görsel etiketi taşındı. Vercel derlemesine bağımlılık eklenmedi.
2. Ana sayfa sayaçları statik HTML'de artık gerçek sayı (2016, 35.000 m², 20). Önceden üçü de sıfırdı.
3. Şema grafiği: tek Organization kimliği, dört kanonik Brand kimliği, yasal sayfalara kırıntı,
   `areaServed` ve `foundingLocation`.
4. Yasal sayfaların meta açıklaması düzeldi. Kök neden `src/pages/Legal.tsx` idi, ön-render değil.
5. JavaScript çalıştırmayan tarayıcı artık içeriği görüyor (`html.js` kapısı). `Reveal` bileşeni
   sınıfı React ile render ediyor, doğrudan DOM'a yazmıyor.
6. Müşteri markaları düz metinde. Alt bilgi bağlantılarına kategori kelimeleri (görünmez).
7. Google Fonts `@import` yerine `link` + iki `preconnect`.
8. Sitemap `lastmod` gerçek commit tarihinden, `priority` kaldırıldı.
9. robots.txt'ten `Disallow: /admin` kaldırıldı; sayfa zaten `noindex` taşıyor.
10. IndexNow kuruldu: `pnpm run indexnow`, dağıtım canlıya çıktıktan SONRA.
11. `vercel.json`'a Content-Security-Policy. Yerelde beş sayfada test edildi, sıfır ihlal.
12. Ön-render betiğindeki şablon kirlenmesi hatası düzeltildi, betik artık idempotent.

## Denenip geri alınanlar

**hydrateRoot.** Denetimin en yüksek öncelikli teknik maddesiydi, uygulanabilir çıkmadı. Rotalar
`lazy` ile yükleniyor ve yönlendiriciye `HydrateFallback` verilmemiş; React Router ilk render'da boş
dönüyor, chunk gelince gerçek ağacı ekliyor. Sonuç devralma değil ikizleme: `#root` altında iki ağaç,
her görsel iki kez, ana sayfa hero'su boş. Gerçek çözüm yönlendiriciyi değiştirmek. Not `src/main.tsx`
içinde duruyor.

**LCP görseli için preload.** Ölçümde zarar verdi (`/wexta` 4.396 → 5.296 ms). Geri alındı.

## Düzeltilen yanlış bulgular

Denetimdeki iki madde incelendi ve elendi: "her sayfada iki H1" (ikincisi `<noscript>` içinde,
Googlebot görmüyor) ve "görsellerin alt metni boş" (24'ü `aria-hidden` ile bilinçli dekoratif,
gerçekten eksik olan iki taneydi).

## Sizden bekleyenler

Veri:
- 20 ihracat ülkesinin listesi. Kod tarafı hazır, liste gelince metin, şema ve harita aynı anda dolar.
- Sahip olunan sertifikalar (ISO, CE). Fressi elektrikli ev aleti satıyor, CE ayrıca teyit edilmeli.
- Oxyra'daki "ödüllü tasarım" ifadesinin ödülü ve veren kurumu.
- LinkedIn ve YouTube profilleri, varsa şemaya eklenecek.

Karar:
- İletişim formu için bir form servisi. Şu an posta istemcisi açıyor, backend yok.
- fressihome.com ve beautynetkorea.com.tr footer'ına ana şirkete link. En ucuz kazanç.
- Hakkımızda sayfası, vaka çalışmaları, fason üretim / B2B sayfası.
- wexta ve Oxyra için satın alma yolu.

Kurulum (üçü de ücretsiz, ilerleme bunlarsız ölçülemez):
- Google Search Console API
- PageSpeed Insights anahtarı
- GA4 API

## Dosyalar

- `docs/seo/audit-2026-09-11/UYGULANANLAR.md` — teknik ayrıntı
- `docs/seo/audit-2026-09-11/FULL-AUDIT-REPORT.md` — denetimin kendisi
- `docs/seo/audit-2026-09-11/ACTION-PLAN.md` — tam aksiyon planı
- `docs/seo/audit-2026-09-11/findings-*.md` — uzman raporları

## Dağıtmak isterseniz

```
git checkout -b seo-optimizasyon
git add -A
git commit -m "SEO ve GEO optimizasyonu: duyarlı görseller, şema grafiği, CSP, IndexNow"
git push -u origin seo-optimizasyon
```

Vercel önizleme dağıtımında `/wexta` ve `/oxyra` sayfalarını bir kez gözden geçirin; görseller en çok
oralarda değişti. Canlıya çıktıktan sonra `pnpm run indexnow`.
