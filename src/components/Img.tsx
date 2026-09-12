import type { ImgHTMLAttributes } from "react";

import { imageManifest, stripUrl, variantUrl } from "../data/imageManifest";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "srcSet"> & {
  src: string;
  /**
   * Zorunlu. Dekoratif görselde açıkça alt="" yazın — böylece "alt yazmayı
   * unuttum" ile "bu görsel bilinçli olarak dekoratif" ayrımı kodda görünür.
   */
  alt: string;
  /** Görselin yerleşimdeki genişliği. Varsayılan: ekran genişliği. */
  sizes?: string;
  /**
   * Dar ekranda görselin yatık bir şeride sıkıştığı yerlerde açın: telefona
   * 2:1 kırpılmış kopya gider (bkz. scripts/images.mjs STRIPS).
   */
  wide?: boolean;
};

/** <Img wide> şeridin hangi genişliğe kadar geçerli olduğu — accordion md'de yatay düzene geçiyor */
const WIDE_MEDIA = "(max-width: 767px)";

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
 * `wide` ile ikinci bir sorun kapanıyor: srcset yalnızca genişliğe bakar, oysa
 * ana sayfadaki marka panelleri telefonda 412x172'lik bir şerit. Dikey kaynak
 * fotoğrafın satırlarının çoğu object-fit: cover tarafından atılıyor ama yine
 * de indiriliyordu. <picture> ile dar ekrana kırpılmış kopya veriliyor.
 *
 * Katalogda olmayan görsel (logo SVG'leri gibi) düz <img> olarak çıkar.
 */
export function Img({ src, alt, sizes = "100vw", wide = false, ...rest }: Props) {
  const meta = imageManifest[src];

  if (!meta) return <img src={src} alt={alt} decoding="async" {...rest} />;

  const { w, h, variants } = meta;

  if (variants.length === 0) {
    return <img src={src} alt={alt} width={w} height={h} decoding="async" {...rest} />;
  }

  const widest = variants[variants.length - 1];
  const img = (
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

  const strip = wide ? meta.strip : undefined;
  if (!strip?.length) return img;

  // display: contents — <picture> yerleşimde hiç kutu üretmesin. İçindeki <img>
  // çoğu yerde absolute konumlanıyor ve konum atasının panel olması gerekiyor.
  return (
    <picture style={{ display: "contents" }}>
      <source
        media={WIDE_MEDIA}
        sizes={sizes}
        srcSet={strip.map((v) => `${stripUrl(src, v)} ${v}w`).join(", ")}
        type="image/webp"
      />
      {img}
    </picture>
  );
}
