/**
 * The Evoke brand: name, voice and the store policies shown across the site
 * (banners, product pages, help pages, structured data, llms.txt).
 *
 * Contact details (phone, email, address) and the currency come from the
 * shop in the inventory app, so they stay in one place.
 *
 * Review the policy values below before launch: they appear on the Shipping,
 * Returns and FAQ pages and in the banners.
 */
export const BRAND = {
  name: "Evoke",
  /** Shown in titles and search results */
  tagline: "Premium Fashion Online in Bangladesh",
  description:
    "Evoke is a premium fashion label from Bangladesh. Shop refined everyday wear and occasion pieces online, with cash on delivery across the country and easy exchanges.",
  domain: "evokefashionbd.com",
  country: "Bangladesh",
  logo: {
    horizontal: { src: "/brand/evoke-logo-horizontal.png", width: 524, height: 116 },
    stacked: { src: "/brand/evoke-logo.png", width: 489, height: 472 },
    mark: { src: "/brand/evoke-mark.png", width: 482, height: 324 },
    icon512: "/brand/icon-512.png",
    ogImage: { src: "/brand/og-image.jpg", width: 1200, height: 630 },
  },
  policies: {
    payment: "Cash on delivery",
    exchangeDays: 7,
    deliveryDhaka: "1–3 working days",
    deliveryOutside: "3–5 working days",
  },
  /** Customer service hours (Contact page and structured data) */
  hours: { label: "Saturday – Thursday, 10:00 am – 8:00 pm", schema: "Sa-Th 10:00-20:00" },
} as const;

/** "01712 345678" → "8801712345678" for WhatsApp links (Bangladesh numbers) */
export function whatsappNumber(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}
