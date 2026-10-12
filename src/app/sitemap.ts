import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/catalog";
import { absoluteUrl, brandPath, categoryPath, productPath } from "@/lib/urls";

/** Every public page, with when it last changed and the product images */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, categories, brands } = await getIndex();
  const latest = [...products, ...categories, ...brands]
    .map((item) => item.updated_at)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/products"), lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categories"), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/brands"), changeFrequency: "weekly", priority: 0.4 },
    // Help and company pages
    ...["/about", "/contact", "/faq", "/shipping", "/returns", "/size-guide"].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...["/privacy", "/terms"].map((path) => ({ url: absoluteUrl(path), changeFrequency: "yearly" as const, priority: 0.2 })),
    ...categories.map((c) => ({
      url: absoluteUrl(categoryPath(c)),
      lastModified: c.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...brands.map((b) => ({
      url: absoluteUrl(brandPath(b)),
      lastModified: b.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...products.map((p) => ({
      url: absoluteUrl(productPath(p)),
      lastModified: p.updated_at ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.image ? [p.image] : undefined,
    })),
  ];
}
