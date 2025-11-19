"use client";
import React, { useEffect, useRef, useState } from "react";
import MainContent from "./MainContent";
import ReviewsCard from "./ReviewsCard";
import Navigation from "./Navigation";

// Sample images - replace these URLs with your actual images
const backgroundImages = [
  "/hero1.webp",
  "/hero2.webp",
  "/hero3.webp",
  "/hero4.webp",
  "/hero5.webp",
];

const BackgroundSlider = ({ imageRef }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Auto-play functionality
    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds
    };

    startAutoPlay();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || typeof window === "undefined" || !window.gsap) return;

    const { gsap } = window;
    const images = sliderRef.current?.querySelectorAll(".bg-image");

    if (images) {
      // Hide all images first
      gsap.set(images, { opacity: 0 });

      // Show current image with fade effect
      gsap.to(images[currentIndex], {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      // Hide previous images
      images.forEach((img, index) => {
        if (index !== currentIndex) {
          gsap.to(img, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    }
  }, [currentIndex, isClient]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Reset the interval when user manually changes slide
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
  };

  if (!isClient) return null;

  return (
    <div ref={imageRef} className="absolute inset-0 w-full h-full">
      <div ref={sliderRef} className="relative w-full h-full">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="bg-image absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === currentIndex ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Main Hero Component with Background Slider
const BeaucareHero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const reviewsRef = useRef(null);
  const imageRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initAnimations = () => {
      if (typeof window !== "undefined" && window.gsap) {
        const { gsap } = window;

        // Set initial states
        gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
          opacity: 0,
          y: 100,
        });

        gsap.set(navRef.current, {
          opacity: 0,
          y: -30,
        });

        gsap.set(reviewsRef.current, {
          opacity: 0,
          scale: 0.8,
        });

        gsap.set(imageRef.current, {
          opacity: 0,
          scale: 1.1,
        });

        const tl = gsap.timeline({ delay: 0.2 });

        tl.to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        })

          .to(
            navRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=1.2"
          )

          .to(
            titleRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.5"
          )

          .to(
            subtitleRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.3"
          )

          .to(
            buttonRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.2"
          )

          .to(
            reviewsRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.7)",
            },
            "-=0.4"
          );

        const handleScroll = () => {
          if (typeof window !== "undefined") {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;

            if (imageRef.current) {
              gsap.to(imageRef.current, {
                y: scrolled * parallaxSpeed,
                duration: 0.8,
                ease: "power2.out",
              });
            }
          }
        };

        if (typeof window !== "undefined") {
          window.addEventListener("scroll", handleScroll);
        }

        return () => {
          if (typeof window !== "undefined") {
            window.removeEventListener("scroll", handleScroll);
          }
        };
      }
    };

    if (typeof window !== "undefined") {
      if (!window.gsap) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        script.onload = initAnimations;
        document.head.appendChild(script);
      } else {
        initAnimations();
      }
    }
  }, [isClient]);

  const handleButtonHover = (isHovering) => {
    if (typeof window !== "undefined" && window.gsap && buttonRef.current) {
      window.gsap.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleNavItemHover = (element, isHovering) => {
    if (typeof window !== "undefined" && window.gsap) {
      window.gsap.to(element, {
        scale: isHovering ? 0.95 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Background Slider */}
      <BackgroundSlider imageRef={imageRef} />

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Component */}
        <Navigation navRef={navRef} handleNavItemHover={handleNavItemHover} />

        {/* Main Content Component */}
        <MainContent
          titleRef={titleRef}
          subtitleRef={subtitleRef}
          buttonRef={buttonRef}
          handleButtonHover={handleButtonHover}
        />

        {/* Reviews Card Component */}
        <ReviewsCard reviewsRef={reviewsRef} />
      </div>
    </div>
  );
};

export default BeaucareHero;
