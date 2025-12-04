"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import MainContent from "./MainContent";
import ReviewsCard from "./ReviewsCard";
import Navigation from "./Navigation";
import NextImage from "next/image";
import Link from "next/link";

// Preload images for better performance
const preloadImages = (imageUrls) => {
  if (typeof window === "undefined") return;

  imageUrls.forEach((url) => {
    const img = new window.Image(); // Use window.Image for SSR safety
    img.src = url;
  });
};

const BackgroundSlider = ({
  imageRef,
  banners,
  currentIndex,
  containerHeight,
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const sliderRef = useRef(null);
  const gsapRef = useRef(null);

  // Memoize image URLs to prevent unnecessary re-renders
  const memoizedImages = useMemo(
    () => banners.map((b) => b.image.url),
    [banners]
  );

  // Load GSAP once
  useEffect(() => {
    const loadGSAP = async () => {
      if (typeof window !== "undefined" && !window.gsap) {
        const { default: gsap } = await import("gsap");
        gsapRef.current = gsap;
        window.gsap = gsap;
      } else if (window.gsap) {
        gsapRef.current = window.gsap;
      }
    };

    loadGSAP();
  }, []);

  // Preload images and set loaded state
  useEffect(() => {
    if (memoizedImages.length === 0) return;

    preloadImages(memoizedImages);

    // Check if images are loaded
    let loadedCount = 0;
    const totalImages = memoizedImages.length;

    const checkImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    memoizedImages.forEach((url) => {
      const img = new window.Image(); // Use window.Image for SSR safety
      img.onload = checkImageLoad;
      img.onerror = checkImageLoad; // Even if error, count it
      img.src = url;
    });

    // Fallback timeout
    const timeoutId = setTimeout(() => setImagesLoaded(true), 1000);
    return () => clearTimeout(timeoutId);
  }, [memoizedImages]);

  // GSAP animations with debouncing
  useEffect(() => {
    if (!imagesLoaded || !gsapRef.current) return;

    const images = sliderRef.current?.querySelectorAll(".bg-image-container");
    if (!images || images.length === 0) return;

    const gsap = gsapRef.current;

    // Animate only the current and previous images
    gsap.to(images[currentIndex], {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      zIndex: 2,
    });

    // Ken Burns effect for current image
    const currentImgElement = images[currentIndex].querySelector("img");
    if (currentImgElement) {
      gsap.fromTo(
        currentImgElement,
        { scale: 1 },
        { scale: 1.05, duration: 10, ease: "power1.out" }
      );
    }

    // Hide all other images
    Array.from(images).forEach((container, index) => {
      if (index !== currentIndex) {
        gsap.to(container, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          zIndex: 1,
        });
      }
    });
  }, [currentIndex, imagesLoaded]);

  return (
    <div
      ref={imageRef}
      className="absolute inset-0 w-full bg-gray-900"
      style={{ height: containerHeight }}
    >
      <div ref={sliderRef} className="relative w-full h-full">
        {memoizedImages.map((image, index) => (
          <div
            key={`bg-image-${index}`}
            className="bg-image-container absolute inset-0 w-full h-full overflow-hidden"
            style={{
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 2 : 1,
            }}
          >
            <NextImage
              src={image}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              quality={100}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/5" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Hero Component with optimizations
const BeaucareHero = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroHeight, setHeroHeight] = useState("85vh"); // Default height
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const reviewsRef = useRef(null);
  const imageRef = useRef(null);
  const gsapRef = useRef(null);
  const rafRef = useRef(null);
  const intervalRef = useRef(null);

  // Use Intersection Observer for scroll animations
  const [isVisible, setIsVisible] = useState(false);

  // Responsive height calculation
  useEffect(() => {
    const calculateHeroHeight = () => {
      if (typeof window === "undefined") return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Mobile devices (portrait)
      if (width <= 640) {
        // For mobile, use a percentage of viewport height
        // or screen height minus navigation
        return height <= 667 ? "85vh" : "75vh"; // iPhone SE to larger phones
      }

      // Tablet devices
      if (width <= 1024) {
        // For tablets, adjust based on orientation
        const isPortrait = height > width;
        return isPortrait ? "70vh" : "65vh";
      }

      // Desktop devices
      if (width <= 1440) {
        return "75vh";
      }

      // Large desktop screens
      return "70vh";
    };

    const updateHeight = () => {
      setHeroHeight(calculateHeroHeight());
    };

    // Initial calculation
    updateHeight();

    // Update on resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateHeight, 150);
    };

    window.addEventListener("resize", handleResize);

    // Also update on orientation change
    window.addEventListener("orientationchange", updateHeight);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateHeight);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const startAutoPlay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 5000);
    };

    startAutoPlay();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [banners.length]);

  // Load GSAP with dynamic import
  useEffect(() => {
    const loadGSAP = async () => {
      if (typeof window !== "undefined" && !window.gsap) {
        const { default: gsap } = await import("gsap");
        gsapRef.current = gsap;
        window.gsap = gsap;
        initAnimations();
      } else if (window.gsap) {
        gsapRef.current = window.gsap;
        initAnimations();
      }
    };

    loadGSAP();

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Intersection Observer for hero section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!isVisible || !imageRef.current || !gsapRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.3; // Reduced for better performance

      gsapRef.current.to(imageRef.current, {
        y: scrolled * parallaxSpeed,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [isVisible]);

  // Throttled scroll event listener
  useEffect(() => {
    if (!isVisible) return;

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [isVisible, handleScroll]);

  const initAnimations = useCallback(() => {
    if (!gsapRef.current || !isVisible) return;

    // Filter out null refs
    const elementsToAnimate = [
      titleRef.current,
      subtitleRef.current,
      buttonRef.current,
    ].filter(Boolean);

    if (elementsToAnimate.length > 0) {
      gsapRef.current.set(elementsToAnimate, {
        opacity: 0,
        y: 50,
      });
    }

    if (navRef.current) {
      gsapRef.current.set(navRef.current, {
        opacity: 0,
        y: -20,
      });
    }

    if (reviewsRef.current) {
      gsapRef.current.set(reviewsRef.current, {
        opacity: 0,
        scale: 0.95,
      });
    }

    if (imageRef.current) {
      gsapRef.current.set(imageRef.current, {
        opacity: 0,
        scale: 1.05,
      });
    }

    // Create timeline
    const tl = gsapRef.current.timeline({
      delay: 0.1,
      defaults: { ease: "power2.out" },
    });

    if (imageRef.current) {
      tl.to(imageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
      });
    }

    if (navRef.current) {
      tl.to(
        navRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.8"
      );
    }

    if (titleRef.current) {
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      );
    }

    if (subtitleRef.current) {
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.2"
      );
    }

    if (buttonRef.current) {
      tl.to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.1"
      );
    }

    if (reviewsRef.current) {
      tl.to(
        reviewsRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
        },
        "-=0.3"
      );
    }
  }, [isVisible]);

  // Re-run animations when component becomes visible
  useEffect(() => {
    if (isVisible && gsapRef.current) {
      initAnimations();
    }
  }, [isVisible, initAnimations]);

  // Animate text change
  useEffect(() => {
    if (!gsapRef.current) return;
    const gsap = gsapRef.current;

    const elementsToAnimate = [titleRef.current, subtitleRef.current].filter(
      Boolean
    );

    if (elementsToAnimate.length > 0) {
      const tl = gsap.timeline();
      tl.fromTo(
        elementsToAnimate,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
      );
    }
  }, [currentIndex]);

  const handleButtonHover = useCallback((isHovering) => {
    if (gsapRef.current && buttonRef.current) {
      gsapRef.current.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, []);

  const handleNavItemHover = useCallback((element, isHovering) => {
    if (gsapRef.current && element) {
      gsapRef.current.to(element, {
        scale: isHovering ? 0.95 : 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, []);

  const currentBanner =
    banners && banners.length > 0 ? banners[currentIndex] : null;

  return (
    <div
      ref={heroRef}
      className="flex flex-col w-full"
      // Prevent image drag
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Navigation - Sticky and separate */}
      <Navigation navRef={navRef} handleNavItemHover={handleNavItemHover} />

      {/* Hero Section with dynamic height */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: heroHeight,
          minHeight: "400px", // Fallback minimum height
          maxHeight: "900px", // Prevent it from getting too tall on large screens
        }}
      >
        {/* Background Slider with optimized loading - wrapped in Link for click functionality */}
        {banners && banners.length > 0 && (
          <Link
            href={currentBanner?.targetUrl || "/products"}
            className="cursor-pointer block absolute inset-0"
          >
            <BackgroundSlider
              imageRef={imageRef}
              banners={banners}
              currentIndex={currentIndex}
              containerHeight={heroHeight}
              href={currentBanner?.targetUrl || "/products"}
            />
          </Link>
        )}

        {/* Optimized overlay with gradient for performance */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Content with optimized stacking context */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-6 md:pb-10 lg:pb-12 px-4 sm:px-6 md:px-8 lg:px-12">
          <MainContent
            titleRef={titleRef}
            subtitleRef={subtitleRef}
            buttonRef={buttonRef}
            handleButtonHover={handleButtonHover}
            title={currentBanner?.title}
            description={currentBanner?.description}
            targetUrl={currentBanner?.targetUrl}
          />

          {/* <ReviewsCard reviewsRef={reviewsRef} isVisible={isVisible} /> */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BeaucareHero);
