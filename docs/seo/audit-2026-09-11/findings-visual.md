# Visual and Mobile Rendering — stlteknoloji.com

24 screenshots at screenshots/{page}_{desktop|mobile}_{fold|full}.png. Raw data in analysis_data.json.

## 1. The first H1 question, settled

Not painted for any real user or JS-executing crawler. The first H1 lives inside a <noscript> block, so
it is parsed into the DOM only when scripting is disabled. Verified dynamically: querySelectorAll('h1')
after domcontentloaded and again 2s later on /wexta returns exactly one H1, the visible headline.

Separately, on the homepage and /en the remaining H1 carries a genuine sr-only class (clip inset(50%),
1x1px). Net effect: brand pages have one real visible H1. The homepage and /en have ZERO visible H1.
Both instances there are non-visual, one noscript-only and one sr-only, and the page relies entirely on
brand-tile imagery for its headline.

Not cloaking, a noscript fallback is legitimate. But it is redundant markup and the homepage should have
a real visible heading.

## 2. Horizontal overflow at 390px

None. scrollWidth equals clientWidth at exactly 390 on all six pages tested.

## 3. Cookie consent bar blocks content on half the pages sampled

Fixed, inset-x-0, bottom-0, z-index 90. Appears immediately, is not dismissed by scrolling, and occupies
roughly the bottom 30% of a 390x844 mobile viewport.

- /bnk mobile: the primary CTA "Rutini keşfet" sits at top 693-737, inside the card's footprint which
  starts at 609. The CTA is fully hidden on first paint.
- /oxyra desktop 1440x900: the card clips the H1 itself. "Oyunda avant" is legible, the rest is covered.
  Confirmed visually in oxyra_desktop_fold.png.
- Homepage and /en, both breakpoints: the banner covers the bottom third of the third brand tile (BNK).
- /wexta and /fressi: no overlap, CTAs sit above the card's top edge.
- Nav and the header contact CTA are never covered.

The banner blocks a primary action or headline on 3 of 6 sampled pages. Hero copy length varies per
brand while the banner position is fixed, which is why it is page-dependent.

## 4. Mobile tap targets at 390px

| Element | Size | Verdict |
|---|---|---|
| Language toggle EN/TR | 42x30 | Fails both axes, worst offender |
| Hamburger menu | 40x40 | Under minimum |
| Cookie Reddet / Kabul et | 104x42 | Under on height |
| Hero CTAs | 44-46 tall | Borderline, acceptable |
| Footer policy link | 158x14 | Thin inline link |

Desktop equivalents all exceed 48px. This is mobile-specific.

## 5. Above-the-fold value proposition on mobile

- /wexta: clear. H1, subcopy and CTA all visible together.
- /fressi: clear, same pattern.
- /bnk: partial. H1 renders but subcopy and CTA are hidden under the cookie banner.
- /oxyra: weak. Only the tagline is visible. It is evocative but never names the product category, and
  no subcopy or CTA is in the first viewport.
- Home and /en: not clear. The first viewport shows the logo, nav and a stack of brand tiles with
  wordmarks. Nothing states what STL Teknoloji actually is. A first-time visitor learns there are some
  brands, not that this is a B2B manufacturer with a 35,000 m² factory.

## 6. Font legibility

Base 16px, body copy 16-18px, both fine. Section eyebrows run 11px and teaser captions 12px with
opacity-85, below general reading recommendations. No FOIT, no contrast failures, headline text over
dark photography stayed readable in every sample.

## 7. Text rendered as image

None. All headlines, subcopy, nav labels and CTAs are real DOM text. Brand wordmarks are SVG marks,
standard practice, but several ship with no alt attribute.

## 8. Layout shift

Measured CLS on /bnk mobile: approximately 0.0004, far under the 0.1 threshold. The one micro-shift was a
5-10px nav width change consistent with a font swap. H1 position stable comparing 300ms and 2300ms after
load. No action needed.

## Summary

| Issue | Severity | Where | Fix |
|---|---|---|---|
| Cookie banner hides primary CTA or H1 | High | /bnk mobile, /oxyra desktop, home and /en | Reserve space instead of overlaying, or offset hero CTAs out of the banner's fixed footprint. Test per-brand hero heights |
| Homepage has no visible H1 or value-prop copy above the fold | Medium | / and /en | Add a short visible tagline near the logo before the brand tiles |
| Redundant noscript H1 repeating the title | Medium | All pages | Remove it or make the fallback non-heading text |
| Small mobile tap targets | Medium | All pages | Bump to at least 44x44 |
| Oxyra hero lacks visible subcopy and CTA | Low-Medium | /oxyra | Move the CTA out of the banner zone or shorten the hero stack |
| 11-12px kicker text with reduced opacity | Low | Brand pages | Raise to 13-14px or increase opacity |
| Brand wordmark SVGs missing alt | Low | wexta, oxyra logos | Add descriptive alt |
