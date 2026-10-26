import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { meta } from "@/lib/marketing/content";

/**
 * Two faces, as the approved design tokens specify: Manrope for headings,
 * Inter for body.
 *
 * Self-hosted by `next/font` rather than linked from Google — the files are
 * fetched at build time and served from our own origin, so there is no
 * third-party request on page load and no layout shift waiting for one.
 *
 * `--font-sans` is what `globals.css` and the Tailwind `font-sans` stack read.
 * Before this the body font was `Arial, Helvetica, sans-serif`, which is what
 * every visitor has actually been seeing.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  // From the content configuration, so the tab title and the page cannot drift.
  title: meta.seoTitle,
  description: meta.metaDescription,
  openGraph: {
    title: meta.seoTitle,
    description: meta.metaDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
