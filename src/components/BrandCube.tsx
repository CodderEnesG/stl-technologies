import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { brands } from "../data/brands";
import { useI18n } from "../i18n";
import { Arrow } from "./Arrow";
import { LogoSlot } from "./LogoSlot";
import { SectionHeader } from "./SectionHeader";
import { BrandGrid } from "./sections";
import { toneStyles, type BrandCtx } from "./brand/sections";

/**
 * Küp yerine düz ızgaraya düşülecek durumlar:
 * hareket azaltma tercihi, veya dar ekran (yüz 768px altında okunmayacak kadar sıkışıyor).
 */
const FLAT_QUERY = "(prefers-reduced-motion: reduce), (max-width: 767px)";

const N = brands.length; // 4 marka = 4 yüz
const STEP = 360 / N;

/**
 * Yüz kendi açısal konumunun bu kadarı kadar döner.
 * 1.0 = kapalı küp: yan yüzler tam 90° döner, ekrana dik kalır ve ön yüzün
 * arkasında kaybolur. 0.62 ile yan yüzler ~56° dönüp görünür kalır — müşterinin
 * tarif ettiği "ortada bir marka, solda ve sağda birer marka" görüntüsü bu.
 */
const DAMP = 0.62;
const STAGE_MAX = 980;
const FACE_RATIO = 0.54; // yüz genişliği / sahne genişliği
const FACE_ASPECT = 0.66; // yükseklik / genişlik
const RADIUS_RATIO = 0.72; // halka yarıçapı / yüz genişliği

/**
 * Fare hareketi -> dönüş. Mutlak konum eşlemesi değil: imleç durunca küp de durur,
 * böylece öndeki kartın üstüne gelmek onu kaydırmaz ve karta tıklanabilir.
 * Sahne genişliğini bir uçtan bir uca taramak ~3 marka ilerletir.
 */
const SCRUB = 0.3; // derece / piksel

/** Kare başına hedefe yaklaşma oranı (60fps referanslı, dt ile düzeltilir) */
const FOLLOW = 0.15;

const mod = (n: number, m: number) => ((n % m) + m) % m;
const rad = (d: number) => (d * Math.PI) / 180;

/**
 * Markalar küpü — dört marka bir halka üzerinde; fare bölümün üzerinde
 * soldan sağa geçtikçe biri diğerine döner. Ön yüz tam ölçekte, yandakiler
 * açılı ve hafif karartılmış.
 *
 * prefers-reduced-motion açıkken küp yerine düz 4'lü ızgara render edilir.
 */
