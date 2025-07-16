'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const socialRef = useRef(null);
  const exploreRef = useRef(null);
  const othersRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { 
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.381-.297 1.199-.336 1.363-.051.225-.165.271-.381.165-1.521-.708-2.474-2.94-2.474-4.733 0-3.86 2.806-7.4 8.085-7.4 4.243 0 7.539 3.028 7.539 7.065 0 4.215-2.659 7.6-6.35 7.6-1.24 0-2.41-.646-2.81-1.419l-.762 2.906c-.275 1.067-1.018 2.407-1.518 3.22C9.597 23.718 10.779 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
        </svg>
      ), 
      href: '#', 
      label: 'Pinterest' 
    },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const exploreLinks = [
    { name: 'About', href: '#' },
    { name: 'Product', href: '#' },
    { name: 'Delivery', href: '#' },
    { name: 'Cart', href: '#' },
  ];

  const othersLinks = [
    { name: 'FAQ', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Terms Of Use', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ];

  return (
    <footer 
      ref={sectionRef}
      className="py-16 md:py-20 lg:py-24 px-4 md:px-20 relative overflow-hidden bg-gradient-to-b from-white to-pink-100"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gray-300"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gray-400"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gray-200"></div>
      </div>

      <div className=" mx-auto relative z-10">
        <div className="flex justify-between flex-wrap gap-12 lg:gap-16">
          {/* Left Section - Title and Social */}
          <div className="">
            <div className="mb-8">
              <h2 
                ref={titleRef}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif mb-2 transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                More About Us?
              </h2>
              <h3 
                ref={subtitleRef}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif transition-all duration-1000 ease-out delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                Follow Our media
              </h3>
            </div>

            {/* Social Media Links */}
            <div 
              ref={socialRef}
              className={`flex items-center space-x-6 transition-all duration-1000 ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Section - Navigation Links */}
          <div className="">
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              {/* Explore Column */}
              <div 
                ref={exploreRef}
                className={`transition-all duration-1000 ease-out delay-600 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <h4 className="text-lg font-medium text-gray-500 mb-6 uppercase tracking-wide">
                  Explore
                </h4>
                <ul className="space-y-4">
                  {exploreLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-800 text-lg hover:text-gray-600 transition-colors duration-300 font-medium"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Others Column */}
              <div 
                ref={othersRef}
                className={`transition-all duration-1000 ease-out delay-800 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <h4 className="text-lg font-medium text-gray-500 mb-6 uppercase tracking-wide">
                  Others
                </h4>
                <ul className="space-y-4">
                  {othersLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-800 text-lg hover:text-gray-600 transition-colors duration-300 font-medium"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
       
        
   
      </div>
      <p className="text-white text-[24vw] mt-30 -mb-7  -translate-x-5 sm:-translate-x-20 playfair-display leading-[50%] ">
         Saundrya 
          </p>
    </footer>
  );
};

export default Footer;