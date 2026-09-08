/**
 * Derleme sonrası: her rota için ayrı bir statik HTML üretir.
 *
 * Site bir SPA; başlık ve açıklama tarayıcıda JavaScript ile yazılıyor.
 * WhatsApp, LinkedIn ve X gibi paylaşım robotları JavaScript çalıştırmaz, bu
 * yüzden hangi sayfa paylaşılırsa paylaşılsın aynı jenerik kart çıkıyordu.
 * Burada her rotanın HTML'i başlık, açıklama, canonical, hreflang, Open Graph
 * ve yapısal veriyle birlikte önceden yazılıyor.
 *
 * Ayrıca sitemap.xml, robots.txt ve gerçek 404 döndüren 404.html üretilir.
 * Her rota kendi dosyasına yazıldığı için vercel.json'daki "her yolu
 * index.html'e yönlendir" kuralına gerek kalmaz; tanınmayan adresler artık
 * 200 yerine 404 döner (Google'ın "soft 404" saydığı durum ortadan kalkar).
 *
 * Çalıştırma: node --experimental-strip-types scripts/prerender.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { tr } from "../src/content/tr.ts";
import { en } from "../src/content/en.ts";
import { legalDocs } from "../src/content/legal.ts";
import { company } from "../src/data/company.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://www.stlteknoloji.com";

const dict = { tr, en };

/** Sayfa listesi. `meta` içerik dosyasındaki anahtar, `og` paylaşım görseli. */
const PAGES = [
  { id: "home", meta: "home", tr: "/", en: "/en", og: "/og/og-home.jpg", priority: "1.0" },
  { id: "wexta", meta: "wexta", tr: "/wexta", en: "/en/wexta", og: "/og/og-wexta.jpg", priority: "0.9" },
  { id: "fressi", meta: "fressi", tr: "/fressi", en: "/en/fressi", og: "/og/og-fressi.jpg", priority: "0.9" },
  { id: "bnk", meta: "bnk", tr: "/bnk", en: "/en/bnk", og: "/og/og-bnk.jpg", priority: "0.9" },
  { id: "oxyra", meta: "oxyra", tr: "/oxyra", en: "/en/oxyra", og: "/og/og-oxyra.jpg", priority: "0.9" },
  { id: "kvkk", legal: "kvkk", tr: "/kvkk", en: "/en/gdpr", og: "/og/og-home.jpg", priority: "0.2" },
  { id: "privacy", legal: "privacy", tr: "/gizlilik", en: "/en/privacy", og: "/og/og-home.jpg", priority: "0.2" },
];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (path) => `${ORIGIN}${path === "/" ? "/" : path}`;

/** Sayfa + dil için başlık ve açıklama */
function copyFor(page, lang) {
  const t = dict[lang];
  if (page.legal) {
    const doc = legalDocs[page.legal][lang];
    return { title: `${doc.title} — ${company.name}`, description: doc.title };
  }
  const m = t.meta[page.meta];
  return { title: m.title, description: m.desc };
}

const BRANDS = [
  { name: "wexta", path: "/wexta" },
  { name: "Fressi", path: "/fressi" },
  { name: "BNK", path: "/bnk" },
  { name: "Oxyra", path: "/oxyra" },
];

