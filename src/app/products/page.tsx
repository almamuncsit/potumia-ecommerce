import type { Metadata } from "next";
import { Suspense } from "react";
import { isFiltered, Listing, ListingSkeleton, parseFilters, type SearchParams } from "@/components/listing";
import { PageHero } from "@/components/page-hero";
import { BRAND, LABELS } from "@/lib/brand";

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const page = filters.page && filters.page > 1 ? filters.page : undefined;

  return {
    title: filters.q ? `Search: ${filters.q}` : page ? `Shop All – Page ${page}` : LABELS.catalogTitle,
    description: `Browse everything at ${BRAND.name} online: prices and stock, with cash on delivery across ${BRAND.country}.`,
    // One canonical URL per page of the full list; searches and filtered
    // views stay out of search indexes (thin / duplicate pages) but their
    // links are still followed
    alternates: { canonical: page ? `/products?page=${page}` : "/products" },
    robots: isFiltered(filters) ? { index: false, follow: true } : undefined,
  };
}

async function Results({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Listing filters={parseFilters(await searchParams)} basePath="/products" />;
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <PageHero
        title="Shop all"
        eyebrow={`Shop ${BRAND.name}`}
        description={`Every ${LABELS.item} in one place. Refine by ${LABELS.collection.toLowerCase()}, price or availability.`}
        crumbs={[{ name: "Shop all", href: "/products" }]}
      />
      <div className="container-x py-12 lg:py-16">
        <Suspense fallback={<ListingSkeleton />}>
          <Results searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
