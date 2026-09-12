import { stlLogo } from "../data/brands";

import { Img } from "./Img";
/**
 * STL Teknoloji kurumsal logosu — kırmızı "STL" ve altında antrasit "TEKNOLOJİ".
 * Açık zeminler için; koyu zeminde kullanılacaksa beyaz varyant gerekir.
 */
export function StlLogo({
  size = 44,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Img
      src={stlLogo.dark}
      alt="STL Teknoloji"
      style={{ height: size, ...style }}
      className={`w-auto object-contain ${className}`}
    />
  );
}
