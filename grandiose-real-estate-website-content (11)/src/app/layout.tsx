import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const display = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${brand.name} - ${brand.tagline}`,
  applicationName: brand.name,
  generator: "Algorithm Ace Technologies",
  description:
    "Grandiose Real Estate Ltd is a Ghanaian real estate development and construction company providing land acquisition and sales, housing development, civil engineering, renovations, property management, consultancy and building-material supply services.",
  keywords: [
    "Grandiose Real Estate Ltd",
    "real estate Ghana",
    "property development Accra",
    "land for sale Ghana",
    "smart housing",
    "Verdant Valley",
    "Developed By Algorithm Ace Technologies",
  ],
  authors: [
    { name: brand.name },
    { name: "Algorithm Ace Technologies" },
  ],
  creator: "Algorithm Ace Technologies",
  publisher: "Algorithm Ace Technologies",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://grandiosegh.com",
    siteName: brand.name,
    title: `${brand.name} - ${brand.tagline}`,
    description:
      "Your trusted partner in real estate development, construction and property solutions in Ghana. Developed By Algorithm Ace Technologies.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    developer: "Developed By Algorithm Ace Technologies",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-w-full overflow-x-hidden">
      <body
        className={`${inter.className} ${display.variable} max-w-full overflow-x-hidden bg-[#fcfaf5] text-[#211d16]`}
      >
        {children}
      </body>
    </html>
  );
}
