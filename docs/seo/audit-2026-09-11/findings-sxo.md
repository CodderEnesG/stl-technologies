# Search Experience (SXO) Analysis — stlteknoloji.com

SXO Gap Score: 41/100. Weakest dimension is Page Type, 4/15: six of eight target queries want a page
type the site does not have.

Of 8 realistic queries tested, the site is competitive for exactly one (stl teknoloji, MEDIUM gap) and
effectively invisible for the other seven (all CRITICAL).

## Two root causes

### 1. wexta and Oxyra have no purchase path anywhere on the site

Fressi and BNK deep-link to their own commerce domains (fressihome.com, beautynetkorea.com.tr) and that
pattern works, Fressi surfaces via its sister site. wexta and Oxyra have no equivalent, so Google routes
"wexta valiz" and "oxyra oyuncu koltuğu" entirely to Trendyol, N11, Akakçe, Hepsiburada and competitor
brand sites. stlteknoloji.com is absent.

### 2. No B2B or manufacturer page exists

"valiz üreticisi", "küçük ev aletleri üreticisi" and "fason üretim istanbul" are all won by dedicated
manufacturer service pages or B2B directory listings: Anka Saraçiye, Keo Plus, Orca, europages,
fasonuretim.tr, ZUCDER. STL's real OEM story, a genuinely strong named client-logo wall (Turkish
Airlines, AJet, DeFacto, Watsons, Slazenger, BİM, LC Waikiki, Kiğılı, D'S Damat) plus a THY hygiene-kit
award, is buried in one homepage sentence with no dedicated URL and no directory presence.

### Separate issue: entity collision

"beauty net korea" collides with an unrelated South Korean B2B K-beauty wholesaler of the same name.
This is entity disambiguation, not page type.

## Persona scores

| Persona | Score | Verdict |
|---|---|---|
| Consumer buyer | 44/100 | Needs work |
| B2B manufacturing-partner buyer | 42/100 | Needs work |
| Journalist / AI engine | 42/100 | Needs work |

The one bright spot across all three is Trust for the B2B persona, 14/25, driven entirely by the
under-used client-logo wall.

## Bug found in passing, verified independently

The homepage animated stat counters render as literal zeros in the prerendered HTML:
<span class="tabular-nums">0</span>, "0 m²", "0" for Kuruluş, Üretim tesisi and Ülkeye ihracat. The real
values (2016, 35.000 m², 20 ülke) appear only after client-side JS animation. The same facts do exist in
nearby prose, so this is not fatal, but the most scannable callout block is zeroed for any crawler or AI
engine that does not run the animation.

## Second bug, verified independently

The contact form is a real form (name, email, company, message, consent checkbox, submit) but its submit
handler sets window.location.href to a mailto: URL. src/components/sections/index.tsx:399. The code
comment concedes it: "Form şimdilik mailto açar (Web3Forms endpoint'i eklenebilir)." There is no backend.
On any device without a configured mail client the lead is silently lost.

## Priority fixes

1. CRITICAL. Give wexta and Oxyra a purchase path, an owned storefront or an official marketplace store,
   linked from the brand page, mirroring what Fressi and BNK already do.
2. CRITICAL. Build a dedicated /fason-uretim OEM and B2B service page surfacing the client-logo wall,
   capacity and the THY award. List the company on europages, fasonuretim.tr and ZUCDER.
3. HIGH. Replace the mailto handler with a real form endpoint, and add an RFQ variant for B2B.
4. HIGH. Fix the stat-counter bug so the real numbers exist in static HTML.
5. MEDIUM. Deepen the company facts (employee count, leadership, certifications, the award) so the
   company's own site beats EMIS, RocketReach and LinkedIn as the source of truth. Add LinkedIn to sameAs.
6. MEDIUM. Disambiguate BNK / Beauty Net Korea from the unrelated Korean wholesaler.
7. LOW. Per-model Oxyra pages and downloadable catalogs for Fressi, BNK and Oxyra. wexta already has one.

## Limitations

SERP data came from web search results, not captured SERP HTML. Ads, People Also Ask, related searches,
featured-snippet format and AI Overview citations could not be directly observed, so severities are
directional rather than confirmed by rank tracking. No Search Console or CrUX access. Single search pass,
not geo-located to Turkey.
