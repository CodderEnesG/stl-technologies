export const img = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export type Product = {
  name: string;
  category: string;
  image: string;
  href: string;
  /** Beyaz zeminli stüdyo fotoğrafı: açık zeminlerde multiply ile kaynaştır */
  blend?: boolean;
  /** Seri renk seçenekleri (katalog renk noktaları) */
  colors?: string[];
};

export type BrandVisual = {
  slug: string;
  name: string;
  color: string; // primary accent
  onColor: string; // text on accent
  panelBg: string; // hero panel background (CSS)
  panelText: string;
  hero: string;
  heroBlend?: boolean;
  /** Hero fotoğrafının odak noktası (CSS object-position). Kadraj panelde buraya göre kurulur. */
  heroFocus?: string;
  /** Hero panelindeki marka adının rengi. Verilmezse panelText kullanılır. */
  heroNameColor?: string;
  channelHref: string;
  /** Ana lockup — açık zeminler (hero, marka sayfası) */
  logoDark: string;
  /** Ana lockup — koyu zeminler */
  logoLight: string;
  /** Yatay/dar varyant — navbar, dropdown, footer gibi kısıtlı alanlar */
  logoDarkWide?: string;
  logoLightWide?: string;
  /**
   * Sayfa başındayken navbar zemini — sayfanın kendi zemin rengiyle birebir aynı,
   * opak. Böylece hero'nun üstünde çizgi/blok gibi durmuyor.
   */
  navTopBg: string;
  /** Aşağı kaydırılınca navbar zemini — yarı saydam, arkasındaki içerik seziliyor */
  navBg: string;
  /** Navbar koyu zeminde mi: metin/ikon/kontur renklerini çevirir */
  navOnDark: boolean;
  /** Marka sayfasında footer zemini — sayfanın tone rengiyle uyumlu, opak */
  footerBg: string;
  /** Footer koyu zeminde mi */
  footerOnDark: boolean;
};

export const stlLogo = {
  dark: "/logos/stl.svg", // renkli logo, açık zeminler
  light: "/logos/stl.svg", // koyu zemin için beyaz varyant gerekirse buraya
};

