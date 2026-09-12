# Technical SEO Audit — stlteknoloji.com

Score: 84/100. Strong foundation. Deductions concentrate in one architectural choice that cancels the
CWV payoff of the prerendering investment, plus smaller hardening gaps.

| Category | Status |
|---|---|
| Crawlability | PASS |
| Indexability | PASS |
| Canonical correctness | PASS, 0 errors across 14 URLs |
| Hreflang correctness | PASS, fully reciprocal, programmatically validated |
| Legacy redirects | PASS, all 51 tested paths land 200 |
| HTTPS / security headers | PASS, CSP missing |
| URL structure | PASS |
| Trailing slash / www | PASS |
| 404 handling | PASS, true 404 not soft-404 |
| Mobile viewport | PASS |
| Structured data | PASS, valid JSON-LD on all 14 |
| Core Web Vitals risk | NEEDS IMPROVEMENT |
| JS rendering | NEEDS IMPROVEMENT |
| IndexNow | NOT IMPLEMENTED |

## HIGH

### H1. src/main.tsx mounts with createRoot, not hydrateRoot

scripts/prerender.mjs Playwright-snapshots the fully rendered DOM per route and writes complete static
HTML into #root for all 14 URLs. Verified: real route-specific content is in the served HTML.

But createRoot does not adopt existing DOM the way hydrateRoot does. Once the main bundle loads, React
tears down the entire prerendered #root subtree and rebuilds it client-side on every load. Consequences:
double DOM construction on every load in exactly the window INP and TBT are measured; the LCP element is
replaced by a new node on remount, which can push the recorded LCP to the post-remount repaint.

This is CSR with a prerendered first paint, not hydration. Indexed content is not at risk since the
client render reproduces the same markup. It is the top CWV risk in the audit.

Fix: switch to hydrateRoot. First reconcile the 3 deliberate SSR/CSR divergences already in
prerender.mjs or hydration will mismatch and bail to a full re-render anyway:
(a) path[d] attributes over 400 chars stripped from the export-map SVG in the snapshot
(b) cookie banner removed from the snapshot
(c) [data-reveal] elements forced to is-in in the snapshot

### H2. Homepage eagerly modulepreloads a decorative chunk

Modulepreloaded on the homepage: index-*.js 303,698 B brotli, ExportMap-*.js 104,551 B, jsx-runtime
48,545 B, sections 41,787 B, Home 25,877 B, brands 9,958 B. Roughly 535 KB compressed fetched, parsed and
executed before interactivity. ExportMap backs a purely decorative SVG map whose path data the prerender
script deliberately strips, yet it is modulepreloaded unconditionally on first paint.

Fix: lazy-load ExportMap on scroll-into-view. Profile and split the 303 KB main entry further.

## MEDIUM

M1. Images on 5 of 7 templates carry no width/height. Only home and en carry dims, 9 of 40. Secondary,
logo and gallery img tags rely on inline style height with no width. Real CLS risk on slow connections.

M2. /admin is both Disallow'd in robots.txt and carries noindex,nofollow. Self-defeating: robots.txt
blocking means Googlebot can never fetch the page to see the noindex. If the URL is discovered
externally it can be indexed URL-only. Pick one mechanism, and put real auth in front of /admin
regardless since neither directive is access control.

M3. No Content-Security-Policy header. HSTS (2 yr, includeSubDomains), X-Content-Type-Options,
X-Frame-Options, Referrer-Policy and Permissions-Policy are all present and correct. CSP is the one
common header missing, relevant with GA4 and consent scripts on-page. Add it to the headers block in
vercel.json.

M4. IndexNow not implemented. The site just shipped 50+ legacy redirect rules. Submitting old and new
URLs to Bing/Yandex/Naver would accelerate pickup versus normal crawl cadence.

## LOW

L1. Legacy redirects return 308, not 301. Vercel serves "permanent": true as 308. SEO-equivalent. All 51
tested legacy paths redirect and land on a 200 destination. No broken redirects.

L2. Bare http non-www takes 2 hops to canonical, 3 with a legacy path. Vercel apex behavior, not in
vercel.json. Not fixable without DNS changes. Real traffic rarely hits this.

L3. sitemap lastmod is the build date for every URL. prerender.mjs applies one "today" to all 14 entries.

## Working well, no action

Canonicals self-referencing and correct. Hreflang fully reciprocal with x-default on the TR version,
validated programmatically, and the sitemap xhtml:link set matches the in-HTML link tags exactly.
robots.txt allows all, disallows /admin, explicitly allow-lists AI crawlers, declares the sitemap.
Unknown paths return a true HTTP 404 with noindex, better than the typical Vite SPA default. All legacy
paths land on 200. Security headers strong apart from CSP. Clean lowercase URLs, trailingSlash false,
non-www to www enforced. Correct viewport on all 14 pages. Valid JSON-LD everywhere.

## Note on the double-H1 report

Dismissed. The second H1 lives inside the <noscript> fallback block injected by prerender.mjs:222.
Googlebot renders with JS, so it never sees it. Verified: exactly 1 H1 inside #root on every page.
