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
│   └── brand/         marka sayfası section'ları + wexta slider
└── pages/             Home, Oxyra, Fressi, Wexta, BNK, About, Contact, NotFound
```

## Diller

| Sayfa | TR | EN |
|---|---|---|
| Ana sayfa | `/` | `/en` |
| Markalar | `/oxyra` `/fressi` `/wexta` `/bnk` | `/en/oxyra` … |
| Hakkımızda | `/hakkimizda` | `/en/about` |
| İletişim | `/iletisim` | `/en/contact` |

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

## Bekleyen işler

- [ ] Müşteri hero varyantı seçimi
- [ ] `robots.index: true` (yayın öncesi)
- [ ] İletişim formu şu an `mailto:` açıyor — Web3Forms/Formspree endpoint'i eklenebilir
- [ ] Ana sayfadaki satış kanalı listesi metin; gerçek logolarla değişecek
- [ ] BNK ürün görselleri geçici (stok fotoğraf); gerçek ürün çekimleriyle değişmeli
- [ ] Oxyra başlık fontu Manifold Extd CF Heavy lisanslı — dosya
      `public/fonts/ManifoldExtdCF-Heavy.woff2` olarak eklenince otomatik devreye girer
      (şu an Archivo ile geniş eksende çalışıyor)
- [ ] Adobe Fonts kit'inde (Co Headline) yayın alan adının yetkilendirilmesi