export const brands: BrandVisual[] = [
  {
    slug: "wexta",
    name: "wexta",
    color: "#29aec6",
    onColor: "#ffffff",
    panelBg: "linear-gradient(160deg, #eafafd 0%, #b7e8f0 45%, #29aec6 135%)",
    panelText: "#0a3c47",
    // Katalog kapağı: portre sahne, panel kadrajına birebir oturuyor.
    // Beyaz zeminli ürün kesiti + mix-blend-multiply, panel açılırken kırpılıp
    // her kare yeniden boyandığı için sekme/titreme yapıyordu.
    hero: "/images/stl/wexta-cover.jpg",
    heroFocus: "50% 45%",
    heroNameColor: "rgb(41, 174, 198)",
    channelHref: "https://www.stlteknoloji.com/tr/urunler/valiz",
    logoDark: "/logos/wexta.svg",
    logoLight: "/logos/wexta-light.svg",
    navTopBg: "#ffffff",
    navBg: "rgba(255,255,255,0.88)",
    navOnDark: false,
    footerBg: "#f2f5f6",
    footerOnDark: false,
  },
  {
    slug: "fressi",
    name: "Fressi",
    color: "#818e71",
    onColor: "#ffffff",
    panelBg: "linear-gradient(165deg, #f9f7f4 0%, #efe9df 55%, #d3c4a9 130%)",
    panelText: "#594439",
    hero: "/images/fressi/kettle-kt07-hero.jpg",
    heroFocus: "52% 58%",
    channelHref: "https://fressihome.com",
    logoDark: "/logos/fressi-dark.svg",
    logoLight: "/logos/fressi-light.svg",
    navTopBg: "#f9f7f4",
    navBg: "rgba(249,247,244,0.88)",
    navOnDark: false,
    footerBg: "#f2eee7",
    footerOnDark: false,
  },
  {
    slug: "bnk",
    name: "BNK",
    color: "#ed1651",
    onColor: "#ffffff",
    panelBg: "linear-gradient(160deg, #ffffff 0%, #ffe7ef 55%, #ffd0de 135%)",
    panelText: "#231f20",
    hero: "/images/bnk/hero-panel.webp",
    heroFocus: "50% 30%",
    channelHref: "https://beautynetkorea.com.tr",
    logoDark: "/logos/bnk-dark.svg",
    logoLight: "/logos/bnk-light.svg",
    navTopBg: "#fff5f8",
    navBg: "rgba(255,245,248,0.9)",
    navOnDark: false,
    footerBg: "#ffeef4",
    footerOnDark: false,
  },
  {
    slug: "oxyra",
    name: "Oxyra",
    color: "#3596de",
    onColor: "#ffffff",
    panelBg:
      "radial-gradient(120% 120% at 70% 20%, rgba(53,150,222,0.35), transparent 55%), linear-gradient(160deg, #05060f 0%, #0a0e2a 60%, #231caa 140%)",
    panelText: "#ffffff",
    hero: "/images/oxyra/koltuk-oxyra.jpg",
    heroFocus: "50% 50%",
    channelHref: "https://www.stlteknoloji.com/tr/urunler/oyuncu-koltugu",
    logoDark: "/logos/oxyra-dark.svg",
    logoLight: "/logos/oxyra-light.svg",
    logoDarkWide: "/logos/oxyra-dark-h.svg",
    logoLightWide: "/logos/oxyra-light-h.svg",
    navTopBg: "#05060f",
    navBg: "rgba(12,17,52,0.88)",
    navOnDark: true,
    footerBg: "#05060f",
    footerOnDark: true,
  },
];

/**
 * Çatı sitenin kendisi de bir "marka" kaydı gibi ele alınır: böylece bölüm sözlüğü
 * (components/brand/sections.tsx) tek bir ctx imzasıyla hem çatıda hem markalarda çalışır.
 * brands[] dizisine bilerek girmez — marka listelerine sızmaması için.
 */
export const stlBrand: BrandVisual = {
  slug: "stl",
  name: "STL Teknoloji",
  color: "#e10000",
  onColor: "#ffffff",
  panelBg: "linear-gradient(160deg, #ffffff 0%, #f5f5f5 100%)",
  panelText: "#2b2828",
  hero: "/images/stl/fabrika-bina.jpg",
  channelHref: "",
  logoDark: "/logos/stl.svg",
  logoLight: "/logos/stl.svg",
  navTopBg: "#ffffff",
  navBg: "rgba(255,255,255,0.86)",
  navOnDark: false,
  footerBg: "#f5f5f5",
  footerOnDark: false,
};

export const getBrand = (slug: string) => brands.find((b) => b.slug === slug)!;

// Satış kanalları — logolar gelene kadar metin; gerçek liste netleşecek
export const partners = [
  "Trendyol",
  "Hepsiburada",
  "Amazon",
  "Teknosa",
  "MediaMarkt",
  "n11",
  "Vatan",
  "A101",
  "Migros",
];

// Gerçek STL fotoğrafları: tesis (firma arşivi) + Wexta katalog görselleri
export const stlImages = {
  /** STL markalı üretim bandı — Arnavutköy tesisi */
  factory: "/images/stl/fabrika-uretim.jpg",
  /** Tesis dış cephe — STL + segment binası */
  building: "/images/stl/fabrika-bina.jpg",
  cover: "/images/stl/wexta-cover.jpg",
  /** Seyahat anı — katalogdan, kimliksiz kadraj */
  travel: "/images/stl/wexta-travel.jpg",
  store: "/images/stl/wexta-lifestyle-1.jpg",
  luggage: "/images/stl/valiz-wx300-1.jpg",
};

