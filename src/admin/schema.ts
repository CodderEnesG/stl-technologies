/**
 * Admin panelinin sayfa ve bölüm haritası.
 *
 * Tek tek 400 alan yazılmaz: her bölüm içerik ağacındaki bir kaç "kök" verir,
 * kökün altındaki metin yaprakları otomatik toplanır. Bir metin sitede
 * kullanılmıyorsa (eski varyant bileşenlerinde kalan anahtarlar gibi) buraya
 * hiç yazılmaz — müşteri panelde sadece sayfada gördüğü metni görür.
 */
import { tr } from "../content/tr";
import { en } from "../content/en";
import { collectStringLeaves, getByPath } from "../content/paths";
import { MULTILINE_KEYS, fieldLabel, groupLabel } from "./labels";

export type PageId = "home" | "wexta" | "fressi" | "bnk" | "oxyra";

type SectionDef = {
  id: string;
  title: string;
  note?: string;
  roots: string[];
};

type PageDef = {
  id: PageId;
  title: string;
  /** Sitedeki karşılığı — "Siteyi aç" bağlantısı */
  href: string;
  color: string;
  sections: SectionDef[];
};

const brandCommon = (slug: string, extra: SectionDef[]): SectionDef[] => [
  {
    id: "meta",
    title: "Arama motoru bilgisi",
    note: "Google sonuçlarında ve tarayıcı sekmesinde görünür.",
    roots: [`meta.${slug}`],
  },
  ...extra,
  {
    id: "cta",
    title: "Kapanış bloğu",
    roots: [`brands.${slug}.quote`, `brands.${slug}.ctaTitle`, `brands.${slug}.channel`],
  },
];

export const PAGES: PageDef[] = [
  {
    id: "home",
    title: "Ana sayfa",
    href: "/",
    color: "#e10000",
    sections: [
      {
        id: "meta",
        title: "Arama motoru bilgisi",
        note: "Google sonuçlarında ve tarayıcı sekmesinde görünür.",
        roots: ["meta.home"],
      },
      {
        id: "nav",
        title: "Menü",
        roots: ["nav"],
      },
      {
        id: "hero",
        title: "Giriş panelleri",
        note: "Dört marka panelinin üzerindeki metinler.",
        roots: [
          "brands.wexta.tagline",
          "brands.fressi.tagline",
          "brands.bnk.tagline",
          "brands.oxyra.tagline",
          "home.discoverBrand",
        ],
      },
      {
        id: "about",
        title: "Hakkımızda",
        roots: ["home.whoWeAre", "home.stats", "about.buildingAlt"],
      },
      {
        id: "mission",
        title: "Misyon ve vizyon",
        roots: ["about.missionEyebrow", "about.missionTitle", "about.mission", "about.vision"],
      },
      {
        id: "brands",
        title: "Markalar bölümü",
        note: "Marka küpü ve kartlardaki özet metinler.",
        roots: [
          "home.portfolioEyebrow",
          "home.portfolioTitle",
          "home.portfolioDescription",
          "home.cube",
          "brands.wexta.summary",
          "brands.fressi.summary",
          "brands.bnk.summary",
          "brands.oxyra.summary",
        ],
      },
      {
        id: "partners",
        title: "Referanslar",
        roots: ["home.partnersKicker", "home.partnersTitle", "home.partnersNote"],
      },
      {
        id: "export",
        title: "İhracat haritası",
        roots: ["home.exportMap"],
      },
      {
        id: "contact",
        title: "İletişim",
        roots: ["contact", "home.ctaButton"],
      },
      {
        id: "footer",
        title: "Alt bilgi",
        roots: ["footer"],
      },
      {
        id: "cookies",
        title: "Çerez bandı",
        note: "Siteye ilk girişte alttan çıkan onay kutusu. Ekran okuyucu etiketi panelde yok.",
        roots: ["cookies.title", "cookies.body", "cookies.policy", "cookies.accept", "cookies.reject"],
      },
      {
        id: "shared",
        title: "Ortak metinler",
        note: "Marka sayfalarında ve hata sayfasında tekrar eden metinler.",
        roots: ["brandPage", "home.explore", "notFound"],
      },
    ],
  },
  {
    id: "wexta",
    title: "wexta",
    href: "/wexta",
    color: "#29aec6",
    sections: brandCommon("wexta", [
      { id: "hero", title: "Giriş", roots: ["brands.wexta.heroAlt"] },
      { id: "about", title: "Hakkında", roots: ["brands.wexta.about", "brands.wexta.stats"] },
      { id: "shells", title: "Gövde bölümü", roots: ["brands.wexta.shells"] },
      { id: "guide", title: "Boy rehberi", roots: ["brands.wexta.guide"] },
      {
        id: "series",
        title: "Seri rehberi",
        note: "Seri kodları katalogdan gelir; burada sadece ad ve açıklama değişir.",
        roots: ["brands.wexta.series"],
      },
      { id: "spec", title: "Teknik şerit", roots: ["brands.wexta.specBand"] },
      {
        id: "hotspots",
        title: "Yakından bakın",
        roots: [
          "brands.wexta.hotspotsEyebrow",
          "brands.wexta.hotspotsTitle",
          "brands.wexta.hotspotsHint",
          "brands.wexta.hotspots",
        ],
      },
      { id: "stages", title: "Üretim aşamaları", roots: ["brands.wexta.stages"] },
      { id: "parts", title: "Parça bölümü", roots: ["brands.wexta.parts"] },
    ]),
  },
  {
    id: "fressi",
    title: "Fressi",
    href: "/fressi",
    color: "#818e71",
    sections: brandCommon("fressi", [
      { id: "hero", title: "Giriş slaytları", roots: ["brands.fressi.hero"] },
      {
        id: "about",
        title: "Hakkında",
        roots: ["brands.fressi.tagline", "brands.fressi.about"],
      },
      { id: "categories", title: "Kategori daireleri", roots: ["brands.fressi.categoryCircles"] },
      { id: "gallery", title: "Galeri", roots: ["brands.fressi.gallery"] },
      { id: "reviews", title: "Yorumlar bölümü", roots: ["brands.fressi.reviews"] },
      { id: "editorial", title: "Editoryal blok", roots: ["brands.fressi.editorial"] },
    ]),
  },
  {
    id: "bnk",
    title: "BNK",
    href: "/bnk",
    color: "#ed1651",
    sections: brandCommon("bnk", [
      { id: "hero", title: "Giriş", roots: ["brands.bnk.hero"] },
      { id: "about", title: "Hakkında", roots: ["brands.bnk.about"] },
      {
        id: "bar",
        title: "Kategori barı",
        roots: ["brands.bnk.barLinks", "brands.bnk.allProducts"],
      },
      { id: "routine", title: "Rutin adımları", roots: ["brands.bnk.routine"] },
      { id: "bestsellers", title: "Çok satanlar", roots: ["brands.bnk.bestSellers"] },
      { id: "blog", title: "Blog kartları", roots: ["brands.bnk.blog"] },
    ]),
  },
  {
    id: "oxyra",
    title: "Oxyra",
    href: "/oxyra",
    color: "#3596de",
    sections: brandCommon("oxyra", [
      { id: "about", title: "Hakkında", roots: ["brands.oxyra.tagline", "brands.oxyra.brandAbout"] },
      { id: "spec", title: "Teknik şerit", roots: ["brands.oxyra.specBand"] },
      { id: "spotlight", title: "Öne çıkan model", roots: ["brands.oxyra.spotlight"] },
      {
        id: "hotspots",
        title: "Yakından bakın",
        roots: [
          "brands.oxyra.hotspotsEyebrow",
          "brands.oxyra.hotspotsTitle",
          // hotspotsHint Oxyra sayfasında yorum satırında — panelde göstermiyoruz
          "brands.oxyra.hotspots",
        ],
      },
      {
        id: "range",
        title: "Ürün gamı",
        roots: [
          "brands.oxyra.rangeEyebrow",
          "brands.oxyra.rangeTitle",
          "brands.oxyra.rangeDescription",
          "brands.oxyra.range",
        ],
      },
    ]),
  },
];

