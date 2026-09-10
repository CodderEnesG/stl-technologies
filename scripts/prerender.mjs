/**
 * Derleme sonrası: her rota için ayrı bir statik HTML üretir.
 *
 * Site bir SPA: hem metin hem de başlık/açıklama tarayıcıda JavaScript ile
 * üretiliyordu. JavaScript çalıştırmayan istemciler için sayfa tamamen boştu.
 * Bu iki ayrı soruna yol açıyordu:
 *
 * 1. Paylaşım robotları (WhatsApp, LinkedIn, X) JavaScript çalıştırmaz; hangi
 *    sayfa paylaşılırsa paylaşılsın aynı jenerik kart çıkıyordu.
 * 2. Cevap üreten AI tarayıcıları (GPTBot, OAI-SearchBot, ClaudeBot,
 *    PerplexityBot) da JavaScript çalıştırmaz; sitede meta açıklaması dışında
 *    alıntılanabilir tek bir cümle göremiyorlardı.
 *
 * Betik iki aşamalı çalışır: önce her rotanın head'ini yazar (başlık, açıklama,
 * canonical, hreflang, Open Graph, yapısal veri), sonra sayfaları gerçek bir
 * tarayıcıda açıp yerleşmiş DOM'un tamamını aynı dosyaya geri yazar. React
 * istemcide devralmaya devam eder, görünen davranış değişmez.
 *
 * Ayrıca sitemap.xml, robots.txt ve gerçek 404 döndüren 404.html üretilir.
 * Her rota kendi dosyasına yazıldığı için vercel.json'daki "her yolu
 * index.html'e yönlendir" kuralına gerek kalmaz; tanınmayan adresler artık
 * 200 yerine 404 döner (Google'ın "soft 404" saydığı durum ortadan kalkar).
 *
 * Çalıştırma: node --experimental-strip-types scripts/prerender.mjs
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
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
    return { title: `${doc.title} — ${company.name}`, description: doc.description };
  }
  const m = t.meta[page.meta];
  return { title: m.title, description: m.desc };
}

const BRANDS = [
  { name: "wexta", path: "/wexta" },
  { name: "Fressi", path: "/fressi", sameAs: "https://fressihome.com" },
  { name: "BNK", path: "/bnk", sameAs: "https://beautynetkorea.com.tr" },
  { name: "Oxyra", path: "/oxyra" },
];

function organizationLd(lang) {
  const { description } = copyFor(PAGES[0], lang);
  const home = abs(lang === "tr" ? "/" : "/en");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Corporation, Organization'ın geçerli bir alt tipi: STL kayıtlı bir limited şirket
        "@type": ["Organization", "Corporation"],
        "@id": `${home}#organization`,
        name: company.name,
        legalName: company.legalName,
        url: home,
        // Google'ın logo zengin sonucu SVG'de tutarsız davranıyor, kare raster veriliyor
        logo: `${ORIGIN}/logos/stl-logo-512.png`,
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
        brand: BRANDS.map((b) => ({
          "@type": "Brand",
          name: b.name,
          url: abs(b.path),
          ...(b.sameAs ? { sameAs: [b.sameAs] } : {}),
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        name: company.name,
        url: home,
        inLanguage: lang,
        publisher: { "@id": `${home}#organization` },
      },
    ],
  };
}

function pageLd(page, lang, url, title, description) {
  if (page.id === "home") return [organizationLd(lang)];

  const home = abs(lang === "tr" ? "/" : "/en");
  const isPartOf = { "@id": `${home}#website` };
  const publisher = { "@id": `${home}#organization` };

  if (page.legal) {
    return [
      { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url, inLanguage: lang, isPartOf, publisher },
    ];
  }

  const brand = BRANDS.find((b) => b.path === page.tr);
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      inLanguage: lang,
      isPartOf,
      publisher,
      // Brand, Organization'ın alt tipi değil: parentOrganization burada geçersiz.
      // Marka-şirket ilişkisi ana sayfadaki Organization.brand üzerinden kuruluyor.
      ...(brand
        ? {
            about: {
              "@type": "Brand",
              name: brand.name,
              url: abs(brand.path),
              ...(brand.sameAs ? { sameAs: [brand.sameAs] } : {}),
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
    noindex ? "" : `<link rel="canonical" href="${esc(url)}">`,
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
    ...ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");

  // JavaScript çalışmadığında (ya da anlık görüntü alınamadığında) sayfanın
  // tamamen boş kalmaması için asgari metin. Anlık görüntü başarılıysa bu blok
  // da içinde kalır; tarayıcıda görünmez, robot için okunur kalır.
  const nav = [
    ["/", "STL Teknoloji"],
    ["/wexta", "wexta"],
    ["/fressi", "Fressi"],
    ["/bnk", "BNK — Beauty Net Korea"],
    ["/oxyra", "Oxyra"],
  ]
    .map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`)
    .join("");

  const noscript = `<noscript><div>
      <h1>${esc(title)}</h1>
      <p>${esc(description)}</p>
      <p>${esc(company.name)} — ${esc(company.addressLines.join(", "))} · ${esc(company.phoneDisplay)} · ${esc(company.email)}</p>
      <nav><ul>${nav}</ul></nav>
    </div></noscript>`;

  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace('<div id="root"></div>', `${noscript}\n    <div id="root"></div>`)
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

# Cevap üreten AI tarayıcıları açıkça izinli. Joker kural zaten izin veriyor;
# ileride "*" grubu daraltılırsa bunlar sessizce dışarıda kalmasın diye ayrıca yazıldı.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`,
);


/* ------------------------------------------------- gövde anlık görüntüsü */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * dist'i olduğu gibi sunan küçük sunucu. `vite preview` kullanılamaz: o, bilinmeyen
 * her yolu index.html'e düşürdüğü için /wexta isteğine ana sayfayı veriyor ve
 * rotaya özel head'i hiç görmüyoruz.
 */
