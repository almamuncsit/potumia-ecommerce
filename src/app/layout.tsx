import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { BRAND, THEME } from "@/lib/brand";
import { getStore } from "@/lib/catalog";
import { absoluteUrl, siteUrl } from "@/lib/urls";
import { fontVariables } from "@theme/fonts";
import "./globals.css";
// The active theme's colours, fonts and button styles (after the shared styles)
import "@theme/theme.css";

const title = `${BRAND.name} | ${BRAND.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: BRAND.keywords,
  alternates: {
    canonical: "/",
    // Plain-text summaries of the store for AI assistants
    types: { "text/plain": [{ url: "/llms.txt", title: "LLM summary" }] },
  },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title,
    description: BRAND.description,
    url: "/",
    locale: "en_BD",
    images: [{ url: BRAND.logo.ogImage.src, width: BRAND.logo.ogImage.width, height: BRAND.logo.ogImage.height, alt: BRAND.name }],
  },
  twitter: { card: "summary_large_image", title, description: BRAND.description, images: [BRAND.logo.ogImage.src] },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  icons: {
    icon: [{ url: BRAND.logo.favicon, sizes: "any" }, { url: BRAND.logo.favicon64, type: "image/png", sizes: "64x64" }],
    apple: BRAND.logo.appleTouch,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
};

async function SiteStructuredData() {
  const store = await getStore();

  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "@id": absoluteUrl("/#store"),
          name: BRAND.name,
          url: siteUrl,
          description: BRAND.description,
          logo: absoluteUrl(BRAND.logo.feature.src),
          image: absoluteUrl(BRAND.logo.ogImage.src),
          email: store.email ?? undefined,
          telephone: store.phone ?? undefined,
          address: store.address ? { "@type": "PostalAddress", streetAddress: store.address, addressCountry: "BD" } : undefined,
          areaServed: { "@type": "Country", name: BRAND.country },
          currenciesAccepted: store.currency.code,
          paymentAccepted: BRAND.policies.payment,
          openingHours: BRAND.hours.schema,
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "BD",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: BRAND.policies.exchangeDays,
            url: absoluteUrl("/returns"),
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": absoluteUrl("/#website"),
          name: BRAND.name,
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
