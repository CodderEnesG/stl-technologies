import { wextaImages } from "../../../data/brands";
import { type BrandCtx } from "../sections";
import { WextaCoverHero } from "./WextaCoverHero";

/**
 * wexta hero'su — katalog kapağının siyah-beyaz tam ekran hâli (varyant 4) sabitlendi.
 * Varyant seçici ve diğer düzenler (slider, ürün gamı, renkli kapak) kaldırıldı;
 * bileşenleri repo'da duruyor, geçmişten geri alınabilir (cc2b1ea).
 */
export function WextaHero({ ctx, channelHref }: { ctx: BrandCtx; channelHref: string }) {
  return (
    <WextaCoverHero ctx={ctx} channelHref={channelHref} image={wextaImages.coverMono} focus="50% 62%" />
  );
}