/* ---------- şemadan alanların üretimi ---------- */

export type Field = {
  path: string;
  label: string;
  multiline: boolean;
  trDefault: string;
  enDefault: string;
};

export type FieldGroup = {
  key: string;
  title?: string;
  fields: Field[];
};

export type Section = {
  id: string;
  title: string;
  note?: string;
  groups: FieldGroup[];
  /** Bölümdeki tüm alan yolları — kirlilik ve sayaç hesabı için */
  paths: string[];
};

const isIndex = (seg: string) => /^\d+$/.test(seg);

const buildField = (path: string, trValue: string): Field => {
  const segs = path.split(".");
  const last = segs[segs.length - 1]!;
  const parentKey = segs[segs.length - 2] ?? "";

  const label = isIndex(last)
    ? `${groupLabel(parentKey)} ${Number(last) + 1}`
    : fieldLabel(last);

  const enValue = getByPath(en, path);
  const multiline = MULTILINE_KEYS.has(last) || trValue.length > 90;

  return {
    path,
    label,
    multiline,
    trDefault: trValue,
    enDefault: typeof enValue === "string" ? enValue : trValue,
  };
};

/** Bir alanın hangi gruba düştüğü: dizi öğesi ise öğenin kendisi, değilse üst nesne. */
const groupKeyFor = (path: string, root: string): { key: string; title?: string } => {
  const rootDepth = root.split(".").length;
  const segs = path.split(".");
  const parent = segs.slice(0, -1);

  // Kök seviyesindeki düz alanlar tek bir isimsiz grupta toplansın
  if (parent.length <= rootDepth) return { key: root };

  const key = parent.join(".");
  const tail = parent[parent.length - 1]!;
  const before = parent[parent.length - 2] ?? "";

  const title = isIndex(tail)
    ? `${groupLabel(before)} ${Number(tail) + 1}`
    : groupLabel(tail);

  return { key, title };
};

export function buildSections(pageId: PageId): Section[] {
  const page = PAGES.find((p) => p.id === pageId);
  if (!page) return [];

  return page.sections.map((def) => {
    const groups: FieldGroup[] = [];
    const byKey = new Map<string, FieldGroup>();
    const paths: string[] = [];

    for (const root of def.roots) {
      const leaves = collectStringLeaves(tr, root);
      for (const leaf of leaves) {
        // Dizi öğesi olmayan tek metinler (ör. "home.ctaButton") kökün kendisidir
        const { key, title } = groupKeyFor(leaf.path, root);
        let group = byKey.get(key);
        if (!group) {
          group = { key, title, fields: [] };
          byKey.set(key, group);
          groups.push(group);
        }
        group.fields.push(buildField(leaf.path, leaf.value));
        paths.push(leaf.path);
      }
    }

    // Tek alanlık isimsiz gruplar sadeleşsin
    for (const g of groups) {
      if (g.fields.length === 1 && g.title && g.fields[0]!.label === g.title) delete g.title;
    }

    return { id: def.id, title: def.title, note: def.note, groups, paths };
  });
}

/** Panelde yönetilen tüm yollar — kapsam denetimi için */
export function allManagedPaths(): string[] {
  return PAGES.flatMap((p) => buildSections(p.id).flatMap((s) => s.paths));
}

export const getPage = (id: PageId) => PAGES.find((p) => p.id === id)!;
