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
import { execFileSync } from "node:child_process";
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

/**
 * IndexNow anahtarı. Gizli değil — protokol gereği aynı değer
 * https://www.stlteknoloji.com/<anahtar>.txt adresinde de yayınlanır; arama
 * motoru bildirimin gerçekten site sahibinden geldiğini böyle doğrular.
 * Bildirimi scripts/indexnow.mjs gönderir (Bing, Yandex, Naver, Seznam).
 */
const INDEXNOW_KEY = "2c8f89217cc46a2ca06ba21025e14cf6";

const dict = { tr, en };

/** Sayfa listesi. `meta` içerik dosyasındaki anahtar, `og` paylaşım görseli. */
const PAGES = [
  // `sources`: sayfanın içeriğini belirleyen dosyalar. sitemap lastmod bunlara
  // dokunan son commit tarihinden hesaplanır.
  { id: "home", meta: "home", tr: "/", en: "/en", og: "/og/og-home.jpg", sources: ["src/pages/Home.tsx", "src/content/tr.ts", "src/content/en.ts", "src/data/company.ts", "src/data/brands.ts"] },
  { id: "wexta", meta: "wexta", tr: "/wexta", en: "/en/wexta", og: "/og/og-wexta.jpg", sources: ["src/pages/Wexta.tsx", "src/content/tr.ts", "src/content/en.ts", "src/data/brands.ts"] },
  { id: "fressi", meta: "fressi", tr: "/fressi", en: "/en/fressi", og: "/og/og-fressi.jpg", sources: ["src/pages/Fressi.tsx", "src/content/tr.ts", "src/content/en.ts", "src/data/brands.ts", "src/data/fressiReviews.ts"] },
  { id: "bnk", meta: "bnk", tr: "/bnk", en: "/en/bnk", og: "/og/og-bnk.jpg", sources: ["src/pages/BNK.tsx", "src/content/tr.ts", "src/content/en.ts", "src/data/brands.ts"] },
  { id: "oxyra", meta: "oxyra", tr: "/oxyra", en: "/en/oxyra", og: "/og/og-oxyra.jpg", sources: ["src/pages/Oxyra.tsx", "src/content/tr.ts", "src/content/en.ts", "src/data/brands.ts"] },
  { id: "kvkk", legal: "kvkk", tr: "/kvkk", en: "/en/gdpr", og: "/og/og-home.jpg", sources: ["src/content/legal.ts", "src/pages/Legal.tsx"] },
  { id: "privacy", legal: "privacy", tr: "/gizlilik", en: "/en/privacy", og: "/og/og-home.jpg", sources: ["src/content/legal.ts", "src/pages/Legal.tsx"] },
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

/**
 * Kanonik kimlikler.
 *
 * Organization dile göre çatallanmamalı: tüzel kişi tektir. Önceden TR ve EN
 * ana sayfaları iki ayrı `@id` altında (`/#organization` ve `/en#organization`)
 * tam birer Organization tanımlıyordu; tüketiciler bunu iki ayrı şirket gibi
 * okuyup varlık birleştirmesini bölüyordu. Artık tek `@id` var, EN sayfaları
 * da ona referans veriyor.
 *
 * Aynı sorun markalarda daha büyüktü: 16 Brand düğümünün hiçbirinde `@id`
 * yoktu, yani ana sayfadaki "wexta" ile /wexta'daki "wexta"nın aynı varlık
 * olduğunu hiçbir şey söylemiyordu. Her marka artık tek bir `@id` ile
 * tanımlanıyor, diğer her yer ona referans veriyor.
 */
const ORG_ID = `${ORIGIN}/#organization`;
const brandId = (path) => `${abs(path)}#brand`;

/** Marka düğümleri yalnızca ana sayfada tam tanımlanır; başka yerde referans. */
function brandNodes() {
  return BRANDS.map((b) => ({
    "@type": "Brand",
    "@id": brandId(b.path),
    name: b.name,
    url: abs(b.path),
    ...(b.sameAs ? { sameAs: [b.sameAs] } : {}),
  }));
}

function organizationLd(lang) {
  const { description } = copyFor(PAGES[0], lang);
  const home = abs(lang === "tr" ? "/" : "/en");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // Corporation, Organization'ın geçerli bir alt tipi: STL kayıtlı bir limited şirket
        "@type": ["Organization", "Corporation"],
        "@id": ORG_ID,
        name: company.name,
        legalName: company.legalName,
        url: abs("/"),
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
        // Kuruluş yeri ve hizmet alanı sitedeki doğrulanmış bilgiden geliyor.
        // Ülke listesi henüz müşteriden gelmediği için ihracat pazarları sayı
        // olarak değil, yalnızca Türkiye + genel ihracat ifadesiyle veriliyor;
        // uydurma ülke adı yazılmıyor.
        foundingLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Arnavutköy",
            addressRegion: "İstanbul",
            addressCountry: "TR",
          },
        },
        areaServed: [
          { "@type": "Country", "name": "TR" },
          ...company.exportMarkets.map((code) => ({ "@type": "Country", name: code })),
        ],
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
        brand: BRANDS.map((b) => ({ "@id": brandId(b.path) })),
      },
      ...brandNodes(),
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        name: company.name,
        url: home,
        inLanguage: lang,
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

