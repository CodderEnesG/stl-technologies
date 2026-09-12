# Content Quality Audit — stlteknoloji.com

Overall content quality: 50/100. E-E-A-T weighted total: 44/100.

## E-E-A-T

Experience 45/100. Fressi has genuine named customer reviews with verified-purchase tags, the strongest
experience signal on the site and the only brand page with UGC. wexta's 3-stage manufacturing walkthrough
(extrusion, vacuum form, screw assembly) reads as real process knowledge. Oxyra and BNK have zero
testimonials. BNK's "Cilt günlüğü" article teasers are permanently marked "Yakında" in production.

Expertise 40/100. wexta process/sizing detail and Oxyra specs (136 kg capacity, 145 degree recline,
100,000-cycle durability test) are specific and testable. Zero certifications named anywhere: no ISO, no
CE marking, despite OEM and 20-country export claims. Fressi sells electrical appliances where CE marking
is typically an EU legal requirement. Confirm compliance-disclosure status with the client. No named
engineers or QA staff.

Authoritativeness 40/100. The homepage partner-logo strip is a real asset: Turkish Airlines, AJet,
DeFacto, Watsons, Slazenger, BİM, LC Waikiki, Kiğılı, D'S Damat. These names exist ONLY in image alt
text, never in crawlable prose. Body text says only "Türkiye'nin önde gelen tekstil markaları". Oxyra
claims "ödüllü tasarım" naming no award or body.

Trustworthiness 50/100. Full contact block on every page, substantive legal pages (900-1150 words).
Against that: the "Ülke listesi güncellenecektir" placeholder sits directly under the "20 ülkeye ihracat"
claim on the homepage; wexta links a 2023 catalog PDF with no freshness signal; no author or date
anywhere; four legal pages' meta descriptions restate their titles.

## Thin content (main content, nav/footer excluded)

| Page | TR | EN | Floor | Status |
|---|---|---|---|---|
| Homepage | 360 | 437 | 500 | Below |
| wexta | 500 | 608 | 800 | Below |
| fressi | 514 | 552 | 800 | Below |
| bnk | 360 | 411 | 800 | Below |
| oxyra | 215 | 244 | 800 | Well below |
| Legal | 655-1060 | - | n/a | OK |

Every commercial page is under its coverage floor. Oxyra is critically thin.

## TR/EN duplication and templating

Not a canonical risk, hreflang is correct. But EN pages are literal translations carrying identical
omissions and no adaptation to an international B2B buyer. All four brand pages share an identical
section skeleton with formulaic "X hakkında" prose, which reads templated.

## Meta descriptions

Confirmed: the four legal pages' descriptions just repeat the title minus the suffix. Each page already
has a good unique og:description that is unused as the meta description. Copying og:description into
meta description on those 4 pages is a zero-cost fix. Brand and homepage descriptions are fine; Oxyra's
is the weakest.

## Readability and headings

Marketing pages average 10-18 words per sentence, scannable but rarely more than 1-2 connected sentences
per subtopic. Brand pages nest H1 to H2 to H3 correctly and should be the template. Homepage gap: the
four rotating hero taglines are wrapped in <p>, not headings, and the only real H1 is visually hidden and
duplicates the title. The most prominent homepage copy carries zero heading weight.

## Keyword coverage

Natural, not stuffed. Gaps: "bavul" is entirely absent from wexta; "Kore kozmetik" as a phrase is absent
from BNK.

## AI citation readiness: 42/100

Facts are already in quotable stat-block form (35,000 m², 2016, 20 countries, 136 kg, 100,000 cycles,
SPF50+ PA+++). Weaknesses: no author or date; unsubstantiated superlatives lower citation confidence; the
real partner proof is trapped in alt text and never appears as a citable sentence.

## Missing About / team / blog / case studies

No About page, no team page, no blog, no case studies. Only a ~100-word "Biz Kimiz" paragraph on the
homepage. Single largest content gap. Build order:

1. About page, 800-1200 words: named leadership, actual certifications held, timeline, factory proof, QC
   process. Natural landing target for the existing Organization JSON-LD.
2. 3-5 case studies, 150-300 words each, built from the partner logos already on the site. Fastest
   authoritativeness win because the asset exists.
3. Team and leadership content, can live inside About. Named people beat anonymous corporate copy.
4. Resolve BNK's "Yakında" blog stubs: publish or remove.
5. Longer term, a real blog for informational queries (valiz nasıl seçilir, oyuncu koltuğu ergonomisi,
   Kore cilt bakım rutini nedir).

## Priority fixes

| Severity | Issue | Fix | Effort |
|---|---|---|---|
| High | No About/team/certification content | Build About page | Medium |
| High | No case studies despite partner-logo asset | Write 3-5 case studies | Medium |
| High | All commercial pages under coverage floor (215-608 words) | Expand to 800-1200 words | Medium |
| Medium | Legal meta descriptions repeat the title | Copy og:description into meta description, 4 pages | Trivial |
| Medium | "Ülke listesi güncellenecektir" live under the export claim | Populate the list or remove the sentence | Low |
| Medium | Unsubstantiated "ödüllü" claim, unnamed partner brands | Name the award or drop it; name partners in prose | Low |
| Medium | Partner names only in alt text | Add one sentence naming key OEM/retail partners | Low |
| Medium | BNK blog stubs permanently "Yakında" | Publish or remove | Medium |
| Low | Stale 2023 wexta catalog PDF | Refresh or date-label | Low |
| Low | Homepage hero taglines are <p>; sr-only H1 duplicates title | Promote the active tagline to H2 | Low |
| Low | "bavul" missing from wexta | Add 1-2 natural mentions | Trivial |
| Low | EN pages are literal translations | Rewrite EN leads toward export/OEM/compliance | Medium |
