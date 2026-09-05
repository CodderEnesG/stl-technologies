import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { BrandVisual, Product } from "../../data/brands";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";
import { LogoSlot } from "../LogoSlot";
import { SectionHeader } from "../SectionHeader";
import { Icon, type IconName } from "../Icon";
import { img } from "../../data/brands";

export type BrandTone = "dark" | "cream" | "light" | "pink" | "mono" | "stl";

export const toneStyles: Record<
  BrandTone,
  { bg: string; fg: string; sub: string; card: string; cardBorder: string; muted: string }
> = {
  // Oxyra: koyu zemin; mavi, kart ve konturlarda detay olarak yaşar
  dark: { bg: "#05060f", fg: "#ffffff", sub: "rgba(255,255,255,0.72)", card: "rgba(53,150,222,0.07)", cardBorder: "rgba(120,175,225,0.2)", muted: "rgba(255,255,255,0.55)" },
  cream: { bg: "#f9f7f4", fg: "#594439", sub: "#7a716d", card: "#ffffff", cardBorder: "#e7ded0", muted: "#7a716d" },
  light: { bg: "#f4fbfd", fg: "#0a3c47", sub: "#3d6d78", card: "#ffffff", cardBorder: "#d5eef3", muted: "#3d6d78" },
  pink: { bg: "#fff5f8", fg: "#231f20", sub: "#6b5b60", card: "#ffffff", cardBorder: "#ffdbe6", muted: "#6b5b60" },
  // wexta katalog dili: beyaz zemin, koyu tipografi, ince gri çizgiler
  mono: { bg: "#ffffff", fg: "#17181a", sub: "#5c6266", card: "#ffffff", cardBorder: "#e8eaeb", muted: "#8a9093" },
  // STL çatı kimliği: beyaz zemin, antrasit tipografi, kırmızı vurgu
  stl: { bg: "#ffffff", fg: "#2b2828", sub: "#767272", card: "#ffffff", cardBorder: "#e6e4e4", muted: "#767272" },
};

export type BrandCtx = {
  brand: BrandVisual;
  tone: BrandTone;
  /** Başlık fontu (tailwind sınıfı) */
  font: string;
  /** Gövde fontu — verilmezse site geneli (STL kimliği) kullanılır */
  bodyFont?: string;
  /**
   * İkon çizgi kalınlığı. Lucide stroke tabanlı olduğu için marka karakteri
   * buradan geliyor: Oxyra kalın, wexta ince katalog çizgisi, BNK narin.
   */
  iconWeight?: number;
};

/** "unsplash:<id>" kısayolunu gerçek URL'e çevirir */
export const resolveImg = (src: string, w = 900, h = 1100) =>
  src.startsWith("unsplash:") ? img(src.slice(9), w, h) : src;

export function BrandShell({ ctx, children }: { ctx: BrandCtx; children: React.ReactNode }) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <div className={`relative ${ctx.bodyFont ?? ""}`} style={{ background: s.bg, color: s.fg }}>
      {/* Hero'dan sonraki üst bölümlerde marka mavisi ışık katmanı */}
      {ctx.tone === "dark" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2200px]"
          style={{
            background: `radial-gradient(900px 620px at 18% 6%, ${brand.color}26, transparent 70%),
                         radial-gradient(760px 520px at 88% 26%, ${brand.color}1f, transparent 72%),
                         radial-gradient(1100px 700px at 45% 52%, ${brand.color}14, transparent 75%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Tam ekran görselli marka hero'su — görselin kendisi marka logosunu taşıyor.
 * Üzerine okunabilirlik için gradient perde, altına tagline.
 */
export function BrandHeroFull({
  ctx,
  tagline,
  background,
}: {
  ctx: BrandCtx;
  tagline: string;
  background: string;
}) {
  const { t } = useI18n();
  const { brand } = ctx;
  return (
    <section
      className="relative flex flex-col overflow-hidden md:h-[calc(100svh-var(--nav-h))] md:min-h-[560px] md:justify-end"
      style={{ background: toneStyles[ctx.tone].bg }}
    >
      {/*
       * Görselin kendisi marka logosunu taşıyor ve logo yatayda geniş yer kaplıyor.
       * Dar ekranda cover kırpması logoyu kestiği için görsel tam genişlikte akışta
       * durur; md ve üzerinde tam ekran arka plana geçer.
       */}
      <img
        src={background}
        alt={brand.name}
        fetchPriority="high"
        className="w-full md:absolute md:inset-0 md:size-full md:object-cover"
      />
      {/* Perde yalnızca en alt şeritte — görseldeki logonun beyazına dokunmaz */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 hidden h-[14%] md:block"
        style={{ background: "linear-gradient(to top, rgba(5,6,15,0.88), transparent)" }}
      />
      <div
        className="relative mx-auto w-full max-w-[1400px] px-5 py-8 md:px-8 md:pb-10 md:pt-0"
        style={{ textShadow: "0 2px 24px rgba(5,6,15,0.9)" }}
      >
        <h1 className={`max-w-xl ${ctx.font} text-xl font-black leading-[1.15] tracking-tightest text-white md:text-3xl`}>
          {tagline}
        </h1>
      </div>
    </section>
  );
}

export function BrandHero({
  ctx,
  tagline,
  scriptAccent,
  image,
  pattern,
}: {
  ctx: BrandCtx;
  tagline: string;
  scriptAccent?: string;
  /** brand.hero yerine kullanılacak fotoğraf (blend uygulanmaz) */
  image?: string;
  /** Marka pattern'i — kılavuz gereği düşük yoğunlukta, arka planda */
  pattern?: string;
}) {
  const { t } = useI18n();
  const { brand } = ctx;
  const onDark = brand.panelText === "#ffffff";
  return (
    <section className="relative overflow-hidden" style={{ background: brand.panelBg, color: brand.panelText }}>
      {pattern && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${pattern})`,
            backgroundSize: "760px",
            opacity: 0.22,
            maskImage: "linear-gradient(to bottom, #000, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 85%)",
          }}
        />
      )}
      <div className="relative mx-auto grid max-w-[1400px] gap-8 px-5 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
        <div>
          {scriptAccent && (
            <p className="font-script mb-3 text-2xl" style={{ color: brand.color }}>{scriptAccent}</p>
          )}
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] opacity-70">
            <span className="size-2 rounded-full" style={{ background: brand.color }} /> {t.brandPage.stlBrandBadge}
          </span>
          <h1 className="mt-6">
            <LogoSlot src={onDark ? brand.logoLight : brand.logoDark} label={brand.name} height={64} onDark={onDark} />
            <span className="sr-only">{brand.name}</span>
          </h1>
          <p className="mt-6 max-w-md text-xl font-medium md:text-2xl">{tagline}</p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl" style={{ background: "rgba(255,255,255,0.35)" }}>
          <img
            src={image ?? brand.hero}
            alt={brand.name}
            className="size-full object-cover"
            style={{ mixBlendMode: !image && brand.heroBlend ? "multiply" : undefined }}
          />
        </div>
      </div>
    </section>
  );
}

