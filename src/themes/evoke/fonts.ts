import { Cormorant_Garamond, Jost } from "next/font/google";

/** Elegant serif for headlines, a clean geometric sans for everything else */
const heading = Cormorant_Garamond({ variable: "--font-heading", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const body = Jost({ variable: "--font-body", subsets: ["latin"], display: "swap" });

export const fontVariables = `${heading.variable} ${body.variable}`;
