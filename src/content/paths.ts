/**
 * İçerik ağacında noktalı yol ("brands.wexta.about.title") ile gezinme.
 *
 * Admin paneli metinleri düz bir `yol -> metin` haritası olarak saklar; site
 * açılırken bu harita koddaki tr/en sözlüğünün üstüne bindirilir. Kod her zaman
 * yedek kalır: Supabase düşse de site kendi metniyle çalışır.
 */

export type Overrides = Record<string, string>;

/** Metin olmadığı kesin olan anahtarlar — koordinat, görsel yolu, bağlantı. */
const NON_TEXT_KEYS = new Set([
  "image",
  "hoverImage",
  "circleImage",
  "href",
  "logo",
  "icon",
  "x",
  "y",
]);

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Yoldaki değeri döndürür; yol yoksa undefined. */
export function getByPath(root: unknown, path: string): unknown {
  let cur: unknown = root;
  for (const key of path.split(".")) {
    if (Array.isArray(cur)) {
      const i = Number(key);
      if (!Number.isInteger(i)) return undefined;
      cur = cur[i];
    } else if (isPlainObject(cur)) {
      cur = cur[key];
    } else {
      return undefined;
    }
    if (cur === undefined) return undefined;
  }
  return cur;
}

/**
 * Yoldaki metni değiştirir. Yol hedefte yoksa ya da oradaki değer metin
 * değilse hiçbir şey yapmaz — bozuk/eskimiş anahtar layout'u bozamaz.
 */
export function setByPath(root: unknown, path: string, value: string): boolean {
  const keys = path.split(".");
  const last = keys.pop();
  if (!last) return false;

  let cur: unknown = root;
  for (const key of keys) {
    if (Array.isArray(cur)) {
      const i = Number(key);
      if (!Number.isInteger(i)) return false;
      cur = cur[i];
    } else if (isPlainObject(cur)) {
      cur = cur[key];
    } else {
      return false;
    }
    if (cur === undefined) return false;
  }

  if (Array.isArray(cur)) {
    const i = Number(last);
    if (!Number.isInteger(i) || typeof cur[i] !== "string") return false;
    cur[i] = value;
    return true;
  }
  if (isPlainObject(cur) && typeof cur[last] === "string") {
    cur[last] = value;
    return true;
  }
  return false;
}

/**
 * Derin kopya. `structuredClone` kullanılamaz: içerikte üç tane fonksiyon
 * yaprağı var (`reviews.count` gibi) ve structuredClone fonksiyonda hata atar.
 */
export function cloneContent<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneContent) as unknown as T;
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = cloneContent(v);
    return out as T;
  }
  return value;
}

/** Koddaki sözlüğün kopyasına admin metinlerini bindirir. */
export function applyOverrides<T>(base: T, overrides: Overrides | undefined): T {
  if (!overrides) return base;
  const entries = Object.entries(overrides);
  if (entries.length === 0) return base;

  const next = cloneContent(base);
  for (const [path, value] of entries) {
    if (typeof value !== "string") continue;
    setByPath(next, path, value);
  }
  return next;
}

export type Leaf = { path: string; value: string };

/**
 * Bir kökün altındaki tüm metin yapraklarını sırayla toplar.
 * Sayı, boolean, fonksiyon ve görsel/bağlantı alanları atlanır.
 */
export function collectStringLeaves(root: unknown, prefix: string): Leaf[] {
  const out: Leaf[] = [];

  const walk = (node: unknown, path: string, key: string) => {
    if (typeof node === "string") {
      if (!NON_TEXT_KEYS.has(key)) out.push({ path, value: node });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${path}.${i}`, key));
      return;
    }
    if (isPlainObject(node)) {
      for (const [k, v] of Object.entries(node)) {
        if (NON_TEXT_KEYS.has(k)) continue;
        walk(v, `${path}.${k}`, k);
      }
    }
    // sayı / boolean / fonksiyon: admin kapsamı dışında
  };

  const start = getByPath(root, prefix);
  if (start === undefined) return out;
  walk(start, prefix, prefix.split(".").pop() ?? prefix);
  return out;
}
