import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useI18n } from "../i18n";
import { getConsent, setConsent, subscribeConsent, type ConsentChoice } from "../lib/consent";

/**
 * Çerez onay bandı. İlk kare boş render edilir: tercih localStorage'dan
 * efektte okunur, böylece ön-render çıktısıyla istemci render'ı çakışmaz.
 * Ön-render anlık görüntüsünde bant `data-cookie-banner` ile ayıklanıyor
 * (scripts/prerender.mjs), statik HTML'e gömülmesin diye.
 */
export function CookieBanner() {
  const { t, p } = useI18n();
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(getConsent() === null);
    sync();
    return subscribeConsent(sync);
  }, []);

  // Girişte aşağıdan yükselsin; görünür olduktan sonraki karede sınıf değişir.
  useEffect(() => {
    if (!visible) {
      setShown(false);
      return;
    }
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible) return null;

  const choose = (choice: ConsentChoice) => () => setConsent(choice);

  return (
    <div
      data-cookie-banner
      role="dialog"
      aria-label={t.cookies.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        className={`mx-auto flex max-w-[860px] flex-col gap-4 rounded-2xl border bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition-all duration-500 sm:flex-row sm:items-center sm:gap-6 ${
          shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex-1">
          <h2 className="text-sm font-semibold">{t.cookies.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {t.cookies.body}{" "}
            <Link to={p.privacy} className="underline underline-offset-2 hover:text-foreground">
              {t.cookies.policy}
            </Link>
          </p>
        </div>

        {/* İki seçenek de aynı boyutta: reddetmek kabul etmek kadar kolay olmalı. */}
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={choose("denied")}
            className="min-w-[104px] rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
            style={{ borderColor: "var(--border)" }}
          >
            {t.cookies.reject}
          </button>
          <button
            type="button"
            onClick={choose("granted")}
            className="min-w-[104px] rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
