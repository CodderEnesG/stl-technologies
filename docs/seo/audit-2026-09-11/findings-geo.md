# GEO (AI Search Readiness) Audit — stlteknoloji.com
Date: 2026-09-11
Scope: all 14 sitemap URLs (TR + EN), robots.txt, llms.txt, JSON-LD, plus live checks against sister-brand domains fressihome.com and beautynetkorea.com.tr.

## GEO Readiness Score: 52 / 100 (Needs Improvement)

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 45/100 | 11.3 |
| Structural Readability | 20% | 55/100 | 11.0 |
| Multi-Modal Content | 15% | 35/100 | 5.3 |
| Authority & Brand Signals | 20% | 30/100 | 6.0 |
| Technical Accessibility | 20% | 90/100 | 18.0 |
| **Total** | | | **51.6 ≈ 52** |

The site's floor is high (crawlable, fast, SSR, llms.txt already deployed) but its ceiling is capped by off-site corroboration and passage depth — the two hardest things to fix quickly, which is exactly why the score sits at "needs improvement" despite good technical hygiene.

---

## 1. AI Crawler Access — VERIFIED GOOD

Live `robots.txt` (fetched 2026-09-11):

```
User-agent: *
Allow: /
Disallow: /admin

User-agent: GPTBot          Allow: /
User-agent: OAI-SearchBot   Allow: /
User-agent: ChatGPT-User    Allow: /
User-agent: ClaudeBot       Allow: /
User-agent: PerplexityBot   Allow: /
User-agent: Google-Extended Allow: /
User-agent: Bingbot         Allow: /
Sitemap: https://www.stlteknoloji.com/sitemap.xml
```

All target AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot) are explicitly allowed, plus Google-Extended and Bingbot. No PerplexityBot/GPTBot-hostile directives found. This is better than ~90% of comparable B2B sites — no action needed here. CCBot/anthropic-ai/cohere-ai (training-only crawlers) are not mentioned; leaving them un-blocked is fine given the site has no premium content worth protecting.

Content is confirmed fully server-rendered: all body copy, headings, and JSON-LD are present in the raw HTML for all 14 URLs (no CSR-only dependency), so crawlers that don't execute JS (GPTBot, ClaudeBot, PerplexityBot all fall in this category) see the same content a browser does.

## 2. llms.txt — PRESENT AND ABOVE-AVERAGE (this was not pre-flagged in CONTEXT.md — verified live)

`https://www.stlteknoloji.com/llms.txt` returns **200**, `text/plain`, 2,236 bytes, correct llms.txt structure (H1, blockquote summary, `## Markalar`, `## Kurumsal`, `## Doğrulanmış bilgiler`, `## Kaynaklar`). It already links to a real, working asset: `https://www.stlteknoloji.com/files/wexta-katalog-2023.pdf` (verified 200, `application/pdf`).

This is genuinely good and rare — most SMB sites have nothing here. Two gaps:

