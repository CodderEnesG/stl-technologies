import { Link } from "react-router";
import { useI18n } from "../i18n";
import { Arrow } from "../components/Arrow";

export default function NotFound() {
  const { t, p } = useI18n();
  return (
    <section className="mx-auto flex max-w-[1400px] flex-col items-start gap-6 px-5 py-32 md:px-8">
      <h1 className="font-expanded text-6xl font-black uppercase tracking-tightest text-[var(--accent)] md:text-8xl">404</h1>
      <p className="font-display text-2xl font-bold tracking-tightest">{t.notFound.title}</p>
      <p className="max-w-md text-muted">{t.notFound.body}</p>
      <Link
        to={p.home}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        {t.notFound.home} <Arrow />
      </Link>
    </section>
  );
}
