"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Currency } from "@/lib/types";
import { useCart } from "../cart/cart-store";
import { BagIcon } from "../icons";

/** Cart in the marketplace header: icon with count, and the subtotal on wide screens */
export function CartButton({ currency }: { currency: Currency }) {
  const { count, subtotal } = useCart();

  return (
    <Link href="/cart" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-surface">
      <span className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand-strong">
        <BagIcon />
        {count > 0 && (
          <span key={count} aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 min-w-5 animate-[pop_0.35s_ease-out] place-items-center rounded-full bg-hot px-1 text-[0.65rem] font-bold text-white ring-2 ring-card">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
      <span className="hidden leading-tight xl:block">
        <span className="block text-xs text-muted">My cart</span>
        <span className="block text-sm font-bold">{formatMoney(subtotal, currency)}</span>
      </span>
    </Link>
  );
}
