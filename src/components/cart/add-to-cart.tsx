"use client";

import Link from "next/link";
import { useState } from "react";
import { LABELS } from "@/lib/brand";
import { BagIcon, MinusIcon, PlusIcon } from "../icons";
import { cart, useCart, type CartLine } from "./cart-store";

type Props = Omit<CartLine, "quantity"> & { inStock: boolean };

/** − / + quantity picker */
export function QuantityStepper({ value, max, onChange, label }: { value: number; max: number; onChange: (n: number) => void; label: string }) {
  const set = (n: number) => onChange(Math.max(1, Math.min(n || 1, Math.max(1, max))));

  return (
    <div className="inline-flex h-12 items-center rounded-full border border-line bg-card">
      <button type="button" onClick={() => set(value - 1)} disabled={value <= 1} aria-label={`Fewer ${label}`} className="grid h-full w-11 place-items-center rounded-l-full hover:bg-surface disabled:opacity-35">
        <MinusIcon className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={Math.max(1, max)}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={`Quantity of ${label}`}
        className="h-full w-10 bg-transparent text-center text-sm font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => set(value + 1)} disabled={value >= max} aria-label={`More ${label}`} className="grid h-full w-11 place-items-center rounded-r-full hover:bg-surface disabled:opacity-35">
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AddToCart({ inStock, ...line }: Props) {
  const { lines } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = lines.find((l) => l.product_id === line.product_id)?.quantity ?? 0;
  const max = Math.max(0, Math.floor(line.max) - inCart);

  if (!inStock) {
    return (
      <div className="rounded-2xl bg-surface p-5">
        <p className="font-medium">Sold out</p>
        <p className="mt-1 text-sm text-muted">
          This {LABELS.item} is currently unavailable. <Link href="/contact" className="text-accent-strong underline">Ask us</Link> about restocks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <QuantityStepper value={Math.min(quantity, Math.max(1, max))} max={max} onChange={setQuantity} label={line.name} />
        <button
          type="button"
          className="btn btn-primary h-12 flex-1"
          disabled={max < 1}
          onClick={() => {
            cart.add(line, Math.min(quantity, max));
            setQuantity(1);
            setAdded(true);
          }}
        >
          <BagIcon className="h-4 w-4" />
          {max < 1 ? "All in your bag" : "Add to bag"}
        </button>
      </div>
      <p aria-live="polite" className="min-h-6 text-sm">
        {added && (
          <span className="inline-flex items-center gap-3 rounded-full bg-brand-soft px-4 py-1.5">
            Added to your bag
            <Link href="/cart" className="font-medium text-accent-strong underline underline-offset-2">View bag</Link>
            <Link href="/checkout" className="font-medium text-accent-strong underline underline-offset-2">Checkout</Link>
          </span>
        )}
      </p>
    </div>
  );
}
