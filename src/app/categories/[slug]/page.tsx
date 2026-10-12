import type { Metadata } from "next";
import { GroupPage, groupMetadata } from "@/components/group-page";
import { getIndex } from "@/lib/catalog";

/** Waits for its data so a missing category is a real 404 (see products/[slug]) */
export const instant = false;

export async function generateStaticParams() {
  const { categories } = await getIndex();
  return categories.length ? categories.map((g) => ({ slug: `${g.id}-${g.slug}` })) : [{ slug: "0" }];
}

export async function generateMetadata({ params, searchParams }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  return groupMetadata("category", (await params).slug, searchParams);
}

export default async function Page({ params, searchParams }: PageProps<"/categories/[slug]">) {
  return <GroupPage kind="category" slug={(await params).slug} searchParams={searchParams} />;
}
