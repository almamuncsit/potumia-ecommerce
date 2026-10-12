/**
 * What every theme provides. A theme is a folder in src/themes/<id>/ with:
 *
 *   config.ts   brand, policies, home-page copy and wording (a ThemeConfig)
 *   content.ts  help and company page copy (ThemeContent)
 *   fonts.ts    next/font fonts, exported as `fontVariables`
 *   theme.css   CSS variables: colours, fonts, buttons, labels
 *   art.tsx     decorative artwork: ArtRings, ArtFlow, ArtPattern, ArtDivider
 *   hero.tsx    the home page hero: `Hero` (HeroProps)
 *
 * The active theme is chosen with NEXT_PUBLIC_THEME in .env and wired in at
 * build time (next.config.ts), so only its fonts, CSS and code are shipped.
 */
import type { Currency, Group, Product } from "@/lib/types";

export type ImageAsset = { src: string; width: number; height: number };

export type ThemeConfig = {
  id: string;
  brand: {
    name: string;
    /** Shown in titles and search results */
    tagline: string;
    description: string;
    domain: string;
    country: string;
    keywords: string[];
    logo: {
      /** Wide logo for light backgrounds (header) */
      onLight: ImageAsset;
      /** Wide logo for dark backgrounds (footer, dark sections) */
      onDark: ImageAsset;
      /** Square-ish logo for feature panels (story, login) on dark backgrounds */
      feature: ImageAsset;
      /** Monogram / symbol for banners */
      mark: ImageAsset;
      icon512: string;
      favicon: string;
      favicon64: string;
      appleTouch: string;
      ogImage: ImageAsset;
    };
    policies: {
      payment: string;
      exchangeDays: number;
      deliveryDhaka: string;
      deliveryOutside: string;
    };
    hours: { label: string; schema: string };
    /** Browser UI colour and app background */
    themeColor: string;
  };
  /** Words that differ by store type (fashion "pieces" vs general "products") */
  labels: {
    item: string;
    items: string;
    collection: string;
    collections: string;
    bagStory: string;
    /** Heading above related products on a product page */
    related: string;
    /** <title> of the full product list */
    catalogTitle: string;
  };
  ui: {
    /** Banner style at the top of listing and help pages */
    pageHero: "dark" | "light";
  };
  home: {
    ticker: string[];
    collections: { eyebrow: string; title: string };
    promoPrimary: { eyebrow: string; title: string; text: string; cta: string; href: string };
    promoSecondary: { eyebrow: string; title: string; text: string; cta: string; href: string };
    story: { eyebrow: string; title: string; highlight: string; text: string; cta: string };
    seo: { eyebrow: string; title: string; paragraphs: string[] };
  };
};

export type Section = { heading: string; body: string[]; list?: string[] };
export type Faq = { q: string; a: string };

export type ContentPage = {
  slug: string;
  title: string;
  /** <title> and search-result headline */
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  /** ISO date, shown on legal pages */
  updated?: string;
  sections: Section[];
};

export type ThemeContent = {
  pages: Record<string, ContentPage>;
  faqs: { group: string; items: Faq[] }[];
  /** Only themes that sell clothing have a size guide */
  sizeChart?: { headers: string[]; rows: string[][] };
};

export type HeroProps = {
  featured: Product[];
  deals: Product[];
  newArrivals: Product[];
  categories: Group[];
  currency: Currency;
  phone: string | null;
};
