# Site Yapısı ve İçerik Planı — STL Teknoloji

## Bugünkü yapı

```
/                     ana sayfa (hakkımızda, misyon, markalar, referanslar,
                      ihracat haritası ve iletişim bu sayfanın bölümleri)
/wexta  /fressi  /bnk  /oxyra
/kvkk   /gizlilik
/en ...               tüm bunların İngilizce karşılığı
```

Toplam 7 sayfa × 2 dil = 14 indekslenebilir adres.

Sorun: hakkımızda, iletişim ve markalar kendi URL'i olmayan bölümler. Çıpa
kendi başına sıralanamaz, kendi başlığı ve açıklaması olamaz. Rakiplerin
`/hakkimizda` sayfaları arama sonuçlarında çıkarken STL'de o içerik ana sayfaya
gömülü.

## Hedeflenen yapı

Yeni sayfalar. Mevcut tasarım bozulmadan ekleniyor; ana sayfadaki bölümler
kalabilir, bu sayfalar onların uzun sürümü olur ve bölümden buraya bağlantı
verilir.

```
/
├── /uretim                     ← YENİ. Üretim yetkinliği, kapasite, tesis
├── /oem                        ← YENİ. OEM / fason / private label valiz
├── /hakkimizda                 ← YENİ. Kurumsal, tarihçe, sayılar
├── /ihracat                    ← YENİ. 20 ülke, ihracat süreci
├── /iletisim                   ← YENİ. Ayrı sayfa, ContactPage şeması
├── /kariyer                    ← YENİ. Eski sitede vardı, kaldırıldı
├── /wexta  /fressi  /bnk  /oxyra   mevcut
├── /sss                        ← YENİ. Marka ve üretim soruları
└── /kvkk  /gizlilik            mevcut
```

İngilizce karşılıkları:
`/en/manufacturing`, `/en/oem`, `/en/about`, `/en/export`, `/en/contact`,
`/en/careers`, `/en/faq`.

Toplam hedef: 14 sayfa × 2 dil = 28 indekslenebilir adres.

## Sayfa sayfa ne yazılacak

### /oem — en yüksek öncelikli sayfa

Sitenin en büyük boşluğu. Şirketin asıl para kazandığı iş, sitede tek bir
sayfası yok.

- Hedef: OEM valiz üretimi, fason valiz üretimi, private label valiz, toptan
  valiz üretimi
- İçermeli: hangi hizmet verilir (kalıp, renk, logo, ambalaj), minimum sipariş,
  numune süreci, teslim süresi, kalite kontrol, kapasite
- Bitişte teklif formu
- Uzunluk: 800-1.000 kelime
- Şema: `Service`
- **Uyarı:** referans marka isimleri yazılı onay alınmadan konmamalı

### /uretim — kanıt sayfası

Sitedeki en güçlü ama en az kullanılan varlık: 35.000 m². Rakiplerin en
büyüğü 9.000 m².

- Hedef: valiz fabrikası, valiz üretimi, ABS valiz üretimi
- İçermeli: tesis, iki hatlı ekstrüzyon, 1-4 mm levha, vakum form, 20/24/28
  inç kalıplar, montaj, çelik vidalı aksesuar, kalite kontrol
- Eklenecek: günlük/aylık kapasite rakamı, çalışan sayısı, makine parkı
  (müşteriden istenecek)
- Gerçek tesis fotoğrafı şart, stok görsel değil
- Uzunluk: 700-900 kelime

### /hakkimizda — kurumsal

Ana sayfadaki bölümün uzun hâli. Kuruluş 2016, valizle başlangıç, dört markaya
genişleme, OEM işi, ihracat. Yönetim ekibi ve fotoğrafları eklenirse güven
sinyali belirgin artar.

- Uzunluk: 500-700 kelime
- Şema: `AboutPage`

### /ihracat

`company.exportMarkets` hâlâ boş, harita sadece Türkiye'yi işaretliyor. Ülke
listesi gelince hem harita hem bu sayfa dolar.

