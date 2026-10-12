import type { Metadata } from "next";
import { GroupIndex } from "@/components/group-page";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop by Collection",
  description: "Browse every Evoke collection and find exactly what you are looking for, with cash on delivery across Bangladesh.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  return <GroupIndex kind="category" groups={await getCategories()} />;
}
