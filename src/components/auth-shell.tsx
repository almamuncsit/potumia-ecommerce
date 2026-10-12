import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { GoldRings } from "./banners/art";

const BENEFITS = ["Follow every order and its delivery", "Faster checkout with saved details", "Your order history in one place"];

/** Login / register layout: brand panel beside the form */
export function AuthShell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-10 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-card lg:grid-cols-2">
        <div className="relative isolate hidden flex-col justify-between overflow-hidden bg-[radial-gradient(120%_120%_at_30%_20%,#2a2419,#0e0d0b_65%)] p-12 text-on-ink lg:flex">
          <GoldRings id="auth" className="absolute -bottom-1/3 -right-1/3 -z-10 h-[120%] w-auto opacity-70" />
          <Image src={BRAND.logo.stacked.src} alt={BRAND.name} width={BRAND.logo.stacked.width} height={BRAND.logo.stacked.height} className="w-32" />
          <div>
            <p className="font-display text-4xl leading-tight">Welcome to the world of {BRAND.name}</p>
            <ul className="mt-8 space-y-3 text-sm text-on-ink-muted">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:p-12">
          <p className="eyebrow text-gold-deep">My account</p>
          <h1 className="font-display mt-2 text-4xl font-medium">{title}</h1>
          <p className="mt-2 text-muted">{lead}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
