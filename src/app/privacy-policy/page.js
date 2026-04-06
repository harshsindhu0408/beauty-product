import PrivacyPolicyPage from "@/components/PrivacyPolicyPage";

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}

export const metadata = {
  title: "Privacy Policy | Saundrya Earth | Committed to Your Privacy",
  description:
    "Understand how Saundrya Earth collects, uses, and protects your personal data. We are committed to transparency and data security.",
  keywords:
    "privacy policy, data protection, personal information, data security, user rights, GDPR, Saundrya Earth",
  authors: [{ name: "Saundrya Earth" }],
  creator: "Saundrya Earth",
  publisher: "Saundrya Earth",

  openGraph: {
    title: "Privacy Policy | Saundrya Earth",
    description:
      "We respect your privacy. Learn about our transparent data practices.",
    url: "https://saundryaearth.com/privacy-policy",
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
    canonical: "https://saundryaearth.com/privacy-policy",
  },

  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      description:
        "Saundrya Earth's Privacy Policy and Data Protection Practices",
      url: "https://saundryaearth.com/privacy-policy",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://saundryaearth.com/privacy-policy",
      },
      publisher: {
        "@type": "Organization",
        name: "Saundrya Earth",
        logo: {
          "@type": "ImageObject",
          url: "https://saundryaearth.com/logo.png",
        },
      },
    }),
  },
};
