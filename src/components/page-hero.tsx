import Link from "next/link";
import { THEME } from "@/lib/brand";
import { ArtPattern, ArtRings } from "./banners/art";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * The banner at the top of listing and help pages (holds the page's h1):
 * dark or soft-tinted, depending on the theme (THEME.ui.pageHero).
 */
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
  const dark = THEME.ui.pageHero === "dark";

  // Marketplace: a compact title bar, so products start above the fold
  if (THEME.ui.layout === "marketplace") {
    return (
      <section className="relative isolate overflow-hidden border-b border-line bg-card">
        <span aria-hidden="true" className="absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-brand-soft" />
        <span aria-hidden="true" className="absolute -bottom-20 right-48 -z-10 hidden h-40 w-40 rounded-full bg-hot/10 sm:block" />
        <div className="container-x py-6 sm:py-8">
          <Breadcrumbs items={crumbs} tone="light" />
          <div className="mt-3 max-w-3xl">
            <h1 className="font-display text-3xl leading-tight text-text sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative isolate overflow-hidden ${dark ? "surface-ink" : "surface-soft border-b border-line"}`}>
      {art === "rings" ? (
        <ArtRings id="page-hero" className="absolute -right-20 top-1/2 -z-10 h-[170%] w-auto -translate-y-1/2 opacity-70" />
      ) : (
        <ArtPattern id="page-hero" className="absolute inset-0 -z-10 h-full w-full opacity-80" />
      )}
      <div className="container-x py-12 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} tone={dark ? "dark" : "light"} />
        <div className="mt-8 max-w-2xl animate-fade-up">
          {eyebrow && <p className={`eyebrow ${dark ? "text-accent-light" : "text-accent-strong"}`}>{eyebrow}</p>}
          <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-on-ink-muted" : "text-muted"}`}>{description}</p>}
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
      {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
      <h1 className="font-display mt-2 text-4xl sm:text-5xl">{title}</h1>
      {children}
    </header>
  );
}

/** Section title with an optional "view all" link */
export function SectionHeading({ eyebrow, title, href, linkLabel = "View all", id }: { eyebrow?: string; title: string; href?: string; linkLabel?: string; id?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
      <div>
        {eyebrow && <p className="eyebrow text-accent-strong">{eyebrow}</p>}
        <h2 id={id} className="font-display mt-2 text-3xl sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="link-line shrink-0 pb-1 text-[0.75rem] font-medium uppercase tracking-[0.18em]">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
