"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  Grid,
  Search,
  User,
  ImageIcon,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper functions
const getPrimaryImageUrl = (product) => {
  if (!product.images || product.images.length === 0) return null;
  const primaryImage = product.images.find((img) => img.isPrimary);
  return primaryImage ? primaryImage.url : product.images[0].url;
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


// Search Result Skeleton
const SearchResultSkeleton = () => (
  <div className="flex items-center gap-4 p-3 animate-pulse">
    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200/50"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 w-4/5 rounded bg-gray-200/50"></div>
      <div className="h-4 w-1/3 rounded bg-gray-200/50"></div>
    </div>
  </div>
);

const Navigation = ({ navRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);
  
  const searchContainerRef = useRef(null);
  const router = useRouter();

  const placeholders = [
    "Search for products...",
    "Search for brands...",
    "Search for skincare...",
    "Search for anything...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Logic
  const performSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const data = await clientFetch(
          `product?search=${encodeURIComponent(query)}&limit=5`
        );
        setSearchResults(data?.data?.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setHasCompletedSearch(true);
      }
    }, 300),
    []
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setHasCompletedSearch(false);
    }
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasCompletedSearch(false);
  };

  const handleNavigation = (href) => {
    router.push(href);
    setIsMenuOpen(false);
  };

  const handleResultClick = () => {
    isMenuOpen ? setIsMenuOpen(false) : handleClearSearch();
  };

  // Updated navLinks with icons
  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Categories", href: "/categories", icon: Grid },
    { name: "Account", href: "/account", icon: User },
  ];

  // Search Results Content
  const searchResultsContent = (
    <div className="max-h-[60vh] overflow-y-auto">
      {searchQuery.trim() && !hasCompletedSearch && (
        <div className="p-2">
          <SearchResultSkeleton />
          <SearchResultSkeleton />
          <SearchResultSkeleton />
        </div>
      )}

      {!isSearching && hasCompletedSearch && searchResults.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-gray-500">
          <ImageIcon className="h-16 w-16 text-gray-300" />
          <p className="font-bold text-lg text-gray-700">No Products Found</p>
          <p className="text-sm">
            Try a different search term or check your spelling.
          </p>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <>
          <ul className="p-2">
            {searchResults.map((product) => {
              const imageUrl = getPrimaryImageUrl(product);
              return (
                <li key={product._id}>
                  <div
                    onClick={() => {
                      router.push(`/products/${product.slug || product._id}`);
                      handleResultClick();
                    }}
                    className="block w-full text-left p-3 hover:bg-gray-100/80 transition-colors rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.brand?.name || "Generic Brand"}
                        </p>
                      </div>
                      <p className="font-bold text-sm text-black whitespace-nowrap">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="p-2 border-t border-gray-100">
            <div
              onClick={() => {
                router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                handleClearSearch();
              }}
              className="group flex items-center justify-center w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              View All {searchResults.length}+ Results
              <ArrowRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <nav ref={navRef} className="top-0 left-0 right-0 z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-lg rounded-full px-4 py-2 sm:px-8 sm:py-4 flex items-center justify-between border-2 bg-white/20 border-white/45 transition-all duration-300">
            
            {/* Left: Logo */}
            <div className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide cursor-pointer"
              onClick={() => handleNavigation("/")}>
              Saundrya Earth
            </div>

            {/* Center: Search */}
            <div
              ref={searchContainerRef}
              className="hidden md:flex items-center flex-1 mx-8 max-w-lg relative"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full"
              >
                <div className="relative flex items-center w-full h-12 rounded-full 
                           bg-white/20 border border-white/40 
                           focus-within:bg-white/30 focus-within:border-white/60
                           transition-all duration-300 ease-in-out">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none z-10"
                    size={20}
                  />

                  <AnimatePresence mode="wait">
                    {!isSearchFocused && !searchQuery && (
                      <motion.div
                        key={placeholderIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute left-12 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
                      >
                        {placeholders[placeholderIndex]}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full h-full pl-12 pr-10 rounded-full text-white 
                             bg-transparent placeholder-transparent 
                             focus:outline-none focus:ring-0"
                  />

                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        type="button"
                        onClick={handleClearSearch}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/70 hover:text-white"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </form>

              <AnimatePresence>
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/20 bg-white/95 backdrop-blur-lg shadow-2xl z-50 overflow-hidden"
                  >
                    {searchResultsContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Nav Tabs */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.name}
                    onClick={() => handleNavigation(link.href)}
                    className="flex items-center gap-1 font-light text-lg text-white/90 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 backdrop-blur-lg rounded-2xl p-6 space-y-4 bg-white/95 transition-all duration-300">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.name}
                    onClick={() => handleNavigation(link.href)}
                    className="flex items-center gap-2 font-medium py-2 text-gray-800 transition-colors duration-300 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </div>
                );
              })}

              <hr className="border-gray-200 transition-colors duration-300" />

              {/* Mobile Search */}
              <div className="relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2"
                >
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-gray-700 placeholder-gray-500 text-sm outline-none w-full"
                  />
                </form>
                
                {searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border bg-white shadow-sm overflow-hidden z-10">
                    {searchResultsContent}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;