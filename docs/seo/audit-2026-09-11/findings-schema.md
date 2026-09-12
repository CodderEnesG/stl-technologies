# Structured Data Audit — stlteknoloji.com

JSON-LD extracted and parsed from all 14 pages. Every block is valid JSON. No Microdata or RDFa, JSON-LD
only, which is correct.

Inventory: Organization+Corporation x2 (one per language), WebSite x2, WebPage+BreadcrumbList x8 (brand
pages), WebPage only x4 (legal), 16 Brand nodes, 2 PostalAddress, 2 ContactPoint. No Product,
ProductGroup, ItemList or FAQPage anywhere.

## Validation

| Check | Result |
|---|---|
| @context correct on all 14 | Pass |
| No deprecated types | Pass |
| Required properties per type | Pass |
| URLs absolute | Pass |
| Dates ISO 8601 | Pass, foundingDate "2016" is a valid partial date |
| No placeholder text inside JSON-LD | Pass, the schema itself is clean |
| WebPage.url matches canonical | Pass on all 14 |
| WebPage.inLanguage matches html lang | Pass |
| BreadcrumbList position sequencing | Pass on all 8 |
| @id uniqueness and consistency | FAIL |
| Entity de-duplication | FAIL |

No hard validity errors. The issues below are graph-consistency and completeness items.

## Graph consistency

### A. Organization is duplicated under two @id values. HIGH

home.html declares @id .../#organization. en.html declares a SECOND full Organization node at
.../en#organization with the same legalName, address, phone and logo, just a translated description.
Consumers read this as two distinct organizations rather than one entity in two languages, which dilutes
Knowledge Graph consolidation. WebSite being duplicated is defensible. Organization is a
language-independent legal entity and must not fork.

Fix: reuse the same @id in en.html (drop the en prefix) and repoint every en#organization reference
across all 7 EN pages to the canonical id. Metadata-only change.

### B. 16 Brand nodes, none with an @id. HIGH

Organization.brand[] on the homepage defines 4 Brand objects inline with no @id. Each brand page's
WebPage.about redeclares its own Brand, also with no @id, and the EN variants repeat it a third time.
Nothing tells a consumer that wexta on the homepage, on /wexta and on /en/wexta are the same entity. It
also blocks any future Product.brand reference from anchoring to a canonical Brand.

Fix: give each Brand a canonical @id like https://www.stlteknoloji.com/wexta#brand, define it once, and
have every other location stub-reference it: "about": { "@id": ".../wexta#brand" }.

### C. Done right already

WebSite.publisher stub-references Organization by @id, and brand pages stub-reference WebSite and
Organization by @id. That pattern is correct everywhere except the two nodes above.

## BreadcrumbList

All 8 instances are structurally correct: sequential positions, absolute item URLs matching canonical,
TR and EN roots correctly differentiated. The 4 legal pages carry WebPage only and no BreadcrumbList,
breaking the pattern. Add one to each. MEDIUM.

## Organization completeness

| Property | Status | Recommendation |
|---|---|---|
| sameAs | Instagram only | Add LinkedIn and YouTube only if real profiles exist. Do not fabricate |
| vatID / taxID | Missing | BLOCKED, see the Critical item below |
| numberOfEmployees | Missing | No figure exists anywhere on the site. Add only a real one |
| areaServed | Missing | Safe to add now, "20 ülkeye ihracat" is already on the site |
| award | Missing | Only marketing copy exists. "Ödüllü tasarım" names no award or body. Do not mark it up |
| foundingLocation | Missing | Safe to add now, Arnavutköy, İstanbul, TR |

## CRITICAL: live legal placeholders

kvkk.html and en_gdpr.html publish literal unfilled placeholders in the data controller identity clause:
"XX Ticaret Sicili nezdinde 00000 sicil numarası ile kayıtlı, 0000000000000000 Mersis numaralı". The EN
page carries the same. Verified in production and traced to src/content/legal.ts:38 and :70. The source
comment notes the numbers were inherited from the old site.

This is a live legal-disclosure defect, not just a schema gap. Under KVKK the data controller identity
clause must be real. Fix the legal text with the real registry and MERSİS numbers first, then mirror
them into schema as identifier and vatID. Never publish schema with fabricated numbers.

## Product / ProductGroup opportunities

wexta is the strongest candidate. The page has 9 real named series with distinct images and shared
20/24/28 inch sizing: Milano VL-280, WX-1, WL-240, WX-230, WX-300 Baskılı, Diamond WX-330, WX-1001,
PP10, kids WX-41x. Textbook ProductGroup with hasVariant per size. Caveat: with no e-commerce there are
no offers, reviews or ratings, so Google Product rich results will not trigger. It is still valid entity
data and helps topical and GEO understanding. The 9 series also share one URL, so adding per-series
anchor fragments would let each ProductGroup.url be unique.

Oxyra has one real named product, the Mooncha chair, with concrete specs (145 degree recline, 51 cm
seat, 136 kg capacity, 100,000-cycle test). Enough for a genuine Product with additionalProperty.

BNK has a real bestseller list of 8 items with real external URLs on beautynetkorea.com.tr. Mark up as
ItemList of Products, not as own Products, since they are third-party sold.

Fressi has no individual product pages, only 4 category collection links. Use ItemList of the
collections. Do NOT convert the named customer testimonials into Review or aggregateRating on the
Organization or Brand. Google explicitly disallows self-serving organization reviews. They become usable
only once Fressi has individual product detail pages.

## FAQPage

No FAQ content exists on any page. FAQPage rich results are gated to government and healthcare sites, so
there is no Google benefit here. Do not add it unless the team writes real FAQ content and prioritizes
AI citation over Google rich results.

## EN page inLanguage and isPartOf

All 7 EN pages: inLanguage "en" matches html lang, isPartOf points to en#website, WebPage.url matches
canonical. Solid. Only the publisher @id needs the fix from section A.

## Severity-ranked actions

| # | Item | Severity |
|---|---|---|
| 1 | KVKK/GDPR pages publish unfilled legal placeholders | CRITICAL |
| 2 | Organization duplicated under two @id values | HIGH |
| 3 | 16 Brand nodes with no shared @id | HIGH |
| 4 | wexta 9-series ProductGroup missing | MEDIUM |
| 5 | Legal pages missing BreadcrumbList | MEDIUM |
| 6 | Organization missing areaServed and foundingLocation | MEDIUM |
| 7 | BNK ItemList, Oxyra Product, Fressi category ItemList missing | MEDIUM |
| 8 | numberOfEmployees, vatID, real award: no data, cannot fabricate | LOW, blocked on client input |
| 9 | sameAs limited to Instagram | LOW |
| 10 | FAQPage not applicable | INFO |

Ready-to-paste JSON-LD for every recommendation above is in the agent transcript and follows the site's
existing @context / @graph / @id-stub style, using only verified on-page data.
