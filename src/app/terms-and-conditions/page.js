import TermsPage from "@/components/TermsPage";

export default function TermsOfService() {
  return <TermsPage />;
}

export const metadata = {
  title: "Terms of Service | Saundrya Earth",
  description:
    "Read our Terms of Service to understand your rights and responsibilities when using Saundrya Earth services and products.",
  keywords:
    "terms of service, user agreement, legal, conditions of use, Saundrya Earth terms",
  authors: [{ name: "Saundrya Earth" }],
  creator: "Saundrya Earth",
  publisher: "Saundrya Earth",

  openGraph: {
    title: "Terms of Service | Saundrya Earth",
    description: "Our commitment to transparent and fair terms.",
    url: "https://saundryaearth.com/terms-and-conditions",
    siteName: "Saundrya Earth",
    locale: "en_US",
    type: "website",
  },

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
    canonical: "https://saundryaearth.com/terms-and-conditions",
  },

  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms of Service",
      description: "Saundrya Earth Terms of Service and User Agreement",
      url: "https://saundryaearth.com/terms-and-conditions",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://saundryaearth.com/terms-and-conditions",
      },
    }),
  },
};
