# Performance / Core Web Vitals — stlteknoloji.com

Methodology: no Google API key configured, so NO CrUX field data was available. Every number below is
LAB data, captured live via Playwright/Chromium against production using the browser's native
PerformanceObserver APIs. Desktop runs unthrottled. Mobile runs used CPU 4x slowdown plus network shaping
(150ms RTT, ~1.6 Mbps down), a Slow-4G-class profile similar to Lighthouse's mobile default. TBT is
approximated by summing longtask duration over 50ms. True INP needs field interaction data, which does
not exist here. Treat TBT as a directional proxy, not a substitute for INP.

## Lab metrics

| Page / device | TTFB | FCP | LCP | CLS | TBT proxy |
|---|---|---|---|---|---|
| Home desktop | 55ms | 764ms | 812ms | 0.0001 | 0ms |
| Home mobile throttled | 112ms | 1,644ms | 7,976ms | 0.0088 | 0ms |
| /wexta desktop | 168ms | 1,028ms | 1,232ms | 0.0006 | 0ms |
| /wexta mobile throttled | 66ms | 1,392ms | 15,936ms | 0.0010 | 3ms |

## Verdict

TTFB passes everywhere, 55-168ms. Vercel edge cache confirmed. Not a bottleneck.

LCP passes on desktop, 812ms home and 1,232ms /wexta, both well under 2.5s. Fails badly on throttled
mobile: 7.98s home, 15.9s /wexta, both far into Poor. Network-bound, not server-bound.

CLS passes in this lab run, 0.0001-0.0088, despite 31 of 40 homepage images and 27 of 27 /wexta images
having no width/height. The 3-4.5s settle window may not capture shifts from very large images decoding
late on real connections. Treat the missing dimensions as a latent risk lab happened not to trigger.

TBT proxy is ~0ms on every run. Negligible main-thread blocking from JS.

## Root cause of the mobile LCP failure

Image weight. Total 9.00 MB across 82 unique images. Homepage 1.19 MB, /wexta 3.10 MB, /oxyra 2.80 MB,
/fressi 1.65 MB, /bnk 1.07 MB.

The homepage LCP candidate is wexta-cover.jpg at 486 KB, correctly marked fetchpriority="high" but with
an empty alt. On /wexta the top four images alone are 486 + 420 + 354 + 324 KB, and six more run
150-310 KB, for 2.89 MB on one page.

No srcset, no sizes, no <picture> anywhere. A phone rendering a hero at ~390px CSS width downloads the
full desktop asset. 17 files are still JPEG while the rest of the site is WebP, and those JPEGs run
1.4-2x larger than the WebP files beside them. Edge caching helps repeat visits and does nothing for the
first-visit LCP that CWV measures.

JS and CSS are NOT the bottleneck. Homepage JS is 178 KB transferred across 7 files; /wexta 135 KB
sharing the same vendor chunks. Route-based code splitting works. CSS is a single 12 KB file. The entry
script is type="module" so it does not block first paint. TBT of 0-3ms confirms cheap execution.

## Fonts, two separate issues

Self-hosted faces (Gilroy x4 weights, Manifold Extended CF x2, Asap Sharp x2) declare font-display: swap
but have no rel=preload, so the browser discovers them only after parsing the CSS.

Separately, src/index.css line 1 @imports six Google Fonts families: Manrope, Inter, Nunito, Playwrite NO,
Figtree, Poppins. No preconnect or dns-prefetch. This is a third-party origin dependency on the critical
path. Only Figtree, Manrope and Playwrite NO appear in the font stacks as fallbacks. Audit whether all six
are actually rendered; self-host and preload the ones that are, drop the rest.

## Third party

GA4 is correctly deferred behind consent: consent-mode default denied, queued via dataLayer, no gtag.js
tag present pre-consent. Already best practice.

A fetch to the Supabase REST endpoint site_content runs on every visitor page load from
src/content/remote.ts, pulling admin-editable text overrides. It fails safe and falls back to in-code
text, but it can swap text after paint, which is a CLS and hydration risk. Confirm it cannot alter layout
dimensions post-paint.

## Prioritized recommendations

Critical, mobile LCP failing by 3-6x:
1. Generate responsive srcset/sizes, or <picture> with AVIF/WebP plus fallback, for every hero and
   product image. Serving a ~390px variant to phones should cut the LCP image's bytes by 70-85%.
2. Convert the remaining 17 JPEGs to WebP/AVIF. Tooling already exists in the project.
3. Re-compress wexta-cover.jpg. 486 KB should be well under 150 KB at delivered dimensions. Fix its
   empty alt at the same time.
4. Add <link rel="preload" as="image" fetchpriority="high"> for the confirmed hero per page.
5. Do /wexta and /oxyra first, they carry the heaviest payloads.

High:
6. Add width/height or aspect-ratio to every img. 31 of 40 on the homepage and 27 of 27 on /wexta have
   none.

Medium:
7. Preload the above-the-fold weights of Gilroy and Manifold Extended CF.
8. Remove or properly optimize the six-family Google Fonts @import.

Low:
9. Confirm whether the Supabase site_content fetch mutates already-painted DOM.

Leave as-is: TTFB, JS bundle size and splitting, CSS size, TBT, GA4 consent gating.
