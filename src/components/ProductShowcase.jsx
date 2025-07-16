"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

const ProductShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState("next");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [showEnterAnimation, setShowEnterAnimation] = useState(false);
  const sectionRef = useRef(null);
  const autoPlayRef = useRef(null);

  const products = [
    {
      id: 1,
      title: "Our New Quality Product For Your Beauty",
      image: "/droper1.png",
      description:
        "Serum is a lightweight, fast-absorbing formula designed to target breakouts and reduce skin redness. Infused with salicylic acid and soothing botanicals, it helps unclog pores and prevent future acne without stripping the skin. P in E and ferulic acid for maximum potency.",
      price: 29.5,
      background: "",
      backgroundText: "Silvara blemmis",
    },
    {
      id: 2,
      title: "Premium Hydrating Moisturizer",
      image: "/droper.png",
      description:
        "Rich, nourishing moisturizer with hyaluronic acid and ceramides. Perfect for dry and sensitive skin, providing 24-hour hydration while strengthening the skin barrier. Powerful antioxidant serum with 20% Vitamin C to brigh aximum potency.",
      price: 35.0,
      background: "",
      backgroundText: "Hydra luxe",
    },
    {
      id: 3,
      title: "Vitamin C Brightening Serum",
      image: "/droper1.png",
      description:
        "Powerful antioxidant serum with 20% Vitamin C to brighten dull skin and reduce dark spots. Enhanced with vitamin E and ferulic acid for maximum potency. Powerful antioxidant serum with 20% Vitamin C to bri id for maximum potency.",
      price: 42.0,
      background: "",
      backgroundText: "Vitamin glow",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && isVisible) {
      autoPlayRef.current = setInterval(() => {
        setShowExitAnimation(true);
        setShowEnterAnimation(false);
        setSlideDirection("next");

        // First show exit animation
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % products.length);
          setShowExitAnimation(false);

          // Trigger enter animation after slide change
          setTimeout(() => {
            setShowEnterAnimation(true);
          }, 50); // Small delay to ensure DOM update
        }, 400); // Exit animation duration
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isVisible, products.length]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  // Initialize enter animation on component mount
  useEffect(() => {
    setShowEnterAnimation(true);
  }, []);

  // Reset enter animation when slide changes
  useEffect(() => {
    if (!showExitAnimation && !showEnterAnimation) {
      const timer = setTimeout(() => {
        setShowEnterAnimation(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, showExitAnimation, showEnterAnimation]);

  const nextSlide = () => {
    pauseAutoPlay();
    setShowExitAnimation(true);
    setShowEnterAnimation(false);
    setSlideDirection("next");

    // First show exit animation
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
      setShowExitAnimation(false);

      // Trigger enter animation after slide change
      setTimeout(() => {
        setShowEnterAnimation(true);
      }, 50); // Small delay to ensure DOM update
    }, 400); // Exit animation duration

    setTimeout(resumeAutoPlay, 8000);
  };

  const prevSlide = () => {
    pauseAutoPlay();
    setShowExitAnimation(true);
    setShowEnterAnimation(false);
    setSlideDirection("prev");

    // First show exit animation
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
      setShowExitAnimation(false);

      // Trigger enter animation after slide change
      setTimeout(() => {
        setShowEnterAnimation(true);
      }, 50); // Small delay to ensure DOM update
    }, 400); // Exit animation duration

    setTimeout(resumeAutoPlay, 8000);
  };

  const goToSlide = (index) => {
    pauseAutoPlay();
    setShowExitAnimation(true);
    setShowEnterAnimation(false);
    setSlideDirection(index > currentSlide ? "next" : "prev");

    // First show exit animation
    setTimeout(() => {
      setCurrentSlide(index);
      setShowExitAnimation(false);

      // Trigger enter animation after slide change
      setTimeout(() => {
        setShowEnterAnimation(true);
      }, 50); // Small delay to ensure DOM update
    }, 400); // Exit animation duration

    setTimeout(resumeAutoPlay, 8000);
  };

  const currentProduct = products[currentSlide];

  const addToCartHandler = () => {
    toast.success("Launching sooonnnnn!!!!!!!");
    console.log("hi there")
  };

  return (
    <section
      ref={sectionRef}
      className={`sm:py-20  px-4 md:px-20 transition-all duration-1000 ${currentProduct.background} relative z-0 overflow-hidden`}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {/* Background Text with Sliding Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          key={`bgtext-${currentSlide}`}
          className={`font-serif bg-gradient-to-t from-gray-400 to-gray-700 bg-clip-text text-transparent font-bold text-[12vw] mx-auto opacity-30 text-nowrap transition-all duration-500 ease-out ${
            showExitAnimation
              ? slideDirection === "next"
                ? "opacity-0 -translate-x-24 scale-95 animate-bg-slide-out-left"
                : "opacity-0 translate-x-24 scale-95 animate-bg-slide-out-right"
              : slideDirection === "next"
              ? "opacity-60 translate-x-0 scale-100 animate-bg-slide-in-right"
              : "opacity-60 translate-x-0 scale-100 animate-bg-slide-in-left"
          }`}
        >
          {currentProduct.backgroundText}
        </h1>
      </div>

      <div className=" mx-auto relative z-10">
        <div className="min-h-[600px]">
          {/* Left Content */}
          <div className=" w-full">
            <div className=" flex max-sm:flex-col justify-between items-center w-full">
              <h2
                key={`title-${currentSlide}`}
                className={`text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif max-w-2xl transition-all duration-400 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  showExitAnimation
                    ? slideDirection === "next"
                      ? "opacity-0 -translate-x-16 animate-slide-out-left"
                      : "opacity-0 translate-x-16 animate-slide-out-right"
                    : slideDirection === "next"
                    ? "opacity-100 translate-x-0 animate-slide-in-right"
                    : "opacity-100 translate-x-0 animate-slide-in-left"
                }`}
              >
                {currentProduct.title}
              </h2>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-8 max-sm:absolute top-[40%] max-sm:w-full justify-between">
                <button
                  onClick={prevSlide}
                  className="w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 animate-pulse-subtle"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>

                <button
                  onClick={nextSlide}
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 animate-pulse-subtle"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Right Product Display */}
            <div className="relative flex items-center justify-center">
              {/* Product Image */}
              <div
                key={`image-${currentSlide}`}
                className={`relative w-[75%] sm:w-full  sm:max-w-lg transition-all duration-500 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                } ${
                  showExitAnimation
                    ? slideDirection === "next"
                      ? "opacity-0 translate-y-8 scale-90 animate-slide-out-down"
                      : "opacity-0 -translate-y-8 scale-90 animate-slide-out-up"
                    : slideDirection === "next"
                    ? "opacity-100 translate-y-0 scale-100 animate-slide-in-up"
                    : "opacity-100 translate-y-0 scale-100 animate-slide-in-down"
                }`}
              >
                <div className="relative z-10">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.title}
                    className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105 animate-float"
                  />
                </div>
              </div>
            </div>

            <div className="flex max-sm:flex-col w-full justify-between">
              <p
                key={`desc-${currentSlide}`}
                className={`text-gray-600 text-xs sm:text-lg leading-relaxed max-w-lg transition-all duration-400 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  showExitAnimation
                    ? slideDirection === "next"
                      ? "opacity-0 -translate-x-12 animate-slide-out-left"
                      : "opacity-0 translate-x-12 animate-slide-out-right"
                    : slideDirection === "next"
                    ? "opacity-100 translate-x-0 animate-slide-in-right"
                    : "opacity-100 translate-x-0 animate-slide-in-left"
                }`}
              >
                {currentProduct.description}
              </p>
              <div
                key={`buttons-${currentSlide}`}
                className={`flex sm:flex-row gap-4 items-center transition-all duration-400 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                } ${
                  showExitAnimation
                    ? slideDirection === "next"
                      ? "opacity-0 -translate-x-12 animate-slide-out-left"
                      : "opacity-0 translate-x-12 animate-slide-out-right"
                    : slideDirection === "next"
                    ? "opacity-100 translate-x-0 animate-slide-in-right"
                    : "opacity-100 translate-x-0 animate-slide-in-left"
                }`}
              >
                <button
                  onClick={() => addToCartHandler()}
                  className="flex cursor-pointer items-center justify-center gap-2 bg-white/80 hover:bg-white text-gray-800 sm:px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-200"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => addToCartHandler()}
                  className="flex cursor-pointer items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy | ${currentProduct.price}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bg-slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 0.6;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes bg-slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.95);
          }
          to {
            opacity: 0.6;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in-down {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bg-slide-out-left {
          from {
            opacity: 0.6;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-100px) scale(0.9);
          }
        }

        @keyframes bg-slide-out-right {
          from {
            opacity: 0.6;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(100px) scale(0.9);
          }
        }

        @keyframes slide-out-left {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-80px);
          }
        }

        @keyframes slide-out-right {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(80px);
          }
        }

        @keyframes slide-out-up {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-80px) scale(0.85);
          }
        }

        @keyframes slide-out-down {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(80px) scale(0.85);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-bg-slide-in-right {
          animation: bg-slide-in-right 0.6s ease-out;
        }

        .animate-bg-slide-in-left {
          animation: bg-slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }

        .animate-slide-in-down {
          animation: slide-in-down 0.6s ease-out;
        }

        .animate-bg-slide-out-left {
          animation: bg-slide-out-left 0.4s ease-out;
        }

        .animate-bg-slide-out-right {
          animation: bg-slide-out-right 0.4s ease-out;
        }

        .animate-slide-out-left {
          animation: slide-out-left 0.4s ease-out;
        }

        .animate-slide-out-right {
          animation: slide-out-right 0.4s ease-out;
        }

        .animate-slide-out-up {
          animation: slide-out-up 0.4s ease-out;
        }

        .animate-slide-out-down {
          animation: slide-out-down 0.4s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ProductShowcase;
