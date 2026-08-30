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
    hero: img("1741896135490-4062a3b21abf", 1100, 1300),
    channelHref: "",
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
    navBg: "rgba(11,16,58,0.94)",
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

export const bnkProducts: Product[] = [
  { name: "Cilt Bakımı", category: "Skincare", image: img("1741896136113-c33a4fded0b5", 900, 1100), href: "" },
  { name: "Nemlendirici", category: "Skincare", image: img("1590393802710-dbf451560939", 900, 1100), href: "" },
  { name: "Esans", category: "Skincare", image: img("1623143445418-40c192fa3d11", 900, 1100), href: "" },
];

// Fressi kategori renk sistemi (marka kılavuzu)
export const fressiCategories = [
  { key: "Kitchen", label: "Mutfak", color: "#818e71", icon: "utensils" as const, image: "/images/fressi/kettle-kt07.webp", href: "https://fressihome.com/collections/kettle" },
  { key: "Coffee", label: "Kahve", color: "#594439", icon: "coffee" as const, image: "/images/fressi/espresso-em01.webp", href: "https://fressihome.com/collections/kahve-makinesi" },
  { key: "Collection", label: "Koleksiyon", color: "#467fa5", icon: "layout-grid" as const, image: "/images/fressi/pikap-p101.webp", href: "https://fressihome.com/collections/tum-urunler" },
  { key: "Home", label: "Ev", color: "#d3c4a9", icon: "house" as const, image: "/images/fressi/cd-calar-cd183.webp", href: "https://fressihome.com/collections/temizlik-ve-ferahlik" },
];