function pageLd(page, lang, url, title, description) {
  if (page.id === "home") return [organizationLd(lang)];

  const home = abs(lang === "tr" ? "/" : "/en");
  const isPartOf = { "@id": `${home}#website` };
  const publisher = { "@id": ORG_ID };

  if (page.legal) {
    // Yasal sayfalar da kırıntı taşısın: marka sayfalarında zaten var, burada
    // yoktu ve desen sitenin geri kalanıyla tutarsız kalıyordu.
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
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: company.name, item: home },
          { "@type": "ListItem", position: 2, name: title.split(" — ")[0], item: url },
        ],
      },
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
      // Marka burada yeniden tanımlanmaz, kanonik @id ile referans verilir.
      ...(brand ? { about: { "@id": brandId(brand.path) } } : {}),
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
    // Denendi ve tutulmadı: <script type="module"> ile modulepreload'lara
    // fetchpriority="low" vermek. Gerekçe, paketin LCP görselinin önüne
    // geçmesiydi; ama görseller küçüldükten sonra ölçümde fark kalmadı
    // (ana sayfa 808'e karşı 800 ms, Fressi 648'e karşı 652 ms — gürültü).
    // Bölümler zaten Reveal ile JavaScript gelene kadar saydam durduğu için
    // paketi geciktirmenin görünür içeriği de geciktirme riski vardı.
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

/**
 * Kabuk şablonu.
 *
 * Vite'ın ürettiği boş index.html şablon olarak kullanılır — ama ana sayfa da
 * aynı dosyaya yazılıyor. Şablon doğrudan dist/index.html'den okunursa betik
 * ikinci kez çalıştığında kendi çıktısını şablon sanıyor ve enjekte edilen
 * etiketler üst üste birikiyordu. İlk çalıştırmada temiz kopya ayrı bir dosyaya
 * alınır; sonraki çalıştırmalar oradan okur. `vite build` dist'i temizlediği
 * için kopya her derlemede yenilenir.
 */
const SHELL = join(DIST, ".prerender-shell.html");
if (!existsSync(SHELL)) writeFileSync(SHELL, readFileSync(join(DIST, "index.html"), "utf8"));
const rawTemplate = readFileSync(SHELL, "utf8");

/**
 * Site CSS'i ayrı dosya olarak istenmek yerine sayfaya gömülür.
 *
 * Tarayıcı HTML'i alıp <link rel="stylesheet"> satırını görünce duruyor ve
 * stili ikinci bir istekle çekiyor; o gelene kadar hiçbir şey boyamıyor.
 * Yani ilk boyamanın önünde arka arkaya iki gidiş dönüş var. Gömülünce ikincisi
 * kalkıyor, boyama HTML'in kendisiyle başlayabiliyor.
 *
 * Dosya sıkıştırılmış hâlde ~13 KB; gömmek için makul boyut. Bedeli, CSS'in
 * artık ayrı önbelleklenmemesi: ikinci bir sayfaya geçen ziyaretçi aynı baytları
 * tekrar indiriyor. Ziyaretlerin çoğu aramadan gelip tek sayfada bittiği için
 * takas ilk boyama lehine.
 */
