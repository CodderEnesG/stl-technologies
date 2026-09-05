import { useEffect, useRef } from "react";

/**
 * Kaydırmayla görünüme giren bölümler için sade "fade + rise" girişi
 * (referans: prestigethermoform.com — framer-motion whileInView, 0.8 s, bir kez).
 *
 * Bağımlılık yok: IntersectionObserver `is-in` sınıfını ekler, geçişin kendisi
 * CSS'te (`[data-reveal]`, index.css). Bir kez tetiklenir; geri kaydırınca
 * tekrar oynamaz. `prefers-reduced-motion` CSS tarafında kapatır.
 *
 * İç kademeleme: sarılan ağaçta `data-reveal-item` + `--i` taşıyan elemanlar
 * bölüm göründükten sonra sırayla gelir. Bu işaretler bir `Reveal` içinde
 * değilse etkisizdir — marka sayfaları etkilenmez.
 *
 * Şimdilik sadece landing'de (Home.tsx). Müşteri beğenirse marka sayfalarına yayılır.
 */
export function Reveal({
  children,
  mode = "rise",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** rise: opaklık + 28px yukarı kayma. fade: sadece opaklık (hero gibi tam ekran bloklar için). */
  mode?: "rise" | "fade";
  /** ms — aynı anda görünen komşu bloklar için küçük kaydırma */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      // Bloğun üstü viewport'un alt %12'sini geçince tetiklenir — kullanıcı
      // bölüme gerçekten bakmadan animasyon bitmiş olmasın diye.
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={mode}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** `data-reveal-item` için sıra değişkeni — kademeli gecikme CSS'te hesaplanır. */
export const revealItem = (i: number) => ({
  "data-reveal-item": "",
  style: { "--i": i } as React.CSSProperties,
});
