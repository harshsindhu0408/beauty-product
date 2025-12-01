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
import { clientFetch } from "../services/clientfetch.js";

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

const Logo = () => (
  <div className="relative group cursor-pointer flex items-center gap-2">
    <div className="relative w-10 h-10">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform transition-transform duration-500 group-hover:rotate-180"
      >
        <defs>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#4a4a4a" />
          </linearGradient>
        </defs>
        <path
          d="M50 0 C20 0 0 20 0 50 C0 80 20 100 50 100 C80 100 100 80 100 50 C100 20 80 0 50 0 Z M50 90 C30 90 10 70 10 50 C10 30 30 10 50 10 C70 10 90 30 90 50 C90 70 70 90 50 90 Z"
          fill="url(#leafGradient)"
          className="opacity-20"
        />
        <path
          d="M50 20 C35 20 25 35 25 50 C25 65 35 80 50 80 C65 80 75 65 75 50 C75 35 65 20 50 20 Z"
          fill="none"
          stroke="url(#leafGradient)"
          strokeWidth="2"
          className="animate-[spin_1s_ease-out_1]"
        />
        <path
          d="M50 25 C50 25 30 40 30 60 C30 75 45 75 50 60 C55 75 70 75 70 60 C70 40 50 25 50 25 Z"
          fill="url(#leafGradient)"
        />
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-xl font-serif font-bold tracking-wider text-gray-900 leading-none">
        SAUNDRYA
      </span>
      <span className="text-[10px] font-sans tracking-[0.3em] text-gray-500 uppercase">
        Earth
      </span>
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
    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
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
                    className="block w-full text-left p-3 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-black transition-colors">
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
                router.push(
                  `/products?search=${encodeURIComponent(searchQuery)}`
                );
                handleClearSearch();
              }}
              className="group flex items-center justify-center w-full text-center px-4 py-3 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Left: Logo */}
            <div onClick={() => handleNavigation("/")}>
              <Logo />
            </div>

            {/* Center: Search */}
            <div
              ref={searchContainerRef}
              className="hidden md:flex items-center flex-1 max-w-xl relative group"
            >
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div
                  className="relative flex items-center w-full h-12 rounded-full 
                           bg-gray-50 border border-gray-200
                           focus-within:bg-white focus-within:border-gray-400 focus-within:shadow-lg
                           hover:border-gray-300
                           transition-all duration-300 ease-out"
                >
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10 transition-colors group-focus-within:text-gray-600"
                    size={18}
                  />

                  <AnimatePresence mode="wait">
                    {!isSearchFocused && !searchQuery && (
                      <motion.div
                        key={placeholderIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none font-medium tracking-wide"
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
                    className="w-full h-full pl-12 pr-10 rounded-full text-gray-900 
                             bg-transparent placeholder-transparent text-sm font-medium
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        aria-label="Clear search"
                      >
                        <X size={16} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </form>

              <AnimatePresence>
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 right-0 mt-4 rounded-2xl border border-gray-100 bg-white shadow-2xl z-50 overflow-hidden ring-1 ring-black/5"
                  >
                    {searchResultsContent}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Nav Tabs */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.name}
                    onClick={() => handleNavigation(link.href)}
                    className="group flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <div className="relative p-2 rounded-full group-hover:bg-gray-50 transition-colors duration-300">
                      <Icon className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors duration-300" />
                      {link.name === "Cart" && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 group-hover:text-black transition-colors duration-300">
                      {link.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-900 transition-colors duration-300 hover:bg-gray-50 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="py-6 space-y-6 bg-white">
                  {/* Mobile Search */}
                  <div className="relative px-4">
                    <form
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-3 border border-gray-100 focus-within:border-gray-300 focus-within:shadow-sm transition-all"
                    >
                      <Search className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-gray-900 placeholder-gray-400 text-base outline-none w-full font-medium"
                      />
                    </form>

                    {searchQuery.trim() && (
                      <div className="absolute top-full left-4 right-4 mt-2 rounded-xl border bg-white shadow-xl overflow-hidden z-10">
                        {searchResultsContent}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 px-4">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <div
                          key={link.name}
                          onClick={() => handleNavigation(link.href)}
                          className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <Icon className="h-6 w-6 text-gray-700" />
                          <span className="font-medium text-sm text-gray-900">
                            {link.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
