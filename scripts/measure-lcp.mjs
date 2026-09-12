/**
 * Yerel LCP/FCP ölçümü — Lighthouse'un mobil kısıtlarını taklit eder.
 * Slow 4G (1.6 Mbps / 150 ms RTT) + 4x CPU yavaşlatma, 412x823 mobil görünüm.
 * LCP öğesinin ne olduğunu da bildirir; PSI bu alanı boş döndürüyor.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:4173";
const RUNS = Number(process.env.RUNS ?? 3);
const paths = process.argv.slice(2);
if (paths.length === 0) paths.push("/");

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const browser = await chromium.launch();

for (const p of paths) {
  const fcps = [], lcps = [];
  let lcpEl = "";
  for (let i = 0; i < RUNS; i++) {
    const ctx = await browser.newContext({
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (Linux; Android 11; moto g power) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    await page.addInitScript(() => {
      window.__perf = { lcp: 0, el: "", url: "" };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          window.__perf.lcp = e.startTime;
          const n = e.element;
          // e.url görsel LCP'lerde gerçekten indirilen dosyayı verir; img.src
          // yalnızca srcset yokmuş gibi davranan yedek adres, yanıltıyor.
          window.__perf.url = e.url || n?.currentSrc || "";
          window.__perf.el = n
            ? `${n.tagName.toLowerCase()}.${(n.className || "").toString().split(" ").slice(0, 2).join(".")}`
            : "(yok)";
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    await page.goto(BASE + p, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(2500);

    const r = await page.evaluate(() => {
      const url = window.__perf.url;
      const res = url ? performance.getEntriesByType("resource").find((x) => x.name === url) : undefined;
      return {
        fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0,
        lcp: window.__perf.lcp,
        el: window.__perf.el,
        url,
        kb: res ? Math.round((res.encodedBodySize || res.transferSize || 0) / 1024) : 0,
        resEnd: res ? Math.round(res.responseEnd) : 0,
        rootChildren: document.getElementById("root")?.children.length ?? 0,
      };
    });
    fcps.push(r.fcp);
    lcps.push(r.lcp);
    lcpEl = r.url
      ? `${r.url.replace(/^https?:\/\/[^/]+/, "")} ${r.kb} KB, indi ${r.resEnd} ms`
      : `${r.el} (metin/arka plan)`;
    if (i === 0 && r.rootChildren !== 1) console.log(`  UYARI: #root çocuk sayısı ${r.rootChildren}`);
    await ctx.close();
  }
  console.log(
    `${p.padEnd(10)} FCP ${median(fcps).toFixed(0).padStart(5)} ms   LCP ${median(lcps).toFixed(0).padStart(5)} ms   ← ${lcpEl}`,
  );
}

await browser.close();
