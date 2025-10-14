import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.saundryaearth.com";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Saundrya Earth – Natural & Organic Beauty Products",
    template: `%s | Saundrya Earth`,
  },

  description:
    "Discover your natural radiance with Saundrya Earth. We offer a curated collection of premium, organic, and ethically sourced beauty products. Enhance your beauty, naturally.",

  keywords: [
    "natural beauty",
    "organic skincare",
    "herbal beauty products",
    "Saundrya Earth",
    "ethical beauty",
    "ayurvedic cosmetics",
  ],

  authors: [{ name: "Saundrya Earth", url: siteUrl }],
  creator: "Saundrya Earth",
  publisher: "Saundrya Earth",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Saundrya Earth – Natural & Organic Beauty Products",
    description:
      "Discover your natural radiance with our premium, organic, and ethically sourced beauty products.",
    url: siteUrl,
    siteName: "Saundrya Earth",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Saundrya Earth Natural Beauty Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Saundrya Earth",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7403500777",
      contactType: "customer service",
    },
    sameAs: [
      "https://www.facebook.com/YourPage",
      "https://www.twitter.com/YourTwitterHandle",
      "https://www.instagram.com/YourProfile",
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Add JSON-LD to the head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavigationWrapper />
        {children}
        <Footer />
        <Analytics />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#ffffff",
              color: "#000000",
              textAlign: "center",
              fontFamily: "var(--font-geist-sans)",
              fontSize: "18px",
              fontWeight: "500",
            },
          }}
        />
      </body>
    </html>
  );
}
