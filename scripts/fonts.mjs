/**
 * Google Fonts'u kendi sunucumuza indirir.
 *
 * Neden: fonts.googleapis.com'daki stylesheet <head> içinde ve boyamayı
 * bloklar. Üçüncü taraf origin olduğu için DNS + TCP + TLS el sıkışması
 * ilk boyamanın önüne giriyordu; mobilde ölçülen FCP'nin büyük kısmı buydu.
 *
 * Çıktı:
 *   public/fonts/google/*.woff2   yüz dosyaları
 *   src/fonts-google.css          @font-face kuralları, yerel yollarla
 *
 * src/index.css bu dosyayı @import ile alır; Vite derlerken tek CSS paketine
 * gömer, yani ek istek doğmaz. Yüz dosyaları unicode-range ile ayrıldığı için
 * tarayıcı yalnızca sayfada gerçekten geçen alfabeyi indirir.
 *
 * Elle çalıştırılır (pnpm run fonts), çıktısı depoya işlenir. Derlemede yok:
 * ağ erişimi gerektiren adımların Vercel derlemesinde yeri yok.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Yalnızca ekranda gerçekten görünen aileler. Manrope ve Figtree listeden
 * çıkarıldı: ikisi de --font-sans/--font-display içinde Gilroy'un ardındaki
 * yedekti, Gilroy kendi sunucumuzdan geldiği ve her zaman yüklendiği için
 * hiçbir zaman boyanmıyorlardı.
 */
const FAMILIES = [
  "Inter:wght@400;500;600;700",
  "Nunito:wght@400;600;700;800;900",
  "Playwrite+NO:wght@400",
  "Poppins:wght@400;500;600;700;800",
];

/** Site Türkçe/İngilizce; latin-ext olmadan ş ğ İ ı yedek fonta düşer. */
const KEEP_SUBSETS = new Set(["latin", "latin-ext"]);

// woff2 alabilmek için modern tarayıcı kimliği şart; aksi halde Google ttf döner.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const outDir = resolve("public/fonts/google");
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const url = `https://fonts.googleapis.com/css2?${FAMILIES.map((f) => `family=${f}`).join("&")}&display=swap`;
const css = await (await fetch(url, { headers: { "user-agent": UA } })).text();

/** Google CSS'i "/* subset *\/ @font-face {...}" blokları halinde döner */
const blocks = css.split("/*").slice(1);
const out = [];
let kept = 0;
let skipped = 0;

for (const raw of blocks) {
  const subset = raw.slice(0, raw.indexOf("*/")).trim();
  const body = raw.slice(raw.indexOf("*/") + 2);
  if (!KEEP_SUBSETS.has(subset)) {
    skipped++;
    continue;
  }

  const family = /font-family:\s*'([^']+)'/.exec(body)?.[1];
  const weight = /font-weight:\s*(\d+)/.exec(body)?.[1] ?? "400";
  const style = /font-style:\s*(\w+)/.exec(body)?.[1] ?? "normal";
  const src = /url\((https:[^)]+\.woff2)\)/.exec(body)?.[1];
  if (!family || !src) continue;

  const name = `${family.toLowerCase().replace(/\s+/g, "-")}-${weight}-${style}-${subset}.woff2`;
  const bytes = Buffer.from(await (await fetch(src, { headers: { "user-agent": UA } })).arrayBuffer());
  writeFileSync(resolve(outDir, name), bytes);
  kept++;

  out.push(
    body
      .replace(/url\(https:[^)]+\.woff2\)/, `url('/fonts/google/${name}')`)
      .replace(/^\s*\n/, "")
      .trimEnd(),
  );
}

writeFileSync(
  resolve("src/fonts-google.css"),
  `/* Üretilmiş dosya — elle düzenlemeyin. Kaynak: scripts/fonts.mjs\n` +
    `   Google Fonts kendi sunucumuzda; yüzler /public/fonts/google altında. */\n` +
    out.join("\n") +
    "\n",
);

console.log(`${kept} yüz indirildi, ${skipped} altküme atlandı → public/fonts/google/`);
