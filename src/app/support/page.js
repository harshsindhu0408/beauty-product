import SupportPage from "@/components/SupportPage";

export default function Support() {
  return <SupportPage />;
}

export const metadata = {
  title: "Customer Support | Saundrya Earth | We Are Here To Help",
  description:
    "Need assistance with your Saundrya Earth order? Contact our dedicated support team via email, chat, or phone. We are here to help 24/7.",
  keywords:
    "customer support, help center, contact us, live chat, email support, phone support, Saundrya Earth help",
  authors: [{ name: "Saundrya Earth" }],
  creator: "Saundrya Earth",
  publisher: "Saundrya Earth",

  openGraph: {
    title: "Contact Support | Saundrya Earth",
    description: "Get help with your order or questions about our products.",
    url: "https://saundryaearth.com/support",
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
    canonical: "https://saundryaearth.com/support",
  },

  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Customer Support",
      description: "Contact Saundrya Earth Customer Support",
      url: "https://saundryaearth.com/support",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-555-123-4567",
        contactType: "Customer Support",
        email: "support@saundrya.com",
        availableLanguage: ["English"],
      },
    }),
  },
};
