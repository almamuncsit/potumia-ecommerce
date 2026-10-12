import type { Metadata } from "next";
import { GroupPage, groupMetadata } from "@/components/group-page";
import { getIndex } from "@/lib/catalog";

/** Waits for its data so a missing brand is a real 404 (see products/[slug]) */
export const instant = false;

export async function generateStaticParams() {
  const { brands } = await getIndex();
  return brands.length ? brands.map((g) => ({ slug: `${g.id}-${g.slug}` })) : [{ slug: "0" }];
}

export async function generateMetadata({ params, searchParams }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  return groupMetadata("brand", (await params).slug, searchParams);
}

export default async function Page({ params, searchParams }: PageProps<"/brands/[slug]">) {
  return <GroupPage kind="brand" slug={(await params).slug} searchParams={searchParams} />;
}
