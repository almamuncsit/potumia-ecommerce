import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { GroupIndex } from "@/components/group-page";
import { getBrands } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Brands",
  description: `Shop the brands available at ${BRAND.name}, with cash on delivery across ${BRAND.country}.`,
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  return <GroupIndex kind="brand" groups={await getBrands()} />;
}
