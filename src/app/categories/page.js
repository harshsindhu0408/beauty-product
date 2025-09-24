import { FetchData } from "@/services/useServerFetch";
import CategoriesPage from "@/pages/CategoriesPage";

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

    return (
      <div className="min-h-screen bg-gray-50 pt-26">
        <CategoriesPage 
          categoriesData={categoriesData} 
          initialPage={page}
          initialLimit={limit}
          initialSearch={search}
          initialSort={sort}
          initialIsActive={isActive}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
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
    );
  }
}