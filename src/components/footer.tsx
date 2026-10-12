import Image from "next/image";
import Link from "next/link";
import { BRAND, whatsappNumber } from "@/lib/brand";
import { getCategories, getStore } from "@/lib/catalog";
import { categoryPath } from "@/lib/urls";
import { HELP } from "@/lib/nav";
import { CashIcon, ExchangeIcon, MailIcon, PhoneIcon, PinIcon, ShieldIcon, TruckIcon, WhatsAppIcon } from "./icons";

const PROMISES = [
  { Icon: CashIcon, title: BRAND.policies.payment, text: "Pay when your order arrives" },
  { Icon: TruckIcon, title: "Nationwide delivery", text: `Inside Dhaka in ${BRAND.policies.deliveryDhaka}` },
  { Icon: ExchangeIcon, title: `${BRAND.policies.exchangeDays}-day exchange`, text: "Easy size and style exchanges" },
  { Icon: ShieldIcon, title: "Quality checked", text: "Every piece inspected before it ships" },
];

/** The four store promises, used above the footer and on product pages */
export function PromiseStrip({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <ul className={`grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 ${dark ? "text-on-ink" : ""}`}>
      {PROMISES.map(({ Icon, title, text }) => (
        <li key={title} className="flex items-start gap-3.5">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${dark ? "border-gold/40 text-gold-light" : "border-gold/50 text-gold-deep"}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-medium">{title}</span>
            <span className={`block text-sm ${dark ? "text-on-ink-muted" : "text-muted"}`}>{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export async function Footer() {
  const [store, categories] = await Promise.all([getStore(), getCategories()]);
  const whatsapp = whatsappNumber(store.phone);

  return (
    <footer className="mt-24 bg-ink text-on-ink">
      <div className="border-b border-white/10">
        <div className="container-x py-12">
          <PromiseStrip tone="dark" />
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <section className="max-w-sm">
          <Link href="/" aria-label={`${BRAND.name} home`}>
            <Image src={BRAND.logo.horizontal.src} alt={BRAND.name} width={BRAND.logo.horizontal.width} height={BRAND.logo.horizontal.height} className="h-10 w-auto" />
          </Link>
          <p className="mt-6 text-sm leading-relaxed text-on-ink-muted">{BRAND.description}</p>
        </section>

        <nav aria-labelledby="footer-shop">
          <h2 id="footer-shop" className="eyebrow text-gold-light">Shop</h2>
          <ul className="mt-5 space-y-3 text-sm text-on-ink-muted">
            <li><Link href="/products" className="link-line hover:text-on-ink">All products</Link></li>
            <li><Link href="/products?sort=newest" className="link-line hover:text-on-ink">New arrivals</Link></li>
            <li><Link href="/products?sort=popular" className="link-line hover:text-on-ink">Best sellers</Link></li>
            {categories.slice(0, 4).map((c) => (
              <li key={c.id}><Link href={categoryPath(c)} className="link-line hover:text-on-ink">{c.name}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-help">
          <h2 id="footer-help" className="eyebrow text-gold-light">Help</h2>
          <ul className="mt-5 space-y-3 text-sm text-on-ink-muted">
            {HELP.map((h) => (
              <li key={h.href}><Link href={h.href} className="link-line hover:text-on-ink">{h.label}</Link></li>
            ))}
            <li><Link href="/account" className="link-line hover:text-on-ink">Track my order</Link></li>
          </ul>
        </nav>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className="eyebrow text-gold-light">Get in touch</h2>
          <address className="mt-5 space-y-3.5 text-sm not-italic text-on-ink-muted">
            {store.phone && (
              <a href={`tel:${store.phone}`} className="flex items-center gap-3 hover:text-on-ink">
                <PhoneIcon className="h-4 w-4 text-gold" /> {store.phone}
              </a>
            )}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-on-ink">
                <WhatsAppIcon className="h-4 w-4 text-gold" /> WhatsApp us
              </a>
            )}
            {store.email && (
              <a href={`mailto:${store.email}`} className="flex items-center gap-3 break-all hover:text-on-ink">
                <MailIcon className="h-4 w-4 shrink-0 text-gold" /> {store.email}
              </a>
            )}
            {store.address && (
              <p className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {store.address}
              </p>
            )}
            <p className="pt-1 text-xs">{BRAND.hours.label}</p>
          </address>
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-on-ink-muted sm:flex-row">
          <p>© {BRAND.name} · {BRAND.domain}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li><Link href="/privacy" className="hover:text-on-ink">Privacy policy</Link></li>
            <li><Link href="/terms" className="hover:text-on-ink">Terms & conditions</Link></li>
            <li className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1">
              <CashIcon className="h-4 w-4 text-gold" /> {BRAND.policies.payment}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
