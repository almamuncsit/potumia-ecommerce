"use client";

import Link from "next/link";
import { BagIcon } from "../icons";
import { cartDrawer, useCart } from "./cart-store";

/** Bag icon with item count. Opens the mini cart (falls back to /cart without JavaScript). */
export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        cartDrawer.open();
      }}
      aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-surface"
    >
      <BagIcon />
      {count > 0 && (
        <span key={count} aria-hidden="true" className="absolute right-0.5 top-0.5 grid h-[1.15rem] min-w-[1.15rem] animate-[pop_.35s_ease-out] place-items-center rounded-full bg-accent-strong px-1 text-[0.65rem] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
      <style>{`@keyframes pop { 0% { transform: scale(.4) } 70% { transform: scale(1.2) } 100% { transform: scale(1) } }`}</style>
    </Link>
  );
}
