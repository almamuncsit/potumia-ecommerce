import Image from "next/image";
import { getShopBrand } from "@/lib/site";
import { ArtRings } from "./banners/art";
import { BrandLogo } from "./brand-logo";

const BENEFITS = ["Follow every order and its delivery", "Faster checkout with saved details", "Your order history in one place"];

/** Login / register layout: brand panel beside the form */
export async function AuthShell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  const brand = await getShopBrand();

  return (
    <div className="container-x py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-card lg:grid-cols-2">
        <div className="relative isolate hidden flex-col justify-between overflow-hidden surface-ink p-12 text-on-ink lg:flex">
          <ArtRings id="auth" className="absolute -bottom-1/3 -right-1/3 -z-10 h-[120%] w-auto opacity-70" />
          {brand.fromShop ? (
            <BrandLogo brand={brand} tone="dark" size="lg" />
          ) : (
            <Image src={brand.logo.feature.src} alt={brand.name} width={brand.logo.feature.width} height={brand.logo.feature.height} className="w-32" />
          )}
          <div>
            <p className="font-display text-4xl leading-tight">Welcome to the world of {brand.name}</p>
            <ul className="mt-8 space-y-3 text-sm text-on-ink-muted">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="eyebrow text-accent-strong">My account</p>
          <h1 className="font-display mt-2 text-4xl font-medium">{title}</h1>
          <p className="mt-2 text-muted">{lead}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
