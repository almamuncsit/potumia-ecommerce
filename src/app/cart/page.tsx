import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-view";
import { PageTitle } from "@/components/page-hero";
import { getStore } from "@/lib/catalog";
import { getShopBrand } from "@/lib/site";

export const metadata: Metadata = { title: "Shopping bag", robots: { index: false, follow: false } };

export default async function Page() {
  const [store, brand] = await Promise.all([getStore(), getShopBrand()]);

  return (
    <div className="container-x space-y-10 py-10 lg:py-14">
      <PageTitle title="Shopping bag" eyebrow="Your selection" />
      <CartPage currency={store.currency} exchangeDays={brand.policies.exchangeDays} />
    </div>
  );
}
