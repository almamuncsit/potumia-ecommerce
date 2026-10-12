import type { Metadata } from "next";
import { BRAND, LABELS } from "@/lib/brand";
import { GroupIndex } from "@/components/group-page";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: `Shop by ${LABELS.collection}`,
  description: `Browse every ${BRAND.name} ${LABELS.collection.toLowerCase()} and find exactly what you are looking for, with cash on delivery across ${BRAND.country}.`,
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  return <GroupIndex kind="category" groups={await getCategories()} />;
}
