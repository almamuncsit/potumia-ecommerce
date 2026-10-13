import "server-only";
import { cache } from "react";
import { CONTENT } from "@/content/pages";
import type { ThemeConfig, ThemeContent } from "@/themes/types";
import { THEME, whatsappNumber } from "./brand";
import { getStore } from "./catalog";
import type { Store } from "./types";
import { siteUrl } from "./urls";

/**
 * The brand as the store shows it: the theme's defaults, filled in from the
 * shop. Themes made for any shop (`brand.fromShop`, e.g. Potumia) take the
 * name and logo from the shop info; every theme takes the Store details set
 * in the inventory app (Settings → Online store): tagline, about text,
 * WhatsApp, hours, delivery times, exchange days, social links.
 *
 * Theme copy writes {name}, {exchangeDays}, {deliveryDhaka}, {deliveryOutside}
 * and {hours} where these belong; `fill` puts the shop's values in.
 */

export type ShopLogo = { src: string; width: number; height: number; /** Wide enough to stand without the name */ wide: boolean };

export type SiteBrand = Omit<ThemeConfig["brand"], "hours"> & {
  fromShop: boolean;
  /** The shop's own logo (fromShop themes); null: show the name */
  shopLogo: ShopLogo | null;
  /** Its version for dark backgrounds (Store details); null: the logo on a white tile */
  shopLogoDark: ShopLogo | null;
  /** Browser-tab icon and link-preview picture from Store details (every theme); null: the theme's */
  favicon: string | null;
  shareImage: { url: string; width?: number; height?: number } | null;
  hours: { label: string; schema?: string };
  /** Digits for wa.me links */
  whatsapp: string | null;
  socials: { label: "Facebook" | "Instagram" | "YouTube" | "TikTok"; href: string }[];
  announcement: string | null;
};

type Vars = Record<string, string>;

/** Puts the shop's values into {placeholders}, in strings, arrays and objects */
export function fill<T>(value: T, vars: Vars): T {
  if (typeof value === "string") return value.replace(/\{(\w+)\}/g, (m, key: string) => vars[key] ?? m) as T;
  if (Array.isArray(value)) return value.map((v) => fill(v, vars)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fill(v, vars)])) as T;
  }
  return value;
}

const hostOf = (url: string | null | undefined) => {
  try {
    return url ? new URL(url).host.replace(/^www\./, "") : null;
  } catch {
    return null;
  }
};

function resolve(store: Store): { brand: SiteBrand; vars: Vars } {
  const theme = THEME.brand;
  const profile = store.profile ?? {};
  const fromShop = Boolean(theme.fromShop);

  const name = (fromShop && store.name?.trim()) || theme.name;
  const policies = {
    ...theme.policies,
    exchangeDays: profile.exchange_days ?? theme.policies.exchangeDays,
    deliveryDhaka: profile.delivery_dhaka || theme.policies.deliveryDhaka,
    deliveryOutside: profile.delivery_outside || theme.policies.deliveryOutside,
  };
  const hours = profile.hours ? { label: profile.hours } : theme.hours;
  const vars: Vars = {
    name,
    exchangeDays: String(policies.exchangeDays),
    deliveryDhaka: policies.deliveryDhaka,
    deliveryOutside: policies.deliveryOutside,
    hours: hours.label,
  };

  const images = profile.images ?? {};
  const asLogo = (src: string, w?: number | null, h?: number | null): ShopLogo => {
    const width = w || 160;
    const height = h || 160;
    return { src, width, height, wide: width / height >= 2.2 };
  };
  // The website logo from Store details, else the Shop info logo
  let shopLogo: ShopLogo | null = null;
  if (fromShop && images.logo) shopLogo = asLogo(images.logo.url, images.logo.width, images.logo.height);
  else if (fromShop && store.logo) shopLogo = asLogo(store.logo, store.logo_width, store.logo_height);
  const shopLogoDark = fromShop && images.logo_dark ? asLogo(images.logo_dark.url, images.logo_dark.width, images.logo_dark.height) : null;
  const share = images.share_image;

  const socials = (
    [
      ["Facebook", profile.facebook],
      ["Instagram", profile.instagram],
      ["YouTube", profile.youtube],
      ["TikTok", profile.tiktok],
    ] as const
  )
    .filter(([, href]) => href)
    .map(([label, href]) => ({ label, href: href as string }));

  const brand: SiteBrand = {
    ...fill(theme, vars),
    name,
    tagline: profile.tagline || fill(theme.tagline, vars),
    description: profile.about || fill(theme.description, vars),
    // The address the store runs at; while developing (localhost), the website's address in the shop
    domain: fromShop ? (/localhost|127\.0\.0\.1/.test(siteUrl) ? hostOf(store.website_url) : hostOf(siteUrl)) ?? theme.domain : theme.domain,
    policies,
    hours,
    fromShop,
    shopLogo,
    shopLogoDark,
    favicon: images.favicon?.url ?? null,
    shareImage: share ? { url: share.url, width: share.width ?? undefined, height: share.height ?? undefined } : null,
    whatsapp: whatsappNumber(profile.whatsapp || store.phone),
    socials,
    announcement: profile.announcement || null,
  };

  return { brand, vars };
}

const resolved = cache(async () => resolve(await getStore()));

/** The brand: name, logo, policies, hours, contact links */
export async function getShopBrand(): Promise<SiteBrand> {
  return (await resolved()).brand;
}

/** Home-page copy of the theme, with the shop's name and policies */
export async function getHomeCopy(): Promise<ThemeConfig["home"]> {
  return fill(THEME.home, (await resolved()).vars);
}

/** Help and company pages (About, Shipping, FAQ …) with the shop's name and policies */
export async function getContent(): Promise<ThemeContent> {
  return fill(CONTENT, (await resolved()).vars);
}

/** One help or company page ("about", "shipping" …); undefined when the theme has none */
export async function getPage(slug: string) {
  return (await getContent()).pages[slug];
}
