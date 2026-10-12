/**
 * The active theme's brand: name, logos, store policies and wording
 * (src/themes/<theme>/config.ts, chosen with NEXT_PUBLIC_THEME in .env).
 * Contact details and currency come from the shop in the inventory app.
 */
import { THEME as ACTIVE_THEME } from "@theme/config";
import type { ThemeConfig } from "@/themes/types";

/** Typed as the shared contract, so code works with every theme */
export const THEME: ThemeConfig = ACTIVE_THEME;
export const BRAND = THEME.brand;
export const LABELS = THEME.labels;

/** "01712 345678" → "8801712345678" for WhatsApp links (Bangladesh numbers) */
export function whatsappNumber(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

/** "1 piece" / "3 pieces" (or "products", per theme) */
export const itemCount = (n: number | undefined) => `${n ?? 0} ${n === 1 ? LABELS.item : LABELS.items}`;
