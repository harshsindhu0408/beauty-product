'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = ({ navRef, handleNavItemHover }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInHero, setIsInHero] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we're in hero section (assuming hero is viewport height)
      const heroHeight = window.innerHeight;
      setIsInHero(currentScrollY < heroHeight - 100);
      
      // Show nav when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        // Hide nav when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      ref={navRef} 
      className={`fixed top-0 left-0 right-0 z-100 px-4 py-6 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`backdrop-blur-lg rounded-full px-4 py-2 sm:px-8 sm:py-4 flex items-center justify-between border-2 transition-all duration-300 ${
          isInHero 
            ? 'bg-white/20 border-white/45' 
            : 'bg-gray-900/95 border-gray-700/50'
        }`}>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-16">
            <a 
              href="#" 
              className={`font-light text-xl transition-colors duration-300 ${
                isInHero 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onMouseEnter={(e) => handleNavItemHover(e.target, true)}
              onMouseLeave={(e) => handleNavItemHover(e.target, false)}
            >
              Home
            </a>
            <a 
              href="#" 
              className={`font-light text-xl transition-colors duration-300 ${
                isInHero 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onMouseEnter={(e) => handleNavItemHover(e.target, true)}
              onMouseLeave={(e) => handleNavItemHover(e.target, false)}
            >
              About
            </a>
            <a 
              href="#" 
              className={`font-light text-xl transition-colors duration-300 ${
                isInHero 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onMouseEnter={(e) => handleNavItemHover(e.target, true)}
              onMouseLeave={(e) => handleNavItemHover(e.target, false)}
            >
              Product
            </a>
          </div>

          {/* Logo */}
          <div className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-wide">
            Saundrya
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-16">
            <span 
              className={`font-light text-xl cursor-pointer transition-colors duration-300 ${
                isInHero 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onMouseEnter={(e) => handleNavItemHover(e.target, true)}
              onMouseLeave={(e) => handleNavItemHover(e.target, false)}
            >
              Cart(8)
            </span>
            <span 
              className={`font-light text-xl cursor-pointer transition-colors duration-300 ${
                isInHero 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onMouseEnter={(e) => handleNavItemHover(e.target, true)}
              onMouseLeave={(e) => handleNavItemHover(e.target, false)}
            >
              Delivery(3)
            </span>
            <span 
              className={`font-light text-xl cursor-pointer transition-colors duration-300 ${
                isInHero 
                  ? 'text-white/90 hover:text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
              onMouseEnter={(e) => handleNavItemHover(e.target, true)}
              onMouseLeave={(e) => handleNavItemHover(e.target, false)}
            >
              Account
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-2 transition-colors duration-300 ${
              isInHero ? 'text-white' : 'text-gray-300'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 backdrop-blur-lg rounded-2xl p-6 space-y-4 transition-all duration-300 ${
            isInHero 
              ? 'bg-white/95' 
              : 'bg-gray-900/95'
          }`}>
            <a href="#" className={`block font-medium py-2 transition-colors duration-300 ${
              isInHero ? 'text-gray-800' : 'text-gray-300 hover:text-white'
            }`}>Home</a>
            <a href="#" className={`block font-medium py-2 transition-colors duration-300 ${
              isInHero ? 'text-gray-800' : 'text-gray-300 hover:text-white'
            }`}>About</a>
            <a href="#" className={`block font-medium py-2 transition-colors duration-300 ${
              isInHero ? 'text-gray-800' : 'text-gray-300 hover:text-white'
            }`}>Product</a>
            <hr className={`transition-colors duration-300 ${
              isInHero ? 'border-gray-200' : 'border-gray-700'
            }`} />
            <div className="space-y-2">
              <span className={`block py-1 transition-colors duration-300 ${
                isInHero ? 'text-gray-800' : 'text-gray-300'
              }`}>Cart(8)</span>
              <span className={`block py-1 transition-colors duration-300 ${
                isInHero ? 'text-gray-800' : 'text-gray-300'
              }`}>Delivery(3)</span>
              <span className={`block py-1 transition-colors duration-300 ${
                isInHero ? 'text-gray-800' : 'text-gray-300'
              }`}>Account</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;