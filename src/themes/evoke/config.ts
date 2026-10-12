import type { ThemeConfig } from "../types";

/**
 * Evoke: a premium fashion label. Ink black, ivory and brushed gold from the
 * logo, an elegant serif for headlines.
 *
 * Review the policies before launch: they appear on the Shipping, Returns and
 * FAQ pages, in the banners and in structured data.
 */
export const THEME = {
  id: "evoke",
  brand: {
    name: "Evoke",
    tagline: "Premium Fashion Online in Bangladesh",
    description:
      "Evoke is a premium fashion label from Bangladesh. Shop refined everyday wear and occasion pieces online, with cash on delivery across the country and easy exchanges.",
    domain: "evokefashionbd.com",
    country: "Bangladesh",
    keywords: ["Evoke", "Evoke fashion", "online shopping Bangladesh", "fashion Bangladesh", "cash on delivery", "clothing online BD"],
    logo: {
      onLight: { src: "/brand/evoke-logo-horizontal.png", width: 524, height: 116 },
      onDark: { src: "/brand/evoke-logo-horizontal.png", width: 524, height: 116 },
      feature: { src: "/brand/evoke-logo.png", width: 489, height: 472 },
      mark: { src: "/brand/evoke-mark.png", width: 482, height: 324 },
      icon512: "/brand/icon-512.png",
      favicon: "/brand/favicon.ico",
      favicon64: "/brand/favicon-64.png",
      appleTouch: "/brand/apple-touch-icon.png",
      ogImage: { src: "/brand/og-image.jpg", width: 1200, height: 630 },
    },
    policies: {
      payment: "Cash on delivery",
      exchangeDays: 7,
      deliveryDhaka: "1–3 working days",
      deliveryOutside: "3–5 working days",
    },
    hours: { label: "Saturday – Thursday, 10:00 am – 8:00 pm", schema: "Sa-Th 10:00-20:00" },
    themeColor: "#0e0d0b",
  },
  labels: { item: "piece", items: "pieces", collection: "Collection", collections: "Collections", bagStory: "Discover the new collection and find something you love.", catalogTitle: "Shop All Clothing Online", related: "Complete the look" },
  ui: { pageHero: "dark", layout: "boutique" },
  home: {
    ticker: ["New season collection", "Cash on delivery nationwide", "7-day easy exchange", "Quality checked", "Designed in Bangladesh"],
    collections: { eyebrow: "Explore", title: "Shop by collection" },
    promoPrimary: { eyebrow: "Just landed", title: "New arrivals", text: "Fresh pieces for the season ahead, added every week.", cta: "Shop new in", href: "/products?sort=newest" },
    promoSecondary: { eyebrow: "The Evoke way", title: "Quality you can feel", text: "Considered fabrics, clean cuts, lasting wear.", cta: "Our story", href: "/about" },
    story: {
      eyebrow: "Our story",
      title: "Fashion that evokes who you are",
      highlight: "evokes",
      text: "Evoke is a Bangladeshi label built on a simple belief: everyday clothing deserves the care of an occasion piece. We choose fabrics for how they feel and last, and cut them into clean silhouettes you'll reach for again and again.",
      cta: "Discover our story",
    },
    seo: {
      eyebrow: "Shop online with Evoke",
      title: "Premium fashion, delivered across Bangladesh",
      paragraphs: [
        "Evoke is an online fashion store for refined, wearable clothing in Bangladesh. Browse our latest collection, find your size with our size guide, and order in a few taps.",
      ],
    },
  },
} satisfies ThemeConfig;
