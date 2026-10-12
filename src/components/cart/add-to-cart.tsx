"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LABELS } from "@/lib/brand";
import { BagIcon, MinusIcon, PlusIcon } from "../icons";
import { addToBag, useCart, type CartLine } from "./cart-store";

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

export function AddToCart({ inStock, priceLabel, ...line }: Props & { priceLabel?: string }) {
  const { lines } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inCart = lines.find((l) => l.product_id === line.product_id)?.quantity ?? 0;
  const max = Math.max(0, Math.floor(line.max) - inCart);

  // On phones, keep "Add to bag" reachable: a bar slides up once the main button scrolls away
  useEffect(() => {
    const box = boxRef.current;
    if (!box || !inStock) return;
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(box);
    return () => observer.disconnect();
  }, [inStock]);

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

  const add = (qty: number) => {
    addToBag(line, Math.min(qty, max));
    setQuantity(1);
  };

  return (
    <>
      <div ref={boxRef} className="flex gap-3">
        <QuantityStepper value={Math.min(quantity, Math.max(1, max))} max={max} onChange={setQuantity} label={line.name} />
        <button type="button" className="btn btn-primary h-12 flex-1" disabled={max < 1} onClick={() => add(quantity)}>
          <BagIcon className="h-4 w-4" />
          {max < 1 ? "All in your bag" : "Add to bag"}
        </button>
      </div>

      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-18px_rgb(0_0_0/0.3)] backdrop-blur transition-transform duration-300 lg:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-medium">{line.name}</p>
            {priceLabel && <p className="text-sm font-semibold text-accent-strong">{priceLabel}</p>}
          </div>
          <button type="button" className="btn btn-primary shrink-0" disabled={max < 1} onClick={() => add(1)}>
            <BagIcon className="h-4 w-4" /> {max < 1 ? "In your bag" : "Add to bag"}
          </button>
        </div>
      </div>
    </>
  );
}
