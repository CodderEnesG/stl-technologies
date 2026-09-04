/**
 * fressihome.com'daki gerçek müşteri yorumları (Entrfy Reviews).
 *
 * Canlı kaynak: `fetchLiveFressiReviews` mağazanın Entrfy ucunu tarayıcıdan
 * çeker (uç, isteği yapan origin'i CORS'ta yansıtıyor). Mağaza şifreliyken
 * anonim istek /password'a 302 döner ve fetch hata verir; o durumda sayfa
 * aşağıdaki statik anlık görüntüyü gösterir. Şifre kalkınca kod değişmeden
 * canlıya geçer.
 *
 * Anlık görüntü: 2026-09-04 — kaynak /apps/reviews/api/list (295 yorum, 4.02).
 * Seçim: 4-5 yıldız + gerçek kullanım deneyimi (stok/kargo soruları elendi).
 */

export type FressiReview = {
  rating: number;
  title?: string;
  body: string;
  author: string;
  /** Yorumun yazıldığı ürün — kart altında küçük punto */
  product: string;
  verified: boolean;
};

/** fressihome.com mağaza geneli değerlendirme özeti (anlık görüntü) */
export const fressiReviewStats = {
  count: 295,
  average: 4.0,
  distribution: { 5: 180, 4: 37, 3: 25, 2: 10, 1: 43 },
};

const LIVE_URL = "https://fressihome.com/apps/reviews/api/list?shop=fressihome.myshopify.com&limit=100";

/** Ürün deneyimi olmayan yorumlar (stok/kargo/sipariş soruları) vitrine girmez */
const NOISE = /stok|stoğ|kargo|sipariş|siparis|ne zaman|yanlış ürün|gelmedi|ulaşamıyor/i;

type EntrfyItem = {
  rating: number;
  title: string;
  body: string;
  authorName: string;
  verifiedPurchase: boolean;
  productTitle: string;
};

/** Baş harf büyük, gerisi küçük — mağazada isimler karışık büyük/küçük geliyor */
const tidyName = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1).toLocaleLowerCase("tr-TR"))
    .join(" ");

/** "A KATEGORİ" (outlet) öneki ve renk eki ürün adından düşer */
const tidyProduct = (title: string) =>
  title
    .replace(/^A KATEGORİ\s+/i, "")
    .replace(/\s+-\s+[^-]+$/, "")
    .trim();

/**
 * Entrfy ucundan canlı yorumları çeker ve vitrin için süzer. Ağ/CORS/şifre
 * hatasında `null` döner; çağıran taraf statik listeye düşer.
 */
export async function fetchLiveFressiReviews(signal?: AbortSignal): Promise<FressiReview[] | null> {
  try {
    const res = await fetch(LIVE_URL, { signal, mode: "cors" });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; items?: EntrfyItem[] };
    if (!data.ok || !Array.isArray(data.items)) return null;
    const picked = data.items
      .filter((r) => r.rating >= 4 && r.body.trim().length >= 40 && !NOISE.test(`${r.title} ${r.body}`))
      .slice(0, 12)
      .map<FressiReview>((r) => ({
        rating: r.rating,
        title: r.title.trim() || undefined,
        body: r.body.trim(),
        author: tidyName(r.authorName),
        product: tidyProduct(r.productTitle),
        verified: r.verifiedPurchase,
      }));
    return picked.length >= 3 ? picked : null;
  } catch {
    return null;
  }
}

