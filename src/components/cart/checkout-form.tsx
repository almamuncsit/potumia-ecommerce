"use client";

import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";
import { checkCoupon, placeOrder, type CheckoutState } from "@/lib/actions";
import { formatMoney } from "@/lib/money";
import { couponDiscount, deliveryCharge, type Coupon, type Currency, type Customer, type DeliveryMethod } from "@/lib/types";
import { Field } from "../form-field";
import { CashIcon, CloseIcon, TruckIcon } from "../icons";
import { Money } from "../price";
import { CartLines, EmptyBag, OrderPromises } from "./cart-view";
import { useCart } from "./cart-store";

/** A coupon code: checked with the shop, then kept with the order (the shop checks it again) */
function CouponBox({
  coupon,
  onChange,
  items,
  subtotal,
  currency,
  serverError,
}: {
  coupon: Coupon | null;
  onChange: (coupon: Coupon | null) => void;
  items: { product_id: number; quantity: number }[];
  subtotal: number;
  currency: Currency;
  serverError?: string;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [checking, startCheck] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const shown = error ?? serverError;

  const apply = () =>
    startCheck(async () => {
      const mobile = (document.querySelector('input[name="mobile"]') as HTMLInputElement | null)?.value;
      const res = await checkCoupon(code, items, mobile);
      if (res.coupon) {
        onChange(res.coupon);
        setError(null);
        setCode("");
      } else {
        setError(res.error ?? "That coupon can't be used.");
      }
    });

  if (coupon) {
    const short = coupon.min_order && subtotal < coupon.min_order ? coupon.min_order - subtotal : 0;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-accent bg-brand-soft px-3 py-2.5">
          <span className="min-w-0">
            <span className="block font-mono text-sm font-bold tracking-wider">{coupon.code}</span>
            <span className="block text-xs text-muted">{coupon.description || coupon.label}</span>
          </span>
          <button type="button" onClick={() => onChange(null)} aria-label={`Remove coupon ${coupon.code}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-card">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        {short > 0 && <p className="text-xs text-danger">Add {formatMoney(short, currency)} more to use this coupon.</p>}
        {serverError && <p className="text-xs text-danger">{serverError}</p>}
      </div>
    );
  }

  if (!open && !shown) {
    return (
      <button type="button" onClick={() => { setOpen(true); setTimeout(() => input.current?.focus(), 0); }} className="text-sm font-medium text-accent-strong underline underline-offset-4">
        Have a coupon code?
      </button>
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor="coupon-code" className="block text-sm font-medium">Coupon code</label>
      <div className="flex gap-2">
        <input
          ref={input}
          id="coupon-code"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (code.trim()) apply(); } }}
          placeholder="e.g. EID10"
          autoComplete="off"
          aria-invalid={Boolean(shown)}
          aria-describedby={shown ? "coupon-error" : undefined}
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-card px-3 font-mono text-sm uppercase tracking-wider outline-none focus:border-accent"
        />
        <button type="button" onClick={apply} disabled={checking || !code.trim()} className="btn btn-primary h-11 shrink-0 px-5 disabled:opacity-60">
          {checking ? "Checking…" : "Apply"}
        </button>
      </div>
      {shown && <p id="coupon-error" className="text-xs text-danger" role="alert">{shown}</p>}
    </div>
  );
}

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

export function CheckoutForm({
  currency,
  customer,
  deliveryMethods = [],
  exchangeDays,
}: {
  currency: Currency;
  customer: Customer | null;
  deliveryMethods?: DeliveryMethod[];
  exchangeDays?: number;
}) {
  const { lines, subtotal } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  // One key per checkout: a double click or retry records the order once
  const [clientRef] = useState(() => crypto.randomUUID());
  const values = state.values ?? {};
  // The first delivery method is chosen to start with
  const [deliveryId, setDeliveryId] = useState<number | null>(deliveryMethods[0]?.id ?? null);
  const delivery = deliveryMethods.find((m) => m.id === deliveryId) ?? null;
  const charge = deliveryCharge(delivery, subtotal);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const discount = couponDiscount(coupon, subtotal);
  const total = subtotal - discount + charge;
  // The shop turned the coupon down with the order: take it off so they can fix it
  const couponError = state.fields?.coupon_code;
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (couponError) setCoupon(null);
  }
  const items = lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity }));

  if (!lines.length) return <EmptyBag />;

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <input type="hidden" name="client_ref" value={clientRef} />
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="coupon_code" value={coupon?.code ?? ""} />

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

        {deliveryMethods.length > 0 && (
          <Step n={2} title="Delivery">
            <fieldset>
              <legend className="sr-only">Delivery method</legend>
              <div className="space-y-3">
                {deliveryMethods.map((m) => {
                  const cost = deliveryCharge(m, subtotal);
                  const chosen = m.id === deliveryId;
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition ${chosen ? "border-accent bg-brand-soft" : "border-line hover:border-accent/60"}`}
                    >
                      <input
                        type="radio"
                        name="delivery_method_id"
                        value={m.id}
                        checked={chosen}
                        onChange={() => setDeliveryId(m.id)}
                        required
                        className="mt-1 h-4 w-4 accent-[var(--accent-strong)]"
                      />
                      <TruckIcon className="mt-0.5 h-6 w-6 shrink-0 text-accent-strong" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{m.name}</span>
                        {(m.estimate || m.description) && <span className="block text-sm text-muted">{[m.estimate, m.description].filter(Boolean).join(" · ")}</span>}
                        {m.free_over ? (
                          <span className={`mt-1 block text-xs font-medium ${cost === 0 ? "text-ok" : "text-muted"}`}>
                            {cost === 0 ? "Free delivery on this order" : `Free on orders over ${formatMoney(m.free_over, currency)}`}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 font-semibold">{cost > 0 ? formatMoney(cost, currency) : "Free"}</span>
                    </label>
                  );
                })}
              </div>
              {state.fields?.delivery_method_id && <p className="mt-2 text-sm text-danger">{state.fields.delivery_method_id}</p>}
            </fieldset>
          </Step>
        )}

        <Step n={deliveryMethods.length > 0 ? 3 : 2} title="Payment">
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
          {discount > 0 && coupon && (
            <div className="flex justify-between gap-3 text-ok">
              <dt>Coupon · {coupon.code}</dt>
              <dd className="font-medium">−{formatMoney(discount, currency)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Delivery{delivery ? ` · ${delivery.name}` : ""}</dt>
            <dd className={delivery ? "font-medium" : "text-muted"}>
              {delivery ? (charge > 0 ? formatMoney(charge, currency) : "Free") : deliveryMethods.length ? "Choose an option" : "Confirmed by phone"}
            </dd>
          </div>
        </dl>
        <CouponBox coupon={coupon} onChange={setCoupon} items={items} subtotal={subtotal} currency={currency} serverError={couponError} />
        <div className="flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-medium">Total</span>
          <span className="font-display text-3xl"><Money amount={total} currency={currency} /></span>
        </div>
        {state.error && <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger" role="alert">{state.error}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={pending}>
          {pending ? "Placing order…" : "Place order"}
        </button>
        <Link href="/cart" className="link-line block text-center text-xs uppercase tracking-[0.16em] text-muted">Edit bag</Link>
        <OrderPromises exchangeDays={exchangeDays} />
      </aside>
    </form>
  );
}
