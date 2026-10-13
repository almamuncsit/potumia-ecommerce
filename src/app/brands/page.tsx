import type { Metadata } from "next";
import { GroupIndex } from "@/components/group-page";
import { getBrands } from "@/lib/catalog";
import { getShopBrand } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getShopBrand();
  return {
    title: "Brands",
    description: `Shop the brands available at ${brand.name}, with cash on delivery across ${brand.country}.`,
    alternates: { canonical: "/brands" },
  };
}

export default async function BrandsPage() {
  return <GroupIndex kind="brand" groups={await getBrands()} />;
}
