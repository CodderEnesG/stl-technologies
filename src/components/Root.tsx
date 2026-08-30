import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { I18nProvider } from "../i18n";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function Root() {
  const { pathname, hash } = useLocation();

  // Hakkımızda/markalar/iletişim ayrı sayfa değil; bağlantılar çıpaya gidiyor.
  // Home lazy yüklendiği için hedef birkaç kare boyunca aranır.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    let frames = 0;
    let raf = 0;
    const find = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (frames++ < 60) raf = requestAnimationFrame(find);
    };
    raf = requestAnimationFrame(find);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return (
    <I18nProvider>
      <div className="flex min-h-full flex-col">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
        >
          İçeriğe geç
        </a>
        <Navbar />
        <main id="icerik" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
