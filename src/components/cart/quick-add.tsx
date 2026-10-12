"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { BagIcon } from "../icons";
import { addToBag } from "./cart-store";

/** "+" button on a product card: adds one to the bag and opens the mini cart */
export function QuickAdd({ product }: { product: Product }) {
  const [done, setDone] = useState(false);

  if (!product.in_stock) return null;

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to bag`}
      onClick={() => {
        addToBag({
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.thumb ?? product.image,
          price: product.price,
          max: product.stock,
        });
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
      className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-card text-text shadow-lg ring-1 ring-black/5 transition hover:scale-110 hover:bg-accent-strong hover:text-white focus-visible:scale-110 active:scale-95"
    >
      {done ? (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4.5 10.5 3.5 3.5 7.5-8" />
        </svg>
      ) : (
        <span className="relative">
          <BagIcon className="h-[1.1rem] w-[1.1rem]" />
          <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-accent-strong text-[0.6rem] font-bold leading-none text-white">+</span>
        </span>
      )}
    </button>
  );
}
