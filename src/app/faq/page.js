import FAQPage from "@/components/FAQPage";

export default function FAQ() {
  return <FAQPage />;
}

export const metadata = {
  title: "Frequently Asked Questions | Saundrya Earth",
  description:
    "Find answers to common questions about Saundrya Earth's natural beauty products, sustainability, shipping, and more.",
  keywords:
    "FAQ, questions, help, support, natural beauty, skincare, sustainability, shipping",
  authors: [{ name: "Saundrya Earth" }],
  creator: "Saundrya Earth",
  publisher: "Saundrya Earth",

  openGraph: {
    title: "Frequently Asked Questions | Saundrya Earth",
    description:
      "Find answers to common questions about Saundrya Earth's natural beauty products, sustainability, shipping, and more.",
    url: "https://saundryaearth.com/faq",
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
    canonical: "https://saundryaearth.com/faq",
  },

  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What makes Saundrya Earth products different?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our products are crafted with 100% natural ingredients, sustainably sourced and free from harsh chemicals.",
          },
        },
        {
          "@type": "Question",
          name: "Are your products cruelty-free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we are Leaping Bunny certified and never test on animals.",
          },
        },
        {
          "@type": "Question",
          name: "How should I store my products?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Store in a cool, dry place away from direct sunlight.",
          },
        },
      ],
    }),
  },
};
