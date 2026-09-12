/**
 * Tek sayfanın LCP ve CLS kaynaklarını gösterir.
 *
 * measure-lcp.mjs kaç milisaniye olduğunu söyler; bu betik neden olduğunu:
 * en büyük boyamanın hangi öğe ve hangi dosya olduğunu, yerleşimi hangi
 * öğenin ne kadar kaydırdığını, kaymadan önceki ve sonraki dikdörtgenleriyle.
 *
 * Mobil görünüm, Slow 4G, 4x CPU kısıtı — PageSpeed'in mobil koşullarına yakın.
 * Varsayılan olarak canlı siteyi ölçer; yerel derlemeyi ölçmek için:
 *   BASE=http://localhost:4173 node scripts/diagnose-page.mjs /oxyra
 */
import { chromium } from "playwright";
const BASE = process.env.BASE ?? "https://www.stlteknoloji.com";
const b = await chromium.launch();
for (const path of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport:{width:412,height:823}, deviceScaleFactor:1.75, isMobile:true, hasTouch:true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
  await cdp.send("Emulation.setCPUThrottlingRate",{rate:4});
  await page.addInitScript(() => {
    window.__d = { lcp:0, lcpUrl:"", lcpEl:"", cls:0, shifts:[] };
    new PerformanceObserver(l=>{for(const e of l.getEntries()){
      window.__d.lcp=e.startTime; window.__d.lcpUrl=e.url||e.element?.currentSrc||"";
      const n=e.element; window.__d.lcpEl=n?`${n.tagName.toLowerCase()}.${String(n.className||"").split(" ").slice(0,3).join(".")}`:"?";
    }}).observe({type:"largest-contentful-paint",buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries()){
      if(e.hadRecentInput) continue;
      window.__d.cls+=e.value;
      for(const s of e.sources||[]) window.__d.shifts.push({v:+e.value.toFixed(4), t:Math.round(e.startTime),
        el:(s.node?`${s.node.tagName?.toLowerCase()}.${String(s.node.className||"").split(" ").slice(0,3).join(".")}`:"?"),
        from:JSON.stringify(s.previousRect), to:JSON.stringify(s.currentRect)});
    }}).observe({type:"layout-shift",buffered:true});
  });
  await page.goto(BASE+path,{waitUntil:"load",timeout:120000});
  await page.waitForTimeout(4000);
  const d = await page.evaluate(()=>window.__d);
  console.log(`\n### ${path}  LCP ${Math.round(d.lcp)} ms  CLS ${d.cls.toFixed(3)}`);
  console.log(`   LCP öğesi: ${d.lcpEl}  ${d.lcpUrl.replace(BASE,"")}`);
  for (const s of d.shifts.slice(0,6)) console.log(`   kayma ${s.v} @${s.t}ms  ${s.el}\n      ${s.from} -> ${s.to}`);
  await ctx.close();
}
await b.close();
