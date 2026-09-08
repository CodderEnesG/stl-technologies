# Uygulama Yol Haritası — STL Teknoloji

Dört aşama. Her aşamada kimin ne yapacağı ayrı yazıldı, çünkü işlerin çoğu
kodda değil, müşteriden gelecek bilgide tıkanıyor.

---

## Aşama 1 — Temel (1-2. hafta)

Amaç: canlıdaki kırıkları kapatmak ve ölçümü başlatmak. Bu aşama bitmeden
içerik üretmenin anlamı yok, çünkü sonucu göremeyiz.

### Geliştirici

| İş | Süre |
|---|---|
| Çıplak alan adını Vercel'e ekle, www'ye yönlendir | 10 dk |
| Vercel ortam değişkenleri (Supabase) ve yeniden dağıtım | 15 dk |
| Gövde ön-render'ının Vercel'de çalışmama sebebini çöz | 2-4 saat |
| Analytics kur | 1 saat |
| wexta sayfasına Trendyol bağlantısı + `sameAs` | 30 dk |
| Fressi ve BNK'ye "STL Teknoloji markasıdır" cümlesi | 30 dk |

### Müşteri

| İş | Neden gerekiyor |
|---|---|
| Search Console'da mülk doğrula, sitemap gönder | Ölçüm bunsuz başlamaz |
| Google Business Profile kategorisini "üretici" yap | Yandex'te "mağaza" görünüyor |
| 20 ülkelik ihracat listesi | Harita ve ihracat sayfası bunu bekliyor |
| Referans marka listesi için yazılı izin | İsim vermeden OEM sayfası yazılamaz |
| KVKK metnindeki sicil ve Mersis numaraları | Eski sitede de boştu |
| Oxyra'nın satış kanalı hangisi | Buton şu an iletişime düşüyor |

### Aşama sonu kontrolü

Çıplak alan adı açılıyor, Search Console veri topluyor, 14 sayfa indekslenmiş,
eski adresler 308 dönüyor, sayfaların gövdesinde tam metin var.

---

## Aşama 2 — Ticari sayfalar (3-8. hafta)

Amaç: şirketin para kazandığı işin sitede karşılığını açmak.

| Sayfa | Kelime | Öncelik |
|---|---|---|
| `/oem` + `/en/oem` | 800-1.000 | 1 |
| `/uretim` + `/en/manufacturing` | 700-900 | 2 |
| `/hakkimizda` + `/en/about` | 500-700 | 3 |
| `/iletisim` + `/en/contact` | 300 | 4 |

Sıralama iş değerine göre: OEM en çok para getiren iş, üretim onun kanıtı,
hakkımızda güven, iletişim dönüşüm.

**Müşteriden gerekenler:** gerçek tesis fotoğrafları (stok görsel kullanılmaz),
kapasite rakamları (günlük/aylık adet, çalışan sayısı, makine parkı), OEM süreç
bilgisi (minimum adet, numune süresi, teslim süresi), yönetim ekibi bilgisi.

Metinleri ben yazabilirim ama sayılar müşteriden gelmeli. Uydurma rakam
kullanılmayacak; bu, sitenin baştan beri uyguladığı kural.

### Aşama sonu kontrolü

Dört yeni sayfa iki dilde yayında, iç bağlantılar kurulu, Search Console'da
OEM kümesinden ilk gösterimler görünüyor.

---

## Aşama 3 — Otorite ve savunma (9-20. hafta)

Amaç: marka sorularının cevabını geri almak ve ihracat tarafını açmak.

| İş | Not |
|---|---|
| `/sss` + `/en/faq`, `FAQPage` şeması | Sorular birebir aranan hâliyle |
| `/ihracat` + `/en/export` | Ülke listesi geldikten sonra |
| `/kariyer` + `/en/careers` | İşveren aramaları, E-E-A-T |
| Marka sayfalarına şirket bilgisi cümleleri | Aşama 1'deki iki cümlenin devamı |
| B2B dizin kayıtları (europages vb.) | Rakiplerin hepsi kayıtlı |
| LinkedIn şirket sayfası | `sameAs` şu an sadece Instagram |

**Dizinler ve LinkedIn neden burada:** site dışı varlık, site içi her şeyden
daha ağır basıyor. Şu an şirketin dış referansı neredeyse yok.

### Aşama sonu kontrolü

Dört marka sorgusunda da kendi siteniz ilk sırada. OEM kümesinde ilk 10'da
sayfalar var. İhracat sayfası İngilizce trafik almaya başlamış.

---

## Aşama 4 — Süreklilik (6-12. ay)

Amaç: tek seferlik iş değil, düzenli sinyal üretmek.

| İş | Sıklık |
|---|---|
| Üretim ve sektör içerikleri (blog değil, rehber) | Ayda 1 |
| Search Console kapsam ve sorgu incelemesi | Ayda 1 |
| Core Web Vitals saha verisi kontrolü | 3 ayda 1 |
| Yeni ürün/seri çıktıkça sayfa güncelleme | Gerektikçe |
| Fotoğraf ve video (tesis turu) | 6 ayda 1 |

**Video notu:** rakiplerin hiçbirinde tesis videosu yok. 35.000 m² bir tesisin
gerçek görüntüsü, yazıyla anlatılamayan bir güven sinyali. Bir YouTube kanalı
ve tek bir tesis turu videosu, bu listedeki her şeyden fazla iş görebilir.

---

## Tıkanma noktaları

Plan iki yerden tıkanır:

**İçerik gelmezse.** Aşama 2 ve 3'ün tamamı müşteriden gelecek bilgiye bağlı.
Teknik taraf hazır; sayfa açmak bir saatlik iş, o sayfayı dolduracak gerçek
bilgi olmadan açılmaz.

**Referans izni gelmezse.** OEM sayfası isim vermeden de yazılabilir ama
"Türkiye'nin önde gelen tekstil markaları" demek, markaları saymaktan belirgin
şekilde zayıf.

## Ölçüm

Search Console kurulduktan sonraki ilk dört hafta taban kabul edilir. Hedefler
`SEO-STRATEJI.md` içinde, taban oluştuktan sonra revize edilecek.

Aylık bakılacak üç şey: hangi sorgulardan gösterim geliyor, hangi sayfalar
indeksten düşmüş, ve iletişim formundan gelen talep sayısı. Sonuncusu
diğerlerinden önemli; sıralama değil talep hedefliyoruz.
