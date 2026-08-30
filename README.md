# STL Teknoloji — Kurumsal Web Sitesi

Dört markayı (Oxyra, Fressi, wexta, BNK) tek çatı altında toplayan çok markalı kurumsal vitrin sitesi.

## Çalıştırma

```bash
pnpm install
pnpm dev        # http://localhost:8443
pnpm build      # dist/
pnpm preview    # build çıktısını yerelde sunar
```

## Metin değiştirme

Sitedeki **tüm metinler** iki dosyada:

- `src/content/tr.ts` — Türkçe (ana kaynak)
- `src/content/en.ts` — İngilizce (aynı yapıyı birebir izler)

Kurumsal bilgiler (adres, telefon, e-posta, KVKK linkleri) tek yerde: `src/data/company.ts`.
Marka renkleri, logoları, ürün listeleri: `src/data/brands.ts`.

## Yapı

```
src/
├── content/           tr.ts, en.ts — tüm site metinleri
├── data/              company.ts (kurumsal), brands.ts (marka görsel kimliği + ürünler)
├── i18n/              dil altyapısı; TR kökte, EN /en/* altında
├── components/
│   ├── hero/          4 ana sayfa hero varyantı (?hero=1..4)
│   ├── brand/         marka sayfası section'ları + wexta slider
│   ├── sections/      çatı sayfa bölümleri (hakkımızda, misyon/vizyon, bento,
│   │                  markalar ızgarası, satış kanalları, iletişim)
│   ├── BrandCube.tsx  markalar küpü (dar ekran / reduced-motion'da ızgaraya düşer)
│   └── ExportMap.tsx  ihracat haritası (veri: data/worldPaths.ts)
└── pages/             Home, Oxyra, Fressi, Wexta, BNK, NotFound
```

## Tek sayfa çatı

Hakkımızda ve İletişim ayrı sayfa **değil**; ana sayfanın bölümleri. Navbar ve footer
bağlantıları `#hakkimizda`, `#markalar`, `#iletisim` çıpalarına gider (`src/i18n/index.tsx`
içindeki `sectionIds`). Marka sayfasından çıpaya tıklanınca `Root.tsx` ana sayfayı
yükleyip hedefe kaydırır.

## Diller

| Sayfa | TR | EN |
|---|---|---|
| Ana sayfa | `/` | `/en` |
| Markalar | `/oxyra` `/fressi` `/wexta` `/bnk` | `/en/oxyra` … |

## Hero varyantları

Ana sayfada sağ altta 1–4 seçici var (veya `?hero=2` gibi). Müşteri seçimi netleşince
`src/components/hero/index.tsx` içindeki seçici kaldırılır ve seçilen varyant doğrudan
render edilir; kalan bileşenler silinir.

## Deploy (Vercel)

`vercel.json` hazır: framework `vite`, build `pnpm build`, çıktı `dist`, SPA rewrite tanımlı.
Vercel'de repoyu içe aktarmak yeterli, ek ayar gerekmiyor.

**Yayına almadan önce:** `.figma/make/site.json` içinde `robots.index` değerini `true` yapın.
Şu an `false` — site `noindex` olarak yayınlanır ve `robots.txt` içinde `Disallow: /` gönderilir
(test yayınları için doğru davranış).

## Tipografi

Çatı sitenin fontu **Gilroy** — kurumsal logodaki "TEKNOLOJİ" wordmark'ının fontu.
`general_assets/fressi/Eski/gilroy/*.ttf` kaynağından Türkçe alt kümeyle woff2'ye
çevrildi (`public/fonts/Gilroy-*.woff2`, 4 kesit: 500/600/700/900). Adobe Typekit
(`co-headline`/`co-text`) bağımlılığı kaldırıldı.

Marka sayfaları kendi fontlarını korur: Oxyra → Manifold Extended CF, Fressi → Nunito +
Playwrite NO, wexta ve BNK → Poppins.

## Bekleyen işler

- [ ] Müşteri hero varyantı seçimi
- [ ] `robots.index: true` (yayın öncesi)
- [ ] İletişim formu şu an `mailto:` açıyor — Web3Forms/Formspree endpoint'i eklenebilir
- [ ] Ana sayfadaki satış kanalı listesi metin; gerçek logolarla değişecek
- [ ] BNK ürün görselleri geçici (stok fotoğraf); gerçek ürün çekimleriyle değişmeli
- [ ] **Gilroy web font lisansı doğrulanmalı** (ticari font; dosyalar marka varlık
      paketinden geldi, web kullanımı için lisans teyidi gerekiyor)
- [ ] İhracat ülkeleri listesi: `src/data/company.ts` → `exportMarkets` (ISO alpha-2).
      Boşken haritada sadece Türkiye işaretli görünür.
- [ ] "STL Dünyası" bölümü için müşterinin referans görseli bekleniyor
- [ ] Oxyra başlık fontu Manifold Extd CF Heavy lisanslı — dosya
      `public/fonts/ManifoldExtdCF-Heavy.woff2` olarak eklenince otomatik devreye girer
      (şu an Archivo ile geniş eksende çalışıyor)
- [ ] Adobe Fonts kit'inde (Co Headline) yayın alan adının yetkilendirilmesi
