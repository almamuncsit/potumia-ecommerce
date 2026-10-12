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
};

export type Group = {
  id: number;
  slug: string;
  name: string;
  products?: number;
  description?: string;
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
};

export type ProductDetail = Product & {
  description_html: string | null;
  description: string | null;
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
  sort?: "newest" | "popular" | "price_asc" | "price_desc" | "name_asc";
  page?: number;
  per_page?: number;
};
