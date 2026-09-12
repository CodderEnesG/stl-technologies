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
  priority = false,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Üst çubuktaki logo için açın. Küçük bir dosya ama ilk perdede duruyor ve
   * varsayılan görsel önceliğiyle paketin, yazı tiplerinin ve hero
   * görsellerinin arkasına düşüyor. Ana sayfada marka panelleri giriş
   * animasyonu sırasında saydam başladığı için LCP adayı sayılmıyor ve
   * sayfanın en büyük boyaması bu 2 KB'lik logoya kalıyordu: ölçümde
   * 2,2 saniyede iniyordu.
   */
  priority?: boolean;
}) {
  return (
    <Img
      src={stlLogo.dark}
      alt="STL Teknoloji"
      style={{ height: size, ...style }}
      className={`w-auto object-contain ${className}`}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
