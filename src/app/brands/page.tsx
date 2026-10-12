import type { Metadata } from "next";
import { GroupIndex } from "@/components/group-page";
import { getBrands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Brands",
  description: "Shop the brands available at Evoke, with cash on delivery across Bangladesh.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  return <GroupIndex kind="brand" groups={await getBrands()} />;
}
