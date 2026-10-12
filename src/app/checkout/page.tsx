import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { PageTitle } from "@/components/page-hero";
import { getStore } from "@/lib/catalog";
import { getCustomer } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

async function Checkout() {
  const [store, customer] = await Promise.all([getStore(), getCustomer()]);
  return <CheckoutForm currency={store.currency} customer={customer} />;
}

export default function Page() {
  return (
    <div className="container-x space-y-10 py-10 lg:py-14">
      <PageTitle title="Checkout" eyebrow="Almost yours">
        <p className="mt-3 text-muted">Cash on delivery. No payment needed now.</p>
      </PageTitle>
      <Suspense fallback={<div className="h-[36rem] animate-pulse rounded-3xl bg-surface" aria-busy="true" />}>
        <Checkout />
      </Suspense>
    </div>
  );
}
