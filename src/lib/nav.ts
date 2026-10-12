import { HAS_SIZE_GUIDE } from "@/content/pages";

/** Site navigation shared by the header, mobile menu and footer */
export const NAV = [
  { href: "/products", label: "Shop all" },
  { href: "/products?sort=newest", label: "New in" },
  { href: "/products?sort=popular", label: "Best sellers" },
  { href: "/about", label: "Our story" },
];

/** Help pages; the size guide only for themes that have one */
export const HELP = [
  { href: "/contact", label: "Contact us" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping & delivery" },
  { href: "/returns", label: "Returns & exchange" },
  { href: "/size-guide", label: "Size guide" },
].filter((link) => link.href !== "/size-guide" || HAS_SIZE_GUIDE);
