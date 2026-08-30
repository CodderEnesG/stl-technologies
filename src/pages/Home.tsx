import { Link } from "react-router";
import { brands, partners, stlImages } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { Arrow } from "../components/Arrow";
import { SectionHeader } from "../components/SectionHeader";
import { NewsTicker } from "../components/NewsTicker";
import { Hero } from "../components/hero";

export default function Home() {
  const { t } = useI18n();
  usePageMeta(t.meta.home.title, t.meta.home.desc);
  return (
    <>
      <h1 className="sr-only">{t.meta.home.title}</h1>
      <Hero />
      <section className="relative z-20 bg-white py-20">
        <NewsTicker items={t.home.news} />
      </section>
      <IntroBlock />
      <WhoWeAre />
      <GroupBento />
      <BrandStrips />
      <Partners />
      <ContactCta />
    </>
  );
}

function IntroBlock() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
      <SectionHeader
        eyebrow={t.home.introEyebrow}
        title={t.home.introTitle}
        description={t.home.introText}
      />
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {t.home.stats.map((s) => (
          <div key={s.l} className="bg-white p-7">
            <div className="font-display text-3xl font-extrabold tracking-tightest text-[var(--accent)] md:text-4xl">{s.n}</div>
            <div className="mt-2 text-sm text-muted">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhoWeAre() {
  const { t, p } = useI18n();
  const w = t.home.whoWeAre;
  return (
    <section className="border-y border-border bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-24 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-8">
        {/* Gerçek üretim bandı fotoğrafı — kare kadraj */}
        <figure>
          <div className="overflow-hidden rounded-3xl">
            <img
              src={stlImages.factory}
              alt={w.lineCaption}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs text-muted">{w.lineCaption}</figcaption>
        </figure>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{w.eyebrow}</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl font-bold leading-[1.1] tracking-tightest md:text-[2.6rem]">
            {w.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted md:text-lg">
            {w.paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          <Link
            to={p.about}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-foreground px-7 py-3 font-semibold transition-colors hover:bg-foreground hover:text-white"
          >
            {w.cta} <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GroupBento() {
  const { t } = useI18n();
  const b = t.home.bento;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
      <SectionHeader eyebrow={b.eyebrow} title={b.title} description={b.description} className="mb-10" />
      <div className="grid gap-4 md:auto-rows-[230px] md:grid-cols-3">
        <article className="group relative min-h-[260px] overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
          <img src={stlImages.factory} alt={t.about.facilityAlt} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{b.production.kicker}</span>
            <p className="mt-2 max-w-md font-display text-2xl font-bold tracking-tightest md:text-3xl">{b.production.text}</p>
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-2xl bg-[var(--accent)] p-7 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{b.exportKicker}</span>
          <div>
            <div className="font-expanded text-5xl font-black tracking-tightest">{b.exportStat}</div>
            <p className="mt-1 text-white/85">{b.exportText}</p>
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-2xl bg-[#2b2828] p-7 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">{b.valueKicker}</span>
          <p className="font-display text-lg font-semibold leading-snug tracking-tightest">{b.valueText}</p>
        </article>

        <article className="group relative min-h-[220px] overflow-hidden rounded-2xl md:col-span-3">
          <img
            src={stlImages.building}
            alt={b.oem.kicker}
            loading="lazy"
            className="absolute inset-0 size-full object-cover object-[center_38%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-8 text-white">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">{b.oem.kicker}</span>
            <p className="mt-2 font-display text-2xl font-bold tracking-tightest md:text-3xl">{b.oem.text}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function BrandStrips() {
  const { t, p } = useI18n();
  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-5 pb-6 md:px-8">
        <SectionHeader
          eyebrow={t.home.portfolioEyebrow}
          title={t.home.portfolioTitle}
          description={t.home.portfolioDescription}
        />
      </div>
      {brands.map((b, i) => {
        const copy = t.brands[b.slug as keyof typeof t.brands];
        return (
          <Link
            key={b.slug}
            to={p[b.slug as keyof typeof p]}
            className="group block"
            style={{ background: b.color, color: b.onColor }}
          >
            <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-sm opacity-60">0{i + 1}</span>
                <h3 className="font-expanded text-4xl font-black uppercase tracking-tightest md:text-5xl">{b.name}</h3>
              </div>
              <p className="max-w-md text-base font-medium opacity-90 md:text-right">{copy.summary}</p>
              <span className="inline-flex items-center gap-2 whitespace-nowrap font-semibold transition-transform group-hover:translate-x-1">
                {t.home.explore} <Arrow />
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}

function Partners() {
  const { t } = useI18n();
  const mid = Math.ceil(partners.length / 2);
  const rowA = partners.slice(0, mid);
  const rowB = partners.slice(mid);
  return (
    <section className="overflow-hidden border-t border-border bg-[var(--surface)]">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 text-center md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{t.home.partnersKicker}</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tightest md:text-3xl">
          {t.home.partnersTitle}
        </h2>
      </div>

      <div className="marquee-mask mt-14 space-y-4">
        <MarqueeRow items={rowA} direction="left" duration={38} />
        <MarqueeRow items={rowB} direction="right" duration={44} />
      </div>

      <p className="mx-auto max-w-[1400px] px-5 pb-16 pt-10 text-center text-xs text-muted md:px-8">
        {t.home.partnersNote}
      </p>
    </section>
  );
}

function MarqueeRow({ items, direction, duration }: { items: string[]; direction: "left" | "right"; duration: number }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-group">
      <div className="marquee gap-4" style={{ animation: `marquee-${direction} ${duration}s linear infinite` }}>
        {loop.map((p, i) => (
          <span
            key={`${p}-${i}`}
            className="flex h-16 shrink-0 items-center justify-center rounded-xl border border-border bg-white px-10 font-display text-base font-bold uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContactCta() {
  const { t, p } = useI18n();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-28 text-center md:px-8">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tightest md:text-6xl">
          {t.home.ctaTitle}
        </h2>
        <Link
          to={p.contact}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02]"
        >
          {t.home.ctaButton} <Arrow />
        </Link>
      </div>
    </section>
  );
}
