'use client'
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductSlider = () => {
  const swiperRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  const products = [
    {
      id: 1,
      name: "Luminé Glow Serum",
      price: "$24,78 USD",
      image: "https://t4.ftcdn.net/jpg/04/54/07/61/360_F_454076171_wETOdPON36pz5neLqXwFnvuijtEWvD2X.jpg",
      tag: "Check Detail",
      category: "Beauty Serum"
    },
    {
      id: 2,
      name: "Hydriva Deep Serum",
      price: "$21,45 USD",
      image: "https://t4.ftcdn.net/jpg/04/54/07/61/360_F_454076171_wETOdPON36pz5neLqXwFnvuijtEWvD2X.jpg",
      tag: "Beauty Serum",
      category: "Beauty Serum"
    },
    {
      id: 3,
      name: "Veloria Age Repair Serum",
      price: "$28,31 USD",
      image: "https://t4.ftcdn.net/jpg/04/54/07/61/360_F_454076171_wETOdPON36pz5neLqXwFnvuijtEWvD2X.jpg",
      tag: "Beauty Serum",
      category: "Beauty Serum"
    },
    {
      id: 4,
      name: "Aeris Lift Serum",
      price: "$32,79 USD",
      image: "https://t4.ftcdn.net/jpg/04/54/07/61/360_F_454076171_wETOdPON36pz5neLqXwFnvuijtEWvD2X.jpg",
      tag: "Beauty Serum",
      category: "Beauty Serum"
    },
    {
      id: 5,
      name: "Radiant Glow Serum",
      price: "$29,99 USD",
      image: "https://t4.ftcdn.net/jpg/04/54/07/61/360_F_454076171_wETOdPON36pz5neLqXwFnvuijtEWvD2X.jpg",
      tag: "Beauty Serum",
      category: "Beauty Serum"
    },
    {
      id: 6,
      name: "Pure Essence Serum",
      price: "$26,50 USD",
      image: "https://t4.ftcdn.net/jpg/04/54/07/61/360_F_454076171_wETOdPON36pz5neLqXwFnvuijtEWvD2X.jpg",
      tag: "Beauty Serum",
      category: "Beauty Serum"
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Swiper
  useEffect(() => {
    if (!isClient) return;

    const initSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiper = new window.Swiper('.product-swiper', {
          slidesPerView: 1.5,
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3.8,
              spaceBetween: 30,
            },
          },
        });
        
        swiperRef.current = swiper;
      }
    };

    // Load Swiper CSS and JS
    const loadSwiper = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;

      // Load CSS
      if (!document.querySelector('#swiper-css')) {
        const link = document.createElement('link');
        link.id = 'swiper-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!document.querySelector('#swiper-js')) {
        const script = document.createElement('script');
        script.id = 'swiper-js';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js';
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
  }, [isClient]);

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

  return (
    <section className="py-6 md:py-20 lg:py-24 px-4 mx-2 sm:mx-8 rounded-xl md:px-20 bg-gray-50">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif">
              Various Products
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif">
              With The Best Quality
            </h3>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Slider */}
        <div className="product-swiper swiper">
          <div className="swiper-wrapper">
            {products.map((product) => (
              <div key={product.id} className="swiper-slide">
                <div className="rounded-2xl overflow-hidden transition-all duration-300 group">
                  {/* Product Image */}
                  <div className="relative sm:h-80 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="sm:w-full sm:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Product Tag */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[8px] sm:text-sm font-medium text-gray-700">
                        {product.tag}
                      </span>
                    </div>
                    
                  
                  </div>

                  {/* Product Info */}
                  <div className="py-6">
                    <h4 className="sm:text-xl font-medium text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {product.name}
                    </h4>
                    <p className="sm:text-lg font-semibold text-gray-600">
                      {product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

     

        {/* View More Button */}
        <div className="flex justify-center mt-4 sm:mt-12">
          <button className="bg-gray-800 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            View More
          </button>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          background: #374151;
          width: 24px;
          border-radius: 12px;
        }
        
        .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default ProductSlider;