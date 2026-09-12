# Sitemap Audit — https://www.stlteknoloji.com

Source: sitemap.xml (14 URLs), cross-checked against src/routes.tsx.

| Check | Result | Severity |
|---|---|---|
| XML validity | Pass (xmllint clean, UTF-8, no BOM) | - |
| URL count vs 50k limit | Pass, 14 URLs ~5.9 KB | - |
| Sitemap index warranted | No | - |
| hreflang reciprocity | Pass, all tr/en pairs reciprocal (42 xhtml:link entries, 0 issues) | - |
| x-default correctness | Pass, always the tr no-prefix URL | - |
| lastmod accuracy | FAIL: all 14 identical (2026-09-10), build-time stamp | Low |
| priority use | 1.0 home / 0.9 brand / 0.2 legal. Google ignores priority since ~2020 | Info |
| changefreq | Not used (correct) | - |
| Missing About/Contact/Blog | No such routes exist. Non-issue | - |
| Orphan sitemap URLs | None | - |
| Linked but not sitemapped | None | - |

## Detail

hreflang: TR/EN legal slug mismatch (/kvkk<->/en/gdpr, /gizlilik<->/en/privacy) is intentional and
reciprocal, confirmed in routes.tsx (legalChildren vs legalChildrenEn). Not a bug.

lastmod: identical across all pages including legal pages that rarely change. Derive from real content
change date (CMS field or last commit touching the page), not the sitemap build step.

Routes: exactly 14 real routes plus /admin (disallowed, excluded) and a catch-all 404. "hakkimizda" and
"iletisim" are in-page anchors on the homepage, not routes. "#blog" on the BNK page is a carousel tab,
not a blog.

Crawl cross-check: every internal same-origin href in the 14 pages is already in the sitemap. Everything
else is out of scope by design: fragment anchors, external brand storefronts (beautynetkorea.com.tr,
fressihome.com), Instagram/mailto/tel, and /files/wexta-katalog-2023.pdf.

## Actions

1. Low: replace uniform lastmod with real per-page dates.
2. Info: optionally drop <priority> sitewide.
3. Info: decide whether the wexta catalog PDF should be independently indexed.
4. No action on About/Contact/Blog as a sitemap defect. Separate content-strategy question.
