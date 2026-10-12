import Link from "next/link";
import { GoldRings, Lattice } from "./banners/art";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/** The dark banner at the top of listing and help pages (holds the page's h1) */
export function PageHero({
  title,
  eyebrow,
  description,
  crumbs,
  art = "rings",
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string | null;
  crumbs: Crumb[];
  art?: "rings" | "lattice";
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(110%_140%_at_85%_30%,#2a2419_0%,#0e0d0b_62%)] text-on-ink">
      {art === "rings" ? (
        <GoldRings id="page-hero" className="absolute -right-20 top-1/2 -z-10 h-[170%] w-auto -translate-y-1/2 opacity-70" />
      ) : (
        <Lattice id="page-hero" className="absolute inset-0 -z-10 h-full w-full opacity-80" />
      )}
      <div className="container-x py-12 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} tone="dark" />
        <div className="mt-8 max-w-2xl animate-fade-up">
          {eyebrow && <p className="eyebrow text-gold-light">{eyebrow}</p>}
          <h1 className="font-display mt-3 text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-4 text-base leading-relaxed text-on-ink-muted sm:text-lg">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Light page header for task pages (bag, checkout, account) */
export function PageTitle({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <header className="border-b border-line pb-8">
      {eyebrow && <p className="eyebrow text-gold-deep">{eyebrow}</p>}
      <h1 className="font-display mt-2 text-4xl font-medium sm:text-5xl">{title}</h1>
      {children}
    </header>
  );
}

/** Section title with an optional "view all" link */
export function SectionHeading({ eyebrow, title, href, linkLabel = "View all", id }: { eyebrow?: string; title: string; href?: string; linkLabel?: string; id?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
      <div>
        {eyebrow && <p className="eyebrow text-gold-deep">{eyebrow}</p>}
        <h2 id={id} className="font-display mt-2 text-3xl font-medium sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="link-line shrink-0 pb-1 text-[0.75rem] font-medium uppercase tracking-[0.18em]">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
