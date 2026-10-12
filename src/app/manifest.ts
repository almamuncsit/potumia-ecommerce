import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} | ${BRAND.tagline}`,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0e0d0b",
    theme_color: "#0e0d0b",
    icons: [
      { src: "/brand/favicon-64.png", sizes: "64x64", type: "image/png" },
      { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: BRAND.logo.icon512, sizes: "512x512", type: "image/png" },
    ],
  };
}
