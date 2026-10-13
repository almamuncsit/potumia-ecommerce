"use client";

import Link from "next/link";
import { BRAND, LABELS } from "@/lib/brand";
import { formatMoney } from "@/lib/money";
import type { Currency } from "@/lib/types";
import { productPath } from "@/lib/urls";
import { BagIcon, CashIcon, ExchangeIcon, TruckIcon } from "../icons";
import { Money } from "../price";
import { StoreImage } from "../store-image";
import { QuantityStepper } from "./add-to-cart";
import { cart, useCart, type CartLine } from "./cart-store";

export function CartLines({ currency, errors = {}, editable = true }: { currency: Currency; errors?: Record<number, string>; editable?: boolean }) {
  const { lines } = useCart();

  return (
    <ul className="divide-y divide-line border-y border-line">
      {lines.map((line) => (
        <CartRow key={line.product_id} line={line} currency={currency} error={errors[line.product_id]} editable={editable} />
      ))}
    </ul>
  );
}

function CartRow({ line, currency, error, editable }: { line: CartLine; currency: Currency; error?: string; editable: boolean }) {
  const href = productPath({ id: line.product_id, slug: line.slug });

  return (
    <li className={`flex gap-4 ${editable ? "py-5 sm:gap-6" : "py-4"}`}>
      <Link href={href} className={`relative aspect-[4/5] shrink-0 overflow-hidden rounded-xl bg-surface ${editable ? "w-24 sm:w-28" : "w-16"}`}>
        <StoreImage src={line.image} alt="" fallback={line.name} fallbackClassName={editable ? "text-3xl" : "text-xl"} fill sizes="7rem" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <Link href={href} className="line-clamp-2 text-sm font-medium hover:text-accent-strong sm:text-base">{line.name}</Link>
          <p className="shrink-0 text-sm font-medium sm:text-base">{formatMoney(line.price * line.quantity, currency)}</p>
        </div>
        <p className="mt-1 text-sm text-muted">
          {editable ? `${formatMoney(line.price, currency)} each` : `Qty ${line.quantity} × ${formatMoney(line.price, currency)}`}
        </p>
        {error && <p className="mt-2 text-sm font-medium text-danger" role="alert">{error}</p>}
        {editable && (
          <div className="mt-auto flex items-center gap-4 pt-3">
            <QuantityStepper value={line.quantity} max={line.max} onChange={(n) => cart.setQuantity(line.product_id, n)} label={line.name} />
            <button type="button" onClick={() => cart.remove(line.product_id)} className="link-line text-xs uppercase tracking-[0.16em] text-muted hover:text-danger">
              Remove
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export function EmptyBag() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface text-accent-strong">
        <BagIcon className="h-7 w-7" />
      </span>
      <p className="font-display mt-6 text-3xl">Your bag is empty</p>
      <p className="mt-2 text-muted">{LABELS.bagStory}</p>
      <Link href="/products" className="btn btn-primary mt-8">Start shopping</Link>
    </div>
  );
}

/** `exchangeDays`: the shop's (Store details), from the server */
export function OrderPromises({ exchangeDays = BRAND.policies.exchangeDays }: { exchangeDays?: number }) {
  return (
    <ul className="space-y-2.5 text-sm text-muted">
      <li className="flex items-center gap-3"><CashIcon className="h-4 w-4 text-accent-strong" /> {BRAND.policies.payment}</li>
      <li className="flex items-center gap-3"><TruckIcon className="h-4 w-4 text-accent-strong" /> Delivery across {BRAND.country}</li>
      <li className="flex items-center gap-3"><ExchangeIcon className="h-4 w-4 text-accent-strong" /> {exchangeDays}-day easy exchange</li>
    </ul>
  );
}

export function CartPage({ currency, exchangeDays }: { currency: Currency; exchangeDays?: number }) {
  const { lines, count, subtotal } = useCart();

  if (!lines.length) return <EmptyBag />;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
      <div>
        <p className="mb-4 text-sm text-muted">{count} {count === 1 ? "item" : "items"}</p>
        <CartLines currency={currency} />
        <Link href="/products" className="link-line mt-6 inline-block text-xs uppercase tracking-[0.16em]">Continue shopping</Link>
      </div>
      <aside className="space-y-6 self-start rounded-3xl bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl">Order summary</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium">{formatMoney(subtotal, currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="text-muted">Confirmed with your order</dd></div>
        </dl>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-medium">Total</span>
          <span className="font-display text-3xl"><Money amount={subtotal} currency={currency} /></span>
        </div>
        <Link href="/checkout" className="btn btn-primary w-full">Checkout</Link>
        <OrderPromises exchangeDays={exchangeDays} />
      </aside>
    </div>
  );
}
