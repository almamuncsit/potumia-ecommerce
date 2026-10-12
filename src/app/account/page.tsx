import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PasswordForm, ProfileForm } from "@/components/account-forms";
import { PageTitle } from "@/components/page-hero";
import { logout } from "@/lib/actions";
import { getStore } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { getOrders, STATUS_LABELS } from "@/lib/orders";
import { getCustomer, getToken } from "@/lib/session";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

async function Account() {
  const customer = await getCustomer();
  if (!customer) redirect("/account/login?next=/account");
  const [store, orders] = await Promise.all([getStore(), getOrders((await getToken())!)]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="orders-heading" className="space-y-3">
        <h2 id="orders-heading" className="font-display text-2xl">Your orders</h2>
        {orders.length ? (
          <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
            {orders.map((order) => {
              const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
              return (
                <li key={order.number}>
                  <Link href={`/account/orders/${order.number}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 hover:bg-surface">
                    <span className="font-display text-lg">#{order.number}</span>
                    <span className="text-sm text-muted">{dateFormat.format(new Date(order.date))}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.tone}`}>{status.label}</span>
                    <span className="ml-auto font-semibold">{formatMoney(order.total, store.currency)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-line p-8 text-center">
            <p className="text-muted">You haven&apos;t ordered anything yet.</p>
            <Link href="/products" className="btn btn-primary mt-4">Start shopping</Link>
          </div>
        )}
      </section>

      <div className="space-y-6">
        <section aria-labelledby="details-heading" className="space-y-3 rounded-3xl border border-line bg-card p-6">
          <h2 id="details-heading" className="font-display text-2xl">Your details</h2>
          <p className="text-sm text-muted">{customer.email}</p>
          <ProfileForm customer={customer} />
        </section>
        <section aria-labelledby="password-heading" className="space-y-3 rounded-3xl border border-line bg-card p-6">
          <h2 id="password-heading" className="font-display text-2xl">Password</h2>
          <PasswordForm />
        </section>
        <form action={logout}>
          <button type="submit" className="btn btn-outline w-full">Log out</button>
        </form>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="container-x space-y-10 py-10 lg:py-14">
      <PageTitle title="My account" eyebrow="Welcome back" />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" aria-busy="true" />}>
        <Account />
      </Suspense>
    </div>
  );
}
