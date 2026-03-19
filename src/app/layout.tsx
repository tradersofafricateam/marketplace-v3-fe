import type { Metadata } from "next";
import { Mulish, Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default:
      "Traders of Africa Marketplace | Connecting African Suppliers to Global Buyers",
    template: "%s | Traders of Africa",
  },
  description:
    "Traders of Africa (TOFA) is a digital B2B marketplace connecting African businesses to buy, sell, and trade products seamlessly across borders. Discover verified suppliers, request quotes, and grow your business globally.",

  keywords: [
    "Africa marketplace",
    "B2B marketplace Africa",
    "import export Africa",
    "trade platform Africa",
    "African suppliers",
    "bulk buying Africa",
    "TOFA marketplace",
  ],

  authors: [{ name: "Traders of Africa" }],
  creator: "Traders of Africa",
  publisher: "Traders of Africa",

  metadataBase: new URL("https://www.tradersofafrica.com"),

  openGraph: {
    title: "Traders of Africa Marketplace",
    description:
      "Connect with verified African suppliers and buyers. Trade seamlessly across Africa with TOFA.",
    url: "https://www.tradersofafrica.com",
    siteName: "Traders of Africa",
    images: [
      {
        url: "/og-image.png", // make sure you add this
        width: 1200,
        height: 630,
        alt: "Traders of Africa Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Traders of Africa Marketplace",
    description:
      "Africa’s leading B2B marketplace for seamless trade and business growth.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", mulish.variable, poppins.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
