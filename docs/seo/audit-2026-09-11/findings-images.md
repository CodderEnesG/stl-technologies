# Image Audit — https://www.stlteknoloji.com

82 unique images, 9.00 MB total, 112 KB average. Formats: 43 WebP, 20 SVG, 17 JPEG, 2 PNG.
Served with cache-control public, max-age=604800 from the Vercel edge cache.

## Per-page payload

| Page | Images | Payload | Largest file |
|---|---|---|---|
| /wexta, /en/wexta | 18 | 3.10 MB | wexta-cover.jpg 485 KB |
| /oxyra, /en/oxyra | 17 | 2.80 MB | mooncha/5.jpg 359 KB |
| /fressi, /en/fressi | 22 | 1.65 MB | gradient-koyu.png 302 KB |
| / , /en | 20 | 1.19 MB | wexta-cover.jpg 485 KB |
| /bnk, /en/bnk | 27 | 1.07 MB | model-routine-2.webp 109 KB |
| legal pages | 5 | 0.04 MB | wexta.svg 17 KB |

## Findings

### HIGH — no responsive images anywhere
Zero srcset, zero sizes, zero <picture> across all 14 pages. Every viewport downloads the same
full-size file. A 390px phone pulls the identical 485 KB hero a 1440px desktop gets. On /wexta that
means roughly 3 MB of images on mobile.
Fix: emit srcset with width descriptors plus a sizes attribute. With Vite, vite-imagetools generates
the variants at build time; alternatively move the files behind Vercel's image optimizer.

### HIGH — 17 JPEG files not converted to WebP
The rest of the site is already WebP, so this is an unfinished conversion, not a decision. The biggest
offenders are wexta-cover.jpg 485 KB, valiz-wx1001-1.jpg 420 KB, mooncha/5.jpg 359 KB,
valiz-wx300-1.jpg 324 KB, mooncha/1.jpg 321 KB. The seven mooncha/*.jpg files alone are 2.1 MB and all
sit on /oxyra.
Fix: convert to WebP at quality 80, keep JPEG as fallback only if you add <picture>. Expect 25-35%
savings, roughly 1.2 MB off /oxyra.

### HIGH — gradient-koyu.png is 302 KB
A gradient shipped as PNG on both Fressi pages. A gradient is the one thing that should never be a
raster file.
Fix: replace with a CSS linear-gradient, or a 2 KB WebP if the artwork is not reproducible in CSS.

### HIGH — missing width and height on nearly every image
Only 9 of the homepage's 40 img elements carry both attributes. The brand pages carry none. Every
image without dimensions is an unreserved box and a CLS contributor.
Fix: set width and height (or aspect-ratio in CSS) on every img. This is the cheapest Core Web Vitals
win available on the site.

### CORRECTED — the empty-alt finding was largely a false positive
Re-checked against the source, not the rendered HTML. Of 58 img tags in the components, 32 carry a real
alt, 24 carry alt="" together with aria-hidden (deliberately decorative, which is correct), and only 2
were genuinely missing one. The LCP hero (wexta-cover.jpg) is one of the deliberate ones: the wexta
wordmark and tagline sit on top of it and carry the meaning, so marking the photo decorative is the
right accessibility call, not a bug.

Fixed: the BNK post-card image now takes the post title as its alt. The other one sits inside a parent
that is already aria-hidden, so no change was needed.

Remaining trade-off, not a defect: a decorative hero never appears in image search. That is a content
decision, not a markup error.

### LOW — no lazy loading on the homepage above-the-fold set
The homepage lazy-loads 13 of 20 images; /bnk lazy-loads 23 of 33. Reasonable, but the legal pages
lazy-load none of their 5, and the first viewport images should be eager while everything below should
be lazy. Worth a pass to confirm the split matches the fold.

## Priority order

1. Add width and height everywhere (CLS, trivial change)
2. Convert the 17 JPEGs to WebP and kill gradient-koyu.png (about 1.5 MB sitewide)
3. Add srcset and sizes (largest mobile win)
4. Fix the hero alt, then the product photo alts
