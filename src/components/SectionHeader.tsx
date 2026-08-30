/**
 * Bölüm başlığı: küçük renkli eyebrow + net okunur başlık + opsiyonel açıklama.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  onDark = false,
  eyebrowColor = "var(--accent)",
  align = "left",
  className = "",
  titleFont = "font-display",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  onDark?: boolean;
  eyebrowColor?: string;
  align?: "left" | "center";
  className?: string;
  titleFont?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: eyebrowColor }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={`${titleFont} text-3xl font-bold leading-[1.08] tracking-tightest md:text-[2.75rem]`}>
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed md:text-lg ${center ? "mx-auto" : ""}`}
          style={{ color: onDark ? "rgba(255,255,255,0.65)" : "var(--muted)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
