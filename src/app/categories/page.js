import { FetchData } from "@/services/useServerFetch";
import CategoriesPage from "@/pages/CategoriesPage";

// Generate metadata for the categories page
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const search = params.search || '';
  
  const baseTitle = "Premium Beauty & Skincare Categories | Saundrya Earth";
  const baseDescription = "Explore our curated collection of premium skincare, fragrances, and beauty products. Natural, sustainable, and effective solutions for your beauty routine.";
  
  // Dynamic metadata based on search
  if (search) {
    return {
      title: `Search Results for "${search}" | Beauty Categories`,
      description: `Find the perfect ${search} products in our premium collection. Natural ingredients, sustainable beauty solutions.`,
      robots: 'index, follow',
      openGraph: {
        title: `Search: ${search} | Saundrya Earth`,
        description: `Discover our ${search} collection - premium quality, natural ingredients`,
        type: 'website',
      },
    };
  }

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: "skincare, beauty products, fragrances, natural cosmetics, body care, face masks, serums, SPF, sustainable beauty",
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    openGraph: {
      title: baseTitle,
      description: baseDescription,
      type: 'website',
      locale: 'en_US',
      siteName: 'Saundrya Earth',
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: baseDescription,
    },
    alternates: {
      canonical: 'https://saundryaearth.com/categories',
    },
  };
}

// Structured data for Google
function addCategoriesJsonLd(categories) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Beauty & Skincare Categories",
    "description": "Comprehensive collection of premium beauty, skincare, and fragrance categories",
    "url": "https://saundryaearth.com/categories",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categories.length,
      "itemListElement": categories.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "ProductCategory",
          "name": category.name,
          "description": category.description,
          "url": `https://saundryaearth.com/categories/${category.slug}`,
          "image": category.image?.[0]?.url,
          "category": category.parent || "Beauty & Personal Care"
        }
      }))
    }
  };

  return structuredData;
}

export const dynamic = 'force-dynamic';

export default async function Categories({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 12;
  const search = params.search || '';
  const sort = params.sort || '-createdAt';
  const isActive = params.isActive || '';

  try {
    // Build the API URL with query parameters
    let apiUrl = `category?page=${page}&limit=${limit}&sort=${sort}`;
    
    // Add search filter if provided
    if (search) {
      apiUrl += `&search=${encodeURIComponent(search)}`;
    }
    
    // Add active filter if provided
    if (isActive) {
      apiUrl += `&isActive=${encodeURIComponent(isActive)}`;
    }

    const [categoriesRes] = await Promise.allSettled([
      FetchData(apiUrl)
    ]);
    
    const categoriesData = categoriesRes.status === "fulfilled" ? categoriesRes.value : null;
    const categories = categoriesData?.data?.category || [];
    
    // Generate structured data
    const structuredData = addCategoriesJsonLd(categories);

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gray-50 pt-10">
          {/* Hidden SEO-friendly content for search engines */}
          <div className="sr-only" aria-hidden="true">
            <h1>Premium Beauty & Skincare Categories</h1>
            <h2>Explore Our Curated Collection</h2>
            <p>Discover our comprehensive range of premium beauty products including skincare essentials, luxurious fragrances, body care, and sustainable beauty solutions. Each category features carefully crafted products with natural ingredients for your wellness routine.</p>
            
            <h3>Featured Categories:</h3>
            <ul>
              {categories.map((category) => (
                <li key={category._id}>
                  <strong>{category.name}:</strong> {category.description}
                </li>
              ))}
            </ul>
            
            <h3>Why Choose Saundrya Earth?</h3>
            <ul>
              <li>Natural & Sustainable Ingredients</li>
              <li>Premium Quality Products</li>
              <li>Ethically Sourced</li>
              <li>Cruelty-Free Formulas</li>
              <li>Environmentally Conscious Packaging</li>
            </ul>
          </div>

          <CategoriesPage 
            categoriesData={categoriesData} 
            initialPage={page}
            initialLimit={limit}
            initialSearch={search}
            initialSort={sort}
            initialIsActive={isActive}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    
    // Error page with SEO
    const errorStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Categories - Saundrya Earth",
      "description": "Browse our beauty and skincare categories",
      "url": "https://saundryaearth.com/categories",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": 0,
        "itemListElement": []
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(errorStructuredData) }}
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Categories
            </h1>
            <p className="text-gray-600">
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        </div>
      </>
    );
  }
}