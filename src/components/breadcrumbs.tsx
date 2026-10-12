import Link from "next/link";
import { absoluteUrl } from "@/lib/urls";
import { JsonLd } from "./json-ld";

export type Crumb = { name: string; href: string };

/** Visible breadcrumbs plus their BreadcrumbList structured data */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  const dark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className={`nav-text text-[0.72rem] ${dark ? "text-on-ink-muted" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {all.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className={dark ? "text-accent/60" : "text-accent"}>/</span>}
            {i === all.length - 1 ? (
              <span aria-current="page" className={`line-clamp-1 ${dark ? "text-on-ink" : "text-text"}`}>
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className={dark ? "hover:text-accent-light" : "hover:text-text"}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </nav>
  );
}
