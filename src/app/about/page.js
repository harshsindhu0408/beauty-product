import AboutPage from "@/pages/AboutPage";

export default function About() {
  return <AboutPage />;
}

export const metadata = {
  title: 'About Saundrya Earth | Conscious Beauty Revolution | Ethical Skincare',
  description: 'Discover Saundrya Earth - where science meets soul in conscious beauty. Learn about our ethical skincare, sustainable practices, and beauty revolution. Vegan, cruelty-free, carbon-negative.',
  keywords: 'conscious beauty, ethical skincare, sustainable beauty, vegan skincare, cruelty-free, carbon-negative, Saundrya Earth, natural skincare, clean beauty',
  authors: [{ name: 'Saundrya Earth' }],
  creator: 'Saundrya Earth',
  publisher: 'Saundrya Earth',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph Tags
  openGraph: {
    title: 'About Saundrya Earth | Redefining Conscious Beauty',
    description: 'Where science meets soul in the pursuit of conscious beauty. Discover our ethical skincare revolution and sustainable practices.',
    url: 'https://saundryaearth.com/about',
    siteName: 'Saundrya Earth',
    images: [
      {
        url: 'https://res.cloudinary.com/dnvjct2if/image/upload/v1752659080/Gemini_Generated_Image_mrz04nmrz04nmrz0_wyivyp.png',
        width: 1200,
        height: 630,
        alt: 'Saundrya Earth - Conscious Beauty Revolution',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'About Saundrya Earth | Conscious Beauty Revolution',
    description: 'Where science meets soul in conscious beauty. Ethical, sustainable, carbon-negative skincare.',
    creator: '@saundryaearth',
    images: ['https://res.cloudinary.com/dnvjct2if/image/upload/v1752659080/Gemini_Generated_Image_mrz04nmrz04nmrz0_wyivyp.png'],
  },

  // Additional Meta Tags for SEO
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

  // Canonical URL
  alternates: {
    canonical: 'https://saundryaearth.com/about',
  },

  // Verification (if you have these)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },

  // Structured Data (JSON-LD) - This will be added separately
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Saundrya Earth",
      "description": "Saundrya Earth is a conscious beauty brand combining science and soul to create ethical, sustainable skincare products.",
      "url": "https://saundryaearth.com/about",
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
        "@id": "https://saundryaearth.com/about"
      }
    }),
  },
};

// Additional Structured Data for Organization
export const generateStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Saundrya Earth",
    "alternateName": "Saundrya Earth Conscious Beauty",
    "url": "https://saundryaearth.com",
    "logo": "https://saundryaearth.com/logo.png",
    "description": "Conscious beauty brand creating ethical, sustainable skincare where science meets soul",
    "slogan": "Where science meets soul in the pursuit of conscious beauty",
    "foundingDate": "2023",
    "founders": [
      {
        "@type": "Person",
        "name": "Anirudh Dalal"
      },
      {
        "@type": "Person",
        "name": "Anushka"
      },
      {
        "@type": "Person",
        "name": "Harsh Sindhu"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your ZIP",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX",
      "contactType": "customer service",
      "email": "hello@saundryaearth.com",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      "https://www.instagram.com/saundryaearth",
      "https://www.facebook.com/saundryaearth",
      "https://www.linkedin.com/company/saundryaearth",
      "https://twitter.com/saundryaearth"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Ethical Skincare Products",
          "description": "Vegan, cruelty-free, sustainable skincare products"
        }
      }
    ],
    "keywords": "conscious beauty, ethical skincare, sustainable beauty, vegan skincare, cruelty-free, carbon-negative beauty",
    "ethicsPolicy": "https://saundryaearth.com/ethics",
    "sustainabilityPolicy": "https://saundryaearth.com/sustainability"
  };

  return structuredData;
};