const stlUrun = (slug: string) => `https://www.stlteknoloji.com/tr/urun/${slug}`;

export const oxyraProducts: Product[] = [
  {
    name: "Oxyra Gaming Koltuk",
    category: "Oyuncu Koltuğu",
    image: "/images/oxyra/koltuk-oxyra.jpg",
    href: "https://www.stlteknoloji.com/tr/urunler/oyuncu-koltugu",
  },
  {
    name: "Oxyra Gaming Kulaklık",
    category: "Ses",
    image: "/images/oxyra/headset-oxyra.jpg",
    href: "https://www.stlteknoloji.com/tr/urunler/oyuncu-koltugu",
  },
  {
    name: "Oxyra Gaming Mouse",
    category: "Çevre Birimi",
    image: "/images/oxyra/mouse-oxyra.jpg",
    href: "https://www.stlteknoloji.com/tr/urunler/oyuncu-koltugu",
  },
  {
    name: "Rampage KL-R44",
    category: "Oyuncu Koltuğu",
    image: "/images/oxyra/koltuk-rampage-1.jpg",
    href: stlUrun("rampage-kl-r44-oyuncu-koltugu"),
    blend: true,
  },
  {
    name: "Valja Serisi",
    category: "Oyuncu Koltuğu",
    image: "/images/oxyra/koltuk-valja-1.jpg",
    href: stlUrun("valja-oyuncu-koltugu"),
    blend: true,
  },
];

export const fressiProducts: Product[] = [
  {
    name: "FR-TK302 Türk Kahve Makinesi",
    category: "Coffee",
    image: "/images/fressi/turk-kahve-tk302.webp",
    href: "https://fressihome.com/collections/turk-kahve-makinesi",
  },
  {
    name: "EM-01 Ristretto Espresso",
    category: "Coffee",
    image: "/images/fressi/espresso-em01.webp",
    href: "https://fressihome.com/collections/kahve-makinesi",
  },
  {
    name: "FR-KT07 Retro Mavera Kettle",
    category: "Kitchen",
    image: "/images/fressi/kettle-kt07.webp",
    href: "https://fressihome.com/collections/kettle",
  },
  {
    name: "FR-TM26 Duobello Tost Makinesi",
    category: "Kitchen",
    image: "/images/fressi/tost-tm26.webp",
    href: "https://fressihome.com/collections/waffle-tost-makinesi",
  },
  {
    name: "FR-P101 Zenitte Pikap",
    category: "Collection",
    image: "/images/fressi/pikap-p101.webp",
    href: "https://fressihome.com/collections/pikap",
  },
  {
    name: "FR-CD183 Riona CD Çalar",
    category: "Collection",
    image: "/images/fressi/cd-calar-cd183.webp",
    href: "https://fressihome.com/collections/muzik-aksesuarlari",
  },
];

export const wextaProducts: Product[] = [
  {
    name: "Valja Milano Serisi",
    category: "Valiz",
    image: "/images/stl/valiz-milano-1.jpg",
    href: stlUrun("valja-milano-serisi-mavi-valiz"),
    blend: true,
    colors: ["#3f6eb5", "#8b8f94", "#20242a"],
  },
  {
    name: "ABS WX-1001",
    category: "Valiz",
    image: "/images/stl/valiz-wx1001-1.jpg",
    href: stlUrun("abs-wx-1001-antrasit-valiz"),
    blend: true,
    colors: ["#20242a", "#57606a", "#b6414b"],
  },
  {
    name: "ABS WX-300 Baskılı",
    category: "Valiz",
    image: "/images/stl/valiz-wx300-1.jpg",
    href: stlUrun("abs-wx-300-baskili-mint-yesili-valiz"),
    blend: true,
    colors: ["#7fc6bc", "#57606a", "#c9b287"],
  },
];

