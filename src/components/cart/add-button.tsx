"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { BagIcon } from "../icons";
import { cart } from "./cart-store";

/** "Add to cart" on a product card: adds one and confirms in place */
export function AddButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  if (!product.in_stock) {
    return (
      <span className="relative z-10 flex h-9 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-muted">
        Sold out
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to cart`}
      onClick={() => {
        cart.add({
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.thumb ?? product.image,
          price: product.price,
          max: product.stock,
        });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={`relative z-10 flex h-9 w-full items-center justify-center gap-2 rounded-lg border text-xs font-semibold transition ${
        added ? "border-ok bg-ok text-white" : "border-brand/25 bg-brand-soft text-brand-strong hover:border-brand hover:bg-brand hover:text-white"
      }`}
    >
      {added ? (
        <>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m4.5 10.5 3.5 3.5 7.5-8" />
          </svg>
          Added
        </>
      ) : (
        <>
          <BagIcon className="h-4 w-4" /> Add to cart
        </>
      )}
      <span role="status" className="sr-only">{added ? `${product.name} added to your cart` : ""}</span>
    </button>
  );
}
