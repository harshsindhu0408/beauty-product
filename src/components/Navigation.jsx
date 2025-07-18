import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navigation = ({ navRef, handleNavItemHover }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter(); // Initialize useRouter

  // Define navigation links as an array of objects
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Testimonial', href: '/testimonials' },
  ];

  // Define action links (Delivery, Account) separately if they are not part of the main navigation flow
  const actionLinks = [
    { name: 'Support', href: '/support' },
    { name: 'Account', href: '/account' },
  ];

  // For mobile, you might want a combined list or separate as well
  const mobileActionLinks = [
    { name: 'Support', href: '/support' },
    { name: 'Account', href: '/account' },
  ];

  // Function to handle navigation
  const handleNavigation = (href) => {
    router.push(href);
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

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
              {navLinks.slice(0, 3).map((link) => ( // Display first 3 links for left side
                <div // Changed from Link to div/span
                  key={link.name} 
                  onClick={() => handleNavigation(link.href)} // Use onClick with router.push
                  className="font-light text-xl text-white/90 hover:text-white transition-colors duration-300 cursor-pointer" // Added cursor-pointer
                  onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
                >
                  {link.name}
                </div>
              ))}
            </div>

            {/* Logo */}
            <div className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-wide">
              Saundrya
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-16">
              {navLinks.slice(3).map((link) => ( // Display Testimonial here
                <div // Changed from Link to div/span
                  key={link.name} 
                  onClick={() => handleNavigation(link.href)} // Use onClick with router.push
                  className="font-light text-xl cursor-pointer text-white/90 hover:text-white transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
                >
                  {link.name}
                </div>
              ))}
              {actionLinks.map((link) => ( // Display Delivery and Account
                <div // Changed from Link to div/span
                  key={link.name} 
                  onClick={() => handleNavigation(link.href)} // Use onClick with router.push
                  className="font-light text-xl cursor-pointer text-white/90 hover:text-white transition-colors duration-300"
                  onMouseEnter={(e) => handleNavItemHover?.(e.target, true)}
                  onMouseLeave={(e) => handleNavItemHover?.(e.target, false)}
                >
                  {link.name}
                </div>
              ))}
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
              {navLinks.map((link) => (
                <div // Changed from Link to div/span
                  key={link.name} 
                  onClick={() => handleNavigation(link.href)} // Use onClick with router.push
                  className="block font-medium py-2 text-gray-800 transition-colors duration-300 cursor-pointer" // Added cursor-pointer
                >
                  {link.name}
                </div>
              ))}
              <hr className="border-gray-200 transition-colors duration-300" />
              <div className="space-y-2">
                {mobileActionLinks.map((link) => (
                  <div // Changed from Link to div/span
                    key={link.name} 
                    onClick={() => handleNavigation(link.href)} // Use onClick with router.push
                    className="block py-1 text-gray-800 transition-colors duration-300 cursor-pointer" // Added cursor-pointer
                  >
                    {link.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;