function organizationLd(lang) {
  const { description } = copyFor(PAGES[0], lang);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    legalName: company.legalName,
    url: abs(lang === "tr" ? "/" : "/en"),
    logo: `${ORIGIN}/logos/stl.svg`,
    image: `${ORIGIN}/og/og-home.jpg`,
    foundingDate: String(company.founded),
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${company.addressLines[0]}, ${company.addressLines[1]}`,
      addressLocality: "Arnavutköy",
      addressRegion: "İstanbul",
      postalCode: "34555",
      addressCountry: "TR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phoneHref.replace("tel:", ""),
        email: company.email,
        contactType: "sales",
        availableLanguage: ["tr", "en"],
      },
    ],
    sameAs: [company.instagram],
    brand: BRANDS.map((b) => ({ "@type": "Brand", name: b.name, url: abs(b.path) })),
  };
}

function pageLd(page, lang, url, title, description) {
  if (page.id === "home") return [organizationLd(lang)];
  if (page.legal) return [];

  const brand = BRANDS.find((b) => b.path === page.tr);
  const home = abs(lang === "tr" ? "/" : "/en");
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      inLanguage: lang,
      isPartOf: { "@type": "WebSite", name: company.name, url: home },
      ...(brand
        ? {
            about: {
              "@type": "Brand",
              name: brand.name,
              parentOrganization: { "@type": "Organization", name: company.name, url: home },
            },
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: company.name, item: home },
        { "@type": "ListItem", position: 2, name: brand?.name ?? title, item: url },
      ],
    },
  ];
}

/** Vite'ın ürettiği kabuğa sayfaya özgü head etiketlerini yazar */
function renderPage(template, { lang, title, description, url, alternates, og, ld, noindex }) {
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    noindex ? `<meta name="robots" content="noindex, nofollow">` : "",
    `<link rel="canonical" href="${esc(url)}">`,
    ...alternates.map(
      (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}">`,
    ),
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(company.name)}">`,
    `<meta property="og:locale" content="${lang === "tr" ? "tr_TR" : "en_US"}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${esc(ORIGIN + og)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${esc(ORIGIN + og)}">`,
    ...ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");

  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    // Kabuktaki jenerik başlık/açıklama/og etiketleri sayfaya özgü olanlarla değişir
    .replace(/\s*<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/g, "")
    .replace(/\s*<meta property="og:(title|description)"[^>]*>/g, "")
    .replace("</head>", `  ${head}\n  </head>`);
}

function write(routePath, html) {
  const file =
    routePath === "/" ? join(DIST, "index.html") : join(DIST, routePath.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return file.replace(DIST + "/", "");
}

// ---------------------------------------------------------------- çalıştır

const template = readFileSync(join(DIST, "index.html"), "utf8");
const written = [];
const sitemap = [];

for (const page of PAGES) {
  const alternates = [
    { hreflang: "tr", href: abs(page.tr) },
    { hreflang: "en", href: abs(page.en) },
    { hreflang: "x-default", href: abs(page.tr) },
  ];

  for (const lang of ["tr", "en"]) {
    const routePath = page[lang];
    const url = abs(routePath);
    const { title, description } = copyFor(page, lang);
    const html = renderPage(template, {
      lang,
      title,
      description,
      url,
      alternates,
      og: page.og,
      ld: pageLd(page, lang, url, title, description),
    });
    written.push(write(routePath, html));
    sitemap.push({ url, alternates, priority: page.priority });
  }
}

// Panel: arama motorlarına kapalı, site haritasında yok
written.push(
  write(
    "/admin",
    renderPage(template, {
      lang: "tr",
      title: `İçerik Yönetimi — ${company.name}`,
      description: "STL Teknoloji içerik yönetim paneli.",
      url: abs("/admin"),
      alternates: [],
      og: "/og/og-home.jpg",
      ld: [],
      noindex: true,
    }),
  ),
);

// Bulunamayan adresler: Vercel bu dosyayı 404 durum koduyla döndürür
writeFileSync(
  join(DIST, "404.html"),
  renderPage(template, {
    lang: "tr",
    title: `${tr.notFound.title} — ${company.name}`,
    description: tr.notFound.body,
    url: abs("/404"),
    alternates: [],
    og: "/og/og-home.jpg",
    ld: [],
    noindex: true,
  }),
);

const today = new Date().toISOString().slice(0, 10);
const urlset = sitemap
  .map(
    ({ url, alternates, priority }) => `  <url>
    <loc>${esc(url)}</loc>
${alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join("\n")}
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n");

writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>
`,
);

writeFileSync(
  join(DIST, "robots.txt"),
  `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${ORIGIN}/sitemap.xml
`,
);

console.log(`prerender: ${written.length} sayfa, sitemap.xml (${sitemap.length} adres), robots.txt, 404.html`);
