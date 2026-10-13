import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { BRAND, THEME } from "@/lib/brand";
import { getStore } from "@/lib/catalog";
import { getShopBrand } from "@/lib/site";
import { absoluteUrl, siteUrl } from "@/lib/urls";
import { fontVariables } from "@theme/fonts";
import "./globals.css";
// The active theme's colours, fonts and button styles (after the shared styles)
import "@theme/theme.css";

export async function generateMetadata(): Promise<Metadata> {
  const [brand, store] = await Promise.all([getShopBrand(), getStore()]);
  const title = `${brand.name} | ${brand.tagline}`;
  // Themes for any shop: the shop's logo as the icon, its photo (else logo) when shared
  // Icon: the favicon from Store details, else the shop's logo (themes for any shop), else the theme's
  const logo = brand.favicon ?? brand.shopLogo?.src;
  // Link previews: the picture from Store details, else the shop's photo or logo, else the theme's
  const share = brand.shareImage
    ? { ...brand.shareImage, alt: brand.name }
    : brand.fromShop && (store.image || brand.shopLogo)
      ? { url: (store.image || brand.shopLogo?.src) as string, alt: brand.name }
      : { ...brand.logo.ogImage, url: brand.logo.ogImage.src, alt: brand.name };

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${brand.name}` },
    description: brand.description,
    applicationName: brand.name,
    keywords: brand.keywords,
    alternates: {
      canonical: "/",
      // Plain-text summaries of the store for AI assistants
      types: { "text/plain": [{ url: "/llms.txt", title: "LLM summary" }] },
    },
    openGraph: {
      type: "website",
      siteName: brand.name,
      title,
      description: brand.description,
      url: "/",
      locale: "en_BD",
      images: [share],
    },
    twitter: { card: "summary_large_image", title, description: brand.description, images: [share.url] },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    icons: logo
      ? { icon: [{ url: logo }], apple: logo }
      : {
          icon: [{ url: brand.logo.favicon, sizes: "any" }, { url: brand.logo.favicon64, type: "image/png", sizes: "64x64" }],
          apple: brand.logo.appleTouch,
        },
  };
}

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
};

async function SiteStructuredData() {
  const [store, brand] = await Promise.all([getStore(), getShopBrand()]);

  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "@id": absoluteUrl("/#store"),
          name: brand.name,
          url: siteUrl,
          description: brand.description,
          logo: brand.fromShop ? brand.shopLogo?.src : absoluteUrl(brand.logo.feature.src),
          image: brand.fromShop ? store.image || brand.shopLogo?.src : absoluteUrl(brand.logo.ogImage.src),
          email: store.email ?? undefined,
          telephone: store.phone ?? undefined,
          address: store.address ? { "@type": "PostalAddress", streetAddress: store.address, addressCountry: "BD" } : undefined,
          areaServed: { "@type": "Country", name: brand.country },
          currenciesAccepted: store.currency.code,
          paymentAccepted: brand.policies.payment,
          openingHours: brand.hours.schema,
          sameAs: brand.socials.length ? brand.socials.map((s) => s.href) : undefined,
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "BD",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: brand.policies.exchangeDays,
            url: absoluteUrl("/returns"),
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": absoluteUrl("/#website"),
          name: brand.name,
          url: siteUrl,
          inLanguage: "en",
          publisher: { "@id": absoluteUrl("/#store") },
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/products?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        },
      ]}
    />
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={THEME.id} className={fontVariables}>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <SiteStructuredData />
      </body>
    </html>
  );
}
