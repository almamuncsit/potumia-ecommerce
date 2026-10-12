import Link from "next/link";
import { ArrowRightIcon, CashIcon, TruckIcon } from "@/components/icons";
import { Money } from "@/components/price";
import { StoreImage } from "@/components/store-image";
import { productPath } from "@/lib/urls";
import type { HeroProps } from "../types";
import { ArtPattern } from "./art";
import { THEME } from "./config";

const { payment, deliveryDhaka, exchangeDays } = THEME.brand.policies;

const CHECKS = [`${payment} everywhere`, "Delivery across Bangladesh", `${exchangeDays}-day easy exchange`, "Real people to help"];

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-ok" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

/**
 * Potumia's home hero, after the Potumia website: a light glow, a bold
 * headline with a gradient line, and a showcase card built from the store's
 * own featured products (like the app mock-up on potumia.com).
 */
export function Hero({ featured, currency, phone }: HeroProps) {
  const showcase = featured.slice(0, 4);
  const lead = showcase[0];

  return (
    <section className="surface-soft relative isolate overflow-hidden border-b border-line">
      <ArtPattern id="hero-dots" className="absolute inset-0 -z-10 h-full w-full opacity-60" />
      <div className="container-x grid items-center gap-14 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-accent-strong shadow-sm">
            <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
            {payment} · Easy exchange · Fast delivery
          </p>
          <h1 className="font-display mt-6 text-[2.5rem] leading-[1.05] text-text sm:text-[3.4rem] xl:text-[3.9rem]">
            Everything you need,
            <span className="text-accent-gradient block">delivered to your door</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Shop everyday products at fair prices. Order in a few taps and pay in cash when your parcel arrives, anywhere in Bangladesh.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn btn-primary">
              Shop now <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/categories" className="btn btn-outline">Browse categories</Link>
          </div>
          <ul className="mt-8 grid max-w-lg gap-x-6 gap-y-2.5 text-[0.95rem] text-muted sm:grid-cols-2">
            {CHECKS.map((c) => (
              <li key={c} className="flex items-center gap-2.5">
                <Check /> {c}
              </li>
            ))}
          </ul>
          {phone && (
            <p className="mt-6 text-sm text-muted">
              Questions? Call <a href={`tel:${phone}`} className="font-semibold text-accent-strong hover:underline">{phone}</a>
            </p>
          )}
        </div>

        {/* Showcase of real featured products */}
        <div className="relative mx-auto w-full max-w-md" aria-hidden={showcase.length === 0}>
          <div className="relative rounded-[2rem] border border-line bg-card p-4 shadow-[0_2px_4px_rgb(15_23_42/0.04),0_24px_48px_-16px_rgb(49_46_129/0.28)] sm:p-5">
            <div className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-white" style={{ background: "var(--ink-glow)" }}>
              <div>
                <p className="text-sm font-semibold">Today&apos;s picks</p>
                <p className="text-xs text-white/75">{showcase.length ? `${showcase.length} popular products` : "New products coming soon"}</p>
              </div>
              <Link href="/products?sort=popular" className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25">See all</Link>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {(showcase.length ? showcase : Array.from({ length: 4 }, () => null)).map((p, i) => (
                <li key={p?.id ?? i} className="overflow-hidden rounded-2xl border border-line bg-surface">
                  {p ? (
                    <Link href={productPath(p)} className="group block">
                      <div className="relative aspect-[5/4] overflow-hidden">
                        <StoreImage src={p.thumb ?? p.image} fallback={p.name} fallbackClassName="text-4xl" alt={p.name} fill sizes="(min-width: 1024px) 14rem, 40vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-medium text-text">{p.name}</p>
                        <p className="mt-0.5 text-sm font-semibold text-accent-strong">
                          <Money amount={p.price} currency={currency} />
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="placeholder-surface aspect-[5/4]" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Floating chips, like the stats on the Potumia app mock-up */}
          {lead && (
            <div className="absolute -left-4 top-24 hidden rounded-2xl border border-line bg-card px-4 py-3 shadow-lg sm:block lg:-left-10">
              <p className="text-xs text-muted">Best seller</p>
              <p className="font-display text-xl text-text">
                <Money amount={lead.price} currency={currency} />
              </p>
            </div>
          )}
          <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3 shadow-lg lg:-right-6">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-accent-strong">
              <TruckIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs text-muted">Inside Dhaka</span>
              <span className="block text-sm font-semibold text-text">{deliveryDhaka}</span>
            </span>
          </div>
          <p className="absolute -top-4 right-8 hidden items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-medium text-text shadow-md sm:flex">
            <CashIcon className="h-4 w-4 text-ok" /> Pay on delivery
          </p>
        </div>
      </div>
    </section>
  );
}
