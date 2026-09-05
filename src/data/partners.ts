/**
 * Kurumsal referans logoları. Hepsi markanın kendi renginde gösterilir.
 *
 * `ratio` = logonun kırpılmış içerik kutusunun genişlik/yükseklik oranı.
 * Chrome'da `svg.getBBox()` ile ölçüldü; şerit bu oranı kullanarak her logoyu
 * eşit optik alana getiriyor (bkz. PartnerLogos). Yeni logo eklerken oranı
 * ölçüp yazın, yoksa kutular birbirini tutmaz.
 *
 * `scale` = optik düzeltme. Tamamı mürekkeple dolu kutulu logolar (BİM,
 * Watsons) eşit alanda diğerlerinden ağır göründüğü için küçültülür. AJet ise
 * büyütülür: kelime işaretinin yarısını "A" sembolü yediği için "Jet" eşit
 * alanda çok küçük kalıyor ve "e" harfinin çubuğu kaybolup "Jat" gibi okunuyor.
 */
export type Partner = {
  name: string;
  src: string;
  /** İçerik kutusu oranı (genişlik / yükseklik) */
  ratio: number;
  /** Optik ağırlık düzeltmesi — varsayılan 1 */
  scale?: number;
};

export const partnerLogos: Partner[] = [
  { name: "Turkish Airlines", src: "/logos/partners/thy.svg", ratio: 6.37 },
  { name: "AJet", src: "/logos/partners/ajet.svg", ratio: 2.8, scale: 1.2 },
  { name: "DeFacto", src: "/logos/partners/defacto.svg", ratio: 4.91 },
  { name: "Watsons", src: "/logos/partners/watsons.svg", ratio: 4.61, scale: 0.92 },
  { name: "Slazenger", src: "/logos/partners/slazenger.svg", ratio: 4.85 },
  { name: "BİM", src: "/logos/partners/bim.svg", ratio: 2.11, scale: 0.86 },
  { name: "LC Waikiki", src: "/logos/partners/lcwaikiki.svg", ratio: 7.13 },
  { name: "Kiğılı", src: "/logos/partners/kigili.png", ratio: 2.3 },
  { name: "D'S Damat", src: "/logos/partners/dsdamat.svg", ratio: 1.1, scale: 0.92 },
];
