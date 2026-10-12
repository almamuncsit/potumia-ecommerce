"use client";

import { useEffect, useMemo, useState } from "react";
import type { Currency, ProductDetail, ProductVariant } from "@/lib/types";
import { Money, Price } from "../price";
import { AddToCart } from "./add-to-cart";

/** Colors we can show as a swatch next to the name */
const SWATCHES: Record<string, string> = {
  black: "#111827", white: "#ffffff", red: "#dc2626", maroon: "#7f1d1d", pink: "#ec4899", orange: "#f97316",
  yellow: "#facc15", gold: "#d4a017", green: "#16a34a", olive: "#6b7d2a", teal: "#0d9488", blue: "#2563eb",
  navy: "#1e3a8a", sky: "#38bdf8", purple: "#7c3aed", brown: "#7c4a21", beige: "#e8d9bf", cream: "#f5ecd7",
  grey: "#9ca3af", gray: "#9ca3af", silver: "#c0c0c0", khaki: "#bdb06b",
};
const swatchOf = (value: string) => SWATCHES[value.trim().toLowerCase()] ?? null;
const isColorOption = (name: string) => /colou?r|shade/i.test(name);

const matches = (v: ProductVariant, chosen: Record<string, string | undefined>) =>
  Object.entries(chosen).every(([name, value]) => value === undefined || v.values[name] === value);

/**
 * Buying a product with variations: pick a value for each option (Color,
 * Size …); the matching variation sets the price, the stock and what goes in
 * the bag. Values with no stock are struck through; combinations the shop
 * doesn't make can't be picked.
 */
export function VariantBuyBox({ product, currency, payment }: { product: ProductDetail; currency: Currency; payment: string }) {
  const options = useMemo(() => product.options ?? [], [product.options]);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  // Start on the first variation in stock (or nothing chosen when all are sold out)
  const [chosen, setChosen] = useState<Record<string, string | undefined>>(() => {
    const first = variants.find((v) => v.in_stock);
    return first ? { ...first.values } : {};
  });

  const complete = options.every((o) => chosen[o.name] !== undefined);
  const selected = complete ? variants.find((v) => matches(v, chosen)) ?? null : null;
  const missing = options.find((o) => chosen[o.name] === undefined)?.name;

  const choose = (name: string, value: string) => {
    const next = { ...chosen, [name]: chosen[name] === value ? undefined : value };
    // That combination isn't made: keep the new value, move the others to an available one
    if (next[name] !== undefined && options.every((o) => next[o.name] !== undefined) && !variants.some((v) => matches(v, next))) {
      const fit = variants.find((v) => v.values[name] === value && v.in_stock) ?? variants.find((v) => v.values[name] === value);
      if (fit) return setChosen({ ...fit.values });
    }
    setChosen(next);
  };

  // A variation with its own photo shows it in the gallery
  useEffect(() => {
    if (selected?.image) window.dispatchEvent(new CustomEvent("product-photo", { detail: selected.image }));
  }, [selected?.image]);

  const lowStock = selected ? selected.in_stock && selected.stock <= 5 : false;

  return (
    <div>
      <div className="mt-5">
        {selected ? (
          <Price price={selected.price} regular={selected.regular_price} currency={currency} size="lg" />
        ) : (
          <span className="font-display text-3xl font-medium">
            {product.price_from && <span className="mr-2 font-sans text-base font-normal text-muted">From</span>}
            <Money amount={product.price} currency={currency} />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted">{payment} available · Delivery charge confirmed with your order</p>

      <div className="mt-6 space-y-5">
        {options.map((option) => {
          const others = Object.fromEntries(Object.entries(chosen).filter(([n]) => n !== option.name));
          const color = isColorOption(option.name);
          return (
            <fieldset key={option.name}>
              <legend className="text-sm">
                <span className="font-medium">{option.name}</span>
                {chosen[option.name] && <span className="text-muted">: {chosen[option.name]}</span>}
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const withValue = variants.filter((v) => v.values[option.name] === value && matches(v, others));
                  const made = withValue.length > 0;
                  const inStock = withValue.some((v) => v.in_stock);
                  const active = chosen[option.name] === value;
                  const swatch = color ? swatchOf(value) : null;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => choose(option.name, value)}
                      disabled={!made && !variants.some((v) => v.values[option.name] === value)}
                      aria-pressed={active}
                      title={!made ? `Not available with this ${Object.keys(others).join(" / ").toLowerCase() || "choice"}` : !inStock ? "Sold out" : value}
                      className={`relative inline-flex min-h-10 min-w-12 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm transition ${
                        active
                          ? "border-accent-strong bg-accent-strong/10 font-semibold text-accent-strong ring-2 ring-accent-strong/30"
                          : "border-line bg-card hover:border-accent-strong"
                      } ${!made || !inStock ? "text-muted" : ""} disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {swatch && <span aria-hidden="true" className="h-4 w-4 rounded-full ring-1 ring-black/15" style={{ background: swatch }} />}
                      <span className={!inStock ? "line-through decoration-1" : ""}>{value}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      {selected && (
        <p className={`mt-6 flex items-center gap-2 text-sm font-medium ${selected.in_stock ? (lowStock ? "text-sale" : "text-ok") : "text-muted"}`}>
          <span className={`h-2 w-2 rounded-full ${selected.in_stock ? (lowStock ? "bg-sale" : "bg-ok") : "bg-muted"}`} />
          {!selected.in_stock ? `${selected.label} is sold out` : lowStock ? `Only ${Math.floor(selected.stock)} left in ${selected.label}` : "In stock, ready to ship"}
        </p>
      )}

      <div className="mt-6">
        {selected ? (
          <AddToCart
            key={selected.id}
            product_id={selected.id}
            slug={product.slug}
            name={`${product.name} - ${selected.label}`}
            image={selected.image ?? product.image ?? product.thumb}
            price={selected.price}
            max={selected.stock}
            inStock={selected.in_stock}
          />
        ) : (
          <button type="button" disabled className="btn btn-primary w-full opacity-60">
            Choose {missing ? missing.toLowerCase() : "options"}
          </button>
        )}
      </div>
    </div>
  );
}
