import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

/**
 * Ön-render edilen DOM devralınmaz, istemcide baştan kurulur.
 *
 * hydrateRoot denendi ve geri alındı. Rotalar `lazy` ile yükleniyor
 * (src/routes.tsx) ve yönlendiriciye HydrateFallback verilmiş değil; React
 * Router ilk render'da boş dönüyor, ardından chunk gelince gerçek ağacı
 * ekliyor. Sonuç devralma değil, ikizleme oluyordu: #root altında biri
 * ön-render'dan kalan öksüz, diğeri React'in kurduğu iki ağaç; sayfadaki her
 * görsel ve bağlantı iki kez. Ölçüldü ve doğrulandı (2026-09-11).
 *
 * Gerçek çözüm yönlendiriciyi değiştirmek: ya eşleşen rotayı eager yapmak
 * (ilk paketi ~30 KB gzip büyütür, mobilde yeni düzelttiğimiz LCP'yi geri
 * bozabilir) ya da React Router'ın kendi SSR kipine geçmek. İkisi de bu işin
 * kapsamı dışında; not olarak duruyor.
 */
const container = document.getElementById('root')!

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
