'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const BeaucareHeroExact = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const navRef = useRef(null);
  const reviewsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => { 
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
          const scrolled = window.pageYOffset;
          const parallaxSpeed = 0.5;
          
          if (imageRef.current) {
            gsap.to(imageRef.current, {
              y: scrolled * parallaxSpeed,
              duration: 0.8,
              ease: "power2.out"
            });
          }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }
    };

 
    if (!window.gsap) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.onload = initAnimations;
      document.head.appendChild(script);
    } else {
      initAnimations();
    }
  }, []);

  const handleButtonHover = (isHovering) => {
    if (window.gsap && buttonRef.current) {
      window.gsap.to(buttonRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleNavItemHover = (element, isHovering) => {
    if (window.gsap) {
      window.gsap.to(element, {
        scale: isHovering ? 0.95 : 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Real Woman Image Overlay */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 w-full h-full">
          <img 
            ref={imageRef}
            src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="Woman applying face mask"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dark Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

      {/* // this should be a different component */}
        {/* Navigation */} 
        <nav ref={navRef} className="px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/20 backdrop-blur-lg rounded-full px-8 py-4 flex items-center justify-between border-2 border-white/45">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-16">
                <a 
                  href="#" 
                  className="text-white/90 hover:text-white font-light text-lg transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover(e.target, false)}
                >
                  Home
                </a>
                <a 
                  href="#" 
                  className="text-white/90 hover:text-white font-light text-lg transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover(e.target, false)}
                >
                  About
                </a>
                <a 
                  href="#" 
                  className="text-white/90 hover:text-white font-light text-lg transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover(e.target, false)}
                >
                  Product
                </a>
              </div>

              {/* Logo */}
              <div className="text-3xl font-normal text-white tracking-wide playfair-display">
                Saundrya
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-16">
                <span 
                  className="text-white/90 hover:text-white font-light text-lg cursor-pointer transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover(e.target, false)}
                >
                  Cart(8)
                </span>
                <span 
                  className="text-white/90 hover:text-white font-light text-lg cursor-pointer transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover(e.target, false)}
                >
                  Delivery(3)
                </span>
                <span 
                  className="text-white/90 hover:text-white font-light text-lg cursor-pointer transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover(e.target, false)}
                >
                  Account
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 bg-white/95 backdrop-blur-lg rounded-2xl p-6 space-y-4">
                <a href="#" className="block text-gray-800 font-medium py-2">Home</a>
                <a href="#" className="block text-gray-800 font-medium py-2">About</a>
                <a href="#" className="block text-gray-800 font-medium py-2">Product</a>
                <hr className="border-gray-200" />
                <div className="space-y-2">
                  <span className="block text-gray-800 py-1">Cart(8)</span>
                  <span className="block text-gray-800 py-1">Delivery(3)</span>
                  <span className="block text-gray-800 py-1">Account</span>
                </div>
              </div>
            )}
          </div>
        </nav>


        {/*this should be a different component */}
        {/* Main Content */}
        <div className="flex-1 flex items-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <h1 
                ref={titleRef}
                className="text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[105%] mb-8 tracking-wide font-serif playfair-display"
              >
                Enhance<br />
                Your Beauty
              </h1>
              
              <p 
                ref={subtitleRef}
                className="text-white text-lg md:text-2xl leading-relaxed mb-12 max-w-[450px] font-light"
              >
                Beauty is important for self-confidence in your daily life, but sometimes you don't care enough about it{' '}
                <span className="text-white font-normal">to maximize it</span>. So, let's enhance your beauty
              </p>

              <button 
                ref={buttonRef}
                className="bg-black hover:bg-gray-700 text-white px-8 py-4 rounded-full text-lg font-normal transition-all duration-300"
                onMouseEnter={() => handleButtonHover(true)}
                onMouseLeave={() => handleButtonHover(false)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>



        {/* this should be a different component */}
        {/* Reviews Card */}
        <div ref={reviewsRef} className="absolute bottom-8 right-8 hidden lg:block">
          <div className="rounded-2xl flex items-center space-x-4">
            <div className="flex-shrink-0 backdrop-blur-lg rounded-lg">
              <img 
                src="/review-img.webp"
                alt="Customer reviews"
                className="w-20 h-20 p-1 rounded-lg object-cover"
              />
            </div>
            <div>
              <h4 className="text-white backdrop-blur-lg px-2 py-1 rounded-full font-semibold text-xs mb-1">Our Rate Reviews</h4>
              <div className="flex items-center space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white text-sm">
                <span className="font-bold">4.9</span> (528 Reviews)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeaucareHeroExact;