"use client";

import Link from "next/link";
import { BagIcon } from "../icons";
import { useCart } from "./cart-store";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/cart" aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
      <BagIcon />
      {count > 0 && (
        <span aria-hidden="true" className="absolute right-0.5 top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold text-ink">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
