import type { ThemeConfig } from "../types";

/**
 * Potumia: the default storefront for shops on Potumia, in the style of the
 * Potumia website. White pages with a soft indigo / sky glow, an indigo →
 * violet gradient, bold Plus Jakarta Sans headlines and Inter for text.
 *
 * Review the policies before launch: they appear on the Shipping, Returns and
 * FAQ pages, in the banners and in structured data.
 */
export const THEME = {
  id: "potumia",
  brand: {
    name: "Potumia Shop",
    tagline: "Shop Online with Cash on Delivery in Bangladesh",
    description:
      "Potumia Shop brings everyday products to your door at fair prices. Order online, pay with cash on delivery anywhere in Bangladesh, and exchange easily if something isn't right.",
    domain: "potumia.com",
    country: "Bangladesh",
    keywords: ["Potumia", "Potumia Shop", "online shopping Bangladesh", "cash on delivery", "buy online BD", "home delivery Bangladesh"],
    logo: {
      onLight: { src: "/themes/potumia/logo.svg", width: 557, height: 158 },
      onDark: { src: "/themes/potumia/logo-dark.svg", width: 557, height: 158 },
      feature: { src: "/themes/potumia/logo-dark.svg", width: 557, height: 158 },
      mark: { src: "/themes/potumia/icon.svg", width: 180, height: 180 },
      icon512: "/themes/potumia/icon-512.png",
      favicon: "/themes/potumia/favicon.ico",
      favicon64: "/themes/potumia/icon-192.png",
      appleTouch: "/themes/potumia/apple-touch-icon.png",
      ogImage: { src: "/themes/potumia/og-store.png", width: 1200, height: 630 },
    },
    policies: {
      payment: "Cash on delivery",
      exchangeDays: 7,
      deliveryDhaka: "1–2 working days",
      deliveryOutside: "3–5 working days",
    },
    hours: { label: "Saturday – Thursday, 9:00 am – 9:00 pm", schema: "Sa-Th 09:00-21:00" },
    themeColor: "#4f46e5",
  },
  labels: {
    item: "product",
    items: "products",
    collection: "Category",
    collections: "Categories",
    bagStory: "Browse our categories and add what you need. You pay only when it arrives.",
    catalogTitle: "Shop All Products Online",
    related: "Customers also bought",
  },
  ui: { pageHero: "light" },
  home: {
    ticker: ["Cash on delivery", "Delivery all over Bangladesh", "7-day easy exchange", "Genuine products"],
    collections: { eyebrow: "Browse", title: "Shop by category" },
    promoPrimary: {
      eyebrow: "Just in",
      title: "New arrivals",
      text: "Fresh stock added every week. Be the first to get it.",
      cta: "See what's new",
      href: "/products?sort=newest",
    },
    promoSecondary: {
      eyebrow: "Shop with confidence",
      title: "Pay when it arrives",
      text: "Cash on delivery everywhere, and easy exchanges if something isn't right.",
      cta: "How delivery works",
      href: "/shipping",
    },
    story: {
      eyebrow: "Why shop with us",
      title: "Everyday shopping, made simple",
      highlight: "made simple",
      text: "Potumia Shop is run on Potumia, so the stock you see is the stock we have. Prices are clear, orders are confirmed by a real person, and you pay only when your parcel reaches you.",
      cta: "About us",
    },
    seo: {
      eyebrow: "Online shopping in Bangladesh",
      title: "Everything you need, delivered to your door",
      paragraphs: [
        "Potumia Shop is an online store for everyday products in Bangladesh. Browse by category, compare prices, check what's in stock and order in a few taps, from your phone or computer.",
      ],
    },
  },
} satisfies ThemeConfig;
