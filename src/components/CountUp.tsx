import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Görünüme girince 0'dan hedefe sayan istatistik (referans: hover.dev "Count Up Stats").
 *
 * Değer metin olarak gelir ("35.000 m²", "20", "2016"); sayı kısmı ayrıştırılır,
 * binlik ayracı ve ek ("m²") korunur. rAF ile ~1.4 s ease-out. Bir kez çalışır.
 * `prefers-reduced-motion` açıksa doğrudan hedef değer basılır.
 * Sayı genişliği sayarken oynamasın diye `tabular-nums`.
 *
 * İlk render hedef değeri basar, 0'ı değil. İki sebep:
 *
 * 1. Ön-render çıktısında sayaçlar "0", "0 m²", "0" olarak kalıyordu; sitenin en
 *    alıntılanabilir üç sayısı (2016, 35.000 m², 20) JavaScript çalıştırmayan
 *    tarayıcılar ve AI tarayıcıları için sıfırlanmış görünüyordu.
 * 2. hydrateRoot statik HTML ile ilk render'ın eşleşmesini ister.
 *
 * Sayaç bağlandığı anda zaten ekrandaysa animasyon hiç oynatılmaz: kullanıcı
 * gerçek sayıyı görmüşken onu sıfıra düşürüp tekrar saymak yanıp sönme olurdu.
 * Ekran dışındaysa değer 0'a alınır ve görünüme girince sayar.
 */
export function CountUp({ value, delay = 0, duration = 1400 }: { value: string; delay?: number; duration?: number }) {
  const m = /^([^\d]*)([\d.,]+)(.*)$/.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  /** null: animasyon yok, hedef değer gösteriliyor. Sayı: sayım sürüyor. */
  const [n, setN] = useState<number | null>(null);

  const prefix = m?.[1] ?? "";
  const raw = m?.[2] ?? "";
  const suffix = m?.[3] ?? "";
  const sep = raw.includes(".") ? "." : raw.includes(",") ? "," : "";
  const target = Number(raw.replace(/[.,]/g, ""));

  // Boyamadan önce çalışmalı: ekran dışındaki sayaç 0'a indirilirken kullanıcı
  // arada gerçek değeri görmemeli.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const r = el.getBoundingClientRect();
    const onScreen = r.top < window.innerHeight && r.bottom > 0;
    if (onScreen) return;

    setN(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !m || n === null) return;

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
            if (p < 1) {
              setN(Math.round(target * eased));
              raf = requestAnimationFrame(tick);
            } else {
              setN(null); // bitti: yeniden hedef değere dön
            }
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
    // n yalnızca "animasyon başladı mı" kapısı; her karede yeniden kurmamak için
    // bağımlılıklarda yok.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, n === null]);

  if (!m) return <span ref={ref}>{value}</span>;

  const shown = n ?? target;
  const grouped = sep ? shown.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep) : shown.toString();

  // `data-countup` hedef değeri taşır. Ön-render betiği anlık görüntüyü sayım
  // ortasında yakalayabildiği için metni bununla sabitler; React her render'da
  // aynı özniteliği yazdığından hydration ile çakışmaz.
  return (
    <span ref={ref} className="tabular-nums" data-countup={value}>
      {prefix}
      {grouped}
      {suffix}
    </span>
  );
}
