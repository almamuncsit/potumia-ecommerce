import type { Metadata } from "next";
import { Suspense } from "react";
import { isFiltered, Listing, ListingSkeleton, parseFilters, type SearchParams } from "@/components/listing";
import { PageHero } from "@/components/page-hero";
import { LABELS } from "@/lib/brand";
import { getShopBrand } from "@/lib/site";

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const page = filters.page && filters.page > 1 ? filters.page : undefined;
  const brand = await getShopBrand();

  return {
    title: filters.q ? `Search: ${filters.q}` : page ? `Shop All – Page ${page}` : LABELS.catalogTitle,
    description: `Browse everything at ${brand.name} online: prices and stock, with cash on delivery across ${brand.country}.`,
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

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const brand = await getShopBrand();

  return (
    <>
      <PageHero
        title="Shop all"
        eyebrow={`Shop ${brand.name}`}
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
