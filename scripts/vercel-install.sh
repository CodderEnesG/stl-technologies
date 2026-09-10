#!/usr/bin/env bash
# Vercel kurulum adımı.
#
# Derleme imajı Amazon Linux 2023 ve Chromium'un ihtiyaç duyduğu kütüphaneler
# içinde yok: ön-render tarayıcısı "libnspr4.so: cannot open shared object
# file" ile 127 dönüp kapanıyor, sayfa gövdeleri de üretilemiyordu.
# Liste Playwright'ın Red Hat ailesi için saydığı bağımlılıklar.
#
# dnf kurulumu başarısız olursa derleme durmuyor: site yayında kalsın, yalnızca
# gövde ön-render'ı düşsün. Betik vercel.json içindeki installCommand'den
# çağrılıyor (o alanın 256 karakter sınırı var).
set -uo pipefail

DEPS="alsa-lib atk at-spi2-atk at-spi2-core cups-libs libdrm libX11 \
libXcomposite libXdamage libXext libXfixes libXrandr libxcb libxkbcommon \
mesa-libgbm nspr nss pango"

if command -v dnf >/dev/null 2>&1; then
  # shellcheck disable=SC2086
  dnf install -y $DEPS || echo "UYARI: sistem kütüphaneleri kurulamadı, gövde ön-render'ı düşebilir"
else
  echo "UYARI: dnf yok, sistem kütüphaneleri atlandı"
fi

set -e
pnpm install
