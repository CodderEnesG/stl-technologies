import { chromium } from "playwright";
const out = "/private/tmp/claude-501/-Users-enesgungor-Desktop-stl-tech/8c87c10f-90c8-46bd-88f0-ed902a5d510e/scratchpad/after";
const base = process.env.BASE || "http://localhost:4173";
const only = process.argv.slice(2);
const pages = [["home","/"],["oxyra","/oxyra"],["fressi","/fressi"],["wexta","/wexta"],["bnk","/bnk"]]
  .filter(([n]) => only.length === 0 || only.includes(n));
const b = await chromium.launch();
for (const [name, path] of pages) {
  for (const [tag, vp, rm] of [["d",{width:1440,height:900},"no-preference"],["m",{width:390,height:844},"no-preference"],["rm",{width:1440,height:900},"reduce"]]) {
    if (tag === "rm" && name !== "home") continue;
    const ctx = await b.newContext({ viewport: vp, reducedMotion: rm });
    const p = await ctx.newPage();
    await p.goto(base + path, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate(async () => { const h=document.body.scrollHeight; for(let y=0;y<h;y+=600){window.scrollTo(0,y); await new Promise(r=>setTimeout(r,90));} window.scrollTo(0,0); });
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${out}/${name}-${tag}.png`, fullPage: true });
    console.log(name, tag, "ok");
    await ctx.close();
  }
}
await b.close();
