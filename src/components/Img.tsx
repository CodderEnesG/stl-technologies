import type { ImgHTMLAttributes } from "react";

import { imageManifest, variantUrl } from "../data/imageManifest";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "srcSet"> & {
  src: string;
  /**
   * Zorunlu. Dekoratif görselde açıkça alt="" yazın — böylece "alt yazmayı
   * unuttum" ile "bu görsel bilinçli olarak dekoratif" ayrımı kodda görünür.
   */
  alt: string;
  /** Görselin yerleşimdeki genişliği. Varsayılan: ekran genişliği. */
  sizes?: string;
};

/**
 * Duyarlı <img>.
 *
 * src/data/imageManifest.ts (pnpm run images ile üretilir) her görselin gerçek
 * piksel boyutunu ve hazır WebP varyantlarını tutar. Bileşen bunlardan srcset
 * ve sizes üretir, width/height yazar.
 *
 * Neden: tek dosya servis edilirken 390 piksellik telefon da masaüstüyle aynı
 * görseli indiriyordu (ana sayfa hero'su 485 KB). width/height ise yerleşim
 * kaymasını (CLS) kapatır; görünümü değiştirmez, yalnızca tarayıcıya oranı
 * önceden bildirir.
 *
 * Katalogda olmayan görsel (logo SVG'leri gibi) düz <img> olarak çıkar.
 */
export function Img({ src, alt, sizes = "100vw", ...rest }: Props) {
  const meta = imageManifest[src];

  if (!meta) return <img src={src} alt={alt} decoding="async" {...rest} />;

  const { w, h, variants } = meta;

  if (variants.length === 0) {
    return <img src={src} alt={alt} width={w} height={h} decoding="async" {...rest} />;
  }

  const widest = variants[variants.length - 1];

  return (
    <img
      src={variantUrl(src, widest)}
      srcSet={variants.map((v) => `${variantUrl(src, v)} ${v}w`).join(", ")}
      sizes={sizes}
      width={w}
      height={h}
      alt={alt}
      decoding="async"
      {...rest}
    />
  );
}