export function BrandIntro({
  ctx,
  kicker,
  title,
  body,
  stats,
  image,
  mark,
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  body: string;
  /** Verilmezse istatistik şeridi çizilmez */
  stats?: { n: string; l: string }[];
  /** Verilirse metnin yanında ürün görseli gösterilir (arkasında marka renginde hafif ışık) */
  image?: string;
  /**
   * Verilirse metnin yanında marka sembolü ışık halesiyle gösterilir —
   * Oxyra sayfasındaki "marka hakkında" düzeninin diğer markalardaki karşılığı.
   */
  mark?: string;
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;

  const heading = (
    <div>
      <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: brand.color }}>
        <span className="size-2 rounded-full" style={{ background: brand.color }} />
        {kicker}
      </p>
      <h2 className={`${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl`}>{title}</h2>
      <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: s.sub }}>{body}</p>
    </div>
  );

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      {mark ? (
        <div className="grid items-center gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-16">
          <div className="relative grid place-items-center py-6">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 blur-3xl"
              style={{ background: `radial-gradient(circle at 50% 50%, ${brand.color}55, transparent 68%)` }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: `radial-gradient(circle, ${brand.color}44, transparent 70%)` }}
            />
            <img src={mark} alt="" aria-hidden className="relative w-full max-w-[240px] object-contain" />
          </div>
          {heading}
        </div>
      ) : image ? (
        <div className="grid items-center gap-10 md:grid-cols-[1fr_0.85fr] md:gap-16">
          {heading}
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 blur-3xl"
              style={{ background: `radial-gradient(circle at 50% 55%, ${brand.color}44, transparent 65%)` }}
            />
            <img src={resolveImg(image, 900, 900)} alt="" aria-hidden className="w-full object-contain" />
          </div>
        </div>
      ) : (
        <div className="grid gap-x-16 gap-y-8 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: brand.color }}>
              <span className="size-2 rounded-full" style={{ background: brand.color }} />
              {kicker}
            </p>
            <h2 className={`${ctx.font} text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl`}>{title}</h2>
          </div>
          <div className="relative pl-6">
            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full" style={{ background: brand.color }} />
            <p className="text-lg leading-relaxed" style={{ color: s.sub }}>{body}</p>
          </div>
        </div>
      )}

      {stats && (
      <div className="mt-16 grid grid-cols-3 gap-6 md:gap-12">
        {stats.map((st) => (
          <div key={st.l} className="border-t-2 pt-5" style={{ borderColor: brand.color }}>
            <div className={`${ctx.font} text-3xl font-extrabold leading-none tracking-tightest md:text-5xl`}>{st.n}</div>
            <div className="mt-3 text-sm" style={{ color: toneStyles[ctx.tone].muted }}>{st.l}</div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}

/** Marka logosu (sembol) + marka hakkında metni — STL "Biz Kimiz" düzeninin marka karşılığı */
export function BrandAbout({
  ctx,
  mark,
  eyebrow,
  title,
  body,
}: {
  ctx: BrandCtx;
  mark: string;
  eyebrow: string;
  title: string;
  body: string[];
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="relative grid place-items-center py-8">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 blur-3xl"
            style={{ background: `radial-gradient(circle at 50% 50%, ${brand.color}66, transparent 68%)` }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: `radial-gradient(circle, ${brand.color}55, transparent 70%)` }}
          />
          <img src={mark} alt="" aria-hidden className="relative w-full max-w-[260px] object-contain" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: brand.color }}>
            {eyebrow}
          </p>
          <h2 className={`mt-4 ${ctx.font} text-3xl font-bold leading-[1.08] tracking-tightest md:text-4xl`}>
            {title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed" style={{ color: s.sub }}>
            {body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Oxyra: kısa teknik vurgu bandı */
export function SpecBand({ ctx, specs, icons }: { ctx: BrandCtx; specs: { k: string; v: string }[]; icons?: IconName[] }) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-20 md:px-8">
      <div className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: s.cardBorder, background: s.cardBorder }}>
        {specs.map((sp, i) => (
          <div key={sp.k} className="relative overflow-hidden p-6" style={{ background: s.card }}>
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(to right, ${brand.color}, transparent)` }}
            />
            {icons?.[i] && (
              <Icon name={icons[i]} size={26} strokeWidth={ctx.iconWeight ?? 1.75} className="mb-4" style={{ color: brand.color }} />
            )}
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: brand.color }}>{sp.k}</div>
            <div className={`mt-2 ${ctx.font} font-bold tracking-tightest`}>{sp.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ValueProps({ ctx, items, icons }: { ctx: BrandCtx; items: { title: string; text: string }[]; icons?: IconName[] }) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((v, i) => (
          <div
            key={v.title}
            className="group rounded-2xl border p-7 transition-transform hover:-translate-y-1 md:p-8"
            style={{ background: s.card, borderColor: s.cardBorder }}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full" style={{ background: brand.color, color: brand.onColor }}>
                {icons?.[i] ? (
                  <Icon name={icons[i]} size={21} strokeWidth={ctx.iconWeight ?? 1.75} />
                ) : (
                  <span className="text-sm font-extrabold">{i + 1}</span>
                )}
              </span>
              <span className="h-px flex-1" style={{ background: s.cardBorder }} />
            </div>
            <h3 className={`mt-5 ${ctx.font} text-xl font-bold tracking-tightest`}>{v.title}</h3>
            <p className="mt-2 leading-relaxed" style={{ color: s.sub }}>{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryGrid({
  ctx,
  label,
  categories,
  round,
  href,
}: {
  ctx: BrandCtx;
  label: string;
  categories: { label: string; image: string }[];
  round?: boolean;
  href?: string;
}) {
  const { t } = useI18n();
  const onDark = ctx.tone === "dark";
  const colMap: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };
  const cols = round
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
    : `grid-cols-2 ${colMap[Math.min(categories.length, 4)] ?? "lg:grid-cols-4"}`;
  const Wrapper = href ? "a" : "div";
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <SectionHeader eyebrow={label} title={t.brandPage.categoriesTitle} onDark={onDark} eyebrowColor={ctx.brand.color} className="mb-10" />
      <div className={`grid gap-5 ${cols}`}>
        {categories.map((c) => (
          <Wrapper
            key={c.label}
            {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
            className="group text-center"
          >
            <div
              className={`overflow-hidden ${round ? "mx-auto aspect-square rounded-full" : "aspect-[4/5] rounded-2xl"}`}
              style={{ background: "rgba(127,127,127,0.08)" }}
            >
              <img
                src={resolveImg(c.image, 500, round ? 500 : 640)}
                alt={c.label}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-semibold">{c.label}</h3>
          </Wrapper>
        ))}
      </div>
    </section>
  );
}

/** Fressi: kategori renk sistemi (marka kılavuzu) */
export function FressiCategoryGrid({
  ctx,
  label,
  categories,
}: {
  ctx: BrandCtx;
  label: string;
  categories: { key: string; label: string; color: string; image: string; href: string; icon?: IconName }[];
}) {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <SectionHeader eyebrow={label} title={t.brandPage.categoriesTitle} eyebrowColor={ctx.brand.color} className="mb-10" />
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {categories.map((c) => (
          <a key={c.key} href={c.href} target="_blank" rel="noreferrer" className="group text-center">
            <div
              className="mx-auto aspect-square overflow-hidden rounded-full p-2 transition-transform duration-500 group-hover:-translate-y-1"
              style={{ background: c.color }}
            >
              <div className="size-full overflow-hidden rounded-full">
                <img src={c.image} alt={c.label} loading="lazy" className="size-full object-cover" />
              </div>
            </div>
            <h3 className="mt-4 flex items-center justify-center gap-2 font-semibold">
              {c.icon ? (
                <Icon name={c.icon} size={17} strokeWidth={ctx.iconWeight ?? 1.75} style={{ color: c.color }} />
              ) : (
                <span className="size-2 rounded-full" style={{ background: c.color }} />
              )}
              <span className="font-nunito">fressi</span>
              <span className="font-script text-sm" style={{ color: c.color }}>{c.label}</span>
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * Birleşik ürün gamı şeridi: kategori + öne çıkan ürün tek kartta.
 * Kartlarda ince kontur, hover'da marka rengine döner; ürün arkasında hafif ışık.
 */
export function ProductRange({
  ctx,
  eyebrow,
  title,
  description,
  items,
  href,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  description: string;
  items: { label: string; text: string; image: string }[];
  href: string;
}) {
  const { t } = useI18n();
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  const onDark = ctx.tone === "dark";

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        onDark={onDark}
        eyebrowColor={brand.color}
        titleFont={ctx.font}
        className="mb-12"
      />
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((it) => (
          <a
            key={it.label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="brand-card group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{
              background: s.card,
              borderColor: s.cardBorder,
              ["--card-accent" as string]: brand.color,
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at 50% 60%, ${brand.color}33, transparent 62%)` }}
              />
              <img
                src={resolveImg(it.image, 800, 600)}
                alt={it.label}
                loading="lazy"
                className="relative size-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className={`${ctx.font} text-lg font-bold tracking-tightest`}>{it.label}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: s.sub }}>{it.text}</p>
              <span
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-transform group-hover:translate-x-1"
                style={{ color: brand.color }}
              >
                {t.home.explore} <Arrow />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function ProductVitrine({ ctx, title, products }: { ctx: BrandCtx; title: string; products: Product[] }) {
  const { t } = useI18n();
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
      <div className="mb-10 flex items-end justify-between">
        <h2 className={`${ctx.font} text-3xl font-bold tracking-tightest md:text-4xl`}>{title}</h2>
        <span className="text-sm" style={{ color: s.muted }}>{t.brandPage.productsCount(products.length)}</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const Card = p.href ? "a" : "div";
          return (
            <Card
              key={p.name}
              {...(p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : {})}
              className="group overflow-hidden rounded-2xl border transition-transform hover:-translate-y-1"
              style={{ background: s.card, borderColor: s.cardBorder }}
            >
              <div className="aspect-[4/5] overflow-hidden" style={{ background: p.blend ? "#ffffff" : "rgba(127,127,127,0.08)" }}>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="size-full transition-transform duration-700 group-hover:scale-105"
                  style={{ objectFit: p.blend ? "contain" : "cover" }}
                />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: brand.color }}>{p.category}</span>
                  <h3 className="mt-1 font-semibold">{p.name}</h3>
                  {p.colors && (
                    <span className="mt-2 flex gap-1.5">
                      {p.colors.map((cc) => (
                        <span key={cc} className="size-3 rounded-full border border-black/10" style={{ background: cc }} />
                      ))}
                    </span>
                  )}
                </div>
                {p.href && (
                  <span className="opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100"><Arrow /></span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

/** wexta: üretim hikâyesi (fabrika/OEM anlatısı) */
export function ManufacturingStory({
  ctx,
  kicker,
  title,
  body,
  points,
  image,
  icons,
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  image: string;
  icons?: IconName[];
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto grid max-w-[1400px] items-stretch gap-6 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-8">
      <div className="flex flex-col justify-center rounded-3xl p-8 md:p-12" style={{ background: brand.color, color: brand.onColor }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] opacity-80">{kicker}</p>
        <h2 className={`mt-4 ${ctx.font} text-3xl font-bold leading-[1.08] tracking-tightest md:text-4xl`}>{title}</h2>
        <p className="mt-4 max-w-md text-lg leading-relaxed opacity-90">{body}</p>
        <ul className="mt-8 space-y-3">
          {points.map((pt, i) => (
            <li key={pt} className="flex items-center gap-3 font-medium">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/20">
                <Icon name={icons?.[i] ?? "check"} size={15} strokeWidth={ctx.iconWeight ?? 1.75} />
              </span>
              {pt}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative min-h-[320px] overflow-hidden rounded-3xl" style={{ background: s.card }}>
        <img src={resolveImg(image, 1100, 900)} alt={title} loading="lazy" className="absolute inset-0 size-full object-cover" />
      </div>
    </section>
  );
}

export function Editorial({
  ctx,
  image,
  title,
  text,
  blend,
  ratio,
}: {
  ctx: BrandCtx;
  image: string;
  title: string;
  text: string;
  blend?: boolean;
  /**
   * Görsel oranı (tailwind aspect sınıfı). Verilmezse masaüstünde görsel
   * metin sütununun boyuna uzar — kısa metinlerde fotoğrafı kırpar.
   */
  ratio?: string;
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto grid max-w-[1400px] items-stretch gap-6 px-5 pb-24 md:grid-cols-2 md:px-8">
      <div
        className={`relative overflow-hidden rounded-2xl ${ratio ?? "aspect-[4/3] md:aspect-auto"}`}
        style={{ background: blend ? "#ffffff" : "rgba(127,127,127,0.08)" }}
      >
        <img
          src={resolveImg(image, 1000, 800)}
          alt={title}
          loading="lazy"
          className="absolute inset-0 size-full"
          style={{ objectFit: blend ? "contain" : "cover" }}
        />
      </div>
      <div className="flex flex-col justify-center py-6">
        <span className="mb-3 h-px w-12" style={{ background: brand.color }} />
        <h2 className={`${ctx.font} text-3xl font-bold leading-[1.1] tracking-tightest md:text-4xl`}>{title}</h2>
        <p className="mt-4 max-w-md text-lg leading-relaxed" style={{ color: s.sub }}>{text}</p>
      </div>
    </section>
  );
}

export function PullQuote({
  ctx,
  text,
  source,
  bg,
  fg,
  pattern,
  image,
}: {
  ctx: BrandCtx;
  text: string;
  source: string;
  bg?: string;
  fg?: string;
  /** Marka pattern'i — renkli zeminin üstünde çok düşük yoğunlukta doku */
  pattern?: string;
  /** Marka gradyanı gibi tam kapsayan arka plan görseli */
  image?: string;
}) {
  const { brand } = ctx;
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: image ? undefined : (bg ?? brand.color), color: fg ?? brand.onColor }}
    >
      {image && (
        <>
          <img src={image} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full object-cover" />
          <span aria-hidden className="absolute inset-0 bg-black/10" />
        </>
      )}
      {pattern && <PatternLayer src={pattern} opacity={0.12} size={520} fade="both" />}
      <div className="relative mx-auto max-w-[1000px] px-5 py-24 text-center md:px-8">
        <p
          className={`${ctx.font} text-2xl font-bold leading-[1.25] tracking-tightest md:text-4xl`}
          style={{ textShadow: image ? "0 2px 26px rgba(0,0,0,0.35)" : undefined }}
        >
          “{text}”
        </p>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-80">{source}</p>
      </div>
    </section>
  );
}

/**
 * wexta katalog bandı: siyah şerit üzerinde "TRAVEL — logo — LUGGAGES"
 * (katalogdaki sayfa başı bantlarının birebir web karşılığı)
 */
export function CatalogRibbon({ left, right, logo }: { left: string; right: string; logo: string }) {
  return (
    <section className="bg-[#17181a] text-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] opacity-80">{left}</span>
        <img src={logo} alt="wexta" className="h-5 w-auto object-contain md:h-6" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] opacity-80">{right}</span>
      </div>
    </section>
  );
}

export function ImageBand({ images, blend }: { images: string[]; blend?: boolean[] }) {
  return (
    <section className="grid grid-cols-2 gap-1 md:grid-cols-4">
      {images.map((src, i) => (
        <div key={i} className="aspect-square overflow-hidden md:aspect-[3/4]" style={{ background: blend?.[i] ? "#ffffff" : "rgba(127,127,127,0.08)" }}>
          <img
            src={resolveImg(src, 700, 900)}
            alt=""
            aria-hidden
            loading="lazy"
            className="size-full transition-transform duration-700 hover:scale-105"
            style={{ objectFit: blend?.[i] ? "contain" : "cover" }}
          />
        </div>
      ))}
    </section>
  );
}

export function BrandCTA({
  ctx,
  title,
  channel,
  note,
  pattern,
  image,
  quoted,
  quoteSource,
}: {
  ctx: BrandCtx;
  title: string;
  channel: string;
  note?: string;
  pattern?: string;
  /** Marka gradyanı gibi tam kapsayan arka plan görseli — metin ortalanır, beyaza döner */
  image?: string;
  /** Başlığı marka söylemi alıntısı gibi dizer: tırnak içinde, versal değil */
  quoted?: boolean;
  /** Alıntının altındaki kaynak satırı — verilmezse satır çıkmaz */
  quoteSource?: string;
}) {
  const { t, s: sec } = useI18n();
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: image ? undefined : s.bg, color: image ? "#ffffff" : s.fg }}
    >
      {image && (
        <>
          <img src={image} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full object-cover" />
          <span aria-hidden className="absolute inset-0 bg-black/10" />
        </>
      )}
      {pattern && <PatternLayer src={pattern} opacity={0.2} fade="top" />}
      <div
        className={`relative mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-24 md:px-8 ${
          image ? "items-center text-center" : "items-start md:flex-row md:items-center md:justify-between"
        }`}
      >
        <div className={quoted ? "max-w-3xl" : "max-w-2xl"}>
          <h2
            className={`${ctx.font} font-bold tracking-tightest ${
              quoted
                ? "text-2xl leading-[1.25] md:text-4xl"
                : "text-4xl font-black uppercase leading-[0.95] md:text-6xl"
            }`}
            style={{ textShadow: image ? "0 2px 26px rgba(0,0,0,0.35)" : undefined }}
          >
            {quoted ? `“${title}”` : title}
          </h2>
          {quoteSource && (
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-80">{quoteSource}</p>
          )}
        </div>
        <div className={`flex flex-col gap-3 ${image ? "items-center" : ""}`}>
          {brand.channelHref ? (
            <a
              href={brand.channelHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: brand.color, color: brand.onColor }}
            >
              {channel} <Arrow />
            </a>
          ) : (
            <Link
              to={sec("contact")}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: brand.color, color: brand.onColor }}
            >
              {t.nav.contact} <Arrow />
            </Link>
          )}
          {note && <p className="max-w-[26ch] text-sm" style={{ color: image ? "rgba(255,255,255,0.85)" : s.muted }}>{note}</p>}
          <Link
            to={sec("contact")}
            className="text-sm font-medium underline underline-offset-4"
            style={{ color: image ? "rgba(255,255,255,0.9)" : s.muted }}
          >
            {t.brandPage.orContact}
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Tek ürüne odaklanan bölüm: solda modelin kendi teknik değerleri, sağda
 * ürün görselleri kayan galeri.
 *
 * Marka geneli iddialar SpecBand'de; buradaki sayılar sadece bu modele ait.
 * Yeni bir model eklenirken kendi `spotlight` içeriğiyle tekrar kullanılır.
 */
export function ProductSpotlight({
  ctx,
  kicker,
  title,
  text,
  specs,
  images,
  alts,
  href,
  cta,
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  text: string;
  specs: { k: string; v: string }[];
  images: string[];
  alts: string[];
  href?: string;
  cta?: string;
}) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    const next = (i + images.length) % images.length;
    setIndex(next);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[next] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-24 md:px-8">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-14">
        <div>
          <p
            className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: brand.color }}
          >
            <span className="size-2 rounded-full" style={{ background: brand.color }} />
            {kicker}
          </p>
          <h2 className={`${ctx.font} text-3xl font-bold leading-[1.08] tracking-tightest md:text-4xl`}>{title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: s.sub }}>
            {text}
          </p>

          <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6">
            {specs.map((sp) => (
              <div key={sp.k} className="border-t pt-3" style={{ borderColor: s.cardBorder }}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: s.muted }}>
                  {sp.k}
                </dt>
                <dd className={`mt-1.5 ${ctx.font} text-xl font-bold tracking-tightest`}>{sp.v}</dd>
              </div>
            ))}
          </dl>

          {href && cta && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: brand.color, color: brand.onColor }}
            >
              {cta} <Arrow />
            </a>
          )}
        </div>

        {/* Kayan galeri — yatay scroll-snap; oklar ve noktalar kontrol eder */}
        <div className="relative min-w-0">
          <div
            ref={trackRef}
            className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          >
            {images.map((src, i) => (
              <figure
                key={src}
                /* Kaynak görseller 1200x1800 (2:3). Kart oranı buna eşit ve object-contain:
                   infografiklerin kenarındaki yazılar kırpılmıyor, boşluk da kalmıyor. */
                className="relative aspect-[2/3] w-[72%] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[46%] md:w-[38%]"
                style={{ background: "#ffffff", border: `1px solid ${s.cardBorder}` }}
              >
                <img
                  src={src}
                  alt={alts[i] ?? ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="size-full object-contain"
                />
              </figure>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex gap-2">
              {[["‹", index - 1], ["›", index + 1]].map(([glyph, target]) => (
                <button
                  key={glyph as string}
                  type="button"
                  onClick={() => go(target as number)}
                  aria-label={glyph === "‹" ? "Önceki" : "Sonraki"}
                  className="grid size-10 place-items-center rounded-full border text-lg transition-colors"
                  style={{ borderColor: s.cardBorder, color: s.sub }}
                >
                  {glyph as string}
                </button>
              ))}
            </div>
            <div className="flex flex-1 gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className="h-[3px] flex-1 rounded-full transition-colors"
                  style={{ background: i === index ? brand.color : s.cardBorder }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Mağaza dili bölümleri — markanın kendi e-ticaret sitesindeki gramerin
 * karşılığı: yatay banner slaytı, kategori barı, daire kategori rayı,
 * yorum slider'ı ve marka dünyası galerisi. Fressi ve BNK ortak kullanıyor.
 * ------------------------------------------------------------------------- */

/** Marka pattern'ini bölüm zeminine döşer — kılavuz gereği düşük yoğunlukta. */
export function PatternLayer({
  src,
  size = 620,
  opacity = 0.16,
  fade = "bottom",
}: {
  src: string;
  size?: number;
  opacity?: number;
  /** Kenarlarda pattern'in eridiği yön */
  fade?: "bottom" | "top" | "both" | "none";
}) {
  const mask =
    fade === "none"
      ? undefined
      : fade === "both"
        ? "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)"
        : fade === "top"
          ? "linear-gradient(to bottom, transparent, #000 30%)"
          : "linear-gradient(to bottom, #000 45%, transparent)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${size}px`,
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Dolu yıldız — Lucide stroke setinden farklı olarak puanlamada dolgu okunuyor. */
function Stars({ value, size = 15, color }: { value: number; size?: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"
            fill={i <= Math.round(value) ? color : "transparent"}
            stroke={color}
            strokeWidth="1.4"
            strokeLinejoin="round"
            opacity={i <= Math.round(value) ? 1 : 0.35}
          />
        </svg>
      ))}
    </span>
  );
}

export type HeroSlide = {
  image: string;
  /** Görselin üstüne binen başlık — banner metni görselde gömülüyse boş bırakılır */
  title?: string;
  sub?: string;
  cta: string;
  href: string;
  /** Masaüstünde metin bloğunun yatay konumu */
  align?: "left" | "center";
  /** Masaüstünde metin bloğunun dikey konumu — ürünlerin üstüne düşmesin diye */
  valign?: "top" | "center" | "bottom";
  /** Görselin üzerindeki metin beyaz mı */
  onDark?: boolean;
  /** Mobilde kırpma odağı */
  focus?: string;
};

/**
 * fressihome.com anasayfasındaki hero slaytının karşılığı: tam genişlikte yatay
 * banner + üstünde marka metni. Banner'lardaki kampanya yazıları görselden
 * temizlendi; metin artık HTML katmanında, yani dil değişince o da değişiyor.
 */
export function BrandHeroSlideshow({
  ctx,
  slides,
  pattern,
  logo,
  prevLabel,
  nextLabel,
}: {
  ctx: BrandCtx;
  slides: HeroSlide[];
  pattern?: string;
  /** Slaytın üstünde duran marka lockup'ı (ilk slayt) */
  logo?: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const s = toneStyles[ctx.tone];
  const n = slides.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % n), 6500);
    return () => window.clearInterval(id);
  }, [paused, n]);

  const active = slides[i];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: s.bg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {pattern && <PatternLayer src={pattern} opacity={0.2} fade="both" />}
      <div className="relative mx-auto max-w-[1600px]">
        <div
          className="relative aspect-[16/11] w-full overflow-hidden md:aspect-[2000/854]"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {slides.map((sl, idx) => (
            <img
              key={sl.image}
              src={sl.image}
              alt=""
              aria-hidden={idx !== i}
              loading={idx === 0 ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : undefined}
              className="absolute inset-0 size-full object-cover transition-opacity duration-700"
              style={{ objectPosition: sl.focus ?? "50% 50%", opacity: idx === i ? 1 : 0 }}
            />
          ))}

          {/* Masaüstü metin katmanı — mobilde metin görselin altına iniyor */}
          <div className="absolute inset-0 hidden md:block">
            {slides.map((sl, idx) => (
              <div
                key={sl.image}
                className={`absolute inset-0 flex px-[6%] transition-opacity duration-700 ${
                  sl.valign === "top"
                    ? "items-start pt-[6%]"
                    : sl.valign === "bottom"
                      ? "items-end pb-[7%]"
                      : "items-center"
                } ${sl.align === "center" ? "justify-center text-center" : "justify-start"}`}
                style={{ opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? "auto" : "none" }}
              >
                <div
                  className={sl.align === "center" ? "max-w-2xl" : "max-w-md"}
                  style={{
                    color: sl.onDark ? "#ffffff" : ctx.brand.panelText,
                    textShadow: sl.onDark ? "0 2px 24px rgba(0,0,0,0.35)" : undefined,
                  }}
                >
                  {logo && idx === 0 && sl.title && (
                    <img src={ctx.brand.logoDark} alt="" aria-hidden className="mb-6 h-9 w-auto object-contain object-left" />
                  )}
                  {sl.title && (
                    <h1 className={`${ctx.font} text-3xl font-bold leading-[1.1] tracking-tightest lg:text-[2.9rem]`}>
                      {sl.title}
                    </h1>
                  )}
                  {sl.sub && <p className="mt-3 text-base opacity-85 lg:text-lg">{sl.sub}</p>}
                  <a
                    href={sl.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 ${
                      sl.title || sl.sub ? "mt-7" : ""
                    }`}
                    style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
                  >
                    {sl.cta}
                    <Arrow />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {n > 1 && (
            <>
              <button
                type="button"
                aria-label={prevLabel}
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/75 text-[#594439] backdrop-blur transition hover:bg-white md:grid"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/75 text-[#594439] backdrop-blur transition hover:bg-white md:grid"
              >
                <Chevron dir="right" />
              </button>
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {slides.map((sl, idx) => (
                  <button
                    key={sl.image}
                    type="button"
                    aria-label={`${idx + 1}`}
                    aria-current={idx === i}
                    onClick={() => setI(idx)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: idx === i ? 22 : 8,
                      background: idx === i ? ctx.brand.color : "rgba(89,68,57,0.3)",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mobil metin bloğu */}
        <div className="px-5 pb-10 pt-7 text-center md:hidden">
          {active.title && (
            <h1 className={`${ctx.font} text-2xl font-bold leading-tight tracking-tightest`}>{active.title}</h1>
          )}
          {active.sub && <p className="mt-2 text-sm" style={{ color: s.sub }}>{active.sub}</p>}
          <a
            href={active.href}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
          >
            {active.cta}
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Kategori barı — mağazadaki üst menünün karşılığı: dört kategori, ince
 * çizgiler arasında, doğrudan fressihome.com koleksiyonlarına gider.
 */
export function BrandCategoryBar({
  ctx,
  categories,
  allLabel,
  links,
}: {
  ctx: BrandCtx;
  categories: {
    key: string;
    label: string;
    color: string;
    href: string;
    icon?: IconName;
    /** Hover panelindeki alt kırılımlar — verilmezse panel açılmaz */
    sub?: { label: string; href: string }[];
    /** Hover panelinde konturlu daire içindeki ürün karesi */
    image?: string;
    /** Panel başlığı — kategorinin tek cümlelik vaadi */
    tagline?: string;
  }[];
  /** Hover panelindeki "tüm ürünler" butonu */
  allLabel?: string;
  /** Kategorilerden sonra gelen sayfa içi bağlantılar (çok satanlar, blog…) */
  links?: { label: string; href: string }[];
}) {
  const s = toneStyles[ctx.tone];
  const [open, setOpen] = useState<string | null>(null);
  const active = categories.find((c) => c.key === open && c.sub?.length);

  return (
    <div className="relative" onMouseLeave={() => setOpen(null)}>
      <nav className="relative border-y" style={{ borderColor: s.cardBorder, background: s.card }} aria-label={ctx.brand.name}>
        <div className="mx-auto flex max-w-[1400px] items-stretch overflow-x-auto px-2 md:px-8">
          {categories.map((c) => (
            <a
              key={c.key}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setOpen(c.key)}
              onFocus={() => setOpen(c.key)}
              className="group relative flex flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors"
              style={{ color: open === c.key ? c.color : s.fg }}
            >
              {c.icon && <Icon name={c.icon} size={16} strokeWidth={ctx.iconWeight ?? 1.7} style={{ color: c.color }} />}
              {c.label}
              <span
                className="absolute inset-x-4 bottom-0 h-[2px] origin-center rounded-full transition-transform duration-300"
                style={{ background: c.color, transform: open === c.key ? "scaleX(1)" : "scaleX(0)" }}
              />
            </a>
          ))}
          {links?.length ? (
            <div className="ml-auto hidden items-stretch border-l pl-2 md:flex" style={{ borderColor: s.cardBorder }}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onMouseEnter={() => setOpen(null)}
                  className="relative flex items-center whitespace-nowrap px-5 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors hover:opacity-70"
                  style={{ color: s.sub }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </nav>

      {/* Hover paneli — alt kırılımlar ve kategori kadrajı */}
      {active && (
        <div
          className="absolute inset-x-0 top-full z-30 hidden border-b shadow-[0_24px_40px_-28px_rgba(0,0,0,0.35)] md:block"
          style={{ background: s.card, borderColor: s.cardBorder }}
        >
          <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center gap-12 px-8 py-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: active.color }}>
                {active.label}
              </p>
              {active.tagline && (
                <p className={`${ctx.font} mt-2 text-2xl font-bold leading-tight tracking-tight`} style={{ color: s.fg }}>
                  {active.tagline}
                </p>
              )}
              <ul className="mt-5 grid max-w-md gap-x-10 gap-y-1.5 sm:grid-cols-2">
                {active.sub?.map((x) => (
                  <li key={x.label}>
                    <a
                      href={x.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-2 py-1 text-[15px] transition-colors"
                      style={{ color: s.sub }}
                    >
                      <span className="h-px w-0 transition-all duration-300 group-hover/link:w-4" style={{ background: active.color }} />
                      {x.label}
                    </a>
                  </li>
                ))}
              </ul>
              {allLabel && (
                <a
                  href={active.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                  style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
                >
                  {allLabel}
                  <Icon name="arrow-up-right" size={14} strokeWidth={2} />
                </a>
              )}
            </div>
            {active.image && (
              <div className="relative pr-6">
                {/* Konturlu daire içinde ürün — model karesi yok (müşteri notu) */}
                <span
                  className="grid size-[220px] place-items-center rounded-full border-2 bg-white shadow-[0_24px_40px_-24px_rgba(0,0,0,0.3)]"
                  style={{ borderColor: active.color }}
                >
                  <img src={active.image} alt="" aria-hidden className="size-[84%] rounded-full object-cover" />
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Daire ürün rayı — mağazadaki dairesel kategori karuselinin birebir karşılığı.
 * Kaydırmalı ray; oklar ve sayfa noktaları scroll konumundan türetiliyor.
 */
export function CircleRail({
  ctx,
  eyebrow,
  title,
  items,
  pattern,
  prevLabel,
  nextLabel,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  items: { label: string; image: string; href: string }[];
  pattern?: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const sync = () => {
    const el = rail.current;
    if (!el) return;
    setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const scrollTo = (p: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-24">
      {pattern && <PatternLayer src={pattern} opacity={0.13} fade="both" />}
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionHeader eyebrow={eyebrow} title={title} eyebrowColor={ctx.brand.color} titleFont={ctx.font} />
          {pages > 1 && (
            <div className="hidden shrink-0 gap-2 md:flex">
              <button
                type="button"
                aria-label={prevLabel}
                onClick={() => scrollTo(Math.max(0, page - 1))}
                className="grid size-10 place-items-center rounded-full border transition hover:-translate-y-0.5"
                style={{ borderColor: toneStyles[ctx.tone].cardBorder, color: toneStyles[ctx.tone].fg }}
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => scrollTo(Math.min(pages - 1, page + 1))}
                className="grid size-10 place-items-center rounded-full border transition hover:-translate-y-0.5"
                style={{ borderColor: toneStyles[ctx.tone].cardBorder, color: toneStyles[ctx.tone].fg }}
              >
                <Chevron dir="right" />
              </button>
            </div>
          )}
        </div>

        <div
          ref={rail}
          onScroll={sync}
          className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 md:gap-8"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              target="_blank"
              rel="noreferrer"
              className="group w-[46%] shrink-0 snap-start text-center sm:w-[31%] lg:w-[23%]"
            >
              <div className="relative aspect-square overflow-hidden rounded-full">
                <img
                  src={it.image}
                  alt={it.label}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-0 ring-2 ring-inset transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: ctx.brand.color }}
                />
              </div>
              <h3 className="mt-4 text-sm font-semibold md:text-base">{it.label}</h3>
            </a>
          ))}
        </div>

        {pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, p) => (
              <button
                key={p}
                type="button"
                aria-label={`${p + 1}`}
                aria-current={p === page}
                onClick={() => scrollTo(p)}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: p === page ? 22 : 8, background: p === page ? ctx.brand.color : "rgba(89,68,57,0.25)" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Müşteri yorumları — fressihome.com'daki Entrfy yorum karuselinin birebir
 * karşılığı: beyaz kart, sağ üstte tırnak, amber yıldızlar, 5 satır kırpılmış
 * gövde, baş harfli avatar ve yeşil "doğrulanmış" rozeti. Veri canlı API'den
 * gelir; erişilemezse statik anlık görüntüye düşer (bkz. data/fressiReviews.ts).
 */
export function ReviewSlider({
  ctx,
  eyebrow,
  title,
  reviews,
  verifiedLabel,
  allLabel,
  allHref,
  prevLabel,
  nextLabel,
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  reviews: { rating: number; title?: string; body: string; author: string; product: string; verified: boolean }[];
  verifiedLabel: string;
  allLabel: string;
  allHref: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const sync = () => {
    const el = rail.current;
    if (!el) return;
    setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [reviews.length]);
  const scrollTo = (p: number) => {
    const el = rail.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
  };

  const initials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toLocaleUpperCase("tr-TR") ?? "")
      .join("");

  const navBtn = (dir: "left" | "right") => (
    <button
      type="button"
      aria-label={dir === "left" ? prevLabel : nextLabel}
      disabled={dir === "left" ? page === 0 : page >= pages - 1}
      onClick={() => scrollTo(dir === "left" ? Math.max(0, page - 1) : Math.min(pages - 1, page + 1))}
      className={`absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white text-[#17181a] shadow-[0_4px_14px_rgba(0,0,0,0.14)] transition hover:scale-105 disabled:pointer-events-none disabled:opacity-30 md:grid ${
        dir === "left" ? "-left-5" : "-right-5"
      }`}
    >
      <Chevron dir={dir} />
    </button>
  );

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
      <SectionHeader eyebrow={eyebrow} title={title} eyebrowColor={ctx.brand.color} titleFont={ctx.font} className="mb-12" />

      <div className="relative">
        {pages > 1 && navBtn("left")}
        {pages > 1 && navBtn("right")}
        <div
          ref={rail}
          onScroll={sync}
          className="hide-scrollbar flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-2"
        >
          {reviews.map((r, i) => (
            <article
              key={`${r.author}-${i}`}
              className="relative flex w-[86%] shrink-0 snap-start flex-col rounded-xl border bg-white p-6 sm:w-[48.5%] lg:w-[32%]"
              style={{ borderColor: "#e5e7eb", color: "#17181a" }}
            >
              <span
                aria-hidden
                className="absolute right-5 top-2 select-none font-serif text-[64px] leading-none"
                style={{ color: "#d1d5db" }}
              >
                “
              </span>
              <Stars value={r.rating} color="#f5a524" size={15} />
              {r.title && <h3 className="mt-3 text-[15px] font-bold">{r.title}</h3>}
              <p
                className="mt-1.5 text-[14px] leading-[1.6]"
                style={{
                  color: "#374151",
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={r.body}
              >
                {r.body}
              </p>
              <footer className="mt-auto flex items-center gap-3 pt-6">
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full text-[11.5px] font-semibold"
                  style={{ background: "#f3f4f6", color: "#374151" }}
                >
                  {initials(r.author)}
                </span>
                <span className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="truncate text-[14px] font-bold">{r.author}</span>
                  {r.verified && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11.5px] font-medium"
                      style={{ background: "#f0fdf4", borderColor: "#86efac", color: "#15803d" }}
                    >
                      <Icon name="check" size={11} strokeWidth={2.4} />
                      {verifiedLabel}
                    </span>
                  )}
                </span>
              </footer>
              <p className="mt-2 truncate pl-11 text-[12px]" style={{ color: "#9ca3af" }} title={r.product}>
                {r.product}
              </p>
            </article>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, p) => (
            <button
              key={p}
              type="button"
              aria-label={`${p + 1}`}
              aria-current={p === page}
              onClick={() => scrollTo(p)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: p === page ? 22 : 8, background: p === page ? ctx.brand.color : "rgba(89,68,57,0.25)" }}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <a
          href={allHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: ctx.brand.color }}
        >
          {allLabel}
          <Arrow />
        </a>
      </div>
    </section>
  );
}

/**
 * Fressi "hakkında" bölümü — jenerik başlık + üç kutu düzeni yerine dergi
 * sayfası kurgusu: pattern zemin, kadrajdan taşan fotoğraf, el yazısı vurgu ve
 * metnin içine giren istatistik şeridi.
 */
export function EditorialIntro({
  ctx,
  kicker,
  title,
  body,
  stats,
  signature,
  image,
  imageAlt = "",
  pattern,
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  body: string;
  /** İstatistik şeridi — verilmezse çizilmez */
  stats?: { n: string; l: string }[];
  /** Metnin altına el yazısı imza (marka script fontu) */
  signature?: string;
  image: string;
  imageAlt?: string;
  pattern?: string;
}) {
  const s = toneStyles[ctx.tone];
  return (
    <section className="relative overflow-hidden py-24">
      {pattern && <PatternLayer src={pattern} opacity={0.22} fade="both" />}
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-8">
        <div className="relative">
          {/* Fotoğrafın arkasında marka renginde kağıt katmanı — hafif çevrik */}
          <div
            aria-hidden
            className="absolute inset-0 -rotate-2 rounded-[2rem]"
            style={{ background: `${ctx.brand.color}26` }}
          />
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_30px_60px_-30px_rgba(89,68,57,0.55)]"
          />
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ctx.brand.color }}>
            {kicker}
          </p>
          <h2 className={`${ctx.font} text-3xl font-bold leading-[1.08] tracking-tightest md:text-[2.75rem]`}>{title}</h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: s.sub }}>{body}</p>
          {signature && (
            <p className="font-script mt-8 text-2xl" style={{ color: ctx.brand.color }}>
              {signature}
            </p>
          )}
          {stats && stats.length > 0 && (
          <dl className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
            {stats.map((st, idx) => (
              <div key={st.l} className="flex items-center gap-10">
                {idx > 0 && <span aria-hidden className="h-10 w-px" style={{ background: s.cardBorder }} />}
                <div>
                  <dt className={`${ctx.font} text-3xl font-extrabold leading-none tracking-tightest`}>{st.n}</dt>
                  <dd className="mt-2 text-sm" style={{ color: s.muted }}>{st.l}</dd>
                </div>
              </div>
            ))}
          </dl>
          )}
        </div>
      </div>
    </section>
  );
}


/**
 * Fressi dünyası — marka kılavuzundaki yaşam ve sunum görsellerinden mozaik.
 * ImageBand'in yerini aldı: eşit yükseklikte dört kesit yerine, ilk görselin
 * öne çıktığı ızgara.
 */
export function BrandGallery({
  ctx,
  eyebrow,
  title,
  images,
  pattern,
  ratio = "aspect-[4/3]",
}: {
  ctx: BrandCtx;
  eyebrow: string;
  title: string;
  images: { src: string; alt: string; wide?: boolean }[];
  pattern?: string;
  /** Kare oranı (tailwind aspect sınıfı) — dikey ürün kadrajlarında 3/4 */
  ratio?: string;
}) {
  return (
    <section className="relative overflow-hidden py-24">
      {pattern && <PatternLayer src={pattern} opacity={0.13} fade="both" />}
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} eyebrowColor={ctx.brand.color} titleFont={ctx.font} className="mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((im) => (
            <figure
              key={im.src}
              className={`overflow-hidden rounded-2xl ${im.wide ? "sm:col-span-2" : ""}`}
            >
              <img
                src={im.src}
                alt={im.alt}
                loading="lazy"
                className={`size-full object-cover transition-transform duration-700 hover:scale-[1.03] ${
                  im.wide ? "aspect-[16/9]" : ratio
                }`}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Yüz üzerinde rutin adımları — model portresi, adımların çıktığı noktalardan
 * konturlu daire içinde ürün. Fare noktaya gelince ürün öne çıkar; dokunmatikte
 * hepsi görünür durur.
 *
 * Not: model görseli mağazadan alınan geçici bir kadraj. Göz kırpma / fareyi
 * takip eden bakış için gözlerin ayrı katman olduğu bir çekim gerekiyor.
 */
export function RoutineFace({
  ctx,
  id,
  eyebrow,
  title,
  description,
  image,
  steps,
}: {
  ctx: BrandCtx;
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  /** x/y yüzde: noktanın yüz üzerindeki yeri; dx/dy: dairenin noktadan sapması */
  steps: {
    n: string;
    label: string;
    text: string;
    product: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    href: string;
  }[];
}) {
  const s = toneStyles[ctx.tone];
  const [active, setActive] = useState<number | null>(null);
  // Masaüstünde daireler fotoğraf çerçevesinin dışına taşar (yanlardaki boşluğu
  // doldurur); dar ekranda aynı sapmalar taşacağı için katsayı küçülür.
  const [spread, setSpread] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setSpread(mq.matches ? 1 : 0.36);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const cx = (st: { x: number; dx: number }) => st.x + st.dx * spread;
  const cy = (st: { y: number; dy: number }) => st.y + st.dy * spread;

  return (
    <section id={id} className="mx-auto max-w-[1400px] scroll-mt-24 overflow-x-clip px-5 py-24 md:px-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        eyebrowColor={ctx.brand.color}
        titleFont={ctx.font}
        align="center"
        className="mb-12"
      />

      <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] md:max-w-[640px]">
        <img src={image} alt="" aria-hidden className="size-full rounded-[2rem] object-cover" />

        {/* Noktalardan dairelere giden ince çizgiler — çerçevenin dışına uzayabilir */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {steps.map((st, i) => (
            <line
              key={st.label}
              x1={st.x}
              y1={st.y}
              x2={cx(st)}
              y2={cy(st)}
              stroke={ctx.brand.color}
              strokeWidth={active === null || active === i ? 1.6 : 1}
              strokeDasharray="5 5"
              opacity={active === null || active === i ? 0.9 : 0.35}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {steps.map((st, i) => (
          <div key={st.label}>
            {/* Yüz üzerindeki nokta */}
            <span
              aria-hidden
              className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4"
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                background: ctx.brand.color,
                // @ts-expect-error CSS değişkeni yerine doğrudan ring rengi
                "--tw-ring-color": `${ctx.brand.color}33`,
              }}
            />
            {/* Ürün dairesi */}
            <a
              href={st.href}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${cx(st)}%`, top: `${cy(st)}%` }}
            >
              <span
                className="grid size-24 place-items-center rounded-full border-2 bg-white shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105 md:size-32 lg:size-40"
                style={{ borderColor: ctx.brand.color }}
              >
                <img src={st.product} alt={st.label} loading="lazy" className="size-[84%] rounded-full object-cover" />
              </span>
              <span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-[11px] font-bold lg:text-xs"
                style={{ background: ctx.brand.color, color: ctx.brand.onColor }}
              >
                {st.n}
              </span>
              <span
                className="absolute left-1/2 top-full mt-4 hidden -translate-x-1/2 whitespace-nowrap text-sm font-semibold lg:block"
                style={{ color: s.fg }}
              >
                {st.label}
              </span>
            </a>
          </div>
        ))}
      </div>

      {/* Adım açıklamaları — mobilde tek okunur liste, masaüstünde şerit */}
      <ol className="mx-auto mt-14 grid max-w-[1100px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((st, i) => (
          <li
            key={st.label}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: s.card,
              borderColor: active === i ? ctx.brand.color : s.cardBorder,
            }}
          >
            <span className={`${ctx.font} text-2xl font-extrabold`} style={{ color: ctx.brand.color }}>{st.n}</span>
            <h3 className="mt-2 font-semibold">{st.label}</h3>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: s.sub }}>{st.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Ürün rayı — kaydırmalı "en çok satanlar" şeridi; kart görselleri sade kadraj. */
export function ProductRail({
  ctx,
  id,
  eyebrow,
  title,
  products,
  prevLabel,
  nextLabel,
  badges,
  viewLabel,
}: {
  ctx: BrandCtx;
  id?: string;
  eyebrow?: string;
  title: string;
  products: Product[];
  prevLabel: string;
  nextLabel: string;
  /** Rozet metinleri (ürünün `badge` anahtarına göre) */
  badges?: Record<NonNullable<Product["badge"]>, string>;
  /** Kart altındaki mağaza bağlantısı metni */
  viewLabel?: string;
}) {
  const s = toneStyles[ctx.tone];
  const rail = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const sync = () => {
    const el = rail.current;
    if (!el) return;
    setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  };
  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  const scrollTo = (p: number) => rail.current?.scrollTo({ left: p * rail.current.clientWidth, behavior: "smooth" });

  return (
    <section id={id} className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 md:px-8">
      <div className="mb-10 flex items-end justify-between gap-6">
        <SectionHeader eyebrow={eyebrow} title={title} eyebrowColor={ctx.brand.color} titleFont={ctx.font} />
        {pages > 1 && (
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              aria-label={prevLabel}
              onClick={() => scrollTo(Math.max(0, page - 1))}
              className="grid size-10 place-items-center rounded-full border transition hover:-translate-y-0.5"
              style={{ borderColor: s.cardBorder, color: s.fg }}
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => scrollTo(Math.min(pages - 1, page + 1))}
              className="grid size-10 place-items-center rounded-full border transition hover:-translate-y-0.5"
              style={{ borderColor: s.cardBorder, color: s.fg }}
            >
              <Chevron dir="right" />
            </button>
          </div>
        )}
      </div>

      <div ref={rail} onScroll={sync} className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {products.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="group flex w-[72%] shrink-0 snap-start flex-col rounded-3xl border p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(0,0,0,0.35)] sm:w-[46%] lg:w-[30%] xl:w-[23%]"
            style={{ background: s.card, borderColor: s.cardBorder }}
          >
            <div className="relative overflow-hidden rounded-2xl" style={{ background: "#ffffff" }}>
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className={`aspect-square w-full object-cover transition-transform duration-700 ${p.hoverImage ? "" : "group-hover:scale-[1.04]"}`}
              />
              {/* rhodeskin.com kart etkileşimi: hover'da kullanım karesine çapraz geçiş */}
              {p.hoverImage && (
                <img
                  src={p.hoverImage}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              )}
              {p.badge && badges?.[p.badge] && (
                <span
                  className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={
                    p.badge === "best"
                      ? { background: ctx.brand.color, color: ctx.brand.onColor }
                      : { background: "#ffffff", color: s.fg, boxShadow: `inset 0 0 0 1px ${s.cardBorder}` }
                  }
                >
                  {badges[p.badge]}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ctx.brand.color }}>
                {p.category}
              </p>
              <h3 className="mt-1 font-semibold leading-snug">{p.name}</h3>
              {p.benefit && (
                <p className="mt-1 text-sm" style={{ color: s.sub }}>
                  {p.benefit}
                </p>
              )}
              {viewLabel && (
                <span
                  className="mt-4 inline-flex items-center gap-1.5 self-start border-t pt-3 text-[13px] font-semibold"
                  style={{ borderColor: s.cardBorder, color: s.fg }}
                >
                  {viewLabel}
                  <Icon name="arrow-up-right" size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, p) => (
            <button
              key={p}
              type="button"
              aria-label={`${p + 1}`}
              aria-current={p === page}
              onClick={() => scrollTo(p)}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: p === page ? 22 : 8, background: p === page ? ctx.brand.color : `${ctx.brand.color}33` }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** Blog kartları — yazı henüz yayında değilse href boş bırakılır, kart pasif olur. */
export function BlogTeasers({
  ctx,
  id,
  eyebrow,
  title,
  posts,
  soonLabel,
}: {
  ctx: BrandCtx;
  id?: string;
  eyebrow: string;
  title: string;
  posts: { image: string; kicker: string; title: string; excerpt: string; href?: string; readingTime: string }[];
  /** href yoksa kartta gösterilen etiket */
  soonLabel: string;
}) {
  const s = toneStyles[ctx.tone];
  return (
    <section id={id} className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 md:px-8">
      <SectionHeader eyebrow={eyebrow} title={title} eyebrowColor={ctx.brand.color} titleFont={ctx.font} className="mb-10" />
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => {
          const inner = (
            <>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: ctx.brand.color }}>
                {post.kicker}
                <span style={{ color: s.muted }}>{post.readingTime}</span>
              </p>
              <h3 className={`${ctx.font} mt-2 text-xl font-bold leading-snug`}>{post.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: s.sub }}>{post.excerpt}</p>
              {!post.href && (
                <span className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: `${ctx.brand.color}1a`, color: ctx.brand.color }}>
                  {soonLabel}
                </span>
              )}
            </>
          );
          return post.href ? (
            <a key={post.title} href={post.href} target="_blank" rel="noreferrer" className="group block">
              {inner}
            </a>
          ) : (
            <article key={post.title} className="group">{inner}</article>
          );
        })}
      </div>
    </section>
  );
}
