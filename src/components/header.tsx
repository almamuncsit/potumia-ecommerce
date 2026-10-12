import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BRAND } from "@/lib/brand";
import { getCategories, getStore } from "@/lib/catalog";
import { HELP, NAV } from "@/lib/nav";
import { getCustomer } from "@/lib/session";
import { categoryPath } from "@/lib/urls";
import { CartLink } from "./cart/cart-link";
import { MobileMenu, SearchButton } from "./header-dialogs";
import { ChevronDownIcon, UserIcon } from "./icons";

async function AccountLink() {
  const customer = await getCustomer();

  return (
    <Link
      href={customer ? "/account" : "/account/login"}
      aria-label={customer ? `My account (${customer.name})` : "Log in"}
      className="hidden h-10 items-center gap-2 rounded-full px-2.5 text-sm hover:bg-surface sm:inline-flex"
    >
      <UserIcon />
      <span className="hidden max-w-28 truncate xl:inline">{customer ? customer.name.split(" ")[0] : "Log in"}</span>
    </Link>
  );
}

async function AnnouncementBar() {
  const store = await getStore();

  return (
    <div className="bg-ink text-on-ink">
      <div className="container-x flex h-9 items-center justify-center gap-6 text-[0.7rem] uppercase tracking-[0.22em] sm:justify-between">
        <p>
          <span className="text-gold-light">{BRAND.policies.payment}</span> across {BRAND.country}
          <span className="mx-3 hidden text-on-ink-muted md:inline">·</span>
          <span className="hidden md:inline">{BRAND.policies.exchangeDays}-day easy exchange</span>
        </p>
        {store.phone && (
          <a href={`tel:${store.phone}`} className="hidden text-on-ink-muted hover:text-gold-light sm:inline">
            Call {store.phone}
          </a>
        )}
      </div>
    </div>
  );
}

export async function Header() {
  const categories = await getCategories();
  const categoryLinks = categories.map((c) => ({ href: categoryPath(c), label: c.name }));

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-x flex h-16 items-center gap-2 lg:h-20">
          <div className="flex flex-1 items-center gap-1 lg:hidden">
            <MobileMenu links={NAV} categories={categoryLinks} help={HELP} />
            <SearchButton />
          </div>

          <Link href="/" aria-label={`${BRAND.name} home`} className="shrink-0">
            <Image
              src={BRAND.logo.horizontal.src}
              alt={BRAND.name}
              width={BRAND.logo.horizontal.width}
              height={BRAND.logo.horizontal.height}
              priority
              className="h-8 w-auto lg:h-10"
            />
          </Link>

          <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-1 text-[0.78rem] uppercase tracking-[0.16em]">
              {NAV.slice(0, 3).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="rounded-full px-3.5 py-2 hover:text-gold-deep">{l.label}</Link>
                </li>
              ))}
              {categoryLinks.length > 0 && (
                <li className="group relative">
                  <Link href="/categories" className="flex items-center gap-1 rounded-full px-3.5 py-2 hover:text-gold-deep">
                    Collections <ChevronDownIcon className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="rounded-2xl border border-line bg-card p-2 normal-case tracking-normal shadow-xl shadow-black/5">
                      {categoryLinks.slice(0, 10).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-surface">{c.label}</Link>
                        </li>
                      ))}
                      <li className="mt-1 border-t border-line pt-1">
                        <Link href="/categories" className="block rounded-xl px-3 py-2 text-sm font-medium text-gold-deep hover:bg-surface">All collections</Link>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
              <li>
                <Link href="/about" className="rounded-full px-3.5 py-2 hover:text-gold-deep">Our story</Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none">
            <span className="hidden lg:block"><SearchButton /></span>
            <Suspense fallback={<span className="hidden h-10 w-10 sm:block" aria-hidden="true" />}>
              <AccountLink />
            </Suspense>
            <CartLink />
          </div>
        </div>
      </header>
    </>
  );
}
