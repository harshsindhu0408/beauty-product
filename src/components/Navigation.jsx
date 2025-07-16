import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = ({ navRef, handleNavItemHover }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav 
        ref={navRef} 
        className=" top-0 left-0 right-0 z-50 px-4 py-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-lg rounded-full px-4 py-2 sm:px-8 sm:py-4 flex items-center justify-between border-2 bg-white/20 border-white/45 transition-all duration-300">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-16">
              <a 
                href="#" 
                className="font-light text-xl text-white/90 hover:text-white transition-colors duration-300"
                onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
              >
                Home
              </a>
              <a 
                href="#about" 
                className="font-light text-xl text-white/90 hover:text-white transition-colors duration-300"
                onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
              >
                About
              </a>
              <a 
                href="#product" 
                className="font-light text-xl text-white/90 hover:text-white transition-colors duration-300"
                onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
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
              <a
                   href="#Testimonial" 
                className="font-light text-xl cursor-pointer text-white/90 hover:text-white transition-colors duration-300"
                onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
              >
             Testimonial
              </a>
              <span 
                className="font-light text-xl cursor-pointer text-white/90 hover:text-white transition-colors duration-300"
                onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
              >
                Delivery(3)
              </span>
              <span 
                className="font-light text-xl cursor-pointer text-white/90 hover:text-white transition-colors duration-300"
                onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
              >
                Account
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 backdrop-blur-lg rounded-2xl p-6 space-y-4 bg-white/95 transition-all duration-300">
              <a href="#" className="block font-medium py-2 text-gray-800 transition-colors duration-300">Home</a>
              <a href="#" className="block font-medium py-2 text-gray-800 transition-colors duration-300">About</a>
              <a href="#" className="block font-medium py-2 text-gray-800 transition-colors duration-300">Product</a>
              <hr className="border-gray-200 transition-colors duration-300" />
              <div className="space-y-2">
                <span className="block py-1 text-gray-800 transition-colors duration-300">Cart(8)</span>
                <span className="block py-1 text-gray-800 transition-colors duration-300">Delivery(3)</span>
                <span className="block py-1 text-gray-800 transition-colors duration-300">Account</span>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;