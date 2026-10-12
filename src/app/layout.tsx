import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { getStore } from "@/lib/catalog";
import { absoluteUrl, siteUrl } from "@/lib/urls";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore();
  const description = store.description ?? `Shop online at ${store.name}. Browse products, check prices and stock, and order for delivery.`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: store.name, template: `%s | ${store.name}` },
    description,
    applicationName: store.name,
    alternates: {
      canonical: "/",
      // Plain-text summaries of the store for AI assistants
      types: { "text/plain": [{ url: "/llms.txt", title: "LLM summary" }] },
    },
    openGraph: {
      type: "website",
      siteName: store.name,
      title: store.name,
      description,
      url: "/",
      images: store.image ?? store.logo ? [{ url: (store.image ?? store.logo)!, alt: store.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: store.name, description },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    icons: store.logo ? { icon: store.logo, apple: store.logo } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
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
          name: store.name,
          url: siteUrl,
          description: store.description ?? undefined,
          logo: store.logo ?? undefined,
          image: store.image ?? store.logo ?? undefined,
          email: store.email ?? undefined,
          telephone: store.phone ?? undefined,
          address: store.address ?? undefined,
          currenciesAccepted: store.currency.code,
          paymentAccepted: "Cash on delivery",
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": absoluteUrl("/#website"),
          name: store.name,
          url: siteUrl,
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
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          {children}
        </main>
        <Footer />
        <SiteStructuredData />
      </body>
    </html>
  );
}
