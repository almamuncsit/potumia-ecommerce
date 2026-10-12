import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Theme: NEXT_PUBLIC_THEME in .env picks a folder in src/themes/ (evoke,
 * potumia, …). `@theme/<file>` imports resolve to that folder, so only the
 * active theme's fonts, CSS and code are built. Restart `next dev` (or
 * rebuild) after changing it.
 */
const themesDir = path.join(process.cwd(), "src", "themes");
const theme = (process.env.NEXT_PUBLIC_THEME ?? "evoke").trim();
const themes = fs.readdirSync(themesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
if (!themes.includes(theme)) {
  throw new Error(`NEXT_PUBLIC_THEME="${theme}" is not a theme. Available: ${themes.join(", ")} (folders in src/themes).`);
}
const themeFiles = { config: "config.ts", content: "content.ts", fonts: "fonts.ts", art: "art.tsx", hero: "hero.tsx", "theme.css": "theme.css" };
const themeAlias = Object.fromEntries(Object.entries(themeFiles).map(([name, file]) => [`@theme/${name}`, `./src/themes/${theme}/${file}`]));

/** Product and logo images come from the inventory API's storage */
const apiUrl = new URL(process.env.API_URL ?? "http://127.0.0.1:8001/api");
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_THEME: theme },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // The dev server is also reached through the Cloudflare tunnel (preview link)
  allowedDevOrigins: ["store.artofcse.com"],
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/storage/**",
      },
      // Product photos linked from Unsplash (demo catalog)
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    // The local API runs on 127.0.0.1; only allowed while developing
    dangerouslyAllowLocalIP: isDev,
  },
  cacheLife: {
    // Products, prices and stock: fresh within a few minutes
    // stale must be ≥ 5 min or the data is left out of the prerendered page shell
    catalog: { stale: 300, revalidate: 300, expire: 3600 },
    // Shop name, logo, contact details
    store: { stale: 300, revalidate: 3600, expire: 86400 },
  },
  turbopack: {
    resolveAlias: themeAlias,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
