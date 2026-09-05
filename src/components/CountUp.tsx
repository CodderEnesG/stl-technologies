import { useEffect, useRef, useState } from "react";

/**
 * Görünüme girince 0'dan hedefe sayan istatistik (referans: hover.dev "Count Up Stats").
 *
 * Değer metin olarak gelir ("35.000 m²", "20", "2016"); sayı kısmı ayrıştırılır,
 * binlik ayracı ve ek ("m²") korunur. rAF ile ~1.4 s ease-out. Bir kez çalışır.
 * `prefers-reduced-motion` açıksa doğrudan hedef değer basılır.
 * Sayı genişliği sayarken oynamasın diye `tabular-nums`.
 */
export function CountUp({ value, delay = 0, duration = 1400 }: { value: string; delay?: number; duration?: number }) {
  const m = /^([^\d]*)([\d.,]+)(.*)$/.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  const prefix = m?.[1] ?? "";
  const raw = m?.[2] ?? "";
  const suffix = m?.[3] ?? "";
  const sep = raw.includes(".") ? "." : raw.includes(",") ? "," : "";
  const target = Number(raw.replace(/[.,]/g, ""));

  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setDone(true);
      return;
    }
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(target * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
            else setDone(true);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!m) return <span ref={ref}>{value}</span>;

  const shown = done ? target : n;
  const grouped = sep ? shown.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep) : shown.toString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {grouped}
      {suffix}
    </span>
  );
}