/**
 * beautynetkorea.com.tr'den seçilen ürünler. Görseller mağazanın sade
 * kadrajlarından: tek renk zemin veya beyaz fon, ürün ortada.
 */
export const bnkProducts: Product[] = [
  {
    name: "TENZERO Perfect Cover BB Krem",
    category: "BB & CC Krem",
    image: "/images/bnk/bb-sade.webp",
    href: "https://beautynetkorea.com.tr/collections/bb-cc-krem",
  },
  {
    name: "TENZERO Snail Göz Serumu",
    category: "Göz Bakımı",
    image: "/images/bnk/circle-goz-cevresi.webp",
    href: "https://beautynetkorea.com.tr/collections/goz-serumu",
  },
  {
    name: "TENZERO Collagen Tonik",
    category: "Tonik",
    image: "/images/bnk/circle-tonik.webp",
    href: "https://beautynetkorea.com.tr/collections/tonik",
  },
  {
    name: "TENZERO Hyaluronik Ampul Serum",
    category: "Serum & Ampul",
    image: "/images/bnk/circle-serum.webp",
    href: "https://beautynetkorea.com.tr/collections/cilt-serumu",
  },
  {
    name: "FOODAHOLIC Multi Sun Cream SPF50+",
    category: "Güneş Kremi",
    image: "/images/bnk/circle-gunes-kremi.webp",
    href: "https://beautynetkorea.com.tr/collections/yuz-gunes-kremi",
  },
  {
    name: "DR. MELOSO Yuja C Peeling Jel",
    category: "Temizleyici",
    image: "/images/bnk/circle-temizleyici.webp",
    href: "https://beautynetkorea.com.tr/collections/yuz-temizleyiciler",
  },
  {
    name: "Ceramide Royal Jelly Yüz Kremi",
    category: "Nemlendirici",
    image: "/images/bnk/circle-nemlendirici.webp",
    href: "https://beautynetkorea.com.tr/collections/yuz-kremi",
  },
  {
    name: "FOODAHOLIC 3D Kore Maskesi 8'li",
    category: "Yüz Maskesi",
    image: "/images/bnk/circle-kagit-maske.webp",
    href: "https://beautynetkorea.com.tr/collections/yuz-maskesi",
  },
];


/**
 * Marka sayfasındaki kategori barı — mağaza menüsünün kısaltılmışı.
 * `sub` alanı bardaki hover panelini besliyor.
 */
export const bnkCategories = [
  {
    key: "sun",
    label: "Güneş Bakımı",
    color: "#ed1651",
    icon: "sun-moon" as const,
    href: "https://beautynetkorea.com.tr/collections/yuz-gunes-kremi",
    image: "/images/bnk/circle-gunes-kremi.webp",
    sub: [
      { label: "Yüz Güneş Kremleri", href: "https://beautynetkorea.com.tr/collections/yuz-gunes-kremi" },
      { label: "Vücut Güneş Kremleri", href: "https://beautynetkorea.com.tr/collections/vucut-gunes-kremi" },
      { label: "BB & CC Krem", href: "https://beautynetkorea.com.tr/collections/bb-cc-krem" },
      { label: "Tüm Ürünler", href: "https://beautynetkorea.com.tr/collections/all" },
    ],
  },
  {
    key: "serum",
    label: "Serum & Ampul",
    color: "#ed1651",
    icon: "droplet" as const,
    href: "https://beautynetkorea.com.tr/collections/cilt-serumu",
    image: "/images/bnk/circle-serum.webp",
    sub: [
      { label: "Serum & Ampul", href: "https://beautynetkorea.com.tr/collections/cilt-serumu" },
      { label: "Göz Serumu", href: "https://beautynetkorea.com.tr/collections/goz-serumu" },
      { label: "Göz Kremi", href: "https://beautynetkorea.com.tr/collections/goz-kremi" },
      { label: "Göz Maskesi", href: "https://beautynetkorea.com.tr/collections/goz-maskesi" },
    ],
  },
  {
    key: "cream",
    label: "Nemlendirici",
    color: "#ed1651",
    icon: "sparkles" as const,
    href: "https://beautynetkorea.com.tr/collections/yuz-kremi",
    image: "/images/bnk/circle-nemlendirici.webp",
    sub: [
      { label: "Yüz Kremi", href: "https://beautynetkorea.com.tr/collections/yuz-kremi" },
      { label: "El Kremi", href: "https://beautynetkorea.com.tr/collections/el-kremi" },
      { label: "Yüz Maskesi", href: "https://beautynetkorea.com.tr/collections/yuz-maskesi" },
      { label: "Vücut Spreyleri", href: "https://beautynetkorea.com.tr/collections/vucut-spreyleri" },
    ],
  },
  {
    key: "cleanser",
    label: "Temizlik",
    color: "#ed1651",
    icon: "flask-conical" as const,
    href: "https://beautynetkorea.com.tr/collections/yuz-temizleyiciler",
    image: "/images/bnk/circle-temizleyici.webp",
    sub: [
      { label: "Temizleyici", href: "https://beautynetkorea.com.tr/collections/yuz-temizleyiciler" },
      { label: "Tonik", href: "https://beautynetkorea.com.tr/collections/tonik" },
      { label: "Peeling", href: "https://beautynetkorea.com.tr/collections/yuz-temizleyiciler" },
    ],
  },
];

