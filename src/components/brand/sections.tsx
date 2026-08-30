import { Link } from "react-router";
import type { BrandVisual, Product } from "../../data/brands";
import { useI18n } from "../../i18n";
import { Arrow } from "../Arrow";
import { LogoSlot } from "../LogoSlot";
import { SectionHeader } from "../SectionHeader";
import { img } from "../../data/brands";

export type BrandTone = "dark" | "cream" | "light" | "pink" | "mono";

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
};

export type BrandCtx = {
  brand: BrandVisual;
  tone: BrandTone;
  /** Başlık fontu (tailwind sınıfı) */
  font: string;
  /** Gövde fontu — verilmezse site geneli (STL kimliği) kullanılır */
  bodyFont?: string;
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
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  body: string;
  stats: { n: string; l: string }[];
  /** Verilirse metnin yanında ürün görseli gösterilir (arkasında marka renginde hafif ışık) */
  image?: string;
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
      {image ? (
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

      <div className="mt-16 grid grid-cols-3 gap-6 md:gap-12">
        {stats.map((st) => (
          <div key={st.l} className="border-t-2 pt-5" style={{ borderColor: brand.color }}>
            <div className={`${ctx.font} text-3xl font-extrabold leading-none tracking-tightest md:text-5xl`}>{st.n}</div>
            <div className="mt-3 text-sm" style={{ color: toneStyles[ctx.tone].muted }}>{st.l}</div>
          </div>
        ))}
      </div>
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
export function SpecBand({ ctx, specs }: { ctx: BrandCtx; specs: { k: string; v: string }[] }) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-20 md:px-8">
      <div className="grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: s.cardBorder, background: s.cardBorder }}>
        {specs.map((sp) => (
          <div key={sp.k} className="relative overflow-hidden p-6" style={{ background: s.card }}>
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(to right, ${brand.color}, transparent)` }}
            />
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: brand.color }}>{sp.k}</div>
            <div className={`mt-2 ${ctx.font} font-bold tracking-tightest`}>{sp.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ValueProps({ ctx, items }: { ctx: BrandCtx; items: { title: string; text: string }[] }) {
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
              <span className="grid size-9 place-items-center rounded-full text-sm font-extrabold" style={{ background: brand.color, color: brand.onColor }}>
                {i + 1}
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
  categories: { key: string; label: string; color: string; image: string; href: string }[];
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
              <span className="size-2 rounded-full" style={{ background: c.color }} />
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
}: {
  ctx: BrandCtx;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  image: string;
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
          {points.map((pt) => (
            <li key={pt} className="flex items-center gap-3 font-medium">
              <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">✓</span>
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

export function Editorial({ ctx, image, title, text, blend }: { ctx: BrandCtx; image: string; title: string; text: string; blend?: boolean }) {
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section className="mx-auto grid max-w-[1400px] items-stretch gap-6 px-5 pb-24 md:grid-cols-2 md:px-8">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto" style={{ background: blend ? "#ffffff" : "rgba(127,127,127,0.08)" }}>
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
}: {
  ctx: BrandCtx;
  text: string;
  source: string;
  bg?: string;
  fg?: string;
}) {
  const { brand } = ctx;
  return (
    <section style={{ background: bg ?? brand.color, color: fg ?? brand.onColor }}>
      <div className="mx-auto max-w-[1000px] px-5 py-24 text-center md:px-8">
        <p className={`${ctx.font} text-2xl font-bold leading-[1.25] tracking-tightest md:text-4xl`}>“{text}”</p>
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

export function BrandCTA({ ctx, title, channel, note }: { ctx: BrandCtx; title: string; channel: string; note?: string }) {
  const { t, p } = useI18n();
  const s = toneStyles[ctx.tone];
  const { brand } = ctx;
  return (
    <section style={{ background: s.bg, color: s.fg }}>
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-5 py-24 md:flex-row md:items-center md:justify-between md:px-8">
        <h2 className={`${ctx.font} max-w-2xl text-4xl font-black uppercase leading-[0.95] tracking-tightest md:text-6xl`}>
          {title}
        </h2>
        <div className="flex flex-col gap-3">
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
              to={p.contact}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold transition-transform hover:scale-[1.02]"
              style={{ background: brand.color, color: brand.onColor }}
            >
              {t.nav.contact} <Arrow />
            </Link>
          )}
          {note && <p className="max-w-[26ch] text-sm" style={{ color: s.muted }}>{note}</p>}
          <Link to={p.contact} className="text-sm font-medium underline underline-offset-4" style={{ color: s.muted }}>
            {t.brandPage.orContact}
          </Link>
        </div>
      </div>
    </section>
  );
}
