import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { BRAND } from "@/lib/brand";
import { getStore } from "@/lib/catalog";
import { absoluteUrl, siteUrl } from "@/lib/urls";
import "./globals.css";

const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const body = Jost({ variable: "--font-body", subsets: ["latin"], display: "swap" });

const title = `${BRAND.name} | ${BRAND.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: ["Evoke", "Evoke fashion", "online shopping Bangladesh", "fashion Bangladesh", "cash on delivery", "clothing online BD"],
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
    icon: [{ url: "/brand/favicon.ico", sizes: "any" }, { url: "/brand/favicon-64.png", type: "image/png", sizes: "64x64" }],
    apple: "/brand/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
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
          logo: absoluteUrl(BRAND.logo.stacked.src),
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
    <html lang="en" className={`${serif.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
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
