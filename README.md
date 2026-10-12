# Evoke online store

The online store for **Evoke** (https://evokefashionbd.com), a fashion label in Bangladesh, running on Potumia: browse products, a cart, cash-on-delivery checkout, and customer accounts with order history. It's built with Next.js 16 (App Router, Cache Components) and reads everything from the inventory API (`multipos-api`, endpoints under `/api/ecommerce/store`).

## Setup

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3100
```

| Variable | What it is |
| --- | --- |
| `API_URL` | The inventory API, e.g. `https://api.potumia.com/api` (local: `http://127.0.0.1:8001/api`) |
| `WEBSITE_API_KEY` | The shop's website key: inventory app → Settings → Website. It decides which shop the store shows. Server-only, never sent to browsers. |
| `NEXT_PUBLIC_SITE_URL` | The store's public address, e.g. `https://shop.example.com`. Used for canonical URLs, the sitemap and structured data, so set it correctly in production. |

The API needs the migration `2026_10_12_000001_create_ecommerce_customer_tables` (`php artisan migrate`).

## Building and deploying

```bash
npm run build && npm run start -- -p 3100
```

`next build` calls the API to prerender product, category and brand pages, so the API must be reachable while building. Pages refresh in the background every 5 minutes (prices and stock) and every hour (shop name and logo); see `cacheLife` in `next.config.ts`. Checkout always checks live prices and stock with the shop, whatever a cached page showed.

## Brand and content

- **Brand settings:** `src/lib/brand.ts` holds the name, tagline, description, logo files (`public/brand/`) and store policies (payment, delivery times, exchange days, service hours). They appear in the banners, product pages, help pages, structured data and `llms.txt`. **Review the policies before launch.**
- **Page copy:** `src/content/pages.ts` holds the text for About, Shipping, Returns, Size guide, Privacy and Terms, the FAQ and the size chart. Contact details and currency come from the shop in the inventory app.
- **Design:** colours and type are tokens in `src/app/globals.css` (ink, ivory, brushed gold; Cormorant Garamond for headlines, Jost for text). Banner artwork is drawn in SVG in `src/components/banners/`, so there are no large banner images to manage.

## How it fits together

- **All API calls run on the Next.js server** (`src/lib/api.ts`, marked `server-only`). The website key is never exposed, and pages arrive as complete HTML.
- **Customer accounts are separate from inventory logins.** Customers have their own table and tokens in the API (`ecommerce_customers`, `ecommerce_customer_tokens`). A customer token is refused by the inventory API, and an inventory token is refused here. There are no roles or permissions. In the browser the token lives in an httpOnly cookie (`store_session`) that page scripts can't read.
- **Cart:** kept in `localStorage` in the browser (`src/components/cart/cart-store.ts`). Checkout sends only product ids and quantities; the shop sets the prices.
- **Orders:** placed as *sales orders* (source "ecommerce") in the inventory app, where staff move them through pending → processing → shipping → delivered and complete them. Customers see the status in their account. The delivery details and payment method are in the order's notes.
- **Payment:** cash on delivery only, for now. To add a method, extend `PAYMENT_METHODS` in `OrderController` (API) and the Payment section in `checkout-form.tsx`.

## Search engines and AI assistants

- Every product, category and brand has one canonical URL (`/products/12-blue-widget`). An old or mistyped name gets a 308 permanent redirect, and a missing item gets a real 404.
- Product pages are prerendered with the title, description, canonical link, Open Graph tags and `Product` / `Offer` structured data (price, currency, availability, brand) in the first HTML.
- Site-wide `OnlineStore` and `WebSite` (with `SearchAction`) structured data, plus `BreadcrumbList` on every catalog page.
- `/sitemap.xml` lists every product (with its image), category and brand, with last-changed dates. `/robots.txt` lets search engines and AI crawlers read the catalog and keeps them out of account, cart and checkout pages.
- Search and filter results are `noindex, follow`: not indexed as thin, duplicate pages, but their product links are followed.
- **`/llms.txt`** is a Markdown summary of the store (pages, categories, brands, every product with price and availability) for AI assistants and LLM search, following [llmstxt.org](https://llmstxt.org). **`/llms-full.txt`** adds each product's description.
- Semantic HTML throughout: one `h1` per page, labelled forms, plain links for pagination and filters (everything works without JavaScript except the cart).