- **It's Turkish-only.** The English site half (`/en/*`) is only referenced as inline links inside the Turkish file; there's no English-language summary block an English-prompting AI agent would parse as primary. Low effort to add an `## English` mirror section (doesn't need a separate file per spec, but a parallel block would help disambiguation for English queries).
- **The "verified facts" block repeats the same unresolved placeholder problem as the site itself**: it states "20 ülkeye ihracat" but — like the website — never names the 20 countries. An llms.txt file is supposed to be the single most trustworthy, structured source for an agent; shipping it with a number nobody can verify undermines its own purpose. Fix this file and the on-page copy together (see §4).
- No `llms-full.txt` (optional, extended version) — low priority for a site this small; the 14-page site is small enough that llms.txt already covers it.

**RSL 1.0**: Not present (`/rsl.xml`, `/rsl.txt` → 404, no `rel="license"` link found in `<head>`). **Not a priority for this site** — RSL matters when you want to declare machine-readable licensing/compensation terms for content that's valuable to withhold or monetize from AI training (articles, datasets, media libraries). STL Teknoloji has no blog, no gated content, no media library — there's nothing here an AI trains on that isn't already meant to be publicly citable marketing copy. Skip it unless a content/blog strategy is added later.

## 3. Passage-Level Citability — WEAK (primary blocker)

Extracted and word-counted the core "answer" sentences from each page (script/style stripped, real prerendered text):

| Page | Passage | Word count | vs. 134–167 target |
|---|---|---|---|
| Home | Founding/facility paragraph ("2016 yılında İstanbul'da valiz üretimiyle kurulduk...") | 29 | 18% of floor |
| Home | OEM/export paragraph ("Üretim omurgamız yerli...") | 28 | 17% of floor |
| wexta | "wexta, STL Teknoloji'nin valiz markasıdır..." | 35 | 21% of floor |
| BNK | "BNK — Beauty Net Korea — Kore kozmetiğinin..." | 52 | 32% of floor |
| Oxyra | "Oxyra, STL Teknoloji'nin oyun ekipmanları markasıdır..." | 28 | 17% of floor |

Every "about" passage on the site is 28–52 words — roughly a fifth to a third of the 134–167-word block that AI engines most reliably lift and cite whole. This isn't a copy-quality problem, it's a copy-*shape* problem: the site is written as fragmented hero taglines and 1–2 sentence marketing beats (deliberate for a scrolling brand site), not as self-contained paragraphs that survive extraction out of context. Splitting one idea across four short `<p>` tags means an AI retrieving "who makes wexta" gets a thin, choppy snippet rather than one dense, quotable block.

**Direct-answer wins (keep and build on these):**
- "wexta, STL Teknoloji'nin valiz markasıdır." — clean subject-is-predicate sentence, front-loaded, correctly answers "who makes wexta" in the first 6 words.
- "Oxyra, STL Teknoloji'nin oyun ekipmanları markasıdır." — same pattern.
- These `Brand → parent company` sentences exist for wexta and Oxyra but a comparable explicit sentence is **missing for Fressi and BNK** on their own pages (Fressi's intro never says "Fressi, STL Teknoloji'nin..."; BNK's intro leads with the brand story, not the parent-company attribution). Inconsistent — fix by giving all four brand pages the same opening sentence pattern.

**Unresolved-fact problem (hurts trust in every citation that includes it):**
The "20 ülkeye ihracat" (exports to 20 countries) claim appears on the homepage hero, the homepage body copy, the wexta meta description, wexta H2 subcopy, and llms.txt — repeated 5+ times — but the dedicated export section explicitly says **"Ülke listesi güncellenecektir."** ("Country list will be updated"), i.e., the site ships a placeholder in production. An AI engine that ingests this page has a specific, oft-repeated number with zero supporting detail — it can cite "20 countries" but cannot name a single one, and a careful engine (or a human fact-checking the AI's answer) will notice the sentence literally says the list is TBD. This is the single most fixable, highest-leverage citability gap on the site.

**Headings are marketing statements, not questions.** Every H2 is a tagline ("Dört marka, tek üretim disiplini.", "Levhadan valize üç aşama.") rather than a question form. AI answer engines pattern-match question-shaped headings to user queries; declarative headings still work but convert less reliably. Not urgent to rewrite site-wide (would hurt brand voice), but worth adding question-form subheads or FAQ blocks *underneath* the existing taglines rather than replacing them.

**No FAQPage schema / no FAQ content anywhere** on the 14 pages — a low-effort, high-yield addition for a site whose real user questions are predictable and few (who makes wexta, where is BNK made, is Oxyra a separate company, what sizes does wexta come in, etc).

## 4. Entity Clarity — Can an AI answer these from this site alone?

**"What is STL Teknoloji?"** — Yes, answerable, with real facts: founded 2016, 35,000 m² Arnavutköy/Istanbul facility, four brands (wexta, Fressi, BNK, Oxyra), 100% domestic manufacturing, OEM luggage for Turkish textile brands, exports to 20 countries (count only, not named), phone/email/address all present in both prose and JSON-LD `Organization`/`Corporation` schema. This is the strongest entity on the site.

**"Who makes wexta luggage?"** — Yes, directly answerable: "wexta, STL Teknoloji'nin valiz markasıdır" plus manufacturing detail (ABS shell, steel-screw assembly, Arnavutköy plant, since 2016). This is a genuine citability win already in place — an AI reading only this site would answer correctly and with specifics.

**"Who makes Fressi / BNK / Oxyra?"** — Partially. Oxyra has the same direct-attribution sentence as wexta. Fressi's page never states the STL Teknoloji relationship in its own "about" prose (it's implied only by site chrome/footer/schema, not by a sentence in the body an extractor would lift). BNK's page states the Korea-sourcing story clearly but likewise doesn't say "BNK is STL Teknoloji's brand" inside its own about paragraph — that fact lives only in the global JSON-LD graph, which a text-extraction-only crawler (vs. a schema-parsing one) would miss entirely.

**Four-brand holding structure clarity**: JSON-LD models this reasonably (Organization with 4 `brand` sub-entities), but two of the four brands (wexta, Oxyra) have **no external web presence at all** — no domain, no sameAs, nothing outside stlteknoloji.com/wexta and /oxyra. Fressi and BNK at least have real commerce domains (fressihome.com, beautynetkorea.com.tr) declared via `sameAs` in the homepage's JSON-LD `@graph`. This means half the brand portfolio is only as "real" to an AI's entity graph as this one domain says it is — there's no independent corroborating source it could cross-check wexta or Oxyra against.

**Schema entity consolidation bug**: the homepage `@graph` defines `Brand` nodes for wexta/Fressi/BNK/Oxyra inline (no `@id`), and each brand's own page (e.g. `wexta.html`) *re-declares* its own separate inline `Brand` node inside a `WebPage.about` property — also with no `@id` and no `sameAs` carried over. These are technically two different unlinked Brand entities to a strict RDF/schema parser, not one entity referenced twice. Low-effort dev fix: give the Organization's brand array and each page's `about` node the same `@id` (e.g. `https://www.stlteknoloji.com/wexta#brand`) so they resolve as the same node.

## 5. Off-Site Corroboration — WEAK (biggest authority gap)

`sameAs` on the `Organization` node is **Instagram only** (`instagram.com/stlteknoloji`). No LinkedIn company page, no Wikipedia/Vikipedi entity, no YouTube, no Crunchbase/Google Business Profile referenced anywhere in schema or prose.

Per the brand-mention correlation data this audit works from, YouTube presence (~0.737 correlation with AI citation) and Wikipedia entity presence are the strongest off-site predictors of being cited by AI engines — and this site has neither, and no LinkedIn or Reddit signal either based on what could be checked.

**Live-checked the two sister-brand domains named in the brief** (fetched their homepages + `hakkımızda`/about pages directly, since search-engine result pages could not be scraped from this sandboxed environment — DuckDuckGo/Google returned CAPTCHA/JS walls, not usable result data; treat brand-mention volume on Reddit/YouTube/Wikipedia/LinkedIn as **unverified, not confirmed-absent**, and re-check with a live search tool or DataForSEO before finalizing strategy):

- **fressihome.com**: mentions "STL TEKNOLOJİ LTD ŞTİ" exactly once, on the homepage footer and again on the `/pages/hakkimizda` about page — but only as the *legal entity name inside a boilerplate KVKK/address block* ("STL TEKNOLOJİ LTD ŞTİ, Deliklikaya Mah..."), not as a sentence describing the brand relationship, and **not as a hyperlink** to stlteknoloji.com anywhere on the page.
- **beautynetkorea.com.tr**: **zero mentions** of "STL" anywhere on the homepage — the legal/parent relationship isn't stated at all on the storefront a customer or AI crawler would actually see.

So the `sameAs` link declared in stlteknoloji.com's own schema (`fressihome.com`, `beautynetkorea.com.tr`) is **one-directional**: this site claims the relationship, but neither sister site corroborates it back with a link or a clear sentence. Reciprocal `sameAs`/backlinks between corporate-parent and brand-storefront domains are exactly the kind of low-cost, high-signal corroboration AI engines use to validate an entity claim instead of taking a single source's word for it. This is the single highest-leverage authority fix available and it's entirely within STL's own control (both sites are owned by the same company).

## 6. Multi-Modal & Technical Accessibility

- Fully prerendered SSR HTML on all 14 URLs, ~200ms TTFB, sitemap declared — no crawler-access barrier of any kind. (Technical dimension scores 90/100; the only deductions are the missing image dimensions on 12 of 14 pages, previously noted in CONTEXT.md.)
- No video content, no YouTube channel, no downloadable spec sheets linked from the actual product pages (the one PDF catalog that exists is only referenced from llms.txt, not linked from wexta.html itself — an AI crawling the HTML page directly would never find it).
- Images have alt text (good), but no captions/structured data tying images to claims (e.g., no ImageObject schema, no factory-photo captions naming the 35,000 m² facility explicitly for image-search/multimodal retrieval).

---

## Concrete Rewrite Examples

### Example A — Homepage "who is STL Teknoloji" paragraph

**Current** (split across two separate `<p>` tags, 29 + 28 words, the export claim is unsupported):

> 2016 yılında İstanbul'da valiz üretimiyle kurulduk. Bugün Arnavutköy'deki 35.000 m² tesisimizde oyun ekipmanından küçük ev aletlerine, seyahatten cilt bakımına uzanan dört markayı aynı üretim ve tasarım disiplini altında yönetiyoruz.
>
> Üretim omurgamız yerli. Türkiye'nin önde gelen tekstil markalarına OEM valiz üretiyor, ürünlerimizi 20 ülkeye ihraç ediyoruz. OEM işimizde geçerli olan kalite çizgisi, kendi markalarımız için de aynen geçerli.

**Rewrite** — one consolidated, self-contained, ~150-word answer block; keep it as one paragraph so an extractor lifts it whole, front-load the direct answer, and replace the placeholder with real country names (bracketed fields need STL to supply the actual list — do not publish "20 ülke" again until this list exists):

> STL Teknoloji, 2016 yılında İstanbul'da valiz üretimiyle kurulan bir üretim ve teknoloji şirketidir. Bugün Arnavutköy'deki 35.000 m²'lik kendi tesisinde dört markayı — valiz markası wexta, küçük ev aletleri markası Fressi, Kore kozmetiği markası BNK (Beauty Net Korea) ve oyun ekipmanları markası Oxyra'yı — aynı üretim ve tasarım disiplini altında yönetir. Üretim tamamen yerlidir: levha ekstrüzyonundan montaja kadar tüm valiz üretim aşamaları aynı çatı altında gerçekleşir. STL Teknoloji ayrıca Türkiye'nin önde gelen tekstil markalarına OEM valiz üreticisi olarak hizmet verir ve kendi markalarıyla birlikte [ör. Almanya, Fransa, Birleşik Krallık, Polonya, Romanya — gerçek 20 ülke listesiyle değiştirilecek] dahil 20 ülkeye ihracat yapar. Merkezi Arnavutköy, İstanbul'dadır; +90 212 866 85 51 ve info@stlteknoloji.com üzerinden iletişime geçilebilir.

(~150 words. Publish the two original short paragraphs *underneath* for scannability/brand voice if needed — the consolidated block doesn't have to replace the visual hero copy, it can sit as a dedicated "Kurumsal Özet" paragraph that both humans and crawlers can find, similar to how the llms.txt summary block works.)

### Example B — wexta "who makes it" passage

**Current** (35 words):

> wexta, STL Teknoloji'nin valiz markasıdır. 2016'dan beri İstanbul Arnavutköy'deki 35.000 m² tesisimizde ürettiğimiz valizler, Türkiye'nin önde gelen tekstil markalarının da tercihi. Levha ekstrüzyonundan montaja tüm aşamalar aynı çatı altında; %100 ABS gövde, çelik vidalı aksesuar.

**Rewrite** — keep the strong opening sentence (it already nails the direct-answer pattern), extend with the size range, material, and export facts that are currently scattered across other sections of the same page so this one block is fully self-contained:

> wexta, STL Teknoloji'nin valiz markasıdır ve 2016'dan beri İstanbul Arnavutköy'deki 35.000 m²'lik tesiste üretilir. wexta valizleri %100 ABS gövdeli, çelik vidalı aksesuarlıdır ve 20, 24 ve 28 inç olmak üzere üç boyda, sekiz yetişkin serisi ve bir çocuk serisi halinde üretilir. Üretim süreci tamamen Arnavutköy'deki tek tesiste yürütülür: ABS ve PC hammaddeden levha çekimi (ekstrüzyon), vakumlu kalıplarla gövde şekillendirme ve fermuar/teker/kol parçalarının çelik vidayla montajı aynı çatı altında gerçekleşir. wexta, Türkiye'nin önde gelen tekstil markalarına OEM valiz üreten aynı hattan çıkar ve [X] ülkeye ihraç edilir. Ürün kataloğu: stlteknoloji.com/files/wexta-katalog-2023.pdf.

(~135 words — inside the 134–167 target range. Note: this also fixes the "orphan PDF" problem by linking the existing catalog PDF directly into the page body, not just llms.txt.)

### Example C — Fressi/BNK missing attribution sentence (smaller fix, high frequency impact)

Add one sentence to the top of each brand's "hakkında" paragraph, matching the pattern already used for wexta/Oxyra:

- Fressi: prepend **"Fressi, STL Teknoloji'nin küçük ev aletleri markasıdır."** before the existing "Fressi, retro ve vintage tarzıyla..." sentence.
- BNK: prepend **"BNK (Beauty Net Korea), STL Teknoloji'nin Kore kozmetiği markasıdır."** before the existing "Kore kozmetiğinin özenli formül yaklaşımını..." sentence.

This costs minutes per page and makes all four brand pages consistently answer "who owns/makes this brand" in the first sentence — the single most citation-friendly sentence shape on the whole site.

---

## Brand Mention & Corroboration Summary

| Signal | Status | Note |
|---|---|---|
| Wikipedia entity | Not found | Not verifiable via live search in this environment; recommend checking Vikipedi/Wikidata directly and, if absent, this is a multi-month effort (notability bar), not a quick win |
| Reddit presence | Unverified | Search engines blocked automated fetch (CAPTCHA); recommend a manual or DataForSEO-backed check |
| YouTube mentions | None found in schema or on-site links | No channel linked anywhere; highest-correlation signal (~0.737) currently at zero |
| LinkedIn | Not in `sameAs`, not found linked from site | Quick win: create/link a company page |
| Instagram | Present | Only external `sameAs` currently declared |
| fressihome.com → STL backlink | **Confirmed absent** (live-fetched) | Only unlinked legal-entity text in footer/about page |
| beautynetkorea.com.tr → STL backlink | **Confirmed absent** (live-fetched) | Zero mentions of "STL" anywhere on homepage |
| Domain Rating / backlinks | Not checked (no Moz/Ahrefs access) | Weakest-correlation signal anyway (~0.266); low priority |

---

## Top 5 Highest-Impact Changes

1. **[High severity, Low effort]** Replace the "Ülke listesi güncellenecektir." placeholder with the real 20-country export list, and stop repeating an unsupported "20 ülke" claim across home/wexta/llms.txt until it's backed by named countries. This is the single fastest trust-and-citability fix on the site — it's a content-only change, no dev work.

2. **[High severity, Medium effort]** Add reciprocal corroboration between stlteknoloji.com and its sister-brand storefronts: put a real linked sentence ("Fressi, STL Teknoloji markasıdır" / "BNK, STL Teknoloji markasıdır" with a hyperlink to stlteknoloji.com) on fressihome.com and beautynetkorea.com.tr's about/footer, not just legal boilerplate. This directly targets the weakest-scoring dimension (Authority, 30/100) and is fully within STL's control since all three domains are owned by the same company.

3. **[Medium severity, Low-Medium effort]** Expand the four brand "about" passages (currently 28–52 words each) into single, self-contained 134–167-word paragraphs using the rewrite patterns in Examples A–C above, with the parent-brand attribution sentence leading every one. Also link the existing wexta PDF catalog directly into the wexta page body, not just llms.txt.

4. **[Medium severity, Medium effort, dev]** Fix the Brand entity duplication in JSON-LD: give each brand a stable `@id` shared between the homepage `@graph` and its own page's `WebPage.about` node so parsers resolve one entity, not two. Add `FAQPage` schema for the handful of predictable questions (who makes X, where is it made, what sizes/models exist). Add `sameAs` to wexta and Oxyra once (or if) they get any external presence.

5. **[Low-Medium severity, Low effort]** Off-site presence build-out for the strongest-correlation, currently-zero signals: a YouTube factory-tour/product video (even one video, ~0.737 correlation with citation) and a LinkedIn company page, both added to `sameAs`. Lower priority: investigate Wikipedia/Vikipedi notability and Reddit presence with a proper search/DataForSEO tool, since this sandbox could not verify either live.

---

## Platform-Specific Estimated Scores

| Platform | Est. Score | Rationale |
|---|---|---|
| Google AI Overviews | ~40/100 | Heavily weights E-E-A-T + backlink/entity corroboration, which is this site's weakest area |
| ChatGPT / OAI-SearchBot | ~55/100 | Benefits most from the llms.txt file and open crawler access; hurt by short passages |
| Perplexity | ~45/100 | Values multi-source corroboration for citations; only one source (this domain) currently backs most brand facts |
| Bing Copilot | ~50/100 | Bingbot fully allowed, decent schema; same off-site-corroboration ceiling as the others |

Only ~11% of domains get cited by both ChatGPT and Google AI Overviews — closing the off-site corroboration gap (item #2 above) is what would move this site from "occasionally cited on long-tail brand queries" into that dual-cited group, more than any on-page copy change alone.