export function BrandCube(props: {
  ctx: BrandCtx;
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const [flat, setFlat] = useState(true);
  useLayoutEffect(() => {
    const mq = window.matchMedia(FLAT_QUERY);
    const sync = () => setFlat(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return flat ? <BrandGrid {...props} /> : <Cube {...props} />;
}

function Cube({
  ctx,
  id,
  eyebrow,
  title,
  description,
}: {
  ctx: BrandCtx;
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  const { t, p } = useI18n();
  const navigate = useNavigate();
  const s = toneStyles[ctx.tone];

  const stageRef = useRef<HTMLDivElement>(null);
  const faceRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shadowRef = useRef<HTMLDivElement>(null);

  const angleRef = useRef(0); // derece; 0 = ilk marka önde
  const targetRef = useRef(0); // gidilmek istenen açı; angle buna doğru yumuşar
  const indexRef = useRef(0);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const lastXRef = useRef<number | null>(null);
  const touched = useRef(false);
  const dragRef = useRef<{ x: number; base: number } | null>(null);

  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(STAGE_MAX);

  const faceW = Math.round(stage * FACE_RATIO);
  const faceH = Math.round(faceW * FACE_ASPECT);
  const radius = faceW * RADIUS_RATIO;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStage(Math.min(STAGE_MAX, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Açıyı doğrudan DOM'a yazar — kare başına React render'ı yok. */
  const paint = useCallback(
    (deg: number) => {
      angleRef.current = deg;
      for (let i = 0; i < N; i++) {
        const el = faceRefs.current[i];
        if (!el) continue;
        // Yüzün açısal konumu: 0 = tam önde
        const phi = ((i * STEP + deg + 180) % 360 + 360) % 360 - 180;
        const x = radius * Math.sin(rad(phi));
        const z = radius * Math.cos(rad(phi)) - radius;
        const facing = Math.cos(rad(phi)); // 1 önde, -1 arkada
        const hidden = Math.abs(phi) > 108;
        el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${(phi * DAMP).toFixed(2)}deg)`;
        el.style.zIndex = String(100 + Math.round(facing * 50));
        el.style.opacity = hidden ? "0" : "1";
        el.style.visibility = hidden ? "hidden" : "visible";
        el.style.filter = `brightness(${(0.78 + 0.22 * Math.max(0, facing)).toFixed(3)})`;
        el.style.pointerEvents = hidden ? "none" : "auto";
      }
      if (shadowRef.current) {
        const tsin = Math.sin(rad(deg));
        shadowRef.current.style.transform = `translateX(${(-tsin * 7).toFixed(2)}%) scaleX(${(1 - Math.abs(tsin) * 0.1).toFixed(3)})`;
      }
    },
    [radius],
  );

  /**
   * Tek animasyon döngüsü: açı her karede hedefe doğru yumuşar.
   * Fare sürüşü, klavye, ray tıklaması ve boştaki tur — hepsi sadece hedefi
   * değiştirir; geçişi her zaman bu döngü çizer, o yüzden ani atlama olmaz.
   */
  const tick = useCallback(
    (ts: number) => {
      const dt = lastTsRef.current ? Math.min(64, ts - lastTsRef.current) : 16.67;
      lastTsRef.current = ts;
      const diff = targetRef.current - angleRef.current;
      if (Math.abs(diff) < 0.02) {
        paint(targetRef.current);
        rafRef.current = 0;
        lastTsRef.current = 0;
        return;
      }
      const k = 1 - Math.pow(1 - FOLLOW, dt / 16.67);
      paint(angleRef.current + diff * k);
      rafRef.current = requestAnimationFrame(tick);
    },
    [paint],
  );

  const glideTo = useCallback(
    (deg: number) => {
      targetRef.current = deg;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  const settle = useCallback(
    (i: number) => {
      indexRef.current = i;
      setIndex(mod(i, N));
      glideTo(-STEP * i);
    },
    [glideTo],
  );

  useEffect(() => {
    paint(angleRef.current);
  }, [paint, faceW]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Boşta yavaş tur; ilk etkileşimde durur
  useEffect(() => {
    const timer = setInterval(() => {
      if (!touched.current) settle(indexRef.current + 1);
    }, 4200);
    return () => clearInterval(timer);
  }, [settle]);

  const onPointerMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el) return;

    // Dokunmatik: sürükleme
    if (dragRef.current) {
      const { x, base } = dragRef.current;
      glideTo(base + (e.clientX - x) * 0.28);
      return;
    }
    if (e.pointerType === "touch") return;

    touched.current = true;
    if (lastXRef.current === null) {
      lastXRef.current = e.clientX;
      return;
    }
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    if (!dx) return;

    glideTo(targetRef.current + dx * SCRUB);
    const i = Math.round(-targetRef.current / STEP);
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(mod(i, N));
    }
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    lastXRef.current = e.clientX;
  };

  const onPointerLeave = () => {
    lastXRef.current = null;
    if (dragRef.current) return;
    // Bırakınca en yakın yüze otur
    settle(Math.round(-targetRef.current / STEP));
    touched.current = false;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    touched.current = true;
    dragRef.current = { x: e.clientX, base: angleRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const endDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    settle(Math.round(-targetRef.current / STEP));
    touched.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    touched.current = true;
    settle(indexRef.current + (e.key === "ArrowRight" ? 1 : -1));
  };

  const activate = (i: number) => {
    // Öndeki yüz hedefin kendisinden okunur; React state'i bir kare geriden gelebiliyor.
    const front = mod(Math.round(-targetRef.current / STEP), N);
    if (mod(i, N) === front) navigate(p[brands[i].slug as keyof typeof p]);
    else settle(indexRef.current + (mod(i - front, N) === 1 ? 1 : -1));
  };

  return (
    <section id={id} className="mx-auto max-w-[1400px] scroll-mt-[var(--nav-h)] px-5 py-24 md:px-8">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        eyebrowColor={ctx.brand.color}
        className="mb-14"
      />

      <div
        ref={stageRef}
        className="relative mx-auto w-full touch-pan-y select-none outline-none"
        style={{ maxWidth: STAGE_MAX, perspective: `${Math.round(stage * 1.1)}px` }}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-roledescription={t.home.cube.roleDescription}
        aria-label={title}
      >
        <div className="relative mx-auto" style={{ height: faceH, transformStyle: "preserve-3d" }}>
          {brands.map((b, i) => {
            const copy = t.brands[b.slug as keyof typeof t.brands];
            const onDark = b.panelText === "#ffffff";
            const isFront = i === index;
            return (
              <button
                key={b.slug}
                ref={(el) => {
                  faceRefs.current[i] = el;
                }}
                type="button"
                onClick={() => activate(i)}
                tabIndex={isFront ? 0 : -1}
                aria-current={isFront ? "true" : undefined}
                className="absolute left-1/2 top-0 cursor-pointer overflow-hidden rounded-2xl text-left shadow-[0_40px_90px_-50px_rgba(0,0,0,0.55)]"
                style={{
                  width: faceW,
                  height: faceH,
                  marginLeft: -faceW / 2,
                  background: b.panelBg,
                  color: b.panelText,
                  willChange: "transform",
                  transition: "filter 400ms ease, opacity 300ms ease",
                }}
              >
                <img
                  src={b.hero}
                  alt=""
                  aria-hidden
                  loading={i === 0 ? "eager" : "lazy"}
                  className="pointer-events-none absolute bottom-0 right-0 h-[88%] w-[46%] object-cover object-bottom"
                  style={{
                    mixBlendMode: b.heroBlend ? "multiply" : undefined,
                    objectFit: b.heroBlend ? "contain" : "cover",
                    // Fotoğrafın kendi zemini yüzün rengine karışsın diye yumuşak kenar
                    maskImage: b.heroBlend
                      ? undefined
                      : "linear-gradient(to right, transparent 0%, #000 26%), linear-gradient(to top, transparent 0%, #000 14%)",
                    WebkitMaskImage: b.heroBlend
                      ? undefined
                      : "linear-gradient(to right, transparent 0%, #000 26%), linear-gradient(to top, transparent 0%, #000 14%)",
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                  }}
                />

                <div className="relative flex h-full w-[58%] flex-col justify-end p-7 md:p-9">
                  <div>
                    <LogoSlot
                      src={onDark ? b.logoLight : b.logoDark}
                      label={b.name}
                      height={30}
                      onDark={onDark}
                      className="mb-5"
                    />
                    <p className="max-w-[30ch] text-sm font-medium leading-snug opacity-90 md:text-base">
                      {copy.summary}
                    </p>
                    <span
                      className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                      style={{ background: b.color, color: b.onColor }}
                    >
                      {t.home.discoverBrand} <Arrow />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          <div
            ref={shadowRef}
            aria-hidden
            className="pointer-events-none absolute -bottom-7 left-1/2 h-9 rounded-[50%] blur-2xl"
            style={{ width: faceW * 0.86, marginLeft: -(faceW * 0.86) / 2, background: "rgba(0,0,0,0.3)" }}
          />
        </div>

        {/* İndeks rayı */}
        <div className="mt-20 flex items-center gap-3">
          {brands.map((b, i) => (
            <button
              key={b.slug}
              type="button"
              aria-label={b.name}
              aria-current={i === index ? "true" : undefined}
              onClick={() => {
                touched.current = true;
                settle(i);
              }}
              className="flex-1 py-2"
            >
              <span
                className="block h-[3px] w-full rounded-full transition-all duration-500"
                style={{
                  background: i === index ? ctx.brand.color : s.cardBorder,
                  transform: i === index ? "scaleY(1.6)" : "scaleY(1)",
                }}
              />
              <span
                className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
                style={{ color: i === index ? "inherit" : s.muted }}
              >
                {b.name}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: s.muted }}>
          {t.home.cube.hint}
        </p>
      </div>
    </section>
  );
}
