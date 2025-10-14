import ProductPage from "@/pages/ProductPage";
import { FetchData } from "@/services/useServerFetch";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Product({ params }) {
  try {
    const [product, similarProducts] = await Promise.all([
      FetchData(`product/slug/${params.slug}`),
      FetchData(`product/${params.slug}/similar`),
    ]);

    return (
      <div className="min-h-screen bg-gray-50 pt-26">
        <ProductPage
          productData={product.data}
          similarProducts={similarProducts.data}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);

    // Handle different types of errors appropriately
    if (error.status === 404) {
      notFound();
    }

    // You could also redirect to an error page or show a custom error component
    return (
      <div className="min-h-screen bg-gray-50 pt-26 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            Unable to load the product. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}

// Generate metadata for better SEO using product's meta fields
export async function generateMetadata({ params }) {
  try {
    const productResponse = await FetchData(`product/slug/${params.slug}`);
    const product = productResponse.data?.product;

    if (!product) {
      return {
        title: "Product Not Found",
      };
    }

    // Use the metaTitle and metaDescription from the product data
    const metaTitle = product.metaTitle || product.name || "Product";
    const metaDescription = product.metaDescription || product.shortDescription || product.description || "Product details";
    const images = product.images?.map(img => img.url) || [];

    return {
      title: metaTitle,
      description: metaDescription,
      // You can also add other meta tags for better SEO
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        images: images,
        type: 'website', // Valid Open Graph types: 'website', 'article', 'profile', etc.
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.slug}`,
      },
      twitter: {
        card: images.length > 0 ? 'summary_large_image' : 'summary',
        title: metaTitle,
        description: metaDescription,
        images: images,
      },
      // Additional product-specific meta tags
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product",
      description: "Product details",
    };
  }
}

// Generate static params if using static generation
// export async function generateStaticParams() {
//   try {
//     const products = await FetchData("products");
//     return (
//       products.data?.map((product) => ({
//         slug: product.slug,
//       })) || []
//     );
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }