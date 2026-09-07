import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./components/Root";

const page = (importer: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await importer()).default,
});

const children = [
  { index: true, lazy: page(() => import("./pages/Home")) },
  { path: "oxyra", lazy: page(() => import("./pages/Oxyra")) },
  { path: "fressi", lazy: page(() => import("./pages/Fressi")) },
  { path: "wexta", lazy: page(() => import("./pages/Wexta")) },
  { path: "bnk", lazy: page(() => import("./pages/BNK")) },
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
      { path: "en", children: [...children] },
      { path: "*", lazy: page(() => import("./pages/NotFound")) },
    ],
  },
]);
