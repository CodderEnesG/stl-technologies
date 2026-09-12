import { useCallback, useRef, useState } from "react";

/**
 * Kaydırmayla görünüme giren bölümler için sade "fade + rise" girişi
 * (referans: prestigethermoform.com — framer-motion whileInView, 0.8 s, bir kez).
 *
 * Bağımlılık yok: IntersectionObserver görünürlüğü bildirir, geçişin kendisi
 * CSS'te (`[data-reveal]`, index.css). Bir kez tetiklenir; geri kaydırınca
 * tekrar oynamaz. `prefers-reduced-motion` CSS tarafında kapatır.
 *
 * `is-in` sınıfı React tarafından render edilir, doğrudan DOM'a yazılmaz.
 * Önceki sürüm `el.classList.add` kullanıyordu; sınıfın sahibi React olmadığı
 * için ön-render edilen ağaç devralındığında sınıf kayboluyor ve bölümler
 * kalıcı olarak saydam kalıyordu. Gözlemci de callback ref ile kuruluyor:
 * düğüm değişirse yeniden bağlanır, bayat düğüm gözlemlenmiş olarak kalmaz.
 *
 * Başlangıçtaki saydamlık CSS'te `html.js` ile kapılı olduğundan JavaScript
 * çalışmadığında bölümler görünür kalır.
 *
 * İç kademeleme: sarılan ağaçta `data-reveal-item` + `--i` taşıyan elemanlar
 * bölüm göründükten sonra sırayla gelir. Bu işaretler bir `Reveal` içinde
 * değilse etkisizdir — marka sayfaları etkilenmez.
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
  const [shown, setShown] = useState(false);
  const io = useRef<IntersectionObserver | null>(null);

  const attach = useCallback(
    (el: HTMLDivElement | null) => {
      io.current?.disconnect();
      io.current = null;

      if (!el || shown) return;

      if (typeof IntersectionObserver === "undefined") {
        setShown(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          observer.disconnect();
          setShown(true);
        },
        // Bloğun üstü viewport'un alt %12'sini geçince tetiklenir — kullanıcı
        // bölüme gerçekten bakmadan animasyon bitmiş olmasın diye.
        { rootMargin: "0px 0px -12% 0px", threshold: 0 },
      );
      observer.observe(el);
      io.current = observer;
    },
    [shown],
  );

  return (
    <div
      ref={attach}
      data-reveal={mode}
      className={[className, shown ? "is-in" : null].filter(Boolean).join(" ") || undefined}
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
