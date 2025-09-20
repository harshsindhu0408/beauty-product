"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

const CategoriesPage = ({
  categoriesData,
  initialPage = 1,
  initialLimit = 12,
  initialSearch = "",
  initialSort = "-createdAt",
  initialIsActive = "",
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortOption, setSortOption] = useState(initialSort);
  const [isActiveFilter, setIsActiveFilter] = useState(initialIsActive);
  const [searchPlaceholderIndex, setSearchPlaceholderIndex] = useState(0);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Extract categories and pagination from the data
  const categories = categoriesData?.data?.category || [];
  const pagination = categoriesData?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  const totalPages = pagination.totalPages || 1;
  const limit = pagination.limit || 12;

  // Search placeholder animations
  const searchPlaceholders = [
    "Search categories...",
    "Try 'Skincare'...",
    "Try 'Makeup'...",
    "Try 'Haircare'...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSearchPlaceholderIndex((prev) =>
        prev === searchPlaceholders.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update URL with all filters
  const updateUrlWithFilters = (
    newPage = 1,
    newSearch = searchQuery,
    newSort = sortOption,
    newIsActive = isActiveFilter
  ) => {
    const params = new URLSearchParams();

    // Add pagination
    params.set("page", newPage.toString());
    params.set("limit", itemsPerPage.toString());

    // Add filters
    if (newSearch) params.set("search", newSearch);
    if (newSort) params.set("sort", newSort);
    if (newIsActive) params.set("isActive", newIsActive);

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setIsLoading(true);
      setCurrentPage(1);
      updateUrlWithFilters(1, query, sortOption, isActiveFilter);
      setTimeout(() => setIsLoading(false), 500);
    }, 300),
    [sortOption, isActiveFilter]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setIsLoading(true);
    setCurrentPage(1);
    updateUrlWithFilters(1, searchQuery, value, isActiveFilter);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleActiveFilterChange = (value) => {
    setIsActiveFilter(value);
    setIsLoading(true);
    setCurrentPage(1);
    updateUrlWithFilters(1, searchQuery, sortOption, value);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= totalPages) {
      setIsLoading(true);
      setCurrentPage(newPage);
      updateUrlWithFilters(newPage, searchQuery, sortOption, isActiveFilter);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleItemsPerPageChange = (newLimit) => {
    setIsLoading(true);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    updateUrlWithFilters(1, searchQuery, sortOption, isActiveFilter);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

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
          className="min-h-screen relative overflow-hidden"
        >
          {/* Hero Section */}
          <section className="relative flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute inset-0 z-10 pointer-events-none"
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
                  <span className="block">Explore Our</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Categories</span>
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
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-6"
                >
                  Discover our wide range of carefully curated categories, each
                  designed to meet your specific needs
                </motion.p>

                {/* Search Bar */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="max-w-2xl mx-auto mt-8 mb-8"
                >
                  <div className="relative">
                    {/* This animates the placeholder text in and out */}
                    <AnimatePresence mode="wait">
                      <motion.span
                        // The key is essential for AnimatePresence to know the element has changed
                        key={searchPlaceholders[searchPlaceholderIndex]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"
                      >
                        {searchPlaceholders[searchPlaceholderIndex]}
                      </motion.span>
                    </AnimatePresence>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      // The native placeholder is removed.
                      // The background is made transparent to see the animated span.
                      // `z-10` ensures the typing cursor is on top of the fake placeholder.
                      className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm text-lg bg-transparent relative z-10 caret-pink-500"
                    />

                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-600 text-white p-2 rounded-full z-20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* All Categories */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-10"
          >
            <div className="container mx-auto px-6">
              <motion.div variants={fadeIn} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
                  All Categories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse through our complete collection of categories to find
                  exactly what you're looking for
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${searchQuery}-${sortOption}-${isActiveFilter}`}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <motion.div
                        key={category._id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
                        onClick={() =>
                          router.push(`/products?category=${category.slug}`)
                        }
                      >
                        <div className="aspect-square w-full relative overflow-hidden">
                          <motion.img
                            src={
                              category.image[0]?.url ||
                              "/placeholder-category.jpg"
                            }
                            alt={category.name}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white cursor-pointer text-pink-600 px-4 py-1.5 rounded-full font-medium text-sm"
                            >
                              View Products
                            </motion.button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2">
                            {category.productsCount || 0} products
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                category.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {category.isActive ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="col-span-full text-center py-16"
                    >
                      <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        No Categories Found
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        {searchQuery
                          ? `No categories found matching "${searchQuery}". Try a different search term.`
                          : `We're currently working on adding new categories. Check back soon!`}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {categories.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} • {pagination.total}{" "}
                    total categories
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 cursor-pointer text-sm font-medium rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 cursor-pointer text-sm font-medium rounded-md border ${
                            page === currentPage
                              ? "bg-pink-600 text-white border-pink-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 text-sm cursor-pointer font-medium rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Items per page selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Show:</label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) =>
                          handleItemsPerPageChange(parseInt(e.target.value))
                        }
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Benefits Section */}
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
                  Why Shop By Category?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our carefully organized categories make it easy to find
                  exactly what you need
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
                        <path d="m8 6 4-4 4 4" />
                        <path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" />
                        <path d="m20 22-5-5" />
                      </svg>
                    ),
                    title: "Easy Navigation",
                    description:
                      "Quickly find products that match your specific needs and preferences.",
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    ),
                    title: "Curated Selection",
                    description:
                      "Each category contains hand-picked items that meet our quality standards.",
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
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                        <path d="m3.3 7 8.7 5 8.7-5" />
                        <path d="M12 22V12" />
                      </svg>
                    ),
                    title: "Organized Shopping",
                    description:
                      "Save time by browsing through logically grouped products.",
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

          {/* Stats Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-20 bg-gradient-to-br from-pink-50 to-blue-50"
          >
            <div className="container mx-auto px-6">
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              >
                {[
                  { number: pagination.total || 0, label: "Categories" },
                  { number: 1000, label: "Products" },
                  { number: 95, label: "Satisfaction Rate" },
                  { number: 24, label: "Delivery Hours" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      className="text-4xl md:text-5xl font-bold text-pink-600 mb-2"
                    >
                      {stat.number}+
                    </motion.div>
                    <p className="text-gray-700">{stat.label}</p>
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
                    Start Exploring
                  </motion.span>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 font-serif leading-tight"
                >
                  Find Your Perfect{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Products
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                  Browse through our categories to discover products that suit
                  your lifestyle and preferences.
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
                    className="bg-gradient-to-r cursor-pointer from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full font-medium text-lg hover:shadow-lg"
                  >
                    View All Products
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        </main>
      </ReactLenis>
    </>
  );
};

export default CategoriesPage;
