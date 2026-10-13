import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { getShopBrand } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const brand = await getShopBrand();
  const logo = brand.shopLogo;

  return {
    name: `${brand.name} | ${brand.tagline}`,
    short_name: brand.name,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.themeColor,
    theme_color: BRAND.themeColor,
    icons: brand.favicon
      ? [{ src: brand.favicon, sizes: "any" }]
      : logo
        ? [{ src: logo.src, sizes: `${logo.width}x${logo.height}` }]
        : [
            { src: BRAND.logo.favicon64, sizes: "64x64", type: "image/png" },
            { src: BRAND.logo.appleTouch, sizes: "180x180", type: "image/png" },
            { src: BRAND.logo.icon512, sizes: "512x512", type: "image/png" },
          ],
  };
}
