# Potumia storefront (Evoke, Potumia Shop, …)

The online store for shops on Potumia, with switchable themes: **Evoke** (https://evokefashionbd.com), a fashion label, and **Potumia Shop**, a general store. It offers product browsing, a cart, cash-on-delivery checkout, and customer accounts with order history. It's built with Next.js 16 (App Router, Cache Components) and reads everything from the inventory API (`multipos-api`, endpoints under `/api/ecommerce/store`).

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

`next build` calls the API to prerender product, category and brand pages, so the API must be reachable while building. Pages refresh in the background every 5 minutes (prices and stock) and every hour (shop name and logo); see `cacheLife` in `next.config.ts`. When the shop saves its shop info, Store details or delivery methods, the inventory API calls `POST /api/revalidate` on each of the shop's websites (with the website's key), so those changes show on the next visit. Checkout always checks live prices and stock with the shop, whatever a cached page showed.

## Themes

The store's look, brand and copy come from a **theme**. Pick one in `.env.local`:

```bash
NEXT_PUBLIC_THEME=evoke     # Evoke: luxury fashion, ink + brushed gold, serif headlines
NEXT_PUBLIC_THEME=potumia   # Potumia Shop: general store in the Potumia website style
```

Restart `npm run dev` (or rebuild) after changing it. A misspelled name stops the build and lists the available themes. Only the active theme's fonts, CSS and code are built, so switching themes costs nothing in page weight.

Each theme is a folder in `src/themes/<name>/`:

| File | What it holds |
| --- | --- |
| `config.ts` | Brand (name, tagline, description, logos, policies, service hours), wording ("pieces" or "products", "Collections" or "Categories"), and home-page copy |
| `content.ts` | Help and company pages (About, Shipping, Returns, Privacy, Terms; Size guide only for clothing themes) and the FAQ |
| `fonts.ts` | Headline and body fonts (`next/font`) |
| `theme.css` | Colours, gradients, and the look of buttons, labels and headlines (CSS variables) |
| `art.tsx` | Banner artwork: `ArtRings`, `ArtFlow`, `ArtPattern`, `ArtDivider` |
| `hero.tsx` | The home-page hero (`Hero`) |

Logos and images live in `public/` (Evoke: `public/brand/`, Potumia: `public/themes/potumia/`). The shared pages and components are in `src/app` and `src/components`; they read the theme through `@/lib/brand` and `@/content/pages`, and the `@theme/*` imports that `next.config.ts` points at the active folder.

**The shop's own brand:** a theme with `brand.fromShop: true` (Potumia) is for any shop: the store shows the shop's **name and logo** from Shop info in the inventory app (a wide logo on its own, a square one beside the name, the name with its initials when there is no logo). Every theme also takes the **Store details** the shop sets in the inventory app (Settings → Online store → Store details): tagline, about text, announcement bar, WhatsApp, opening hours, delivery times, exchange days, social links, and images from the file manager (a website logo and one for dark backgrounds in themes for any shop; the browser icon and link-preview picture in every theme); empty fields keep the theme's text or images. Theme copy writes `{name}`, `{exchangeDays}`, `{deliveryDhaka}`, `{deliveryOutside}` and `{hours}` where these belong, and `src/lib/site.ts` fills them in (`getShopBrand()`, `getContent()`, `getHomeCopy()`).

**Adding a theme:** copy an existing folder to `src/themes/<new-name>/`, change its files (keep the same exports, which `src/themes/types.ts` checks), add its images under `public/`, and set `NEXT_PUBLIC_THEME=<new-name>`. **Review the policies in `config.ts` before launch**; they appear on the help pages, in banners and in structured data. Contact details and currency always come from the shop in the inventory app.

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
