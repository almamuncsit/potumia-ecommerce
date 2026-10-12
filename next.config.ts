import type { NextConfig } from "next";

/** Product and logo images come from the inventory API's storage */
const apiUrl = new URL(process.env.API_URL ?? "http://127.0.0.1:8001/api");
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
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
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
