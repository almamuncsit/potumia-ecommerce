import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/urls";

/**
 * Search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended…) are all welcome on the catalog; personal pages are off
 * limits. /llms.txt gives AI assistants a plain-text summary of the store.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Search and filter pages stay crawlable: they carry "noindex" so
        // they're kept out of results while their product links are followed
        disallow: ["/account", "/cart", "/checkout"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
