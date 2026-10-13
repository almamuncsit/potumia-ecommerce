import type { Metadata } from "next";
import Link from "next/link";
import { HelpNav } from "@/components/content-page";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, SOCIAL_ICONS, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { getStore } from "@/lib/catalog";
import { getShopBrand } from "@/lib/site";
import { absoluteUrl } from "@/lib/urls";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getShopBrand();
  const description = `Contact ${brand.name} by phone, WhatsApp or email for help with orders, delivery, sizing and exchanges. ${brand.hours.label}.`;

  return {
    title: { absolute: `Contact Us | ${brand.name}` },
    description,
    alternates: { canonical: "/contact" },
    openGraph: { title: `Contact ${brand.name}`, description, url: "/contact" },
  };
}

type Method = { Icon: typeof PhoneIcon; title: string; value: string; href?: string; note: string; external?: boolean };

export default async function ContactPage() {
  const [store, brand] = await Promise.all([getStore(), getShopBrand()]);
  const { whatsapp } = brand;
  const methods: Method[] = [];
  if (store.phone) methods.push({ Icon: PhoneIcon, title: "Call us", value: store.phone, href: `tel:${store.phone}`, note: "Fastest for questions about an order" });
  if (whatsapp) methods.push({ Icon: WhatsAppIcon, title: "WhatsApp", value: "Chat with us", href: `https://wa.me/${whatsapp}`, note: "Send photos and sizes easily", external: true });
  if (store.email) methods.push({ Icon: MailIcon, title: "Email", value: store.email, href: `mailto:${store.email}`, note: "We reply within one working day" });
  if (store.address) methods.push({ Icon: PinIcon, title: "Visit", value: store.address, note: "Please call ahead" });
  for (const { label, href } of brand.socials) {
    methods.push({ Icon: SOCIAL_ICONS[label], title: label, value: "Follow us", href, note: "News, offers and new arrivals", external: true });
  }

  return (
    <>
      <PageHero
        title="Contact us"
        eyebrow="We're here to help"
        description="Questions about an order, a size or an exchange? Reach us whichever way suits you. A real person will get back to you."
        crumbs={[{ name: "Contact", href: "/contact" }]}
      />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1fr_20rem] lg:py-20">
        <div className="space-y-10">
          <ul className="grid gap-5 sm:grid-cols-2">
            {methods.map(({ Icon, title, value, href, note, external }) => {
              const inner = (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-accent-light">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="eyebrow mt-6 block text-muted">{title}</span>
                  <span className="font-display mt-1 block break-words text-2xl">{value}</span>
                  <span className="mt-2 block text-sm text-muted">{note}</span>
                </>
              );
              return (
                <li key={title}>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="block h-full rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-black/5"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="h-full rounded-2xl border border-line bg-card p-6">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-start gap-4 rounded-2xl bg-surface p-6">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong" />
            <div>
              <h2 className="font-medium">Customer service hours</h2>
              <p className="mt-1 text-muted">{brand.hours.label}. Messages sent outside these hours are answered the next working day.</p>
            </div>
          </div>

          <div className="prose-store max-w-3xl">
            <h2>Before you get in touch</h2>
            <p>
              Many answers are already on our <Link href="/faq">FAQ</Link>, <Link href="/shipping">shipping & delivery</Link> and{" "}
              <Link href="/returns">returns & exchange</Link> pages. If you&apos;re asking about an order, please have your order number ready. You&apos;ll find it
              on your order confirmation and in <Link href="/account">My account</Link>.
            </p>
          </div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <HelpNav current="/contact" />
        </aside>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl("/contact"),
          name: `Contact ${brand.name}`,
          mainEntity: {
            "@id": absoluteUrl("/#store"),
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              telephone: store.phone ?? undefined,
              email: store.email ?? undefined,
              areaServed: "BD",
              availableLanguage: ["English", "Bengali"],
            },
          },
        }}
      />
    </>
  );
}