export const fressiReviews: FressiReview[] = [
  {
    rating: 5,
    title: "Kesinlikle tavsiye ederim",
    body: "Evimin ve mutfak dolaplarımın bir hayli küçük olması sebebiyle bu tost makinesini tercih ettim, iyi ki de öyle yapmışım. Koca koca plakaları yıkamak zorunda kalmıyorsunuz, işiniz çok kolaylaşıyor. Tüm plakaları denedim, hepsinden çok memnun kaldım. Özellikle waffle plakası tam bir Belçika waffle'ı yapıyor: dışı kıtır, içi yumuşak.",
    author: "Sena Uğuray Ceylan",
    product: "FR-TM51 Triochef Waffle ve Tost Makinesi",
    verified: true,
  },
  {
    rating: 5,
    title: "Mü-kem-mel",
    body: "Önceki markalardan da kahve tüketmiş biri olarak söylüyorum: Fressi EM-02 pişman etmedi. Mükemmel bir americano içtim bu akşam.",
    author: "Hilal Polat Ekşi",
    product: "EM-02 Lavante 20 Bar Tam Otomatik Espresso Makinesi",
    verified: false,
  },
  {
    rating: 5,
    title: "Fiyat performans",
    body: "Tam otomatik olmaması sizi caydırmasın; kendi istediğiniz süt, kahve ve süt köpüğü oranlarında tadını ayarlayabilirsiniz. Görünüşü çok hoş. Kahve içmek için çok masrafa girmeye gerek yok, hem şık hem kullanışlı bu cihazı alabilirsiniz.",
    author: "Muhammed Yıldız",
    product: "EM-01 Ristretto Süt Köpürtücülü Espresso Makinesi",
    verified: true,
  },
  {
    rating: 5,
    title: "Çok teşekkür ederim",
    body: "Hizmetinden çok memnun kaldım, her süreçte mükemmel destek verdiler. Gösterdikleri ilgi bizi markayı daha çok sevmeye itti; yakın tarihte markanın farklı ürünlerinden muhakkak alacağım.",
    author: "Yaşar Miraç Çerçi",
    product: "EM-411 Retro Mavera Ahşap Detaylı Espresso Makinesi",
    verified: true,
  },
  {
    rating: 5,
    title: "Takdir ve teşekkür dileklerimle",
    body: "Sipariş verdikten bir gün sonra kargo geldi. Fressi vantilatör umduğumdan çok daha kaliteli, çok beğendim. Sizler gibi kaliteli ürünler üreten firmalarımız olduğu için gurur duyuyorum.",
    author: "İbrahim Akci",
    product: "FR-F25R Venturi Ayaklı Vantilatör",
    verified: true,
  },
  {
    rating: 5,
    title: "Güvenilir",
    body: "Ürünü eşime aldım, yaklaşık bir aydır kullanıyor ve çok memnun, tavsiye ederim. Müşteri temsilcisi de çok ilgiliydi; satıştan sonra bile bazı hususlarda yardımcı oldular.",
    author: "Arif Uyğur",
    product: "FR-SM2503 Allegro Tam Döküm Hamur Yoğurma Makinesi",
    verified: false,
  },
  {
    rating: 5,
    title: "Fressi tost ve waffle makinesi",
    body: "Ürün gerçekten güzel, hem şirin hem işlevsel. Malzeme kalitesi ağırlığıyla hissettiriyor. Waffle denedik, istediğimiz performansı aldık. Ama bizim mutfak Fressi'nin yanında sönük kaldı; hanım diyor mutfağı yenileyelim.",
    author: "Mustafa Bağçeci",
    product: "FR-TM51 Triochef Waffle ve Tost Makinesi",
    verified: true,
  },
  {
    rating: 5,
    title: "Beklentimin üzerinde",
    body: "İtinalı paketlenmişti; ses kalitesi ve basit kullanımı beklentimin üzerinde.",
    author: "İhsan Kesici",
    product: "FR-P101 Zenitte Bluetooth Pikap Müzik Kutusu",
    verified: true,
  },
  {
    rating: 5,
    body: "Çok sağlam paketlenmiş şekilde hızlıca elimize ulaştı. Denemek için 250 gr öğütülmüş espresso da sipariş etmiştik, hemen denedik. Çok memnun kaldık, kesinlikle tavsiye ediyoruz.",
    author: "Hasan Serkan Gümüş",
    product: "EM-02 Lavante 20 Bar Tam Otomatik Espresso Makinesi",
    verified: true,
  },
  {
    rating: 5,
    title: "Çok tatlı bir kahve makinesi",
    body: "Paket bir iki gün içinde ulaştı, özenle paketlenmiş. Rengi harika bir yeşil ve çok da ağır değil. Görüntüsü ve kalitesi çok iyi.",
    author: "Aslı Bulut",
    product: "EM-01 Ristretto Süt Köpürtücülü Espresso Makinesi",
    verified: true,
  },
  {
    rating: 5,
    body: "Çok kibar, çok şeker ve performansı muhteşem. Kendime özel tasarlamak isteseydim bunu tasarlardım.",
    author: "Nur Sema Kılıç",
    product: "YSB-GC02 Eiffel Cam Hazneli Kettle",
    verified: true,
  },
  {
    rating: 5,
    title: "Waffle ve tost makinesi",
    body: "İkisi bir arada olunca bu fiyata denemek istedim. Geldiği gün waffle yaptık, aşırı beğendim; 9 dakikada hazır oluyor. Dışı kıtır, içi yumuşacık. Artık dışarıda waffle yemeyeceğim.",
    author: "Elif Ayhan Tanrıverdi",
    product: "FR-TM51 Triochef Waffle ve Tost Makinesi",
    verified: true,
  },
];
