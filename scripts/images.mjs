/**
 * Duyarlı görsel varyantları üretir ve boyut kataloğunu yazar.
 *
 * Sorun: sitedeki fotoğraflar ekranda kullanıldıkları boyutun çok üstündeydi
 * (1950x1950'e kadar) ve tek bir dosya olarak servis ediliyordu. 390 piksellik
 * telefon da 1440 piksellik masaüstüyle aynı dosyayı indiriyordu; mobil LCP
 * ana sayfada 8, /wexta'da 16 saniyeye çıkıyordu.
 *
 * Betik her fotoğraf için WebP varyantları üretir ve gerçek piksel boyutlarını
 * src/data/imageManifest.ts dosyasına yazar. <Img> bileşeni srcset, sizes,
 * width ve height değerlerini oradan okur; width/height yerleşim kaymasını
 * (CLS) da kapatır.
 *
 * Çıktı depoya işlenir, derleme sırasında çalışmaz: Vercel derlemesine yeni bir
 * bağımlılık (sharp) ve yeni bir kırılma noktası eklemek istemedik. Görsel
 * ekleyip değiştirdikten sonra elle çalıştırın:
 *
 *   pnpm run images
 *
 * Gereksinim: cwebp (libwebp). macOS'ta `brew install webp`.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = join(ROOT, "public", "images");
const MANIFEST = join(ROOT, "src", "data", "imageManifest.ts");

/** Üretilecek genişlikler. Kaynak bundan darsa o genişlik atlanır. */
const WIDTHS = [480, 960, 1440];

/** Bu boyutun altındaki dosyalar zaten küçük; varyant üretmeye değmez. */
const MIN_BYTES = 40 * 1024;

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Üretilmiş varyantların adı: ad-480w.webp */
const VARIANT_RE = /-(\d+)w\.webp$/;

// ---------------------------------------------------------------- boyut okuma

/**
 * PNG, JPEG ve WebP başlıklarından piksel boyutunu okur.
 * Harici bağımlılık istemediğimiz için başlıklar elle ayrıştırılıyor.
 */
function dimensions(buf) {
  // PNG: 8 bayt imza, sonra IHDR
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }

  // WebP: RIFF....WEBP, ardından VP8 / VP8L / VP8X parçası
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        w: 1 + buf.readUIntLE(24, 3),
        h: 1 + buf.readUIntLE(27, 3),
      };
    }
    if (chunk === "VP8 ") {
      return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
  }

  // JPEG: parçaları sırayla gez, SOF parçasında boyut var
  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0..SOF15, DHT/DAC/RST dışındakiler
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  return null;
}

// ---------------------------------------------------------------- yardımcılar

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function hasCwebp() {
  try {
    execFileSync("cwebp", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- çalıştır

if (!hasCwebp()) {
  console.error(
    "images: cwebp bulunamadı. Kurulum: brew install webp (macOS) veya apt install webp (Linux).",
  );
  process.exit(1);
}

const files = walk(IMAGES)
  .filter((f) => SOURCE_EXT.has(extname(f).toLowerCase()))
  .filter((f) => !VARIANT_RE.test(f))
  .sort();

const manifest = {};
let generated = 0;
let skipped = 0;
let sourceBytes = 0;
let variantBytes = 0;

for (const file of files) {
  const buf = readFileSync(file);
  const dim = dimensions(buf);
  const url = "/images/" + relative(IMAGES, file).split(/[\\/]/).join("/");

  if (!dim) {
    console.warn(`images: boyut okunamadı, atlandı — ${url}`);
    continue;
  }

  sourceBytes += buf.length;

  // Küçük dosyalar olduğu gibi kalır; yine de katalogda boyutu bulunsun ki
  // <Img> width/height yazabilsin (CLS için varyanttan bağımsız olarak gerekli).
  if (buf.length < MIN_BYTES) {
    manifest[url] = { w: dim.w, h: dim.h, variants: [] };
    skipped++;
    continue;
  }

  const widths = WIDTHS.filter((w) => w < dim.w);
  // Kaynak en büyük varyanttan genişse kendi genişliği de bir varyant olur:
  // böylece masaüstünde WebP'ye çevrilmiş hâli servis edilir, JPEG değil.
  widths.push(Math.min(dim.w, Math.max(...WIDTHS, dim.w)));

  const made = [];
  for (const w of [...new Set(widths)].sort((a, b) => a - b)) {
    const out = file.replace(/\.(jpe?g|png|webp)$/i, `-${w}w.webp`);
    mkdirSync(dirname(out), { recursive: true });
    execFileSync("cwebp", ["-quiet", "-q", "82", "-resize", String(w), "0", file, "-o", out]);
    variantBytes += statSync(out).size;
    made.push(w);
    generated++;
  }

  manifest[url] = { w: dim.w, h: dim.h, variants: made };
}

const entries = Object.keys(manifest)
  .sort()
  .map((url) => {
    const m = manifest[url];
    return `  "${url}": { w: ${m.w}, h: ${m.h}, variants: [${m.variants.join(", ")}] },`;
  })
  .join("\n");

writeFileSync(
  MANIFEST,
  `// ÜRETİLMİŞ DOSYA — elle düzenlemeyin. Yeniden üretmek için: pnpm run images
//
// Her görselin gerçek piksel boyutu ve üretilmiş WebP varyantlarının genişlikleri.
// <Img> bileşeni srcset, sizes, width ve height değerlerini buradan okur.

export type ImageMeta = { w: number; h: number; variants: number[] };

export const imageManifest: Record<string, ImageMeta> = {
${entries}
};

/** Varyant dosyasının adresi: /images/a/b.jpg + 480 -> /images/a/b-480w.webp */
export function variantUrl(src: string, width: number): string {
  return src.replace(/\\.(jpe?g|png|webp)$/i, \`-\${width}w.webp\`);
}
`,
  "utf8",
);

const mb = (n) => (n / 1048576).toFixed(2);
console.log(
  `images: ${files.length} kaynak, ${generated} varyant üretildi, ${skipped} küçük dosya atlandı.\n` +
    `        kaynak toplamı ${mb(sourceBytes)} MB, varyant toplamı ${mb(variantBytes)} MB\n` +
    `        katalog: ${relative(ROOT, MANIFEST)}`,
);
