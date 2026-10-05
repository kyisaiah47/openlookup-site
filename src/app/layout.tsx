import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import "@/components/site-view/simple.css";
import SiteViewProvider from "@/components/site-view/SiteViewProvider";
import Analytics from "@/components/Analytics";
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});
/* Inter sets body and product UI in the Simple view only; the Console never reads --font-inter. */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = {
  title: "OpenLookup",
  description: "Eleven read-only lookup tools backed by live public data.",
  metadataBase: new URL("https://openlookup.thecompound.tech"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "OpenLookup",
    description: "Eleven read-only lookup tools backed by live public data.",
    url: "https://openlookup.thecompound.tech/",
    siteName: "OpenLookup",
    type: "website",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OpenLookup",
    url: "https://openlookup.thecompound.tech",
    publisher: {
      "@type": "Organization",
      "@id": "https://thecompound.tech/#organization",
      name: "Compound Labs",
      url: "https://thecompound.tech",
    },
  };
  return (
    <html lang="en" className={`${mono.variable} ${inter.variable}`}>
      <body>
        <Analytics />
        <SmoothScroll />
        <SiteViewProvider slug="compound-mcp">
          {children}
        </SiteViewProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
