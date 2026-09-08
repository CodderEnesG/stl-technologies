# SEO Stratejisi — STL Teknoloji

Tarih: 2026-09-09. Alan adı yeni siteye taşındı, ölçüm henüz başlamadı.

## Temel tespit

Bu site ürün satmıyor. Fressi fressihome.com'da, BNK beautynetkorea.com.tr'de,
wexta Trendyol ve Evidea'da satılıyor. `stlteknoloji.com` bir vitrin ve
kurumsal kimlik sitesi.

Dolayısıyla hedef "organik satış" değil. Üç somut hedef var:

1. **B2B talep toplamak.** Valiz ürettirecek marka arayan alıcı bu siteyi
   bulmalı. Şirketin asıl para kazandığı iş bu ve site şu an bu konuda tek bir
   sayfa barındırmıyor.
2. **Marka sorularının cevabını geri almak.** "Fressi hangi ülkenin markası",
   "wexta kimin" gibi sorulara bugün üçüncü siteler cevap veriyor.
3. **İhracat tarafında görünürlük.** 20 ülkeye ihracat var, İngilizce sürüm var,
   ama İngilizce tarafta B2B içerik yok.

## Neyi hedeflemiyoruz

"Valiz fiyatları", "en iyi valiz markası" gibi tüketici aramaları bu sitenin
işi değil. O trafiğin gideceği yer Trendyol ve marka mağazaları. Kurumsal sitede
bu aramalar için içerik üretmek hem dönüşmez hem markanın kendi mağazalarıyla
rekabet eder.

## Anahtar kelime kümeleri

### Küme 1 — Üretim ve OEM (ana ticari niyet)

Sitenin en büyük boşluğu. Bu kelimelerin hiçbiri için sayfa yok.

| Türkçe | İngilizce |
|---|---|
| valiz üretimi, valiz üreticisi | luggage manufacturer Turkey |
| valiz fabrikası, valiz imalatı | suitcase factory Turkey |
| OEM valiz üretimi, fason valiz | OEM suitcase manufacturer |
| private label valiz | private label luggage supplier |
| ABS valiz üretimi | ABS luggage manufacturing |
| toptan valiz üretimi | wholesale luggage production |

Bu küme rakiplerin (Rita, Uyar, Anka, Valiz Dünyası) rekabet ettiği alan.
Ayrıntı: `RAKIP-ANALIZI.md`.

### Küme 2 — Marka kimliği (savunma)

| Sorgu | Bugün cevabı veren |
|---|---|
| fressi hangi ülkenin markası | kiminmali.com |
| fressi kimin markası | üçüncü siteler |
| wexta kimin markası / wexta valiz yorum | Şikayetvar, Trendyol |
| beauty net korea türkiye | mağaza sitesi |
| oxyra oyuncu koltuğu | belirsiz |

Bu sorguların cevabı `stlteknoloji.com`'da yazmadığı sürece başkası cevaplar.

### Küme 3 — Kurumsal ve itibar

STL Teknoloji, STL Teknoloji Arnavutköy, STL Teknoloji kariyer, STL Teknoloji
iletişim. Düşük hacim, yüksek niyet. Ayrı kurumsal sayfalar olmadan bunların
hepsi tek bir ana sayfaya yığılıyor.

## Sitenin bugünkü durumu

**Güçlü olan:** teknik altyapı. Rota başına ön-render, canonical, tr/en
hreflang, Organization ve Brand yapısal verisi, sitemap, eski adresler için
kalıcı yönlendirme, gerçek 404, güvenlik başlıkları, paylaşım kartları.
İncelenen rakiplerin hiçbirinde bu yok.

**Zayıf olan:** içerik hacmi ve sayfa sayısı. Toplam 7 sayfa (× 2 dil).
Hakkımızda, iletişim ve markalar ayrı URL değil, ana sayfanın bölümleri. Blog
yok, OEM sayfası yok, üretim kapasitesi sayfası yok, ihracat sayfası yok,
kariyer sayfası yok.

Bölüm olmak ile sayfa olmak arasındaki fark burada belirleyici: çıpa (`#hakkimizda`)
kendi başına sıralanamaz, kendi başlığı ve açıklaması olamaz.

## Açık teknik işler

| İş | Öncelik | Durum |
|---|---|---|
| Çıplak alan adı `stlteknoloji.com` Vercel'e eklenmeli | **Acil** | Kırık, SSL hatası veriyor |
| Google Search Console'a mülk + sitemap | Acil | Yapılmadı |
| Gövde ön-render'ı Vercel'de çalışmıyor | Yüksek | Chromium açılamıyor, sayfalar noscript metniyle geliyor |
| Google Business Profile kategorisi | Yüksek | Yandex'te "mağaza" görünüyor, üretici olmalı |
| `company.exportMarkets` boş | Orta | 20 ülke listesi müşteriden bekleniyor |
| Trendyol mağaza bağlantısı yok | Orta | wexta sayfasına ve şemaya eklenmeli |
| KVKK metnindeki sicil/Mersis alanları boş | Orta | Eski sitede de boştu |
| Analytics kurulu değil | Orta | GA4 ya da alternatifi |

## KPI ve hedefler

Ölçüm henüz başlamadığı için başlangıç değerleri bilinmiyor. Search Console
kurulduktan sonra ilk 4 hafta taban alınmalı. Aşağıdaki hedefler taban
oluştuktan sonra revize edilecek varsayımlardır, taahhüt değildir.

| Ölçüt | Taban | 3. ay | 6. ay | 12. ay |
|---|---|---|---|---|
| İndekslenen sayfa | 14 | 25 | 40 | 60 |
| Search Console gösterim | ölçülmedi | taban ×2 | taban ×4 | taban ×8 |
| OEM kümesinde ilk 10 sıralama | 0 | 2 | 6 | 12 |
| Marka sorgularında kendi sitesi 1. sırada | 0/4 marka | 2/4 | 4/4 | 4/4 |
| B2B form/telefon talebi | ölçülmedi | ayda 5 | ayda 12 | ayda 25 |
| Core Web Vitals (saha) | ölçülmedi | tümü yeşil | tümü yeşil | tümü yeşil |

Son satır için not: alan adı 2016'dan beri indeksli olduğu için sıfırdan
başlamıyoruz. Eski adreslerin yönlendirmeleri çalıştığı sürece alan adı
düzeyindeki geçmiş korunur.

## Riskler

**Yönlendirmelerin kapsamı.** Eski sitedeki tüm adresleri bilmiyoruz; bilinen
kalıplar için kural yazıldı, gerisi ana sayfaya düşüyor. Search Console'daki
"kapsam" raporu ilk ay dikkatle izlenmeli.

**İçerik üretimi kaynağı.** Plandaki sayfaların çoğu yeni metin gerektiriyor.
Metin gelmezse plan ilerlemez; teknik taraf zaten hazır.

**Doğrulanmamış iddialar.** Referans marka listesi (THY, LC Waikiki, DeFacto…)
müşteriye teyit ettirilmedi ve markalar tescilli. OEM sayfasında isim vermeden
önce yazılı onay alınmalı.

**Fressi'nin üretim yeri.** Üçüncü bir kaynak Fressi'nin Çin'de OEM ürettiğini
yazıyor. Sitedeki "%100 yerli üretim" ifadesi valiz üretimi için doğru ama
Fressi'ye genellenirse yanlış olur. Metinlerde bu ayrım net durmalı.
