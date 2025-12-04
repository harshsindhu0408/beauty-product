// app/product/page.js
import { FetchData } from "@/services/useServerFetch";
import ProductsPage from "@/pages/ProductsPage";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params.category || "";
  const search = params.search || "";

  // Base metadata
  const baseMetadata = {
    title: "Saundrya Earth | Premium Ayurvedic Skincare & Beauty Products",
    description: "Discover Saundrya Earth's premium Ayurvedic skincare collection. Natural, chemical-free serums, creams, and beauty products for radiant, healthy skin. Shop now!",
    keywords: "ayurvedic skincare, natural beauty products, chemical-free cosmetics, saundrya earth, organic skincare, face serum, night cream, day cream, lip balm, ubtan, radiance boost serum",
    authors: [{ name: "Saundrya Earth" }],
    creator: "Saundrya Earth",
    publisher: "Saundrya Earth",
  };

  // Category-specific metadata
  if (category) {
    const categoryName = category.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      title: `${categoryName} - Premium Ayurvedic ${categoryName} | Saundrya Earth`,
      description: `Shop premium Ayurvedic ${categoryName} by Saundrya Earth. Natural, chemical-free formulas for ${categoryName.toLowerCase()} needs. Free shipping & authentic Ayurvedic solutions.`,
      keywords: `ayurvedic ${categoryName}, ${categoryName} for skin, natural ${categoryName}, saundrya earth ${categoryName}, best ${categoryName} online, ${categoryName} price, buy ${categoryName}`,
      openGraph: {
        title: `${categoryName} - Premium Ayurvedic ${categoryName} | Saundrya Earth`,
        description: `Shop premium Ayurvedic ${categoryName} by Saundrya Earth. Natural formulas for radiant skin.`,
        type: 'website',
        url: `https://saundryaearth.com/products?category=${category}`,
        siteName: 'Saundrya Earth',
        images: [
          {
            url: 'https://api.saundryaearth.com/uploads/brands/logo-1760172582745-550243530.jpg',
            width: 800,
            height: 600,
            alt: `Saundrya Earth ${categoryName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} - Premium Ayurvedic ${categoryName} | Saundrya Earth`,
        description: `Shop premium Ayurvedic ${categoryName} by Saundrya Earth.`,
        images: ['https://api.saundryaearth.com/uploads/brands/logo-1760172582745-550243530.jpg'],
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
    };
  }

  // Search-specific metadata
  if (search) {
    return {
      title: `Search Results for "${search}" | Saundrya Earth Ayurvedic Skincare`,
      description: `Find the best Ayurvedic skincare products for "${search}" at Saundrya Earth. Natural, chemical-free solutions for your skincare needs. Free shipping available.`,
      keywords: `${search}, ayurvedic ${search}, natural ${search}, saundrya earth ${search}, buy ${search} online`,
      openGraph: {
        title: `Search Results for "${search}" | Saundrya Earth`,
        description: `Find Ayurvedic ${search} products at Saundrya Earth. Natural skincare solutions.`,
        type: 'website',
        url: `https://saundryaearth.com/products?search=${encodeURIComponent(search)}`,
        siteName: 'Saundrya Earth',
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  // Default products page metadata
  return {
    ...baseMetadata,
    openGraph: {
      title: baseMetadata.title,
      description: baseMetadata.description,
      type: 'website',
      url: 'https://saundryaearth.com/products',
      siteName: 'Saundrya Earth',
      images: [
        {
          url: 'https://api.saundryaearth.com/uploads/brands/logo-1760172582745-550243530.jpg',
          width: 800,
          height: 600,
          alt: 'Saundrya Earth - Premium Ayurvedic Skincare',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: baseMetadata.title,
      description: baseMetadata.description,
      images: ['https://api.saundryaearth.com/uploads/brands/logo-1760172582745-550243530.jpg'],
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
      canonical: 'https://saundryaearth.com/products',
    },
  };
}

export default async function Product({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  const category = params.category || "";
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const minRating = params.minRating || "";
  const brand = params.brand || "";
  const isActive = params.isActive || "";
  const isFeatured = params.isFeatured || "";
  const isDigital = params.isDigital || "";
  const tags = params.tags || "";
  const topSelling = params.topSelling || "";
  const search = params.search || "";

  try {
    // Build the API URL with all query parameters
    let apiUrl = `product?page=${page}&limit=${limit}`;

    // Add all filter parameters
    if (category) apiUrl += `&category=${encodeURIComponent(category)}`;
    if (minPrice) apiUrl += `&minPrice=${encodeURIComponent(minPrice)}`;
    if (maxPrice) apiUrl += `&maxPrice=${encodeURIComponent(maxPrice)}`;
    if (minRating) apiUrl += `&minRating=${encodeURIComponent(minRating)}`;
    if (brand) apiUrl += `&brand=${encodeURIComponent(brand)}`;
    if (isActive) apiUrl += `&isActive=${encodeURIComponent(isActive)}`;
    if (isFeatured) apiUrl += `&isFeatured=${encodeURIComponent(isFeatured)}`;
    if (isDigital) apiUrl += `&isDigital=${encodeURIComponent(isDigital)}`;
    if (tags) apiUrl += `&tags=${encodeURIComponent(tags)}`;
    if (topSelling) apiUrl += `&topSelling=${encodeURIComponent(topSelling)}`;
    if (search) apiUrl += `&search=${encodeURIComponent(search)}`;

    // Run both API calls in parallel
    const [productsRes, categoriesRes] = await Promise.all([
      FetchData(apiUrl),
      FetchData(`category`),
    ]);

    const productsData = productsRes?.data || null;
    const categoriesData = categoriesRes?.data || null;

    // Generate structured data for SEO
    const generateStructuredData = () => {
      const websiteStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Saundrya Earth",
        "url": "https://saundryaearth.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://saundryaearth.com/products?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "description": "Premium Ayurvedic Skincare & Beauty Products",
        "publisher": {
          "@type": "Organization",
          "name": "Saundrya Earth",
          "logo": {
            "@type": "ImageObject",
            "url": "https://api.saundryaearth.com/uploads/brands/logo-1760172582745-550243530.jpg"
          }
        }
      };

      const productStructuredData = productsData?.products?.map(product => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.metaDescription || product.shortDescription,
        "image": product.images?.map(img => img.url) || [],
        "sku": product.sku,
        "brand": {
          "@type": "Brand",
          "name": product.brand?.name || "Saundrya Earth"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://saundryaearth.com/products/${product.slug}`,
          "priceCurrency": "INR",
          "price": product.price,
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "availability": product.isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Saundrya Earth"
          }
        },
        "aggregateRating": product.averageRating > 0 ? {
          "@type": "AggregateRating",
          "ratingValue": product.averageRating,
          "reviewCount": product.reviewCount
        } : undefined
      })) || [];

      const breadcrumbStructuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://saundryaearth.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": "https://saundryaearth.com/products"
          }
        ]
      };

      // Add category to breadcrumb if exists
      if (category) {
        const categoryName = category.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbStructuredData.itemListElement.push({
          "@type": "ListItem",
          "position": 3,
          "name": categoryName,
          "item": `https://saundryaearth.com/products?category=${category}`
        });
      }

      return [websiteStructuredData, breadcrumbStructuredData, ...productStructuredData];
    };

    const structuredData = generateStructuredData();

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData[0]) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData[1]) }}
        />
        {structuredData.slice(2).map((data, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}

        <ProductsPage
          apiResponse={productsData}
          initialPage={page}
          initialLimit={limit}
          categories={categoriesData}
          initialFilters={{
            category,
            minPrice,
            maxPrice,
            minRating,
            brand,
            isActive,
            isFeatured,
            isDigital,
            tags,
            topSelling,
            search,
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching products or categories:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Products
          </h1>
          <p className="text-gray-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
}