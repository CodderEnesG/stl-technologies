type LogoSlotProps = {
  /** Logo image URL/path. When empty, a labelled placeholder is shown. */
  src?: string;
  /** Fallback text shown inside the placeholder box. */
  label: string;
  /** Rendered height (px). Width is auto for images, ratio-based for the slot. */
  height?: number;
  /** Placeholder aspect ratio (width / height). Default 2.6. */
  ratio?: number;
  /** Use light strokes for dark backgrounds. */
  onDark?: boolean;
  className?: string;
};

/**
 * Drop-in logo slot. Shows a dashed placeholder until `src` is provided,
 * then renders the actual logo image at the same footprint.
 */
export function LogoSlot({
  src,
  label,
  height = 36,
  ratio = 2.6,
  onDark = false,
  className = "",
}: LogoSlotProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={label}
        style={{ height }}
        className={`w-auto object-contain ${className}`}
      />
    );
  }

  const line = onDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.28)";
  const text = onDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)";

  return (
    <span
      className={`grid place-items-center rounded-md ${className}`}
      style={{
        height,
        width: height * ratio,
        border: `1.5px dashed ${line}`,
      }}
      aria-label={`${label} logo alanı`}
    >
      <span
        className="px-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.14em]"
        style={{ color: text }}
      >
        {label}
      </span>
    </span>
  );
}
