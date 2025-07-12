'use client'
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = ({ navRef, handleNavItemHover }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
  );
};

export default Navigation;