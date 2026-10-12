import Link from "next/link";
import type { PageMeta } from "@/lib/types";

/** Plain links (crawlable, works without JavaScript) */
export function Pagination({ meta, href }: { meta: PageMeta; href: (page: number) => string }) {
  if (meta.last_page <= 1) return null;
  const { current_page: page, last_page: last } = meta;
  const pages = Array.from(new Set([1, page - 1, page, page + 1, last])).filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);

  return (
    <nav aria-label="Pages" className="mt-8 flex flex-wrap items-center justify-center gap-1.5 text-sm">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className="btn btn-outline px-3 py-1.5">
          Previous
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          {p === page ? (
            <span aria-current="page" className="btn btn-primary px-3 py-1.5">
              {p}
            </span>
          ) : (
            <Link href={href(p)} className="btn btn-outline px-3 py-1.5">
              {p}
            </Link>
          )}
        </span>
      ))}
      {page < last && (
        <Link href={href(page + 1)} rel="next" className="btn btn-outline px-3 py-1.5">
          Next
        </Link>
      )}
    </nav>
  );
}