- Katalogdan bilinen ülkeler: Birleşik Krallık, Kosova, Gürcistan, Somali,
  Hırvatistan, Tunus, İran, Fransa, Nijer, Azerbaycan (2023 kataloğu)
- Kesin 20 ülke listesi müşteriden alınmalı
- İngilizce sürüm burada Türkçeden daha önemli

### /sss — marka sorularını geri almak

Bugün üçüncü siteler cevaplıyor. Sorular birebir arananlar olmalı:

- STL Teknoloji ne üretir?
- Fressi hangi ülkenin markası, kimin?
- wexta kimin markası, nerede üretiliyor?
- BNK ürünleri nereden geliyor?
- Oxyra kimin markası?
- OEM üretim yapıyor musunuz, minimum adet nedir?
- Kaç ülkeye ihracat yapıyorsunuz?

Her cevap kendi başına alıntılanabilir tam bir cümleyle başlamalı. Bu format
hem Google'ın öne çıkan snippet'i hem AI cevap motorları için en verimli olan.

- Şema: `FAQPage`

### /iletisim ve /kariyer

İletişim ayrı sayfa olmalı, `ContactPage` şeması alır. Kariyer eski sitede
vardı, yeni sitede yok; işveren aramaları için ve E-E-A-T açısından değerli.

### Marka sayfalarına eklenecek tek cümle

wexta ve Oxyra sayfalarında "bu marka STL Teknoloji'nindir" cümlesi var.
**Fressi ve BNK'de yok.** Biri `/fressi` sayfasına gelip "bu kimin markası"
diye sorduğunda sayfada cevap yok; bilgi sadece yapısal veride duruyor, o da
alıntılanmıyor.

Eklenecek:
- Fressi: "Fressi, STL Teknoloji'nin küçük ev aletleri markasıdır."
- BNK: "BNK — Beauty Net Korea, STL Teknoloji'nin K-beauty markasıdır."

Ayrıca her marka sayfasına kuruluş yılı ve tesis bilgisini taşıyan bir cümle,
wexta'daki gibi. Bir marka sayfası tek başına alıntılandığında şirket bilgisi
de yanında gitsin.

## İç bağlantı düzeni

```
Ana sayfa ──► /uretim ──► /oem ──► iletişim formu
     │            │
     │            └──► /ihracat
     ├──► /hakkimizda ──► /kariyer
     ├──► /sss (her cevaptan ilgili sayfaya)
     └──► marka sayfaları ──► kendi satış kanalları
```

Ana sayfadaki mevcut bölümlerin altına "detaylı bilgi" bağlantısı konur.
Marka sayfalarından `/uretim` ve `/oem`'e çapraz bağlantı verilir: dört markanın
da aynı tesisten çıktığı mesajı böyle pekişir.

## Satış kanalı bağlantıları

Eski site adresleri öldüğü için marka butonları şu an iletişime düşüyor.
Gerçek kanallar bağlanmalı:

| Marka | Kanal | Durum |
|---|---|---|
| Fressi | fressihome.com | Bağlı |
| BNK | beautynetkorea.com.tr | Bağlı |
| wexta | Trendyol, Evidea | **Bağlı değil** |
| Oxyra | — | Kanal belirsiz, müşteriye sorulacak |

wexta'nın Trendyol mağazası hem sayfaya hem yapısal veriye (`sameAs`)
eklenmeli. `wexta.com.tr` DNS'te yok, sitede o adrese atıf varsa kaldırılmalı.

## Kalite eşiği

Bu sayfalar sitenin sade tasarımını bozmamalı. Mevcut marka sayfalarının
görsel diline dokunulmayacak; yeni sayfalar metin ağırlıklı kurumsal sayfalar
olarak, KVKK sayfasındaki düzenin daha zengin hâliyle kurulur.

İçerik gelmeden sayfa açılmaz. Boş ya da 200 kelimelik bir OEM sayfası hiç
olmamasından kötüdür.
