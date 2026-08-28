/**
 * Oversized "ghosted" section label — a poster-scale word set in a very light
 * tint, with a small readable eyebrow carrying the actual meaning.
 * Semantics: the eyebrow is the real heading; the ghost word is decorative.
 */
export function SectionHeader({
  eyebrow,
  title,
  onDark = false,
  eyebrowColor = "var(--accent)",
  ghostColor,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  onDark?: boolean;
  eyebrowColor?: string;
  ghostColor?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const ghost = ghostColor ?? (onDark ? "rgba(255,255,255,0.10)" : "rgba(43,40,40,0.08)");
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: eyebrowColor }}>
        {eyebrow ?? title}
      </h2>
      <p
        aria-hidden
        className="font-expanded font-extrabold uppercase leading-[0.82] tracking-tightest"
        style={{ color: ghost, fontSize: "clamp(2.5rem, 8.5vw, 8rem)" }}
      >
        {title}
      </p>
    </div>
  );
}
