"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatMoney } from "@/lib/money";
import type { Currency } from "@/lib/types";
import { productPath } from "@/lib/urls";
import { BagIcon, CloseIcon } from "../icons";
import { StoreImage } from "../store-image";
import { QuantityStepper } from "./add-to-cart";
import { cart, cartDrawer, useCart, useCartDrawer } from "./cart-store";

/**
 * Slide-in mini cart. Opens when something is added (confirming it) or from
 * the bag icon, so shoppers can carry on browsing or go straight to checkout.
 * A native <dialog>: focus stays inside while open and Esc closes it.
 */
export function CartDrawer({ currency }: { currency: Currency }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { open, added } = useCartDrawer();
  const { lines, count, subtotal } = useCart();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Shopping bag"
      onClose={() => cartDrawer.close()}
      onClick={(e) => e.target === ref.current && cartDrawer.close()}
      className="m-0 ml-auto h-dvh max-h-none w-[min(26rem,100vw)] max-w-none bg-bg p-0 shadow-2xl open:animate-[drawer-in_.3s_ease-out]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl">
            Your bag <span className="text-base text-muted">({count})</span>
          </h2>
          <button type="button" onClick={() => cartDrawer.close()} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
            <CloseIcon />
          </button>
        </div>

        {added && (
          <p role="status" className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-accent-strong">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m4.5 10.5 3.5 3.5 7.5-8" />
            </svg>
            <span className="line-clamp-1">Added: {added.name}</span>
          </p>
        )}

        {lines.length ? (
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((line) => {
              const href = productPath({ id: line.product_id, slug: line.slug });
              return (
                <li key={line.product_id} className="flex gap-4 py-4">
                  <Link href={href} onClick={() => cartDrawer.close()} className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <StoreImage src={line.image} alt="" fallback={line.name} fallbackClassName="text-2xl" fill sizes="5rem" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={href} onClick={() => cartDrawer.close()} className="line-clamp-2 text-sm font-medium hover:text-accent-strong">{line.name}</Link>
                      <button type="button" onClick={() => cart.remove(line.product_id)} aria-label={`Remove ${line.name}`} className="shrink-0 text-muted hover:text-danger">
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold">{formatMoney(line.price * line.quantity, currency)}</p>
                    <div className="mt-auto scale-90 origin-left">
                      <QuantityStepper value={line.quantity} max={line.max} onChange={(n) => cart.setQuantity(line.product_id, n)} label={line.name} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid flex-1 place-items-center px-5 text-center">
            <div>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface text-accent-strong">
                <BagIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 font-medium">Your bag is empty</p>
              <button type="button" onClick={() => cartDrawer.close()} className="btn btn-outline mt-5">Keep shopping</button>
            </div>
          </div>
        )}

        {lines.length > 0 && (
          <div className="space-y-3 border-t border-line bg-surface px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-lg font-semibold">{formatMoney(subtotal, currency)}</span>
            </div>
            <p className="text-xs text-muted">Cash on delivery. Delivery charge confirmed with your order.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={() => cartDrawer.close()} className="btn btn-outline">View bag</Link>
              <Link href="/checkout" onClick={() => cartDrawer.close()} className="btn btn-primary">Checkout</Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes drawer-in { from { transform: translateX(100%) } to { transform: none } }`}</style>
    </dialog>
  );
}
