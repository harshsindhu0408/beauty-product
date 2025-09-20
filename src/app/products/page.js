// app/product/page.js
import { FetchData } from "@/services/useServerFetch";
import ProductsPage from "@/pages/ProductsPage";

export default async function Product({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = parseInt(searchParams.limit) || 12;
  const category = searchParams.category || '';
  const minPrice = searchParams.minPrice || '';
  const maxPrice = searchParams.maxPrice || '';
  const minRating = searchParams.minRating || '';
  const brand = searchParams.brand || '';
  const isActive = searchParams.isActive || '';
  const isFeatured = searchParams.isFeatured || '';
  const isDigital = searchParams.isDigital || '';
  const tags = searchParams.tags || '';
  const topSelling = searchParams.topSelling || '';
  const search = searchParams.search || '';

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
      FetchData(`category/fetch/all`)
    ]);

    const productsData = productsRes.data;
    const categoriesData = categoriesRes.data;

    return (
      <div className="min-h-screen bg-gray-50">
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
            search
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
            Error Loading Data
          </h1>
          <p className="text-gray-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
}