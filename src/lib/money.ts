import type { Currency } from "./types";

/** 1234.5 → "৳1,234.50" (or "1,234.50 ৳" for shops that put the symbol after) */
export function formatMoney(amount: number, currency: Currency): string {
  const digits = Math.max(0, Math.min(4, currency.decimals ?? 2));
  const number = new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);

  return currency.position === "right" ? `${number} ${currency.symbol}` : `${currency.symbol}${number}`;
}
