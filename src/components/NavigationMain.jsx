"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  User,
  Search,
  Grid,
  ImageIcon,
  ArrowRight,
  Loader2, // <-- Added for a subtle loading spinner
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // <-- Correctly using Next.js Image
import { motion, AnimatePresence } from "framer-motion";
import { clientFetch, debounce } from "@/services/clientfetch";

// --- Helper Functions ---
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

// --- ✨ Enhanced Search Result Skeleton ---
const SearchResultSkeleton = () => (
  <div className="flex items-center gap-4 p-3 animate-pulse">
    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 w-4/5 rounded bg-gray-200"></div>
      <div className="h-4 w-1/3 rounded bg-gray-200"></div>
    </div>
  </div>
);

const NavigationMain = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);

  const navRef = useRef(null);
  const menuButtonRef = useRef(null);
  const searchContainerRef = useRef(null);

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
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMenuOpen]);

  // --- Search Logic ---
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
      window.location.href = `/products/search?q=${encodeURIComponent(
        searchQuery
      )}`;
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasCompletedSearch(false);
  };

  const handleResultClick = () => {
    isMenuOpen ? setIsMenuOpen(false) : handleClearSearch();
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Categories", href: "/categories", icon: Grid },
  ];

  // --- ✨ Re-architected Search Results Component ---
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
                  <Link
                    href={`/products/${product.slug || product._id}`}
                    onClick={handleResultClick}
                    className="block w-full text-left p-3 hover:bg-gray-100/80 transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
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
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="p-2 border-t border-gray-100">
            <Link
              href={`/products?search=${encodeURIComponent(searchQuery)}`}
              onClick={handleClearSearch}
              className="group flex items-center justify-center w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All {searchResults.length}+ Results
              <ArrowRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </>
      )}
    </div>
  );

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative md:py-4 py-2 flex items-center justify-between gap-6 px-8
                     rounded-full border border-white/40 
                     bg-white/30 backdrop-blur-xl
                     shadow-[0_8px_32px_rgba(31,38,135,0.2)] 
                     ring-1 ring-white/20"
        >
          <Link
            href="/"
            className="flex-shrink-0 text-2xl md:text-3xl font-bold font-serif text-gray-900 tracking-tight"
          >
            Saundrya Earth
          </Link>

          <div
            ref={searchContainerRef}
            className="hidden md:block flex-1 max-w-xl relative"
          >
            <form onSubmit={handleSearchSubmit} className="w-full">
              {/* This container now holds both the input and the animated placeholder */}
              <div
                className="relative flex items-center w-full h-12 rounded-full 
                           bg-white/50 border border-black/40 
                           focus-within:bg-white focus-within:border-black focus-within:ring-2 focus-within:ring-black/10
                           transition-all duration-300 ease-in-out"
              >
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
                  size={20}
                />

                {/* ✨ 1. The Animated Placeholder */}
                {/* This only shows when the input is not focused and is empty. */}
                <AnimatePresence mode="wait">
                  {!isSearchFocused && !searchQuery && (
                    <motion.div
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                    >
                      {placeholders[placeholderIndex]}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ✨ 2. The Input Element */}
                {/* It's now transparent so the animated placeholder behind it can be seen. */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)} // We now track blur
                  // Note the transparent placeholder and background
                  className="w-full h-full pl-12 pr-10 rounded-full text-gray-900 
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                      aria-label="Clear search"
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* This part for search results remains the same */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden"
                >
                  {searchResultsContent}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-x-6">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className="flex items-center gap-2 font-medium text-gray-700 hover:text-black transition-colors"
              >
                <Icon size={20} />
                <span className="hidden lg:inline">{name}</span>
              </Link>
            ))}
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <User size={20} />
              <span className="hidden lg:inline">Account</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3 ml-auto">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* --- Updated & Animated Mobile Menu --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden mt-3 backdrop-blur-xl bg-white/95 border border-gray-200/60 rounded-2xl p-4 shadow-xl"
            >
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </form>

              {searchQuery.trim() && (
                <div className="mb-4 rounded-lg border bg-white shadow-sm overflow-hidden">
                  {searchResultsContent}
                </div>
              )}

              <div className="flex flex-col gap-2">
                {navLinks.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={`mobile-${name}`}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-lg text-gray-800 hover:bg-black/5"
                  >
                    <Icon size={22} />
                    {name}
                  </Link>
                ))}
                <Link
                  href="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-lg font-medium rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  <User size={22} />
                  Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavigationMain;
