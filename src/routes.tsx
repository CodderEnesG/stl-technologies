import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./components/Root";

const page = (importer: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await importer()).default,
});

const legal = () => import("./pages/Legal");

const children = [
  { index: true, lazy: page(() => import("./pages/Home")) },
  { path: "oxyra", lazy: page(() => import("./pages/Oxyra")) },
  { path: "fressi", lazy: page(() => import("./pages/Fressi")) },
  { path: "wexta", lazy: page(() => import("./pages/Wexta")) },
  { path: "bnk", lazy: page(() => import("./pages/BNK")) },
];

/** Yasal metinler — dil başına farklı yol, bileşen aynı (yolundan hangi metin olduğunu anlar) */
const legalChildren = [
  { path: "kvkk", lazy: page(legal) },
  { path: "gizlilik", lazy: page(legal) },
];
const legalChildrenEn = [
  { path: "gdpr", lazy: page(legal) },
  { path: "privacy", lazy: page(legal) },
];

export const router = createBrowserRouter([
  // İçerik yönetim paneli — site kabuğunun (navbar/footer/i18n) dışında,
  // ayrı bir chunk. Supabase kütüphanesi yalnızca bu dalda yüklenir.
  { path: "/admin", lazy: page(() => import("./admin/AdminApp")) },
  {
    path: "/",
    Component: Root,
    children: [
      ...children,
      ...legalChildren,
      { path: "en", children: [...children, ...legalChildrenEn] },
      { path: "*", lazy: page(() => import("./pages/NotFound")) },
    ],
  },
]);
