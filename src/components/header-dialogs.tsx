"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BRAND, LABELS } from "@/lib/brand";
import { CloseIcon, MenuIcon, SearchIcon } from "./icons";
import { StoreImage } from "./store-image";

type Suggestion = { id: number; name: string; href: string; image: string | null; category: string | null; price: string; regular: string | null; inStock: boolean };

/**
 * Search in a dialog. Suggests products as you type (photo, price, stock);
 * Enter or "Search" opens the full results page (a plain GET form, so it also
 * works without JavaScript).
 */
export function SearchButton({ categories = [] }: { categories?: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputId = useId();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const close = () => ref.current?.close();

  useEffect(() => {
    const term = q.trim();
    // Under two letters nothing is fetched (and old results are hidden below)
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        const data = await res.json();
        setResults(data.results ?? []);
        setTotal(data.total ?? 0);
      } catch {
        // aborted or offline: keep the last results
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [q]);

  const term = q.trim();

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
        <SearchIcon />
      </button>
      <dialog
        ref={ref}
        aria-label="Search products"
        className="m-0 mt-0 h-auto max-h-[90dvh] w-full max-w-none overflow-y-auto bg-bg p-0 shadow-2xl open:animate-fade-up"
        onClick={(e) => e.target === ref.current && close()}
      >
        <div className="container-x py-6 sm:py-10">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted">Search the store</p>
            <button type="button" onClick={close} aria-label="Close search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
              <CloseIcon />
            </button>
          </div>
          <form action="/products" role="search" className="mt-3 flex items-center gap-3 border-b-2 border-text pb-3" onSubmit={close}>
            <SearchIcon className="h-6 w-6 shrink-0 text-muted" />
            <label htmlFor={inputId} className="sr-only">Search products</label>
            <input
              id={inputId}
              name="q"
              type="search"
              autoFocus
              autoComplete="off"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              // A search field eats the first Escape (it clears the text); close straight away instead
              onKeyDown={(e) => e.key === "Escape" && (e.preventDefault(), close())}
              placeholder="What are you looking for?"
              aria-controls={`${inputId}-results`}
              className="font-display w-full bg-transparent text-2xl outline-none placeholder:text-muted/60 sm:text-4xl"
            />
            {loading && <span aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-line border-t-accent-strong" />}
            <button type="submit" className="btn btn-primary hidden sm:inline-flex">Search</button>
          </form>

          <div id={`${inputId}-results`} aria-live="polite" className="mt-5">
            {term.length >= 2 && results.length > 0 && (
              <>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((r) => (
                    <li key={r.id}>
                      <Link href={r.href} onClick={close} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-surface">
                        <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                          <StoreImage src={r.image} alt="" fallback={r.name} fallbackClassName="text-xl" fill sizes="3.5rem" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          {r.category && <span className="block text-[0.7rem] uppercase tracking-wide text-muted">{r.category}</span>}
                          <span className="line-clamp-1 text-sm font-medium">{r.name}</span>
                          <span className="text-sm">
                            <span className={r.regular ? "font-semibold text-sale" : "font-semibold"}>{r.price}</span>
                            {r.regular && <s className="ml-1.5 text-xs text-muted">{r.regular}</s>}
                            {!r.inStock && <span className="ml-2 text-xs text-muted">Sold out</span>}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/products?q=${encodeURIComponent(term)}`} onClick={close} className="btn btn-outline mt-4">
                  See all {total} results
                </Link>
              </>
            )}
            {term.length >= 2 && !loading && results.length === 0 && (
              <p className="text-muted">No {LABELS.items} match “{term}”. Try another word, or browse below.</p>
            )}
            {(term.length < 2 || results.length === 0) && categories.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Popular {LABELS.collections.toLowerCase()}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {categories.slice(0, 10).map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} onClick={close} className="inline-block rounded-full border border-line bg-card px-4 py-2 text-sm hover:border-accent hover:text-accent-strong">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
