"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { placeOrder, type CheckoutState } from "@/lib/actions";
import { formatMoney } from "@/lib/money";
import type { Currency, Customer } from "@/lib/types";
import { Field } from "../form-field";
import { CashIcon } from "../icons";
import { Money } from "../price";
import { CartLines, EmptyBag, OrderPromises } from "./cart-view";
import { useCart } from "./cart-store";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-6 sm:p-8">
      <h2 className="flex items-center gap-4">
        <span className="font-display grid h-9 w-9 place-items-center rounded-full bg-ink text-lg text-accent-light lining-nums">{n}</span>
        <span className="font-display text-2xl">{title}</span>
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

export function CheckoutForm({ currency, customer }: { currency: Currency; customer: Customer | null }) {
  const { lines, subtotal } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  // One key per checkout: a double click or retry records the order once
  const [clientRef] = useState(() => crypto.randomUUID());
  const values = state.values ?? {};

  if (!lines.length) return <EmptyBag />;

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <input type="hidden" name="client_ref" value={clientRef} />
      <input type="hidden" name="items" value={JSON.stringify(lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })))} />

      <div className="space-y-6">
        <Step n={1} title="Delivery details">
          {customer ? (
            <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-muted">
              Ordering as <span className="font-medium text-text">{customer.name}</span> · {customer.email}
            </p>
          ) : (
            <p className="text-sm text-muted">
              Have an account? <Link href="/account/login?next=/checkout" className="font-medium text-accent-strong underline">Log in</Link> to follow this order later.
            </p>
          )}
          {!customer && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" name="name" autoComplete="name" required defaultValue={values.name} error={state.fields?.name} />
              <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={values.email} error={state.fields?.email} />
            </div>
          )}
          <Field label="Mobile number" name="mobile" type="tel" autoComplete="tel" required defaultValue={values.mobile ?? customer?.mobile ?? ""} error={state.fields?.mobile} hint="We'll call to confirm your order." />
          <Field label="Delivery address" name="address" autoComplete="street-address" required textarea defaultValue={values.address ?? customer?.address ?? ""} error={state.fields?.address} />
          <Field label="Note for us (optional)" name="notes" textarea defaultValue={values.notes} error={state.fields?.notes} />
        </Step>

        <Step n={2} title="Payment">
          <fieldset>
            <legend className="sr-only">Payment method</legend>
            {/* Only cash on delivery for now; more methods can be added here */}
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-accent bg-brand-soft p-4">
              <input type="radio" name="payment_method" value="cod" defaultChecked required className="h-4 w-4 accent-[var(--accent-strong)]" />
              <CashIcon className="h-6 w-6 text-accent-strong" />
              <span>
                <span className="block font-medium">Cash on delivery</span>
                <span className="text-sm text-muted">Pay in cash when your order arrives.</span>
              </span>
            </label>
            {state.fields?.payment_method && <p className="mt-2 text-sm text-danger">{state.fields.payment_method}</p>}
          </fieldset>
        </Step>
      </div>

      <aside className="space-y-6 self-start rounded-3xl bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl">Your order</h2>
        <CartLines currency={currency} errors={state.cartErrors} editable={false} />
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium">{formatMoney(subtotal, currency)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="text-muted">Confirmed by phone</dd></div>
        </dl>
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-medium">Total</span>
          <span className="font-display text-3xl"><Money amount={subtotal} currency={currency} /></span>
        </div>
        {state.error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger" role="alert">{state.error}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>
          {pending ? "Placing order…" : "Place order"}
        </button>
        <Link href="/cart" className="link-line block text-center text-xs uppercase tracking-[0.16em] text-muted">Edit bag</Link>
        <OrderPromises />
      </aside>
    </form>
  );
}