const template = (() => {
  const link = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/.exec(rawTemplate);
  if (!link) return rawTemplate;

  const file = join(DIST, link[1]);
  if (!existsSync(file)) return rawTemplate;

  const css = readFileSync(file, "utf8");
  return rawTemplate.replace(link[0], `<style>${css}</style>`);
})();
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
    sitemap.push({ url, alternates, sources: page.sources });
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

const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * Sayfanın gerçek son değişiklik tarihi: o sayfayı üreten dosyalara dokunan
 * son commit'in tarihi.
 *
 * Önceden bütün adresler derleme tarihini taşıyordu — nadiren değişen yasal
 * sayfalar bile her dağıtımda "bugün güncellendi" diyordu, bu da lastmod'un
 * sinyal değerini sıfırlıyor.
 *
 * Sığ klonlarda (Vercel varsayılanı) git geçmişi eksik olabilir; o durumda
 * derleme tarihine düşülür, yani en kötü ihtimalle eski davranış.
 */
function lastModified(sources) {
  const paths = (sources ?? []).filter((f) => existsSync(join(ROOT, f)));
  if (paths.length === 0) return BUILD_DATE;
  const dates = [];
  for (const f of paths) {
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", f], {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(out)) dates.push(out);
    } catch {
      // git yok ya da geçmiş eksik — sessizce derleme tarihine düşülür
    }
  }
  return dates.length ? dates.sort().at(-1) : BUILD_DATE;
}

