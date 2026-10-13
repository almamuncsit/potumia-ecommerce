import type { Metadata } from "next";
import { LABELS } from "@/lib/brand";
import { GroupIndex } from "@/components/group-page";
import { getCategories } from "@/lib/catalog";
import { getShopBrand } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getShopBrand();
  return {
    title: `Shop by ${LABELS.collection}`,
    description: `Browse every ${brand.name} ${LABELS.collection.toLowerCase()} and find exactly what you are looking for, with cash on delivery across ${brand.country}.`,
    alternates: { canonical: "/categories" },
  };
}

export default async function CategoriesPage() {
  return <GroupIndex kind="category" groups={await getCategories()} />;
}
