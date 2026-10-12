import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} | ${BRAND.tagline}`,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: BRAND.themeColor,
    theme_color: BRAND.themeColor,
    icons: [
      { src: BRAND.logo.favicon64, sizes: "64x64", type: "image/png" },
      { src: BRAND.logo.appleTouch, sizes: "180x180", type: "image/png" },
      { src: BRAND.logo.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
}
