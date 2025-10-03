"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { clientFetch } from "@/services/clientfetch";

export default function ProductsPage({
  apiResponse,
  initialPage = 1,
  initialLimit = 12,
  categories,
  initialFilters = {},
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("this is the apiResponse --->", apiResponse);

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [productsData, setProductsData] = useState(apiResponse);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: initialFilters.category || "all",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    minRating: initialFilters.minRating || "",
    brand: initialFilters.brand || "",
    isActive: initialFilters.isActive || "",
    isFeatured: initialFilters.isFeatured || "",
    isDigital: initialFilters.isDigital || "",
    tags: initialFilters.tags || "",
    topSelling: initialFilters.topSelling || "",
    search: initialFilters.search || "",
  });

  useEffect(() => {
    setCurrentPage(initialPage);
    setItemsPerPage(initialLimit);
    setProductsData(apiResponse);
    setIsNavigating(false);
    setFilters((prev) => ({
      ...prev,
      ...initialFilters,
      category: initialFilters.category || "all",
    }));
  }, [initialPage, initialLimit, apiResponse, initialFilters]);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Extract products from API response
  const products = productsData?.products || [];
  const paginationInfo = productsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalProducts: products.length,
    hasNext: currentPage,
    hasPrev: false,
  };

  // Update URL with all filters
  const updateUrlWithFilters = (newFilters, newPage = 1) => {
    const params = new URLSearchParams();

    // Add pagination
    params.set("page", newPage.toString());
    params.set("limit", itemsPerPage.toString());

    // Add all filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value.toString());
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    setIsNavigating(true);
    setCurrentPage(1);
    updateUrlWithFilters(newFilters, 1);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage !== currentPage &&
      newPage >= 1 &&
      newPage <= paginationInfo.totalPages
    ) {
      setIsNavigating(true);
      setCurrentPage(newPage);
      updateUrlWithFilters(filters, newPage);
    }
  };

  const handleItemsPerPageChange = (newLimit) => {
    setIsNavigating(true);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    updateUrlWithFilters({ ...filters, page: 1, limit: newLimit });
  };

  const resetFilters = () => {
    const resetFiltersState = {
      category: "all",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      brand: "",
      isActive: "",
      isFeatured: "",
      isDigital: "",
      tags: "",
      topSelling: "",
      search: "",
    };
    setFilters(resetFiltersState);
    setIsNavigating(true);
    setCurrentPage(1);
    updateUrlWithFilters(resetFiltersState, 1);
  };

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  // Helper function to get primary image
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      return primaryImage?.url || product.images[0].url;
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  // Helper function to get product category
  const getProductCategory = (product) => {
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].name || "Uncategorized";
    }
    return "Uncategorized";
  };

  const addToCartHandler = async (product) => {
    try {
      const defaultQuantity = 1;
      let payload = {
        productId: product._id,
        quantity: defaultQuantity,
      };

      if (product.variants && product.variants.length > 0) {
        const variant = product.variants[0];
        const option = variant.options[0];
        payload.variant = {
          variantName: variant.name,
          optionName: option.name,
        };
      }

      console.log("This is the payload for the quick add:", payload);

      const response = await clientFetch("cart", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response) {
        console.log("Response from cart API:", response);
        if (
          response.code === "ITEM_ADDED_TO_CART" ||
          response.code === "CART_ITEM_UPDATED"
        ) {
          toast.success(response.message);
        } else {
          toast.info(response.message);
        }
      } else {
        throw new Error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-transparent border-r-transparent border-pink-500 border-l-pink-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main
          ref={containerRef}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        >
          {/* Hero Section */}
          <section className="relative pt-26 flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.3,
                    },
                  },
                }}
                className="text-center"
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="block">Conscious</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Beauty</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 w-full h-4 bg-pink-200/60 z-0 transform origin-left"
                      style={{ bottom: "15%" }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
                >
                  Formulated with intention, designed for impact
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* All Products */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div className="container mx-auto px-6">
              <motion.div
                variants={fadeIn}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                  Complete Collection
                </h2>

                {/* Filter Toggle Button */}
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => setShowFilters(!showFilters)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="21" x2="4" y2="14"></line>
                      <line x1="4" y1="10" x2="4" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12" y2="3"></line>
                      <line x1="20" y1="21" x2="20" y2="16"></line>
                      <line x1="20" y1="12" x2="20" y2="3"></line>
                      <line x1="1" y1="14" x2="7" y2="14"></line>
                      <line x1="9" y1="8" x2="15" y2="8"></line>
                      <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    Filters
                  </motion.button>

                  {(filters.category !== "all" ||
                    filters.minPrice ||
                    filters.maxPrice ||
                    filters.minRating ||
                    filters.brand ||
                    filters.search) && (
                    <motion.button
                      onClick={resetFilters}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Clear Filters
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white cursor-pointer rounded-xl p-6 mb-8 shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Search Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Search Products
                        </label>
                        <input
                          type="text"
                          value={filters.search}
                          onChange={(e) =>
                            handleFilterChange("search", e.target.value)
                          }
                          placeholder="Search products..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Range
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) =>
                              handleFilterChange("minPrice", e.target.value)
                            }
                            placeholder="Min"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                          <input
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) =>
                              handleFilterChange("maxPrice", e.target.value)
                            }
                            placeholder="Max"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>

                      {/* Rating Filter */}
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Rating
                        </label>
                        <select
                          value={filters.minRating}
                          onChange={(e) =>
                            handleFilterChange("minRating", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">Any Rating</option>
                          <option value="4">4+ Stars</option>
                          <option value="3">3+ Stars</option>
                          <option value="2">2+ Stars</option>
                          <option value="1">1+ Star</option>
                        </select>
                      </div> */}

                      {/* Top Selling Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Best Sellers
                        </label>
                        <select
                          value={filters.topSelling}
                          onChange={(e) =>
                            handleFilterChange("topSelling", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">All Products</option>
                          <option value="true">Top Selling Only</option>
                        </select>
                      </div>

                      {/* Featured Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Featured Products
                        </label>
                        <select
                          value={filters.isFeatured}
                          onChange={(e) =>
                            handleFilterChange("isFeatured", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">All Products</option>
                          <option value="true">Featured Only</option>
                        </select>
                      </div>

                      {/* Active Products Filter */}
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Status
                        </label>
                        <select
                          value={filters.isActive}
                          onChange={(e) =>
                            handleFilterChange("isActive", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">All Status</option>
                          <option value="true">Active Only</option>
                          <option value="false">Inactive Only</option>
                        </select>
                      </div> */}

                      {/* Digital Products Filter */}
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Type
                        </label>
                        <select
                          value={filters.isDigital}
                          onChange={(e) =>
                            handleFilterChange("isDigital", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                          <option value="">All Types</option>
                          <option value="true">Digital Only</option>
                          <option value="false">Physical Only</option>
                        </select>
                      </div> */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Filter Tabs */}
              <motion.div variants={fadeIn} className="mb-8">
                <div className="flex w-full overflow-x-auto p-1 scrollbar-hide">
                  <div className="flex flex-nowrap items-center gap-2 rounded-full bg-gray-100 p-1">
                    <motion.button
                      onClick={() => handleFilterChange("category", "all")}
                      className={`whitespace-nowrap cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        filters.category === "all"
                          ? "bg-white text-pink-600 shadow-sm"
                          : "bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      All
                    </motion.button>
                    {categories?.categories?.map((category) => (
                      <motion.button
                        key={category._id}
                        onClick={() =>
                          handleFilterChange("category", category.name)
                        }
                        className={`whitespace-nowrap cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 capitalize ${
                          filters.category === category.name
                            ? "bg-white text-pink-600 shadow-sm"
                            : "bg-transparent text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Products Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${filters.category}-${currentPage}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {products.length > 0 ? (
                    products.map((product) => (
                      <motion.div
                        onClick={() => {
                          router.push(`/products/${product?.slug}`);
                        }}
                        key={product._id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white cursor-pointer rounded-xl overflow-hidden shadow-sm border border-gray-100 group"
                      >
                        <div className="aspect-square w-full relative overflow-hidden">
                          <motion.img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <motion.button
                              onClick={() => addToCartHandler(product)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white cursor-pointer text-pink-600 px-4 py-1.5 rounded-full font-medium text-sm"
                            >
                              Quick Add
                            </motion.button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2 capitalize">
                            {getProductCategory(product)}
                          </p>
                          <p className="text-gray-900 font-bold">
                            ₹{product.price}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="col-span-full text-center py-16"
                    >
                      <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        No Products Found
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        {filters.category !== "all"
                          ? `We couldn't find any products matching your filters. Try adjusting your search criteria.`
                          : `We're currently working on new products. Check back soon or sign up for updates.`}
                      </p>
                      {(filters.category !== "all" ||
                        filters.minPrice ||
                        filters.maxPrice ||
                        filters.minRating ||
                        filters.brand ||
                        filters.search) && (
                        <motion.button
                          onClick={resetFilters}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-6 cursor-pointer bg-pink-600 text-white px-6 py-2 rounded-full font-medium"
                        >
                          Clear Filters
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {products.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(parseInt(e.target.value))
                      }
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      items per page
                    </span>
                  </div>

                  {/* Pagination buttons */}
                  <div className="flex gap-2 flex-wrap items-center">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoadingMore}
                      className="px-4 py-2 cursor-pointer text-sm font-medium rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers with Ellipsis */}
                    {(() => {
                      const totalPages = paginationInfo.totalPages;
                      const maxVisible = 5;
                      let pages = [];

                      if (totalPages <= 7) {
                        pages = Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        );
                      } else {
                        if (currentPage <= maxVisible) {
                          pages = [...Array(maxVisible).keys()].map(
                            (i) => i + 1
                          );
                          pages.push("...", totalPages);
                        } else if (currentPage > totalPages - maxVisible) {
                          pages = [1, "..."];
                          pages.push(
                            ...Array.from(
                              { length: maxVisible },
                              (_, i) => totalPages - maxVisible + i + 1
                            )
                          );
                        } else {
                          pages = [
                            1,
                            "...",
                            currentPage - 1,
                            currentPage,
                            currentPage + 1,
                            "...",
                            totalPages,
                          ];
                        }
                      }

                      return pages.map((page, index) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 cursor-pointer py-2 text-gray-500"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={isLoadingMore}
                            className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-md border ${
                              page === currentPage
                                ? "bg-pink-600 text-white border-pink-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {page}
                          </button>
                        )
                      );
                    })()}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage >= paginationInfo.totalPages ||
                        isLoadingMore
                      }
                      className="px-4 py-2 text-sm cursor-pointer font-medium rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {isLoadingMore && (
                <div className="flex justify-center mt-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-t-transparent border-pink-600 rounded-full"
                  />
                </div>
              )}
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-20"
          >
            <div className="container mx-auto px-6 max-w-5xl">
              <motion.div variants={fadeIn} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                  Our Formulation Promise
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Every ingredient serves a purpose, every product tells a story
                  of conscious creation.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ),
                    title: "Clean Science",
                    description:
                      "We combine cutting-edge dermatology with time-tested botanicals for formulas that deliver visible results.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    ),
                    title: "Ethical Sourcing",
                    description:
                      "Our ingredients are sustainably harvested through fair-trade partnerships with farming communities.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ),
                    title: "Zero Compromise",
                    description:
                      "No synthetic fragrances, parabens, sulfates, or other questionable ingredients—ever.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
                  >
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mx-auto mb-6">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-32 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl"></div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl"></div>
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
              <motion.div
                variants={staggerContainer}
                className="max-w-2xl mx-auto"
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <motion.span
                    className="text-pink-600 font-semibold tracking-widest text-sm uppercase"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Luxurious Self-Care
                  </motion.span>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 font-serif leading-tight"
                >
                  Elevate Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Skincare Ritual
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                  Discover the art of conscious beauty with our thoughtfully
                  curated collection, crafted for those who seek both luxury and
                  sustainability.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <motion.button
                    onClick={() => router.push("/products")}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full font-medium text-lg hover:shadow-lg"
                  >
                    Explore Collection
                  </motion.button>

                  <motion.button
                    onClick={() => router.push("/about")}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#f8fafc",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full font-medium text-lg bg-white bg-opacity-50 hover:bg-opacity-100"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        </main>
      </ReactLenis>
    </>
  );
}
