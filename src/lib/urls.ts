/** Public URLs of store pages. Products, categories and brands are "/<id>-<slug>". */

type Sluggable = { id: number; slug: string };

/** The public address: https://evokefashionbd.com (local development sets localhost in .env.local) */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://evokefashionbd.com").replace(/\/+$/, "");

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const productPath = (p: Sluggable) => `/products/${p.id}-${p.slug}`;
export const categoryPath = (c: Sluggable) => `/categories/${c.id}-${c.slug}`;
export const brandPath = (b: Sluggable) => `/brands/${b.id}-${b.slug}`;

/** "12-blue-widget" → { id: 12, slug: "blue-widget" }; null when it doesn't start with an id */
export function parseIdSlug(value: string): { id: number; slug: string } | null {
  const match = /^(\d+)(?:-(.*))?$/.exec(decodeURIComponent(value));
  if (!match) return null;
  return { id: Number(match[1]), slug: match[2] ?? "" };
}
