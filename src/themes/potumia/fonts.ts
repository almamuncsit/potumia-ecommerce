import { Inter, Plus_Jakarta_Sans } from "next/font/google";

/** The Potumia website's type: Plus Jakarta Sans headlines, Inter text */
const heading = Plus_Jakarta_Sans({ variable: "--font-heading", subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });
const body = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const fontVariables = `${heading.variable} ${body.variable}`;