// <priority> bilerek yazılmıyor: Google 2020'den beri yok sayıyor, 14 adresli
// bir sitede tarama bütçesine de etkisi yok. changefreq de aynı sebeple yok.
const urlset = sitemap
  .map(
    ({ url, alternates, sources }) => `  <url>
    <loc>${esc(url)}</loc>
${alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join("\n")}
    <lastmod>${lastModified(sources)}</lastmod>
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

# /admin bilerek engellenmiyor. Sayfa zaten "noindex, nofollow" taşıyor; taramayı
# robots.txt ile kapatmak Google'ın o etiketi görmesini de engelliyordu, yani
# adres dışarıdan keşfedilirse yine de adres olarak dizine girebiliyordu. Şimdi
# taranabilir ve noindex okunabilir — dizine girmemesi garanti. Panelin önünde
# gerçek oturum doğrulaması var; robots.txt zaten erişim denetimi değil.
# Yan fayda: yönetim adresi artık herkese açık bir dosyada ilan edilmiyor.

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

// IndexNow doğrulama dosyası: içeriği anahtarın kendisi.
writeFileSync(join(DIST, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);


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

/**
 * İlk perdedeki görselleri toplar. Tarayıcı bağlamında çalışır; iki farklı
 * genişlikte çağrılır (bkz. collectPreloads).
 */
const COLLECTOR = () => {
  const fold = window.innerHeight;
  const out = [];
  const seen = new Set();

  const add = (entry) => {
    const key = `${entry.media ?? ""}|${entry.srcset || entry.href}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ ...entry, key });
  };

  const localPath = (raw) => {
    if (!raw || raw.startsWith("data:")) return null;
    const path = new URL(raw, location.href).pathname;
    return path.startsWith("/images/") || path.startsWith("/logos/") ? path : null;
  };

  /** Görünen alan; ekran dışı ya da gizli öğe için 0 */
  const visible = (el) => {
    const box = el.getBoundingClientRect();
    if (box.top >= fold || box.bottom <= 0 || box.width < 40 || box.height < 20) return 0;
    return Math.round(box.width * Math.min(box.height, fold - Math.max(box.top, 0)));
  };

  const sourcesOf = (picture) =>
    [...picture.querySelectorAll("source")]
      .map((el) => {
        const set = el.getAttribute("srcset");
        const first = localPath(set?.split(",")[0]?.trim().split(/\s+/)[0]);
        return first
          ? {
              href: first,
              srcset: set ?? undefined,
              sizes: el.getAttribute("sizes") ?? undefined,
              media: el.getAttribute("media") ?? undefined,
            }
          : null;
      })
      .filter(Boolean);

  // Üst çubuktaki İLK logo her hâlükârda listede kalsın. Yalnızca ilki:
  // açılır menüdeki marka logoları da header içinde, hepsi sabitlenince
  // kotayı onlar dolduruyor ve asıl büyük öğe dışarıda kalıyordu.
  const headerLogo = document.querySelector("header img");

  for (const img of document.images) {
    if (img.loading === "lazy") continue;
    const area = visible(img);
    if (area === 0) continue;

    const href = localPath(img.getAttribute("src"));
    if (!href) continue;

    const pinned = img === headerLogo;
    const picture = img.parentElement?.tagName === "PICTURE" ? img.parentElement : null;
    const sources = picture ? sourcesOf(picture) : [];
    for (const source of sources) add({ ...source, area, pinned });

    // <picture> yedeği yalnızca kaynakların KAPSAMADIĞI genişliklerde önden
    // yüklenmeli, yoksa telefon hem dar ekran şeridini hem tam boy kapağı
    // indirir. Kaynak media'sı basit bir max-width ise tersi alınıyor,
    // değilse yedek atlanıyor.
    let fallbackMedia;
    if (sources.length > 0) {
      const caps = sources.map((x) => /^\(max-width:\s*(\d+)px\)$/.exec(x.media ?? ""));
      if (!caps.every(Boolean)) continue;
      fallbackMedia = `(min-width: ${Math.max(...caps.map((m) => Number(m[1]))) + 1}px)`;
    }

    add({
      href,
      srcset: img.getAttribute("srcset") ?? undefined,
      sizes: img.getAttribute("sizes") ?? undefined,
      media: fallbackMedia,
      area,
      pinned,
    });
  }

  for (const el of document.querySelectorAll("*")) {
    const area = visible(el);
    if (area < 6400) continue;
    const bg = getComputedStyle(el).backgroundImage;
    if (!bg || bg === "none") continue;
    for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) {
      const href = localPath(m[1]);
      if (href) add({ href, area });
    }
  }

  return out;
};

/** En fazla bu kadar adres önden yüklenir; fazlası birbiriyle yarışıp LCP'yi bozar. */
const PRELOAD_LIMIT = 4;
const MOBILE = { width: 412, height: 823 };
const DESKTOP = { width: 1440, height: 1200 };

/**
 * Bir rotanın önden yüklenecek görsellerini belirler.
 *
 * Sayfa iki genişlikte açılıp iki liste çıkarılıyor. Yalnızca telefonda
 * görünen bir adres `(max-width: 767px)`, yalnızca masaüstünde görünen
 * `(min-width: 768px)` ile sınırlanıyor; ikisinde de görünen sınırsız kalıyor.
 * Böylece telefon masaüstü görselini, masaüstü telefon görselini indirmiyor.
 *
 * Sıralama alana göre: en büyük öğe LCP adayıdır ve tek o `fetchpriority=high`
 * alır. Üst çubuk logosu ayrıca korunuyor — ana sayfada en büyük boyama odur,
 * çünkü marka panelleri giriş animasyonuna saydam başlayıp aday sayılmıyor.
 */
