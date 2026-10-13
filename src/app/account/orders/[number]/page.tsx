import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { StoreImage } from "@/components/store-image";
import { getStore } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { getOrder, STATUS_LABELS } from "@/lib/orders";
import { getToken } from "@/lib/session";
import { productPath } from "@/lib/urls";

const STEPS = ["pending", "processing", "shipping", "delivered"] as const;
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

async function OrderDetails({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const token = await getToken();
  if (!token) redirect(`/account/login?next=/account/orders/${encodeURIComponent(number)}`);
  const [order, store] = await Promise.all([getOrder(token, number), getStore()]);
  if (!order) notFound();

  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
  const reached = order.status === "completed" ? STEPS.length - 1 : STEPS.indexOf(order.status as (typeof STEPS)[number]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3 border-b border-line pb-8">
        <p className="eyebrow w-full text-accent-strong">Order details</p>
        <h1 className="font-display text-4xl font-medium sm:text-5xl">Order #{order.number}</h1>
        <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${status.tone}`}>{status.label}</span>
        <p className="w-full text-sm text-muted">Placed on {dateFormat.format(new Date(order.date))}</p>
      </header>

      {order.status !== "canceled" && (
        <ol className="grid grid-cols-4 gap-2 text-center text-xs sm:text-sm" aria-label="Order progress">
          {STEPS.map((step, i) => (
            <li key={step} className="space-y-1.5" aria-current={i === reached ? "step" : undefined}>
              <span className={`block h-1.5 rounded-full ${i <= reached ? "bg-brand" : "bg-line"}`} />
              <span className={i <= reached ? "font-medium" : "text-muted"}>{STATUS_LABELS[step].label}</span>
            </li>
          ))}
        </ol>
      )}

      <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">
        {order.items.map((item, i) => (
          <li key={`${item.product_id}-${i}`} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
              <StoreImage src={item.image} alt="" fallback={item.name} fallbackClassName="text-xl" fill sizes="4rem" className="object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              {item.product_id ? (
                <Link href={productPath({ id: item.product_id, slug: item.slug })} className="font-medium hover:underline">{item.name}</Link>
              ) : (
                <span className="font-medium">{item.name}</span>
              )}
              <p className="text-sm text-muted">{item.quantity} × {formatMoney(item.price, store.currency)}</p>
            </div>
            <span className="font-semibold">{formatMoney(item.total, store.currency)}</span>
          </li>
        ))}
      </ul>

      <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
        {order.delivery && (
          <>
            <div className="flex justify-between"><dt className="text-muted">Items</dt><dd>{formatMoney(order.items_total ?? order.total - order.delivery.charge, store.currency)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery · {order.delivery.name}</dt>
              <dd>{order.delivery.charge > 0 ? formatMoney(order.delivery.charge, store.currency) : "Free"}</dd>
            </div>
          </>
        )}
        <div className="flex justify-between"><dt className="text-muted">Total</dt><dd className="font-semibold">{formatMoney(order.total, store.currency)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Paid</dt><dd>{formatMoney(order.paid, store.currency)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Due</dt><dd>{formatMoney(order.due, store.currency)}</dd></div>
      </dl>

      {order.notes && (
        <section className="rounded-3xl bg-surface p-6 text-sm">
          <h2 className="font-semibold">Delivery</h2>
          <p className="mt-1 whitespace-pre-line text-muted">{order.notes}</p>
        </section>
      )}

      <Link href="/account" className="link-line inline-block text-xs uppercase tracking-[0.16em]">← All orders</Link>
    </div>
  );
}

export default function OrderPage({ params }: PageProps<"/account/orders/[number]">) {
  return (
    <div className="container-x py-10 lg:py-14">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" aria-busy="true" />}>
        <OrderDetails params={params} />
      </Suspense>
    </div>
  );
}
