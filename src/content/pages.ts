/**
 * Help and company page copy of the active theme
 * (src/themes/<theme>/content.ts, chosen with NEXT_PUBLIC_THEME).
 */
import { CONTENT as ACTIVE_CONTENT } from "@theme/content";
import type { ThemeContent } from "@/themes/types";

export type { ContentPage, Faq, Section } from "@/themes/types";

/** Typed as the shared contract, so code works with every theme */
const CONTENT: ThemeContent = ACTIVE_CONTENT;

export const PAGES = CONTENT.pages;
export const FAQS = CONTENT.faqs;
export const SIZE_CHART = CONTENT.sizeChart;

/** Clothing themes have a size guide (page, links, sitemap) */
export const HAS_SIZE_GUIDE = "size-guide" in PAGES;