async function collectPreloads(page, routePath, port) {
  const at = async (size) => {
    await page.setViewportSize(size);
    await page.goto(`http://127.0.0.1:${port}${routePath}`, { waitUntil: "networkidle" });
    await page.waitForSelector("#root > *", { timeout: 15000 }).catch(() => {});
    return page.evaluate(COLLECTOR).catch(() => []);
  };

  const mobile = await at(MOBILE);
  const desktop = await at(DESKTOP);

  const byKey = new Map();
  for (const [list, only] of [
    [mobile, "(max-width: 767px)"],
    [desktop, "(min-width: 768px)"],
  ]) {
    for (const entry of list) {
      const seen = byKey.get(entry.key);
      if (seen) {
        // İki genişlikte de görünüyor: genişlik sınırı gerekmiyor.
        seen.only = null;
        seen.area = Math.max(seen.area, entry.area);
      } else {
        byKey.set(entry.key, { ...entry, only });
      }
    }
  }

  const chosen = [...byKey.values()]
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.area - a.area)
    .slice(0, PRELOAD_LIMIT);

  // Öğenin kendi media'sı (picture kaynağı) varsa o geçerli; yoksa hangi
  // genişlikte göründüğünden çıkan sınır uygulanır.
  const withMedia = chosen.map((x) => ({ ...x, media: x.media ?? x.only ?? undefined }));

  // Yüksek öncelik ekran sınıfı başına veriliyor. Tek bir "en büyük" seçilince
  // BNK'da masaüstü hero'su kazanıyor ve telefonun gerçek hero'su önceliksiz
  // kalıyordu; media zaten ikisinden yalnızca birini geçerli kılıyor.
  const largestOf = (skip) => {
    const list = withMedia.filter((x) => x.media !== skip);
    return list.length > 0 ? Math.max(...list.map((x) => x.area)) : -1;
  };
  const topMobile = largestOf("(min-width: 768px)");
  const topDesktop = largestOf("(max-width: 767px)");

  return withMedia.map((x) => ({
    href: x.href,
    srcset: x.srcset,
    sizes: x.sizes,
    media: x.media,
    priority:
      (x.media !== "(min-width: 768px)" && x.area === topMobile) ||
      (x.media !== "(max-width: 767px)" && x.area === topDesktop),
  }));
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
  const page = await browser.newPage({ viewport: DESKTOP });
  // Önden yükleme listesi ayrı bir sekmede çıkarılıyor: anlık görüntü alınan
  // sayfa yeniden boyutlandırılırsa React duyarlı bileşenleri yeniden çiziyor
  // ve temizlenmiş sınıflar geri gelebiliyor.
  const collector = await browser.newPage({ viewport: MOBILE });

  // İçerik anlık görüntüsü her zaman koddaki metinlerden üretilsin: admin
  // panelindeki metinler tarayıcıda zaten üzerine biniyor, derleme çıktısının
  // hangi ana ait olduğu belirsiz kalmasın.
  for (const tab of [page, collector]) {
    await tab.route("**/rest/v1/site_content*", (r) => r.abort());
    await tab.route("**://*.googletagmanager.com/**", (r) => r.abort());
  }


  let done = 0;
  for (const routePath of routes) {
    await page.goto(`http://127.0.0.1:${port}${routePath}`, { waitUntil: "networkidle" });
    await page.waitForSelector("#root > *", { timeout: 15000 });

    // Önce sayfa baştan sona gezilir: tembel yüklenen görseller ve gözlemciye
    // bağlı bölümler gelsin. Temizlik bundan SONRA yapılmalı — aksi halde
    // kaydırma, kaldırılan `is-in` sınıfını geri ekliyor.
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));
    });

    await page.evaluate(() => {
      // Kaydırmayla açılan bölümlerin (Reveal) başlangıçtaki gizliliği CSS'te
      // `html.js` ile kapılı. Statik çıktıda bu sınıf bulunmamalı: JavaScript
      // çalıştırmayan tarayıcı içeriği görsün, satır içi betik ise sınıfı
      // istemcide boyamadan önce geri eklesin.
      //
      // `is-in` de temizleniyor: React onu render etmiyor (doğrudan DOM'a
      // ekleniyor), statik HTML'de kalırsa hydrateRoot uyuşmazlık görür.
      document.documentElement.classList.remove("js");
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.remove("is-in"));

      // Çerez bandı ziyaretçinin tercihine göre çıkar; statik çıktıya gömülürse
      // tercihini çoktan yapmış ziyaretçi de bir an için onu görür.
      document.querySelectorAll("[data-cookie-banner]").forEach((el) => el.remove());

      // Sayaçlar (CountUp) ekran dışındayken 0'a inip görünüme girince sayar;
      // anlık görüntü sayımın ortasına denk gelebiliyor. Hedef değer
      // data-countup'ta duruyor, metin bununla sabitleniyor. React'in ilk
      // render'ı da hedef değeri bastığı için hydration ile çakışmaz.
      document.querySelectorAll("[data-countup]").forEach((el) => {
        el.textContent = el.getAttribute("data-countup") ?? el.textContent;
      });

      // İhracat haritasının ülke yolları tek başına ~96 KB; dekoratif geometri,
      // arama motoruna hiçbir şey anlatmıyor. Anlık görüntüden çıkarılıyor.
      // ExportMap'in ilk render'ı da `d` yazmıyor, efektle dolduruyor.
      document.querySelectorAll("path[d]").forEach((el) => {
        if ((el.getAttribute("d") ?? "").length > 400) el.removeAttribute("d");
      });
    });
    // Ekranın ilk perdesindeki CSS arka plan görsellerini önden yükle.
    //
    // <img> etiketlerini tarayıcının ön tarama (preload scanner) mekanizması
    // HTML gelir gelmez buluyor; CSS arka planları ise ancak stil çözülüp
    // yerleşim hesaplandıktan sonra keşfediliyor. Fressi'de sayfanın en büyük
    // boyaması (LCP) hero zemini olan pattern-1.svg'ydi: dosya 13 KB olmasına
    // rağmen ölçümde 2,6 saniyede iniyordu, çünkü sıraya en sonda giriyordu.
    //
    // İlk perdedeki görseller <link rel="preload"> olarak head'e yazılıyor.
    //
    // İki ayrı sorunu kapatıyor. Biri, CSS arka planları: tarayıcı bunları
    // ancak stil çözülüp yerleşim hesaplandıktan sonra keşfediyor. Diğeri,
    // site CSS'inin sayfaya gömülmesiyle çıktı: ayrıştırıcı 78 KB'lik <style>
    // bloğunu bitirmeden gövdeye ulaşamıyor, <img> etiketleri de geç
    // keşfediliyor. Ölçümde Oxyra'nın hero'su 1084 yerine 2779 ms'de iniyordu.
    //
    // Liste ayrı bir sekmede, hem telefon hem masaüstü genişliğinde toplanıp
    // birleştiriliyor (bkz. collectPreloads). Anlık görüntü masaüstünde
    // alındığı için tek başına masaüstü ölçüsüne bakmak yanlış sonuç veriyordu:
    // BNK'nın hero'su telefonda başka bir dosya, ön-render masaüstündekini
    // önden yükleyince telefon iki görseli birden indiriyor ve LCP 1808'den
    // 2332 ms'ye çıkıyordu.
    const preloads = await collectPreloads(collector, routePath, port);

    await page.evaluate((entries) => {
      // Etiketler viewport meta'sının ARDINA yazılıyor, head'in başına değil.
      // Ön tarama media sorgularını o meta'yı görmeden değerlendiriyor ve
      // genişliği 980 piksel sayıyor: telefonda (max-width: 767px) tutmuyor,
      // (min-width: 768px) tutuyordu. Ölçümde ana sayfa dar ekran şeridinin
      // yanında 163 KB'lik masaüstü kapağını da indiriyordu.
      const anchor = document.head.querySelector('meta[name="viewport"]');
      for (const entry of [...entries].reverse()) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = entry.href;
        if (entry.priority) link.setAttribute("fetchpriority", "high");
        if (entry.srcset) link.setAttribute("imagesrcset", entry.srcset);
        if (entry.sizes) link.setAttribute("imagesizes", entry.sizes);
        if (entry.media) link.setAttribute("media", entry.media);
        if (anchor) anchor.after(link);
        else document.head.prepend(link);
      }
    }, preloads);

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
