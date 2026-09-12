/**
 * dist/ klasörünü Vercel'in servis ettiği gibi yayınlar — yerel doğrulama için.
 *
 * `vite preview` bu iş için yanıltıcı: tanımadığı her yolu SPA yedeklemesiyle
 * dist/index.html'e düşürüyor. Sonuçta her rota aynı dosyayı döndürüyor ve
 * olmayan bir adres bile 200 veriyor. Oysa ön-render her rotayı kendi
 * dosyasına yazıyor ve tanınmayan adresler gerçek 404 dönmeli.
 *
 * Bu sunucu Vercel'in `trailingSlash: false` + `outputDirectory: dist`
 * davranışını taklit eder: dizin varsa içindeki index.html, yoksa 404.html.
 * vercel.json'daki güvenlik başlıkları da uygulanır ki CSP yerelde test
 * edilebilsin.
 *
 * Çalıştırma: node scripts/serve-dist.mjs [port]
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

// vercel.json'daki "/(.*)" başlıkları — CSP dahil
const vercel = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
const globalHeaders = Object.fromEntries(
  (vercel.headers?.find((h) => h.source === "/(.*)")?.headers ?? []).map((h) => [h.key, h.value]),
);

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
  // dist dışına çıkmayı engelle
  const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  let file = join(DIST, safe);

  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");

  if (!existsSync(file) || statSync(file).isDirectory()) {
    const notFound = join(DIST, "404.html");
    res.writeHead(404, { ...globalHeaders, "content-type": TYPES[".html"] });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
    return res.end("404");
  }

  res.writeHead(200, { ...globalHeaders, "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

// Host verilmiyor: hem 127.0.0.1 hem ::1 dinlenir. Yalnız 127.0.0.1'e bağlanınca
// tarayıcıda "localhost" IPv6'ya çözülüp isteği ıskalayabiliyor.
server.listen(PORT, () => {
  console.log(`dist sunuluyor: http://localhost:${PORT}  (Vercel davranışı taklit ediliyor)`);
});
