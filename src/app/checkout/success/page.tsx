import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { GoldRings } from "@/components/banners/art";
import { ClearCart } from "@/components/cart/clear-cart";
import { BRAND } from "@/lib/brand";
import { getStore } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { getCustomer } from "@/lib/session";

export const metadata: Metadata = { title: "Order placed", robots: { index: false, follow: false } };

async function Confirmation({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const order = typeof sp.order === "string" ? sp.order : null;
  const total = Number(sp.total);
  const [store, customer] = await Promise.all([getStore(), getCustomer()]);

  return (
    <div className="relative isolate mx-auto max-w-2xl overflow-hidden rounded-3xl bg-[radial-gradient(120%_120%_at_50%_0%,#2a2419,#0e0d0b_65%)] px-6 py-14 text-center text-on-ink sm:px-12">
      <GoldRings id="success" className="absolute left-1/2 top-0 -z-10 h-[120%] w-auto -translate-x-1/2 -translate-y-1/3 opacity-60" />
      <ClearCart />
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-3xl text-gold-light" aria-hidden="true">✓</span>
      <p className="eyebrow mt-6 text-gold-light">Thank you</p>
      <h1 className="font-display mt-2 text-4xl font-medium sm:text-5xl">Your order is placed</h1>
      {order && (
        <p className="mt-6">
          Order number <strong className="font-display text-2xl text-gold-light">#{order}</strong>
        </p>
      )}
      {Number.isFinite(total) && total > 0 && (
        <p className="mt-2 text-on-ink-muted">Total {formatMoney(total, store.currency)}, payable in cash on delivery.</p>
      )}
      <p className="mx-auto mt-4 max-w-md text-sm text-on-ink-muted">
        We&apos;ll call you shortly to confirm your order and delivery charge. Inside Dhaka, orders usually arrive in {BRAND.policies.deliveryDhaka}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {customer && order ? <Link href={`/account/orders/${order}`} className="btn btn-gold">View order</Link> : null}
        <Link href="/products" className="btn btn-ghost-light">Keep shopping</Link>
      </div>
    </div>
  );
}

export default function Page({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <div className="container-x py-12 lg:py-20">
      <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-3xl bg-surface" />}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