function serveDist() {
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = join(DIST, normalize(path));
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(readFileSync(join(DIST, "404.html")));
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

/**
 * Kapsayıcı içinde çalışan Chromium'un ayakta kalması için gereken bayraklar.
 * Vercel derleme kabında paylaşılan bellek (/dev/shm) 64 MB ve kum havuzunun
 * ihtiyaç duyduğu çekirdek yetkileri yok; varsayılan ayarlarla tarayıcı açılır
 * açılmaz düşüyor ve Playwright bunu "Target page, context or browser has been
 * closed" diye bildiriyor. Bayraklar macOS'ta da zararsız.
 */
const CHROMIUM_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];

/** Sırayla iki yapılandırma dener; ikisi de tutmazsa hata metinlerini döndürür. */
async function launchChromium() {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (err) {
    return { failures: [`playwright yüklenemedi: ${err.message}`] };
  }

  // Tek süreç kipi son çare: bazı kısıtlı kaplarda alt süreç açmak yasak.
  const attempts = [
    { label: "standart", args: CHROMIUM_ARGS },
    { label: "tek süreç", args: [...CHROMIUM_ARGS, "--single-process"] },
  ];

  const failures = [];
  for (const attempt of attempts) {
    try {
      const browser = await chromium.launch({
        args: attempt.args,
        chromiumSandbox: false,
        timeout: 60_000,
      });
      if (failures.length) console.warn(`prerender: tarayıcı "${attempt.label}" kipinde açıldı.`);
      return { browser };
    } catch (err) {
      failures.push(`${attempt.label}: ${err.message}`);
    }
  }
  return { failures };
}

async function snapshotBodies(routes) {
  // Tarayıcı yoksa derleme çökmemeli: head'ler zaten yazıldı, site çalışır.
  // Ama gövde ön-render'ı olmadan JavaScript çalıştırmayan tarayıcılar sayfayı
  // boş görür, o yüzden sessiz geçilmiyor.
  const { browser, failures } = await launchChromium();
  if (!browser) {
    console.warn(
      `\nprerender UYARI: tarayıcı açılamadı, gövde ön-render'ı atlandı.\n` +
        failures.map((f) => `  Denendi — ${f}\n`).join("") +
        `  Sonuç: sayfalar meta etiketleriyle geliyor ama gövde boş; JavaScript\n` +
        `  çalıştırmayan tarayıcılar (GPTBot, ClaudeBot, PerplexityBot, paylaşım\n` +
        `  robotları) metni göremez. Düzeltmek için: pnpm exec playwright install chromium\n`,
    );
    return 0;
  }

  const { server, port } = await serveDist();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  // İçerik anlık görüntüsü her zaman koddaki metinlerden üretilsin: admin
  // panelindeki metinler tarayıcıda zaten üzerine biniyor, derleme çıktısının
  // hangi ana ait olduğu belirsiz kalmasın.
  await page.route("**/rest/v1/site_content*", (r) => r.abort());

  // Analitik derleme sırasında yüklenmesin: networkidle beklemesini uzatıyor ve
  // ölçüm kimliğine derleme trafiği düşmesine yol açabiliyor.
  await page.route("**://*.googletagmanager.com/**", (r) => r.abort());

  let done = 0;
  for (const routePath of routes) {
    await page.goto(`http://127.0.0.1:${port}${routePath}`, { waitUntil: "networkidle" });
    await page.waitForSelector("#root > *", { timeout: 15000 });

    await page.evaluate(async () => {
      // Kaydırmayla açılan bölümler (Reveal) varsayılan olarak saydamsız; anlık
      // görüntüde gizli metin gibi görünmemeleri için hepsi görünür yapılıyor.
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));

      // İhracat haritasının ülke yolları tek başına ~96 KB; dekoratif geometri,
      // arama motoruna hiçbir şey anlatmıyor. Anlık görüntüden çıkarılıyor,
      // React istemcide haritayı zaten yeniden çiziyor.
      document.querySelectorAll("path[d]").forEach((el) => {
        if ((el.getAttribute("d") ?? "").length > 400) el.removeAttribute("d");
      });
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 250));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);

    const html = await page.evaluate(() => document.documentElement.outerHTML);
    write(routePath, `<!doctype html>\n${html}\n`);
    done++;
  }

  await browser.close();
  await new Promise((r) => server.close(r));
  return done;
}

const snapshotted = await snapshotBodies([...PAGES.flatMap((p) => [p.tr, p.en])]);

console.log(`prerender: ${written.length} sayfa (${snapshotted} tanesi gövdesiyle), sitemap.xml (${sitemap.length} adres), robots.txt, 404.html`);

// Sunucuda gövdesiz çıktı sessizce yayına girmesin: PRERENDER_STRICT=1 verilirse
// tarayıcı aşaması düştüğünde derleme başarısız sayılır.
if (snapshotted === 0 && process.env.PRERENDER_STRICT === "1") {
  console.error("prerender HATA: PRERENDER_STRICT=1 ve hiçbir sayfanın gövdesi üretilemedi.");
  process.exit(1);
}
