import { type BrandCtx } from "../sections";
import { WextaCoverHero } from "./WextaCoverHero";

/**
 * wexta hero — müşteri kararı (2026-09-05): üç varyanttan "katalog kapağı" seçildi.
 * Slider ve ürün gamı varyantları silindi; seçici kaldırıldı.
 */
export function WextaHero({ ctx, channelHref }: { ctx: BrandCtx; channelHref: string }) {
  return <WextaCoverHero ctx={ctx} channelHref={channelHref} />;
}
