import { useState } from "react";
import { Arrow } from "./Arrow";

export type NewsItem = { tag: string; title: string; body: string };

/**
 * Numbered announcement ticker with a red active underline, floating on an
 * elevated white card. Inspired by Arçelik Global's homepage news rail.
 */
export function NewsTicker({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="mx-auto max-w-[1240px] px-5 md:px-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-2 border-b border-border md:grid-cols-4">
          {items.map((it, i) => {
            const on = i === active;
            return (
              <button
                key={it.title}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="relative border-r border-border px-5 py-6 text-left transition-colors last:border-r-0 hover:bg-[var(--surface)]"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-left transition-transform duration-300"
                  style={{ background: "var(--accent)", transform: on ? "scaleX(1)" : "scaleX(0)" }}
                />
                <span
                  className="font-display text-lg font-extrabold tabular-nums"
                  style={{ color: on ? "var(--accent)" : "var(--muted)" }}
                >
                  0{i + 1}
                </span>
                <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {it.tag}
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tightest md:text-2xl">{current.title}</h3>
            <p className="mt-2 max-w-2xl text-muted">{current.body}</p>
          </div>
          <span className="grid size-11 place-items-center rounded-full bg-[var(--accent)] text-white">
            <Arrow />
          </span>
        </div>
      </div>
    </div>
  );
}
