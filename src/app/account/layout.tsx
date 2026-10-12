import type { Metadata } from "next";

/** Personal pages: never in search results */
export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return children;
}
