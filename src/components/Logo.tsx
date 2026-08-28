import { stlLogo } from "../data/brands";

/**
 * STL Teknoloji kurumsal kimliği.
 * - default: yatay lockup — gerçek kırmızı "STL" grafiği (logos/stl-mark.svg) + "TEKNOLOJİ"
 * - mark: tam kare logo (logos/stl.svg) — geniş yüzeyler için
 */
export function StlLogo({ size = 28, mark = false }: { size?: number; mark?: boolean }) {
  if (mark) {
    return <img src={stlLogo.dark} alt="STL Teknoloji" style={{ height: size }} className="w-auto object-contain" />;
  }
  return (
    <span className="flex items-center gap-2.5 leading-none select-none">
      <img src="/logos/stl-mark.svg" alt="STL" style={{ height: size }} className="w-auto object-contain" />
      <span
        className="font-display font-semibold uppercase"
        style={{ color: "#2b2828", fontSize: size * 0.38, letterSpacing: "0.24em" }}
      >
        Teknoloji
      </span>
    </span>
  );
}
