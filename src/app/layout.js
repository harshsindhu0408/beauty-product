import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import GoogleAuthProvider from "@/components/GoogleAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ADD THESE NEW FONTS
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const siteUrl = "https://www.saundryaearth.com";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Saundrya Earth – Best Premium Skincare Products & Organic Beauty",
    template: `%s | Saundrya Earth`,
  },

  description:
    "Elevate your beauty ritual with Saundrya Earth. Shop premium skincare products and organic beauty essentials crafted with science and soul for ethical, glowing skin.",

  keywords: [
    "Saundrya Earth",
    "skincare products",
    "premium beauty products",
    "organic skincare",
    "clean beauty",
    "natural skincare India",
    "ethical beauty shop",
    "vegan skincare products",
    "Ayurvedic skincare",
    "sustainable beauty",
    "Saundrya Earth skincare",
    "best skincare products",
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
    title: "Saundrya Earth – Best Premium Skincare Products & Organic Beauty",
    description:
      "Where science meets soul in the pursuit of beauty. Explore our collection of premium, ethical, and organic skincare products for natural radiance.",
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

  twitter: {
    card: "summary_large_image",
    title: "Saundrya Earth – Best Premium Skincare Products & Organic Beauty",
    description:
      "Shop premium, organic, and ethically sourced skincare products designed where science meets soul.",
    images: ["/og-image.png"],
    creator: "@saundryaearth",
  },

  verification: {
    google: "G-XXXXXXXXX", // Placeholder for actual verification
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

import Script from "next/script";

export default function RootLayout({ children }) {
  const jsonLd = [
    {
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
        "https://www.facebook.com/saundryaearth",
        "https://www.twitter.com/saundryaearth",
        "https://www.instagram.com/saundryaearth",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Saundrya Earth",
      url: siteUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Sitelinks",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "All Products",
          url: `${siteUrl}/products`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Categories",
          url: `${siteUrl}/categories`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Our Story",
          url: `${siteUrl}/about`,
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Account",
          url: `${siteUrl}/account`,
        },
      ],
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* Add JSON-LD to the head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} antialiased`}
      >
        {/* Google Tag Manager - Moved out of head for afterInteractive strategy */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-PZBBS2NH');`,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PZBBS2NH"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <GoogleAuthProvider>
          <NavigationWrapper />
          {children}
          <Footer />
        </GoogleAuthProvider>
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
