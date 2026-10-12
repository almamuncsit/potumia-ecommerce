import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { getBrand, getCategory } from "@/lib/catalog";
import type { Group } from "@/lib/types";
import { brandPath, categoryPath, parseIdSlug } from "@/lib/urls";
import { BRAND, itemCount, LABELS } from "@/lib/brand";
import { ArtFlow, ArtRings } from "./banners/art";
import { ArrowRightIcon } from "./icons";
import { PageHero } from "./page-hero";
import { isFiltered, Listing, ListingSkeleton, parseFilters, type SearchParams } from "./listing";

/** Category and brand pages: one indexable landing page each, with the list of products */
type Kind = "category" | "brand";

const config = {
  category: { find: getCategory, path: categoryPath, list: "/categories", listName: LABELS.collections },
  brand: { find: getBrand, path: brandPath, list: "/brands", listName: "Brands" },
};

async function findGroup(kind: Kind, slug: string): Promise<{ group: Group; requestedSlug: string } | null> {
  const parsed = parseIdSlug(slug);
  const group = parsed ? await config[kind].find(parsed.id) : null;
  return parsed && group ? { group, requestedSlug: parsed.slug } : null;
}

export async function groupMetadata(kind: Kind, slug: string, searchParams: Promise<SearchParams>): Promise<Metadata> {
  const found = await findGroup(kind, slug);
  if (!found) return { title: "Not found", robots: { index: false } };
  const { group } = found;
  const filters = await searchParams.then(parseFilters);
  const path = config[kind].path(group);
  const page = filters.page && filters.page > 1 ? filters.page : undefined;
  const description =
    group.description?.slice(0, 155) ??
    `Shop ${group.name} at ${BRAND.name}: ${group.products ?? "all"} ${group.products === 1 ? "product" : "products"} with prices and stock.`;

  return {
    title: page ? `${group.name} – page ${page}` : group.name,
    description,
    alternates: { canonical: page ? `${path}?page=${page}` : path },
    openGraph: { title: group.name, description, url: path },
    robots: isFiltered(filters) ? { index: false, follow: true } : undefined,
  };
}

async function Products({ kind, group, searchParams }: { kind: Kind; group: Group; searchParams: Promise<SearchParams> }) {
  const filters = parseFilters(await searchParams);
  return <Listing filters={filters} basePath={config[kind].path(group)} fixed={kind === "category" ? { category: group.id } : { brand: group.id }} />;
}

export async function GroupPage({ kind, slug, searchParams }: { kind: Kind; slug: string; searchParams: Promise<SearchParams> }) {
  const found = await findGroup(kind, slug);
  if (!found) notFound();
  const { group, requestedSlug } = found;
  const { path, list, listName } = config[kind];
  if (requestedSlug !== group.slug) permanentRedirect(path(group));

  return (
    <>
      <PageHero
        title={group.name}
        eyebrow={kind === "category" ? LABELS.collection : "Brand"}
        description={group.description ?? `${itemCount(group.products)} from ${BRAND.name}, with cash on delivery across ${BRAND.country}.`}
        crumbs={[{ name: listName, href: list }, { name: group.name, href: path(group) }]}
      />
      <div className="container-x py-12 lg:py-16">
        <Suspense fallback={<ListingSkeleton />}>
          <Products kind={kind} group={group} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}

/** All categories / brands */
export function GroupIndex({ kind, groups }: { kind: Kind; groups: Group[] }) {
  const { path, listName } = config[kind];
  const isCategory = kind === "category";

  return (
    <>
      <PageHero
        title={listName}
        eyebrow="Explore"
        description={isCategory ? `Browse ${BRAND.name} by ${LABELS.collection.toLowerCase()} and find exactly what you're looking for.` : "Shop the brands we carry."}
        crumbs={[{ name: listName, href: config[kind].list }]}
      />
      <div className="container-x py-12 lg:py-16">
        {groups.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {groups.map((group, i) => (
              <li key={group.id}>
                <Link
                  href={path(group)}
                  className={`group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-2xl p-6 transition duration-500 hover:-translate-y-1 ${
                    i % 2 === 0 ? "bg-ink text-on-ink" : "bg-sand text-text"
                  }`}
                >
                  {i % 2 === 0 ? (
                    <ArtRings id={`idx-${kind}-${group.id}`} className="absolute -bottom-1/2 -right-1/3 h-[130%] w-auto opacity-50 transition duration-700 group-hover:scale-110" />
                  ) : (
                    <ArtFlow id={`idx-${kind}-${group.id}`} className="absolute inset-x-0 bottom-0 h-3/4 w-full opacity-70" />
                  )}
                  <span className={`font-display relative text-4xl ${i % 2 === 0 ? "text-accent/70" : "text-accent-strong/60"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative">
                    <span className="font-display block text-2xl font-medium leading-tight">{group.name}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] opacity-70">
                      {itemCount(group.products)} <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">Nothing here yet. Check back soon.</p>
        )}
      </div>
    </>
  );
}
