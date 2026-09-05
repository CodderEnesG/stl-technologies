/**
 * Kurumsal referans logoları.
 *
 * Her logo kendi orijinal renginde saklanır; şerit onları gri tonlamayla
 * gösterir, üstüne gelince rengi açılır. Bu yüzden BİM ve Watsons gibi
 * "beyaz yazı + renkli kutu" logolarında oyma yazı korunur.
 *
 * `ratio` = logonun kırpılmış içerik kutusunun genişlik/yükseklik oranı.
 * Chrome'da `svg.getBBox()` ile ölçüldü; şerit bu oranı kullanarak her logoyu
 * eşit optik alana getiriyor (bkz. PartnerLogos). Yeni logo eklerken oranı
 * ölçüp yazın, yoksa kutular birbirini tutmaz.
 *
 * `scale` = optik düzeltme. Tamamı mürekkeple dolu kutulu logolar (BİM,
 * Watsons, DS Damat) eşit alanda diğerlerinden ağır göründüğü için küçültülür.
 */
export type Partner = {
  name: string;
  src: string;
  /** İçerik kutusu oranı (genişlik / yükseklik) */
  ratio: number;
  /** Optik ağırlık düzeltmesi — varsayılan 1 */
  scale?: number;
  /**
   * Ek CSS filtresi. Gri tonlamada açık renkli zeminler (Watsons'ın turkuaz
   * kutusu) soluk gri oluyor, üstündeki beyaz yazı okunmuyor; o kutular
   * koyulaştırılır.
   */
  filter?: string;
};

export const partnerLogos: Partner[] = [
  { name: "Turkish Airlines", src: "/logos/partners/thy.svg", ratio: 6.37 },
  { name: "AJet", src: "/logos/partners/ajet.svg", ratio: 2.8 },
  { name: "DeFacto", src: "/logos/partners/defacto.svg", ratio: 4.91 },
  { name: "Watsons", src: "/logos/partners/watsons.svg", ratio: 4.61, scale: 0.92, filter: "brightness(0.72)" },
  { name: "Slazenger", src: "/logos/partners/slazenger.svg", ratio: 4.85 },
  { name: "BİM", src: "/logos/partners/bim.svg", ratio: 2.11, scale: 0.86 },
  { name: "LC Waikiki", src: "/logos/partners/lcwaikiki.svg", ratio: 7.13 },
  { name: "Kiğılı", src: "/logos/partners/kigili.png", ratio: 2.3 },
  { name: "D'S Damat", src: "/logos/partners/dsdamat.svg", ratio: 1.1, scale: 0.92 },
];
