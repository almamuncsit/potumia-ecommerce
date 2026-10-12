"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BRAND, LABELS } from "@/lib/brand";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";

/** Search in a dialog: a plain GET form to /products, so results are a normal page */
export function SearchButton() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
        <SearchIcon />
      </button>
      <dialog
        ref={ref}
        aria-label="Search products"
        className="m-0 mt-0 h-auto max-h-none w-full max-w-none bg-bg p-0 open:animate-fade-up"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
      >
        <div className="container-x py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted">Search the store</p>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Close search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
              <CloseIcon />
            </button>
          </div>
          <form action="/products" role="search" className="mt-4 flex items-center gap-3 border-b border-text pb-3" onSubmit={() => ref.current?.close()}>
            <SearchIcon className="h-6 w-6 text-muted" />
            <label htmlFor="dialog-search" className="sr-only">Search products</label>
            <input id="dialog-search" name="q" type="search" autoFocus placeholder="What are you looking for?" className="font-display w-full bg-transparent text-2xl outline-none placeholder:text-muted/60 sm:text-4xl" />
            <button type="submit" className="btn btn-primary hidden sm:inline-flex">Search</button>
          </form>
          <p className="mt-4 text-sm text-muted">
            Try a product name, a category or a brand. <Link href="/products" className="link-line text-text" onClick={() => ref.current?.close()}>Browse everything</Link>
          </p>
        </div>
      </dialog>
    </>
  );
}

type NavLink = { href: string; label: string };

/** Slide-in menu for phones and tablets */
export function MobileMenu({ links, categories, help }: { links: NavLink[]; categories: NavLink[]; help: NavLink[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface lg:hidden">
        <MenuIcon />
      </button>
      <dialog
        ref={ref}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-bg p-0"
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Image src={BRAND.logo.onLight.src} alt={BRAND.name} width={BRAND.logo.onLight.width} height={BRAND.logo.onLight.height} className="h-7 w-auto" />
            <button type="button" onClick={close} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={close} className="font-display block py-2 text-2xl">{l.label}</Link>
                </li>
              ))}
            </ul>
            {categories.length > 0 && (
              <>
                <p className="eyebrow mt-8 text-muted">{LABELS.collections}</p>
                <ul className="mt-3 space-y-1">
                  {categories.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} onClick={close} className="block py-1.5 text-text/80 hover:text-text">{c.label}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="eyebrow mt-8 text-muted">Help</p>
            <ul className="mt-3 space-y-1">
              {help.map((h) => (
                <li key={h.href}>
                  <Link href={h.href} onClick={close} className="block py-1.5 text-text/80 hover:text-text">{h.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-line p-5">
            <Link href="/account" onClick={close} className="btn btn-primary w-full">My account</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
