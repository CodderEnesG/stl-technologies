/**
 * Çatı sitenin bölüm sözlüğü.
 *
 * Marka sayfalarının sözlüğüyle (components/brand/sections.tsx) aynı imzayı kullanır:
 * her bölüm bir `BrandCtx` alır ve renklerini `toneStyles[ctx.tone]` ile kurar.
 * Böylece çatıda kurulan düzen marka sayfalarında da kullanılabilir; marka sayfaları
 * da kendi bölümlerini çatıya taşıyabilir.
 */
import { useState } from "react";
import { Link } from "react-router";
import { brands, stlBrand } from "../../data/brands";
import { company } from "../../data/company";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";
import { Icon, type IconName } from "../Icon";
import { LogoSlot } from "../LogoSlot";
import { SectionHeader } from "../SectionHeader";
import { toneStyles, type BrandCtx } from "../brand/sections";

/** Çatı sitenin kendi ctx'i — marka sayfalarındaki ctx literalinin karşılığı. */
export const stlCtx: BrandCtx = { brand: stlBrand, tone: "stl", font: "font-display", iconWeight: 1.75 };

type Stat = { n: string; l: string };

/**
 * Hakkımızda bloğu: bina/üretim fotoğrafı + minimal paragraf + satır-içi istatistik şeridi.
 * İstatistikler ayrı bir bölüm değil, paragrafın devamı olarak okunur.
 */
