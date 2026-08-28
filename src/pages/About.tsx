import { Link } from "react-router";
import { brands, stlImages } from "../data/brands";
import { useI18n } from "../i18n";
import { usePageMeta } from "../hooks/usePageMeta";
import { Arrow } from "../components/Arrow";
import { SectionHeader } from "../components/SectionHeader";
import { LogoSlot } from "../components/LogoSlot";

export default function About() {
  const { t, p } = useI18n();
  const a = t.about;
  usePageMeta(t.meta.about.title, t.meta.about.desc);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pt-20 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{a.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tightest md:text-6xl">
          {a.heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{a.heroBody}</p>
      </section>

      {/* Tesis görselleri — kare kadraj */}
      <section className="mx-auto grid max-w-[1400px] gap-4 px-5 pt-14 sm:grid-cols-2 md:px-8">
        <figure>
          <div className="overflow-hidden rounded-3xl">
            <img src={stlImages.building} alt={a.buildingAlt} className="aspect-square w-full object-cover" />
          </div>
          <figcaption className="mt-3 text-xs text-muted">{a.buildingAlt}</figcaption>
        </figure>
        <figure>
          <div className="overflow-hidden rounded-3xl">
            <img src={stlImages.factory} alt={a.lineAlt} loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <figcaption className="mt-3 text-xs text-muted">{a.lineAlt}</figcaption>
        </figure>
      </section>

      {/* Biz Kimiz */}
      <section className="mx-auto grid max-w-[1400px] items-start gap-10 px-5 pt-24 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8">
        <div className="overflow-hidden rounded-3xl">
          <img src={stlImages.luggage} alt={a.lineAlt} loading="lazy" className="aspect-square w-full bg-white object-contain" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">{a.whoWeAreEyebrow}</p>
          <h2 className="mt-4 max-w-lg font-display text-3xl font-bold leading-[1.1] tracking-tightest md:text-4xl">
            {a.whoWeAreTitle}
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            {a.whoWeAreBody.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
        <SectionHeader eyebrow={a.missionEyebrow} title={a.missionTitle} className="mb-12" />
        <div className="grid gap-4 md:grid-cols-2">
          {[a.mission, a.vision].map((m, i) => (
            <div
              key={m.label}
              className="rounded-3xl p-8 md:p-10"
              style={i === 0 ? { background: "#2b2828", color: "#fff" } : { background: "var(--accent)", color: "#fff" }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">{m.label}</p>
              <p className="mt-4 font-display text-xl font-semibold leading-snug tracking-tightest md:text-2xl">
                {m.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
        <SectionHeader eyebrow={a.timelineEyebrow} title={a.timelineTitle} className="mb-12" />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {a.timeline.map((it) => (
            <div key={it.title} className="bg-white p-7">
              <div className="font-expanded text-2xl font-extrabold tracking-tightest text-[var(--accent)]">{it.year}</div>
              <h3 className="mt-4 font-display font-bold tracking-tightest">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{it.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Değerler */}
      <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
        <SectionHeader eyebrow={a.valuesEyebrow} title={a.valuesTitle} className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {a.values.map((v, i) => (
            <div key={v.title} className="rounded-2xl border border-border bg-white p-7">
              <span className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tightest">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Markalar */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
        <SectionHeader eyebrow={a.brandsEyebrow} title={a.brandsTitle} className="mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((b) => {
            const copy = t.brands[b.slug as keyof typeof t.brands];
            const onDark = b.panelText === "#ffffff";
            return (
              <Link
                key={b.slug}
                to={p[b.slug as keyof typeof p]}
                className="group flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform hover:-translate-y-1"
                style={{ background: b.panelBg, color: b.panelText }}
              >
                <LogoSlot src={onDark ? b.logoLight : b.logoDark} label={b.name} height={24} onDark={onDark} />
                <div>
                  <p className="text-sm font-medium leading-snug opacity-90">{copy.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: onDark ? "#fff" : b.color }}>
                    {t.home.explore} <Arrow />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
