/** Shapes returned by the inventory API's online-store endpoints (/api/ecommerce/store) */

export type Currency = {
  code: string;
  symbol: string;
  position: "left" | "right" | string;
  decimals: number;
};

export type Store = {
  name: string;
  description: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  logo: string | null;
  image: string | null;
  website_url: string | null;
  currency: Currency;
  /** How orders can be delivered (Settings → Online store); none: no delivery charge */
  delivery_methods?: DeliveryMethod[];
};

/** A way to deliver and its charge, e.g. Inside Dhaka 60 */
export type DeliveryMethod = {
  id: number;
  name: string;
  charge: number;
  estimate: string | null;
  description: string | null;
  /** Orders whose items come to at least this are delivered free */
  free_over: number | null;
};

/** The charge for a delivery method on an order of this many items' worth */
export const deliveryCharge = (method: DeliveryMethod | null | undefined, itemsTotal: number) =>
  !method ? 0 : method.free_over && itemsTotal >= method.free_over ? 0 : method.charge;

export type Group = {
  id: number;
  slug: string;
  name: string;
  products?: number;
  description?: string;
  /** Photo of the newest product in the group */
  image?: string | null;
  updated_at?: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  sku: string | null;
  unit: string | null;
  image: string | null;
  thumb: string | null;
  price: number;
  regular_price: number | null;
  in_stock: boolean;
  stock: number;
  category: Group | null;
  brand: Group | null;
  updated_at: string | null;
  /** Quantity sold in the last 90 days */
  sold?: number;
  /** Added in the last 30 days */
  is_new?: boolean;
  /** Has variations (color, size …): price is the lowest of theirs */
  has_variants?: boolean;
  /** Variations cost different amounts: show "From" */
  price_from?: boolean;
  /** Biggest saving among its variations, in % */
  max_discount?: number | null;
};

/** An option of a product with variations, e.g. Color: Red, Blue */
export type VariantOption = { name: string; values: string[] };

/** One combination ("Red / L") with its own price and stock */
export type ProductVariant = {
  id: number;
  label: string;
  values: Record<string, string>;
  sku: string | null;
  price: number;
  regular_price: number | null;
  in_stock: boolean;
  stock: number;
  image: string | null;
  thumb: string | null;
};

/** A product photo: the main one first, then the shop's extra photos */
export type ProductImage = { image: string; thumb: string | null; width: number | null; height: number | null };

export type ProductDetail = Product & {
  description_html: string | null;
  description: string | null;
  /** Every photo in order (older APIs leave it out) */
  images?: ProductImage[];
  options?: VariantOption[];
  variants?: ProductVariant[];
};

export type PageMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ProductPage = { data: Product[]; meta: PageMeta };

export type Home = {
  best_sellers: Product[];
  new_arrivals: Product[];
  /** In-stock products on sale, biggest saving first */
  deals: Product[];
  categories: Group[];
};

export type CatalogIndex = {
  products: { id: number; slug: string; name: string; image: string | null; updated_at: string | null }[];
  categories: Group[];
  brands: Group[];
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  address: string | null;
};

export type OrderStatus = "pending" | "processing" | "shipping" | "delivered" | "completed" | "canceled";

export type OrderSummary = {
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  paid: number;
  due: number;
};

export type Order = OrderSummary & {
  notes: string | null;
  /** Items before delivery */
  items_total?: number;
  delivery?: { name: string; charge: number } | null;
  items: {
    product_id: number | null;
    slug: string;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
    total: number;
  }[];
};

export type ProductFilters = {
  q?: string;
  category?: number;
  brand?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  on_sale?: boolean;
  sort?: "newest" | "popular" | "price_asc" | "price_desc" | "name_asc";
  page?: number;
  per_page?: number;
};
