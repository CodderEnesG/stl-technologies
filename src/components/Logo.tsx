import { stlLogo } from "../data/brands";

/**
 * STL Teknoloji kurumsal logosu — kırmızı "STL" ve altında antrasit "TEKNOLOJİ".
 * Açık zeminler için; koyu zeminde kullanılacaksa beyaz varyant gerekir.
 */
export function StlLogo({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={stlLogo.dark}
      alt="STL Teknoloji"
      style={{ height: size }}
      className={`w-auto object-contain ${className}`}
    />
  );
}
