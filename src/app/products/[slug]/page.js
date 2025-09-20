import ProductPage from "@/pages/ProductPage";
import { FetchData } from "@/services/useServerFetch";
import { notFound } from "next/navigation";

export default async function Product({ params }) {
  try {
const [product, similarProducts] = await Promise.all([
  FetchData(`product/slug/${params.slug}`),
  FetchData(`product/${params.slug}/similar`)
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

// Optional: Generate metadata for better SEO
export async function generateMetadata({ params }) {
  try {
    const product = await FetchData(`product/slug/${params.slug}`);

    if (!product || !product.data) {
      return {
        title: "Product Not Found",
      };
    }

    return {
      title: product.data.name || "Product",
      description: product.data.description || "Product details",
    };
  } catch (error) {
    return {
      title: "Product",
    };
  }
}

// Optional: Generate static params if using static generation
export async function generateStaticParams() {
  try {
    const products = await FetchData("products");
    return (
      products.data?.map((product) => ({
        slug: product.slug,
      })) || []
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
