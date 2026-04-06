"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ShopByCategories = ({ categories: initialCategories }) => {
  const swiperRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Handle data structure variations
  const categories = Array.isArray(initialCategories)
    ? initialCategories
    : initialCategories?.category || [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Swiper
  useEffect(() => {
    if (!isClient || !categories || categories.length === 0) return;

    const initSwiper = () => {
      if (typeof window !== "undefined" && window.Swiper) {
        const swiper = new window.Swiper(".category-swiper", {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          speed: 1500,
          centeredSlides: false,
          autoplay: {
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false,
          },
          freeMode: false,
          allowTouchMove: true,
          breakpoints: {
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 36,
            },
          },
        });

        swiperRef.current = swiper;
        console.log("Swiper initialized:", swiper);
      }
    };

    // Load Swiper CSS and JS if not already loaded
    const loadSwiper = () => {
      if (typeof window === "undefined" || typeof document === "undefined")
        return;

      // Load CSS
      if (!document.querySelector("#swiper-css")) {
        const link = document.createElement("link");
        link.id = "swiper-css";
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css";
        document.head.appendChild(link);
      }

      // Load JS
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
  }, [isClient, categories]);

  const nextSlide = () => {
    console.log("Next clicked, swiper:", swiperRef.current);
    if (swiperRef.current && !swiperRef.current.destroyed) {
      swiperRef.current.slideNext();
      // Restart autoplay after manual navigation
      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.start();
      }
    }
  };

  const prevSlide = () => {
    console.log("Prev clicked, swiper:", swiperRef.current);
    if (swiperRef.current && !swiperRef.current.destroyed) {
      swiperRef.current.slidePrev();
      // Restart autoplay after manual navigation
      if (swiperRef.current.autoplay) {
        swiperRef.current.autoplay.start();
      }
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="max-w-[1720px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 px-4 md:px-8 lg:px-16">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-medium">
              Browse Collection
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight mb-3">
              Shop by Category
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-lg">
              Explore our curated collection of natural beauty products tailored
              for your specific needs.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/categories")}
              className="hidden cursor-pointer md:flex group relative items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-900 transition-all duration-300 border border-gray-200 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900"
            >
              Explore All
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="group w-10 h-10 cursor-pointer rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 transition-all duration-300 shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="group w-10 h-10 cursor-pointer rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-gray-900 hover:bg-gray-900 transition-all duration-300 shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Slider */}
        <div className="px-4 md:px-8 lg:px-16">
          <div className="category-swiper swiper !overflow-visible">
            <div className="swiper-wrapper pb-2">
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  className="swiper-slide cursor-pointer group"
                  onClick={() =>
                    router.push(
                      `/products?category=${category.name || category.slug}`
                    )
                  }
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3 shadow-sm transition-all duration-500 group-hover:shadow-md">
                    {category.image && category.image.length > 0 ? (
                      <Image
                        src={category.image[0].url}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        priority={index < 4}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Floating Arrow Button */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <ArrowRight className="w-3.5 h-3.5 text-gray-900" />
                    </div>

                    {/* Category Name Overlay */}
                    <div className="absolute bottom-3 left-3 right-12 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-lg font-medium text-white drop-shadow-md leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-[10px] text-white/90 font-medium tracking-wider uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {category.productCount
                          ? `${category.productCount} Products`
                          : "Explore"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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

export default ShopByCategories;
