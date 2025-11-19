import RefundReturnPage from "@/pages/RefundReturnPage";


export default function RefundReturn() {
  return <RefundReturnPage />;
}

export const metadata = {
  title: 'Refund & Return Policy | Saundrya Earth | Conscious Commerce',
  description: 'Learn about Saundrya Earth\'s refund and return policy. Understand our cancellation process, Razorpay refund system, and commitment to sustainable commerce practices.',
  keywords: 'refund policy, return policy, order cancellation, Razorpay refund, sustainable commerce, Saundrya Earth, conscious beauty, ethical shopping',
  authors: [{ name: 'Saundrya Earth' }],
  creator: 'Saundrya Earth',
  publisher: 'Saundrya Earth',
  
  openGraph: {
    title: 'Refund & Return Policy | Saundrya Earth',
    description: 'Transparent refund and cancellation policy for conscious commerce. Learn about our Razorpay integration and sustainable practices.',
    url: 'https://saundryaearth.com/refund-return',
    siteName: 'Saundrya Earth',
    images: [
      {
        url: 'https://res.cloudinary.com/dnvjct2if/image/upload/v1752659080/Gemini_Generated_Image_mrz04nmrz04nmrz0_wyivyp.png',
        width: 1200,
        height: 630,
        alt: 'Saundrya Earth Refund Policy - Conscious Commerce',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Refund & Return Policy | Saundrya Earth',
    description: 'Transparent refund and cancellation policy for conscious commerce at Saundrya Earth.',
    creator: '@saundryaearth',
    images: ['https://res.cloudinary.com/dnvjct2if/image/upload/v1752659080/Gemini_Generated_Image_mrz04nmrz04nmrz0_wyivyp.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://saundryaearth.com/refund-return',
  },

  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Refund & Return Policy",
      "description": "Saundrya Earth's refund and return policy for conscious commerce",
      "url": "https://saundryaearth.com/refund-return",
      "publisher": {
        "@type": "Organization",
        "name": "Saundrya Earth",
        "logo": {
          "@type": "ImageObject",
          "url": "https://saundryaearth.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://saundryaearth.com/refund-return"
      }
    }),
  },
};