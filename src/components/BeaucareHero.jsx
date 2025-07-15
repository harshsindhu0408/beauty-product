'use client'
import React, { useEffect, useRef, useState } from 'react';
import Navigation from './Navigation';
import MainContent from './MainContent';
import ReviewsCard from './ReviewsCard';
import BackgroundImage from './BackgroundImage';

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
      if (typeof window !== 'undefined' && window.gsap) {
        const { gsap } = window;
        
        // Set initial states
        gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
          opacity: 0,
          y: 100
        });
        
        gsap.set(navRef.current, {
          opacity: 0,
          y: -30
        });
        
        gsap.set(reviewsRef.current, {
          opacity: 0,
          scale: 0.8
        });
        
        gsap.set(imageRef.current, {
          opacity: 0,
          scale: 1.1
        });
 
        const tl = gsap.timeline({ delay: 0.2 });
         
        tl.to(imageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out"
        })
         
        .to(navRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=1.2")
         
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        }, "-=0.5")
         
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.3")
         
        .to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.2")
         
        .to(reviewsRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }, "-=0.4");
 
        const handleScroll = () => {
          if (typeof window !== 'undefined') {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (imageRef.current) {
              gsap.to(imageRef.current, {
                y: scrolled * parallaxSpeed,
                duration: 0.8,
                ease: "power2.out"
              });
            }
          }
        };

        if (typeof window !== 'undefined') {
          window.addEventListener('scroll', handleScroll);
        }
        
        return () => {
          if (typeof window !== 'undefined') {
            window.removeEventListener('scroll', handleScroll);
          }
        };
      }
    };

    if (typeof window !== 'undefined') {
      if (!window.gsap) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
        script.onload = initAnimations;
        document.head.appendChild(script);
      } else {
        initAnimations();
      }
    }
  }, [isClient]);

  const handleButtonHover = (isHovering) => {
    if (typeof window !== 'undefined' && window.gsap && buttonRef.current) {
      window.gsap.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleNavItemHover = (element, isHovering) => {
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.to(element, {
        scale: isHovering ? 0.95 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <BackgroundImage imageRef={imageRef} />

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Component */}
        <Navigation 
          navRef={navRef} 
          handleNavItemHover={handleNavItemHover} 
        />

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