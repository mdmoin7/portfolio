import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import { getJsonLd, siteMetadata, SITE_URL, PROFILE_IMAGE } from "@/lib/seo";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: "Mohammad Moin" }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: SITE_URL,
    siteName: "Mohammad Moin",
    locale: "en_US",
    images: [{ url: PROFILE_IMAGE, width: 164, height: 164, alt: "Mohammad Moin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [PROFILE_IMAGE],
  },
  icons: { icon: "/favicon.svg" },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = getJsonLd();

  return (
    <html lang="en" className={`${playfair.variable} ${nunito.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
