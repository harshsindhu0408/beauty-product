"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/services/clientfetch";
import Image from "next/image";
import { toast } from "react-hot-toast";

const ProductSlider = () => {
  const swiperRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await clientFetch(`product`, {
          method: "GET",
        });

        if (result.success && result.data && result.data.products) {
          setProducts(result.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Swiper
  useEffect(() => {
    if (!isClient || loading || products.length === 0) return;

    const initSwiper = () => {
      if (typeof window !== "undefined" && window.Swiper) {
        const swiper = new window.Swiper(".product-swiper", {
          slidesPerView: 1.2,
          spaceBetween: 16,
          loop: false,
          speed: 600,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          breakpoints: {
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3, // Increased from 2.5
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4, // Increased from 3.5
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 5, // Increased from 4 - This makes cards smaller on MacBooks
              spaceBetween: 28,
            },
            1536: {
              slidesPerView: 6, // Added for very large screens
              spaceBetween: 32,
            },
          },
        });

        swiperRef.current = swiper;
      }
    };

    const loadSwiper = () => {
      if (typeof window === "undefined" || typeof document === "undefined")
        return;

      if (!document.querySelector("#swiper-css")) {
        const link = document.createElement("link");
        link.id = "swiper-css";
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css";
        document.head.appendChild(link);
      }

      if (!document.querySelector("#swiper-js")) {
        const script = document.createElement("script");
        script.id = "swiper-js";
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js";
        script.onload = initSwiper;
        document.head.appendChild(script);
      } else if (window.Swiper) {
        initSwiper();
      }
    };

    loadSwiper();

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, [isClient, loading, products]);

  const nextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const prevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      return primaryImage ? primaryImage.url : product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80";
  };

  const getProductTag = (product) => {
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].name;
    }
    return "Featured";
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3 font-medium">
              Our Collection
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight mb-3">
              Featured Essentials
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-md">
              Discover products carefully selected for their exceptional quality and results.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/products")}
              className="hidden cursor-pointer md:flex group relative items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-900 transition-all duration-300 border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900"
            >
              Explore All
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="group w-10 h-10 cursor-pointer rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="group w-10 h-10 cursor-pointer rounded-full border border-gray-300 bg-white flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="product-swiper swiper">
          <div className="swiper-wrapper pb-2">
            {products.map((product, index) => (
              <div key={product._id} className="swiper-slide">
                <div className="group relative">
                  {/* Card */}
                  <div
                    className="relative bg-white rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() => router.push(`/products/${product.slug}`)}
                  >
                    {/* Image Container - CHANGED Aspect Ratio to 4/5 */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 85vw, (max-width: 768px) 45vw, (max-width: 1024px) 33vw, 20vw"
                        priority={index < 4}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Category Badge - Made slightly smaller */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-gray-900 rounded-sm shadow-sm">
                          {getProductTag(product)}
                        </span>
                      </div>

                      {/* Sale Badge */}
                      {product.compareAtPrice > product.price && (
                        <div className="absolute bottom-3 left-3">
                          <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-sm shadow-md">
                            -{Math.round(
                              ((product.compareAtPrice - product.price) /
                                product.compareAtPrice) *
                                100
                            )}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info - Reduced Padding */}
                    <div className="p-4">
                      {/* Brand */}
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">
                        {product.brand?.name || "Saundrya Earth"}
                      </p>

                      {/* Product Name */}
                      <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 leading-snug line-clamp-1 group-hover:text-gray-700 transition-colors">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default ProductSlider;