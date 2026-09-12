/**
 * Kanonik adresleri IndexNow ile bildirir.
 *
 * Neden: site eski adreslerden 50'den fazla kalıcı yönlendirmeyle taşındı.
 * Normal tarama sırasını beklemek yerine Bing, Yandex, Naver ve Seznam'a
 * doğrudan haber verilir; Google IndexNow kullanmıyor, orası Search Console
 * üzerinden ilerler.
 *
 * Anahtar gizli değil: aynı değer /<anahtar>.txt adresinde yayınlanıyor,
 * doğrulama bu şekilde yapılıyor (scripts/prerender.mjs yazar).
 *
 * Çalıştırma (dağıtım canlıya çıktıktan SONRA — uç noktalar adresleri hemen
 * doğrulamaya çalışır):
 *
 *   node scripts/indexnow.mjs
 *   node scripts/indexnow.mjs --dry
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.stlteknoloji.com";
const HOST = "www.stlteknoloji.com";
const KEY = "2c8f89217cc46a2ca06ba21025e14cf6";
const DRY = process.argv.includes("--dry");

const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
  "https://searchadvisor.naver.com/indexnow",
  "https://search.seznam.cz/indexnow",
];

const sitemap = readFileSync(join(ROOT, "dist", "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
  console.error("indexnow: dist/sitemap.xml içinde adres yok. Önce derleyin.");
  process.exit(1);
}

console.log(`indexnow: ${urlList.length} adres`);
for (const u of urlList) console.log(`  ${u}`);

if (DRY) {
  console.log("\nindexnow: --dry, istek gönderilmedi.");
  process.exit(0);
}

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList });

for (const endpoint of ENDPOINTS) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body,
    });
    // 200 kabul edildi, 202 kuyruğa alındı, 422 adres/anahtar uyuşmazlığı
    console.log(`  ${res.status} ${res.statusText}  ${endpoint}`);
  } catch (err) {
    console.log(`  HATA ${String(err).slice(0, 80)}  ${endpoint}`);
  }
}
