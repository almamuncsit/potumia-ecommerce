import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BRAND, LABELS } from "@/lib/brand";
import { getCategories, getStore } from "@/lib/catalog";
import { HELP, NAV } from "@/lib/nav";
import { getCustomer } from "@/lib/session";
import type { Group } from "@/lib/types";
import { categoryPath } from "@/lib/urls";
import { MobileMenu } from "../header-dialogs";
import { ChevronDownIcon, MenuIcon, PhoneIcon, SearchIcon, UserIcon } from "../icons";
import { CartButton } from "./cart-button";

/**
 * Marketplace header: a slim utility bar, then logo, a wide search with a
 * category picker, account and cart (sticky), then a menu bar with every
 * category one click away.
 */

async function Account() {
  const customer = await getCustomer();

  return (
    <Link href={customer ? "/account" : "/account/login"} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-surface">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-text">
        <UserIcon />
      </span>
      <span className="hidden leading-tight xl:block">
        <span className="block text-xs text-muted">{customer ? "Hello," : "Sign in"}</span>
        <span className="block max-w-28 truncate text-sm font-bold">{customer ? customer.name.split(" ")[0] : "My account"}</span>
      </span>
      <span className="sr-only xl:hidden">{customer ? `My account (${customer.name})` : "Log in"}</span>
    </Link>
  );
}

/** Plain GET form to the product list, so search works without JavaScript */
function SearchForm({ categories, id }: { categories: Group[]; id: string }) {
  return (
    <form action="/products" role="search" className="flex h-11 w-full overflow-hidden rounded-lg border-2 border-brand bg-card focus-within:ring-4 focus-within:ring-brand/15">
      <label htmlFor={`${id}-category`} className="sr-only">{LABELS.collection}</label>
      <select
        id={`${id}-category`}
        name="category"
        defaultValue=""
        className="hidden max-w-44 cursor-pointer border-r border-line bg-surface px-3 text-sm text-text outline-none md:block"
      >
        <option value="">All {LABELS.collections.toLowerCase()}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <label htmlFor={`${id}-q`} className="sr-only">Search {LABELS.items}</label>
      <input id={`${id}-q`} name="q" type="search" placeholder={`Search ${LABELS.items}…`} className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted" />
      <button type="submit" className="flex items-center gap-2 bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-strong sm:px-6">
        <SearchIcon className="h-[1.1rem] w-[1.1rem]" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}

export async function MarketHeader() {
  const [store, categories] = await Promise.all([getStore(), getCategories()]);
  const categoryLinks = categories.map((c) => ({ href: categoryPath(c), label: c.name }));

  return (
    <>
      {/* Utility bar */}
      <div className="border-b border-line bg-card text-xs text-muted">
        <div className="container-x flex h-9 items-center justify-center gap-6 sm:justify-between">
          <ul className="hidden items-center divide-x divide-line sm:flex">
            <li className="pr-3"><Link href="/about" className="hover:text-brand-strong">About us</Link></li>
            <li className="px-3"><Link href="/contact" className="hover:text-brand-strong">Contact</Link></li>
            <li className="pl-3"><Link href="/account" className="hover:text-brand-strong">Track order</Link></li>
          </ul>
          <p>
            <strong className="font-semibold text-hot">{BRAND.policies.payment}</strong> all over {BRAND.country}
            <span className="hidden lg:inline"> · {BRAND.policies.exchangeDays}-day easy exchange</span>
          </p>
          {store.phone && (
            <a href={`tel:${store.phone}`} className="hidden items-center gap-1.5 md:flex">
              Need help? <strong className="font-semibold text-brand-strong">{store.phone}</strong>
            </a>
          )}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-card/95 shadow-[0_6px_20px_-18px_rgb(15_23_42/0.5)] backdrop-blur">
        <div className="container-x flex h-16 items-center gap-3 lg:h-[4.5rem] lg:gap-8">
          <MobileMenu links={NAV} categories={categoryLinks} help={HELP} />
          <Link href="/" aria-label={`${BRAND.name} home`} className="shrink-0">
            <Image src={BRAND.logo.onLight.src} alt={BRAND.name} width={BRAND.logo.onLight.width} height={BRAND.logo.onLight.height} priority className="h-8 w-auto lg:h-10" />
          </Link>
          <div className="hidden flex-1 lg:block">
            <SearchForm categories={categories} id="search-top" />
          </div>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <Suspense fallback={<span className="h-10 w-10" aria-hidden="true" />}>
              <Account />
            </Suspense>
            <CartButton currency={store.currency} />
          </div>
        </div>
        {/* Phones and tablets: search on its own row */}
        <div className="container-x pb-3 lg:hidden">
          <SearchForm categories={categories} id="search-mobile" />
        </div>
      </header>

      {/* Menu bar */}
      <nav aria-label="Main" className="hidden border-b border-line bg-card lg:block">
        <div className="container-x flex h-12 items-center gap-6">
          {categoryLinks.length > 0 && (
            <div className="group relative h-full">
              <Link href="/categories" className="flex h-full w-60 items-center gap-3 bg-brand px-4 text-sm font-semibold text-white">
                <MenuIcon /> All {LABELS.collections.toLowerCase()}
                <ChevronDownIcon className="ml-auto h-4 w-4 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-60 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="rounded-b-xl border border-t-0 border-line bg-card py-2 shadow-xl">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link href={categoryPath(c)} className="flex items-center justify-between px-4 py-2 text-sm hover:bg-brand-soft hover:text-brand-strong">
                        {c.name}
                        <span className="text-xs text-muted">{c.products}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li><Link href="/" className="hover:text-brand-strong">Home</Link></li>
            <li><Link href="/products" className="hover:text-brand-strong">Shop all</Link></li>
            <li>
              <Link href="/products?on_sale=1" className="flex items-center gap-1.5 text-hot hover:text-sale">
                Deals <span className="rounded bg-hot px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-white">Hot</span>
              </Link>
            </li>
            <li><Link href="/products?sort=newest" className="hover:text-brand-strong">New arrivals</Link></li>
            <li><Link href="/products?sort=popular" className="hover:text-brand-strong">Best sellers</Link></li>
            <li><Link href="/contact" className="hover:text-brand-strong">Contact</Link></li>
          </ul>
          {store.phone && (
            <a href={`tel:${store.phone}`} className="ml-auto flex items-center gap-2 text-sm font-semibold text-brand-strong">
              <PhoneIcon className="h-4 w-4" /> {store.phone}
            </a>
          )}
        </div>
      </nav>
    </>
  );
}
