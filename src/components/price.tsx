import { formatMoney } from "@/lib/money";
import type { Currency } from "@/lib/types";

/**
 * An amount with its currency symbol. The headline serif has no "৳", so the
 * symbol is set in the body font at a matching size, and digits are lining
 * (even height) for easy reading.
 */
export function Money({ amount, currency }: { amount: number; currency: Currency }) {
  const text = formatMoney(amount, currency);
  const at = text.indexOf(currency.symbol);
  if (at < 0) return <span className="lining-nums">{text}</span>;

  return (
    <span className="lining-nums whitespace-nowrap">
      {text.slice(0, at)}
      <span className="mr-0.5 font-sans text-[0.8em] font-normal">{currency.symbol}</span>
      {text.slice(at + currency.symbol.length)}
    </span>
  );
}

/** Price, with the regular price struck through when it's on sale */
export function Price({
  price,
  regular,
  currency,
  size = "md",
}: {
  price: number;
  regular?: number | null;
  currency: Currency;
  size?: "md" | "lg";
}) {
  const big = size === "lg";

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={`${big ? "font-display text-3xl font-medium" : "text-[0.95rem] font-medium"} ${regular ? "text-sale" : ""}`}>
        <Money amount={price} currency={currency} />
      </span>
      {regular ? (
        <>
          <s className={`text-muted ${big ? "text-lg" : "text-sm"}`}>
            <span className="sr-only">Regular price </span>
            <Money amount={regular} currency={currency} />
          </s>
          {big && (
            <span className="eyebrow rounded-full bg-sale/10 px-2.5 py-1 text-[0.62rem] text-sale">
              Save {Math.round(((regular - price) / regular) * 100)}%
            </span>
          )}
        </>
      ) : null}
    </span>
  );
}