export function AboutBlock({
  ctx,
  id,
  eyebrow,
  title,
  paragraphs,
  image,
  imageAlt,
  stats,
}: {
  ctx: BrandCtx;
  id?: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  stats: Stat[];
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section
      id={id}
      className="scroll-mt-[var(--nav-h)] border-y"
      style={{ background: "var(--surface)", borderColor: s.cardBorder }}
    >
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-24 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-8">
        <figure>
          <div className="overflow-hidden rounded-3xl">
            <img src={image} alt={imageAlt} loading="lazy" className="aspect-square w-full object-cover" />
          </div>
          <figcaption className="mt-3 text-xs" style={{ color: s.muted }}>
            {imageAlt}
          </figcaption>
        </figure>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: brand.color }}>
            {eyebrow}
          </p>
          <h2 className={`mt-4 max-w-lg ${ctx.font} text-3xl font-bold leading-[1.1] tracking-tightest md:text-[2.6rem]`}>
            {title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed md:text-lg" style={{ color: s.sub }}>
            {paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>

          {/* Satır-içi istatistik şeridi — marka sayfalarındaki BrandIntro düzeninin çatı karşılığı */}
          <div className="mt-12 grid grid-cols-3 gap-6 md:gap-10">
            {stats.map((st) => (
              <div key={st.l} className="border-t-2 pt-4" style={{ borderColor: brand.color }}>
                <div className={`${ctx.font} text-2xl font-extrabold leading-none tracking-tightest md:text-4xl`}>
                  {st.n}
                </div>
                <div className="mt-2.5 text-sm" style={{ color: s.muted }}>
                  {st.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Misyon & Vizyon — iki kart. */
export function MissionVision({
  ctx,
  eyebrow,
  title,
  items,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  items: { label: string; text: string }[];
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <SectionHeader eyebrow={eyebrow} title={title} eyebrowColor={ctx.brand.color} className="mb-12" />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((m, i) => (
          <div
            key={m.label}
            className="rounded-3xl p-8 md:p-10"
            style={i === 0 ? { background: "#2b2828", color: "#fff" } : { background: ctx.brand.color, color: ctx.brand.onColor }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">{m.label}</p>
            <p className={`mt-4 ${ctx.font} text-xl font-semibold leading-snug tracking-tightest md:text-2xl`}>
              {m.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

type BentoCopy = {
  eyebrow: string;
  title: string;
  description: string;
  production: { kicker: string; text: string };
  exportKicker: string;
  exportStat: string;
  exportText: string;
  valueKicker: string;
  valueText: string;
  oem: { kicker: string; text: string };
};

/** "STL Dünyası" bento ızgarası — büyük üretim görseli + istatistik + değer + OEM bandı. */
export function Bento({
  ctx,
  copy,
  productionImage,
  oemImage,
  productionAlt,
}: {
  ctx: BrandCtx;
  copy: BentoCopy;
  productionImage: string;
  oemImage: string;
  productionAlt: string;
}) {
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
      <SectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        eyebrowColor={brand.color}
        className="mb-10"
      />
      <div className="grid gap-4 md:auto-rows-[230px] md:grid-cols-3">
        <article className="group relative min-h-[260px] overflow-hidden rounded-2xl md:col-span-2 md:row-span-2">
          <img
            src={productionImage}
            alt={productionAlt}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              {copy.production.kicker}
            </span>
            <p className={`mt-2 max-w-md ${ctx.font} text-2xl font-bold tracking-tightest md:text-3xl`}>
              {copy.production.text}
            </p>
          </div>
        </article>

        <article
          className="flex flex-col justify-between rounded-2xl p-7"
          style={{ background: brand.color, color: brand.onColor }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">{copy.exportKicker}</span>
          <div>
            <div className="font-expanded text-5xl tracking-tightest">{copy.exportStat}</div>
            <p className="mt-1 opacity-85">{copy.exportText}</p>
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-2xl bg-[#2b2828] p-7 text-white">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">{copy.valueKicker}</span>
          <p className={`${ctx.font} text-lg font-semibold leading-snug tracking-tightest`}>{copy.valueText}</p>
        </article>

        <article className="group relative min-h-[220px] overflow-hidden rounded-2xl md:col-span-3">
          <img
            src={oemImage}
            alt={copy.oem.kicker}
            loading="lazy"
            className="absolute inset-0 size-full object-cover object-[center_38%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-8 text-white">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
              {copy.oem.kicker}
            </span>
            <p className={`mt-2 ${ctx.font} text-2xl font-bold tracking-tightest md:text-3xl`}>{copy.oem.text}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

/**
 * Markalar ızgarası — 4 marka kartı.
 * Marka küpü devreye girdiğinde reduced-motion ve dar ekran karşılığı olarak da kullanılır.
 */
export function BrandGrid({ ctx, id, eyebrow, title, description }: {
  ctx: BrandCtx;
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const { t, p } = useI18n();
  return (
    <section id={id} className="mx-auto max-w-[1400px] scroll-mt-[var(--nav-h)] px-5 py-24 md:px-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        eyebrowColor={ctx.brand.color}
        className="mb-12"
      />
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
                <span
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: onDark ? "#fff" : b.color }}
                >
                  {t.home.explore} <Arrow />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Satış kanalları — iki yönde akan logo/isim şeridi. */
export function MarqueeBand({
  ctx,
  kicker,
  title,
  note,
  items,
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  note?: string;
  items: string[];
}) {
  const s = toneStyles[ctx.tone];
  const mid = Math.ceil(items.length / 2);
  return (
    <section className="overflow-hidden border-t" style={{ background: "var(--surface)", borderColor: s.cardBorder }}>
      <div className="mx-auto max-w-[1400px] px-5 pt-24 text-center md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ctx.brand.color }}>
          {kicker}
        </p>
        <h2 className={`mx-auto mt-3 max-w-2xl ${ctx.font} text-2xl font-semibold leading-tight tracking-tightest md:text-3xl`}>
          {title}
        </h2>
      </div>

      <div className="marquee-mask mt-14 space-y-4">
        <MarqueeRow items={items.slice(0, mid)} direction="left" duration={38} ctx={ctx} />
        <MarqueeRow items={items.slice(mid)} direction="right" duration={44} ctx={ctx} />
      </div>

      {note && (
        <p className="mx-auto max-w-[1400px] px-5 pb-16 pt-10 text-center text-xs md:px-8" style={{ color: s.muted }}>
          {note}
        </p>
      )}
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  duration,
  ctx,
}: {
  items: string[];
  direction: "left" | "right";
  duration: number;
  ctx: BrandCtx;
}) {
  const s = toneStyles[ctx.tone];
  const loop = [...items, ...items];
  return (
    <div className="marquee-group">
      <div className="marquee gap-4" style={{ animation: `marquee-${direction} ${duration}s linear infinite` }}>
        {loop.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className={`flex h-16 shrink-0 items-center justify-center rounded-xl border px-10 ${ctx.font} text-base font-bold uppercase tracking-[0.1em] transition-colors`}
            style={{ background: s.card, borderColor: s.cardBorder, color: s.muted }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * İletişim bölümü — ayrı sayfa yok: başlık, iletişim bilgileri, form ve konum haritası
 * aynı sayfada. Form şimdilik mailto açar (Web3Forms endpoint'i eklenebilir).
 */
export function ContactSection({ ctx, id }: { ctx: BrandCtx; id?: string }) {
  const { t } = useI18n();
  const c = t.contact;
  const s = toneStyles[ctx.tone];

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [firm, setFirm] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${company.name} — ${name}${firm ? ` (${firm})` : ""}`;
    const body = `${message}\n\n—\n${name}\n${from}${firm ? `\n${firm}` : ""}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const fieldCls = "w-full border-b bg-transparent py-2.5 outline-none transition-colors focus:border-current";

  return (
    <section id={id} className="scroll-mt-[var(--nav-h)] border-t" style={{ borderColor: s.cardBorder }}>
      <div className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ctx.brand.color }}>
          {c.eyebrow}
        </p>
        <h2 className={`mt-4 ${ctx.font} text-4xl font-bold tracking-tightest md:text-6xl`}>{t.home.ctaButton}</h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: s.sub }}>
          {c.lead}
        </p>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-14 md:grid-cols-[1fr_0.9fr] md:px-8">
        <div className="flex flex-col justify-between gap-12">
          <div className="space-y-9">
            <div>
              <FieldLabel ctx={ctx} icon="phone" muted={s.muted}>
                {c.phoneLabel}
              </FieldLabel>
              <a
                href={company.phoneHref}
                className={`mt-2 block ${ctx.font} text-3xl font-bold tracking-tightest transition-colors md:text-5xl`}
                style={{ color: "inherit" }}
              >
                {company.phoneDisplay}
              </a>
            </div>
            <div>
              <FieldLabel ctx={ctx} icon="mail" muted={s.muted}>
                {c.emailLabel}
              </FieldLabel>
              <a
                href={`mailto:${company.email}`}
                className={`mt-2 block break-all ${ctx.font} text-2xl font-bold tracking-tightest md:text-4xl`}
              >
                {company.email}
              </a>
            </div>
            <div className="grid gap-9 sm:grid-cols-2">
              <div>
                <FieldLabel ctx={ctx} icon="map-pin" muted={s.muted}>
                  {c.addressLabel}
                </FieldLabel>
                <address className="mt-2 text-base not-italic leading-relaxed">
                  {company.addressLines.map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))}
                </address>
              </div>
              <div>
                <FieldLabel ctx={ctx} icon="clock" muted={s.muted}>
                  {c.hoursLabel}
                </FieldLabel>
                <p className="mt-2 text-base leading-relaxed">
                  {company.hours}
                  <br />
                  <span style={{ color: s.muted }}>{company.weekend}</span>
                </p>
              </div>
            </div>
          </div>

          <a
            href={company.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ borderColor: s.cardBorder }}
          >
            <Icon name="instagram" size={17} strokeWidth={ctx.iconWeight ?? 1.75} />
            Instagram
            <Icon name="arrow-up-right" size={15} strokeWidth={ctx.iconWeight ?? 1.75} />
          </a>
        </div>

        <form
          onSubmit={submit}
          className="rounded-3xl border p-7 md:p-9"
          style={{ background: "var(--surface)", borderColor: s.cardBorder }}
        >
          <h3 className={`${ctx.font} text-xl font-bold tracking-tightest`}>{c.formTitle}</h3>
          <div className="mt-6 space-y-5">
            <Field label={c.nameLabel} muted={s.muted}>
              <input
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldCls}
                style={{ borderColor: s.cardBorder }}
              />
            </Field>
            <Field label={c.emailFieldLabel} muted={s.muted}>
              <input
                required
                type="email"
                name="email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={fieldCls}
                style={{ borderColor: s.cardBorder }}
              />
            </Field>
            <Field label={c.companyLabel} muted={s.muted}>
              <input
                name="company"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
                className={fieldCls}
                style={{ borderColor: s.cardBorder }}
              />
            </Field>
            <Field label={c.messageLabel} muted={s.muted}>
              <textarea
                required
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${fieldCls} resize-none`}
                style={{ borderColor: s.cardBorder }}
              />
            </Field>
          </div>

          <label className="mt-6 flex items-start gap-3 text-sm" style={{ color: s.muted }}>
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
              style={{ accentColor: ctx.brand.color }}
            />
            <span>
              {c.kvkkText}{" "}
              <a href={company.kvkkUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {c.kvkkLink}
              </a>
            </span>
          </label>

          <button
            type="submit"
            className="mt-7 inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
          >
            {c.submit} <Icon name="send" size={17} strokeWidth={ctx.iconWeight ?? 1.75} />
          </button>
          <p className="mt-3 text-xs" style={{ color: s.muted }}>
            {c.submitNote}
          </p>
        </form>
      </div>

      {/* Fabrika konumu */}
      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
        <div className="overflow-hidden rounded-3xl border" style={{ borderColor: s.cardBorder }}>
          <iframe
            title={c.mapTitle}
            src={`https://www.google.com/maps?q=${encodeURIComponent(company.mapsQuery)}&output=embed`}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/** İletişim bilgisi etiketi: küçük ikon + majüskül etiket */
function FieldLabel({
  ctx,
  icon,
  muted,
  children,
}: {
  ctx: BrandCtx;
  icon: IconName;
  muted: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: muted }}>
      <Icon name={icon} size={15} strokeWidth={ctx.iconWeight ?? 1.75} />
      {children}
    </p>
  );
}

function Field({ label, muted, children }: { label: string; muted: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: muted }}>
        {label}
      </span>
      {children}
    </label>
  );
}