// Fressi kategori renk sistemi (marka kılavuzu)
export const fressiCategories = [
  { key: "Coffee", label: "Kahve", color: "#594439", icon: "coffee" as const, image: "/images/fressi/espresso-em01.webp", href: "https://fressihome.com/collections/kahve-makinesi" },
  { key: "Kitchen", label: "Mutfak", color: "#818e71", icon: "utensils" as const, image: "/images/fressi/kettle-kt07.webp", href: "https://fressihome.com/collections/kettle" },
  { key: "Home", label: "Ev", color: "#d3c4a9", icon: "house" as const, image: "/images/fressi/cd-calar-cd183.webp", href: "https://fressihome.com/collections/temizlik-ve-ferahlik" },
  { key: "Collection", label: "Koleksiyon", color: "#467fa5", icon: "layout-grid" as const, image: "/images/fressi/pikap-p101.webp", href: "https://fressihome.com/collections/tum-urunler" },
];

/**
 * fressihome.com anasayfasındaki daire ürün rayının birebir karşılığı —
 * görseller ve koleksiyon linkleri mağazadan alındı.
 */
export const fressiCircles = [
  { label: "Airfryer Fırın", image: "/images/fressi/circle-airfryer.webp", href: "https://fressihome.com/collections/airfryer-firin" },
  { label: "Çay Makinesi", image: "/images/fressi/circle-cay-makinesi.webp", href: "https://fressihome.com/collections/cay-makinesi" },
  { label: "Smoothie Blender", image: "/images/fressi/circle-smoothie-blender.webp", href: "https://fressihome.com/collections/smoothie-blender" },
  { label: "Espresso Makinesi", image: "/images/fressi/circle-espresso.webp", href: "https://fressihome.com/collections/kahve-makinesi" },
  { label: "Akıllı Thermo Tencere", image: "/images/fressi/circle-thermo-tencere.webp", href: "https://fressihome.com/collections/akilli-thermo-tencere" },
  { label: "Kettle", image: "/images/fressi/circle-kettle.webp", href: "https://fressihome.com/collections/kettle" },
  { label: "Katı Meyve Sıkacağı", image: "/images/fressi/circle-meyve-sikacagi.webp", href: "https://fressihome.com/collections/kati-meyve-sikacagi" },
  { label: "Karıştırıcılar", image: "/images/fressi/circle-karistirici.webp", href: "https://fressihome.com/collections/karistiricilar" },
];
