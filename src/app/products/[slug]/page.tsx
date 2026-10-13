import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AddToCart } from "@/components/cart/add-to-cart";
import { VariantBuyBox } from "@/components/cart/variant-buy-box";
import { CashIcon, ExchangeIcon, PlusIcon, RulerIcon, TruckIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/page-hero";
import { Price } from "@/components/price";
import { ProductGrid } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { HAS_SIZE_GUIDE } from "@/content/pages";
import { LABELS, THEME } from "@/lib/brand";
import { getShopBrand } from "@/lib/site";
import { getIndex, getProduct, getStore } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { ProductDetail, ProductImage } from "@/lib/types";
import { absoluteUrl, brandPath, categoryPath, parseIdSlug, productPath } from "@/lib/urls";

/**
 * Product pages wait for their data before sending anything, so search
 * engines get a real 404 for a missing product, the metadata in <head> and the
 * full content in the first HTML. They're prerendered at build time and
 * refreshed in the background (see cacheLife "catalog").
 */
export const instant = false;

export async function generateStaticParams() {
  const { products } = await getIndex();
  // Cache Components needs at least one; a missing one simply 404s
  return products.length ? products.map((p) => ({ slug: `${p.id}-${p.slug}` })) : [{ slug: "0" }];
}

async function load(slugParam: string) {
  const parsed = parseIdSlug(slugParam);
  const found = parsed ? await getProduct(parsed.id) : null;
  if (!parsed || !found) notFound();
  return { ...found, requestedSlug: parsed.slug };
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const parsed = parseIdSlug((await params).slug);
  const found = parsed ? await getProduct(parsed.id) : null;
  if (!found) return { title: "Product not found", robots: { index: false } };

  const { product } = found;
  const [store, brand] = await Promise.all([getStore(), getShopBrand()]);
  const price = formatMoney(product.price, store.currency);
  const description =
    product.description?.slice(0, 155) ??
    `Buy ${product.name} online at ${brand.name} for ${price}. ${product.in_stock ? "In stock" : "Currently sold out"}, cash on delivery across Bangladesh.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: productPath(product) },
    openGraph: {
      title: product.name,
      description,
      url: productPath(product),
      images: photosOf(product).length ? photosOf(product).map((p) => ({ url: p.image, alt: product.name })) : undefined,
    },
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": store.currency.code,
      "product:availability": product.in_stock ? "in stock" : "out of stock",
    },
  };
}

const PANEL = "group border-b border-line py-5";

/** Every photo of the product; just the main one if the API doesn't list them */
const photosOf = (product: ProductDetail): ProductImage[] =>
  product.images?.length ? product.images : product.image ? [{ image: product.image, thumb: product.thumb, width: null, height: null }] : [];

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [{ product, related, requestedSlug }, store, brand] = await Promise.all([load(slug), getStore(), getShopBrand()]);

  // One URL per product: an old or mistyped name redirects to the current one
  if (requestedSlug !== product.slug) permanentRedirect(productPath(product));

  const crumbs = [
    { name: "Shop", href: "/products" },
    ...(product.category ? [{ name: product.category.name, href: categoryPath(product.category) }] : []),
    { name: product.name, href: productPath(product) },
  ];
  const lowStock = product.in_stock && product.stock <= 5;
  // "Delivery from ৳60" when the shop has delivery methods (Settings → Online store)
  const charges = (store.delivery_methods ?? []).map((m) => m.charge);
  const deliveryNote = !charges.length
    ? "Delivery charge confirmed with your order"
    : Math.min(...charges) > 0
      ? `Delivery from ${formatMoney(Math.min(...charges), store.currency)}`
      : "Free delivery available";
  const { payment, exchangeDays, deliveryDhaka, deliveryOutside } = brand.policies;

  return (
    <>
      <div className="container-x pt-8">
        <Breadcrumbs items={crumbs} />
      </div>

      <article className="container-x grid gap-10 pt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <ProductGallery
          images={photosOf(product)}
          name={product.name}
          badge={product.regular_price ? <span className="eyebrow absolute left-5 top-5 rounded-full bg-ink px-3 py-1.5 text-[0.65rem] text-accent-light">On sale</span> : undefined}
        />

        <div className="lg:py-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {product.category && (
              <Link href={categoryPath(product.category)} className="eyebrow text-accent-strong hover:underline">{product.category.name}</Link>
            )}
            {product.brand && (
              <>
                <span aria-hidden="true" className="text-line">|</span>
                <Link href={brandPath(product.brand)} className="eyebrow text-muted hover:text-text">{product.brand.name}</Link>
              </>
            )}
          </div>
          <h1 className="font-display mt-3 text-4xl font-medium leading-[1.1] sm:text-5xl">{product.name}</h1>

          {product.variants?.length ? (
            // Color, size …: the chosen variation sets price, stock and what goes in the bag
            <VariantBuyBox product={product} currency={store.currency} payment={payment} deliveryNote={deliveryNote} />
          ) : (
            <>
              <div className="mt-5">
                <Price price={product.price} regular={product.regular_price} currency={store.currency} size="lg" />
              </div>
              <p className="mt-2 text-sm text-muted">{payment} available · {deliveryNote}</p>

              <p className={`mt-6 flex items-center gap-2 text-sm font-medium ${product.in_stock ? (lowStock ? "text-sale" : "text-ok") : "text-muted"}`}>
                <span className={`h-2 w-2 rounded-full ${product.in_stock ? (lowStock ? "bg-sale" : "bg-ok") : "bg-muted"}`} />
                {!product.in_stock ? "Sold out" : lowStock ? `Only ${Math.floor(product.stock)} left` : "In stock, ready to ship"}
              </p>

              <div className="mt-6">
                <AddToCart
                  product_id={product.id}
                  slug={product.slug}
                  name={product.name}
                  image={product.image ?? product.thumb}
                  price={product.price}
                  max={product.stock}
                  inStock={product.in_stock}
                />
              </div>
            </>
          )}

          <ul className="mt-8 grid grid-cols-3 gap-3 border-y border-line py-6 text-center text-xs">
            <li className="space-y-2">
              <CashIcon className="mx-auto h-6 w-6 text-accent-strong" />
              <span className="block">{payment}</span>
            </li>
            <li className="space-y-2">
              <TruckIcon className="mx-auto h-6 w-6 text-accent-strong" />
              <span className="block">Nationwide delivery</span>
            </li>
            <li className="space-y-2">
              <ExchangeIcon className="mx-auto h-6 w-6 text-accent-strong" />
              <span className="block">{exchangeDays}-day exchange</span>
            </li>
          </ul>

          <div>
            {product.description_html && (
              <details className={PANEL} open>
                <summary className="flex items-center justify-between text-sm font-medium nav-text">
                  Description <PlusIcon className="h-4 w-4 text-accent-strong transition group-open:rotate-45" />
                </summary>
                {/* Cleaned by the API: basic formatting tags only, no attributes or scripts */}
                <div className="prose-store mt-3 text-[0.95rem]" dangerouslySetInnerHTML={{ __html: product.description_html }} />
              </details>
            )}
            <details className={PANEL}>
              <summary className="flex items-center justify-between text-sm font-medium nav-text">
                Details <PlusIcon className="h-4 w-4 text-accent-strong transition group-open:rotate-45" />
              </summary>
              <dl className="mt-4 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
                <dt className="text-muted">Item code</dt>
                <dd>{product.sku ?? `EV-${product.id}`}</dd>
                {product.category && (<><dt className="text-muted">{LABELS.collection}</dt><dd>{product.category.name}</dd></>)}
                {product.brand && (<><dt className="text-muted">Brand</dt><dd>{product.brand.name}</dd></>)}
                {product.unit && (<><dt className="text-muted">Sold by</dt><dd>{product.unit}</dd></>)}
              </dl>
              {HAS_SIZE_GUIDE && (
                <Link href="/size-guide" className="mt-4 inline-flex items-center gap-2 text-sm text-accent-strong hover:underline">
                  <RulerIcon className="h-4 w-4" /> Size guide
                </Link>
              )}
            </details>
            <details className={PANEL}>
              <summary className="flex items-center justify-between text-sm font-medium nav-text">
                Delivery & payment <PlusIcon className="h-4 w-4 text-accent-strong transition group-open:rotate-45" />
              </summary>
              <ul className="mt-3 space-y-1.5 text-sm text-muted">
                <li>Inside Dhaka: {deliveryDhaka}</li>
                <li>Outside Dhaka: {deliveryOutside}</li>
                <li>{payment}: pay when your order arrives</li>
              </ul>
              <Link href="/shipping" className="mt-3 inline-block text-sm text-accent-strong hover:underline">Shipping details</Link>
            </details>
            <details className={PANEL}>
              <summary className="flex items-center justify-between text-sm font-medium nav-text">
                Exchange & returns <PlusIcon className="h-4 w-4 text-accent-strong transition group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm text-muted">
                Exchange within {exchangeDays} days of delivery if it&apos;s unworn with tags attached. Damaged or wrong items are replaced free of charge.
              </p>
              <Link href="/returns" className="mt-3 inline-block text-sm text-accent-strong hover:underline">Exchange policy</Link>
            </details>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="container-x pt-24">
          <SectionHeading id="related-heading" eyebrow="You may also like" title={LABELS.related} href={product.category ? categoryPath(product.category) : "/products"} />
          <ProductGrid products={related.slice(0, THEME.ui.layout === "marketplace" ? 5 : 4)} currency={store.currency} />
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "@id": absoluteUrl(`${productPath(product)}#product`),
          name: product.name,
          url: absoluteUrl(productPath(product)),
          image: photosOf(product).length ? photosOf(product).map((p) => p.image) : [brand.shopLogo?.src ?? absoluteUrl(brand.logo.ogImage.src)],
          description: product.description ?? `${product.name} from ${brand.name}.`,
          sku: product.sku ?? String(product.id),
          category: product.category?.name,
          brand: { "@type": "Brand", name: product.brand?.name ?? brand.name },
          offers: {
            // Variations: the range of their prices
            ...(product.variants?.length
              ? {
                  "@type": "AggregateOffer",
                  lowPrice: Math.min(...product.variants.map((v) => v.price)).toFixed(2),
                  highPrice: Math.max(...product.variants.map((v) => v.price)).toFixed(2),
                  offerCount: product.variants.length,
                }
              : { "@type": "Offer", price: product.price.toFixed(2) }),
            url: absoluteUrl(productPath(product)),
            priceCurrency: store.currency.code,
            availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": absoluteUrl("/#store") },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "BD",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: exchangeDays,
            },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "BD" },
            },
          },
        }}
      />
    </>
  );
}
