'use client'
import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, Shield, Award, Leaf } from 'lucide-react';

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const features = [
    {
      id: 1,
      icon: DollarSign,
      title: "Best Price",
      description: "We offer exclusive deals without compromising on quality or results.",
      bgColor: "bg-purple-200",
      cardColor: "bg-purple-100",
      iconColor: "text-purple-600",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1065&q=80"
    },
    {
      id: 2,
      icon: Award,
      title: "Best Quality",
      description: "Only the finest skincare, made with high-quality natural ingredients.",
      bgColor: "bg-gray-600",
      cardColor: "bg-gray-700",
      iconColor: "text-white",
      textColor: "text-white",
      image: null
    },
    {
      id: 3,
      icon: Shield,
      title: "Guaranteed",
      description: "Products are 100% original, quality-checked, free return guarantee.",
      bgColor: "bg-gray-800",
      cardColor: "bg-gray-700",
      iconColor: "text-white",
      textColor: "text-white",
      image: null
    },
    {
      id: 4,
      icon: Leaf,
      title: "Eco - Friendly",
      description: "Our products are eco-conscious, crafted with sustainable ingredients.",
      bgColor: "bg-gray-100",
      cardColor: "bg-white",
      iconColor: "text-gray-600",
      image: null
    },
    {
      id: 5,
      icon: Award,
      title: "Premium Care",
      description: "Luxury skincare experience with professional-grade formulations.",
      bgColor: "bg-rose-200",
      cardColor: "bg-rose-100",
      iconColor: "text-rose-600",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1065&q=80"
    },
    {
      id: 6,
      icon: DollarSign,
      title: "Value for Money",
      description: "Maximum benefits and results at competitive prices for everyone.",
      bgColor: "bg-blue-200",
      cardColor: "bg-blue-100",
      iconColor: "text-blue-600",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80"
    }
  ];

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Normalize to -1 to 1 range
    const normalizedX = mouseX / (rect.width / 2);
    const normalizedY = mouseY / (rect.height / 2);
    
    setMousePosition({ x: normalizedX, y: normalizedY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const getCardTransform = (index) => {
    const intensity = 15;
    const moveX = mousePosition.x * intensity * (index % 2 === 0 ? 1 : -1);
    const moveY = mousePosition.y * intensity * (index % 3 === 0 ? 1 : -1);
    
    return `translate(${moveX}px, ${moveY}px)`;
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative z-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 sm:top-16 md:top-20 left-10 sm:left-16 md:left-20 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 rounded-full bg-purple-300"></div>
        <div className="absolute bottom-10 sm:bottom-16 md:bottom-20 right-10 sm:right-16 md:right-20 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 rounded-full bg-gray-300"></div>
      </div>
      <div class="absolute w-[600px] h-[400px] bg-pink-100 rounded-full mix-blend-multiply filter -translate-1/2 blur-3xl top-1/2 left-1/2"></div>


      <div className="max-w-7xl mx-auto relative z-10">
        {/* Desktop Layout - Cards around centered text */}
        <div className="hidden xl:block relative min-h-[800px] flex items-center justify-center">
          {/* Centered Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 
                className={`text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-6 leading-tight font-serif transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                Why Choose Our<br />
                <span className="font-semibold relative inline-block">Product?
                  <svg 
                    className=' w-[100px] sm:w-[300px] mx-auto absolute  -bottom-5 left-1/2 transform -translate-x-1/2' 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 1418 125"
                  >
                    <defs>
                      <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFB5D8" />
                        <stop offset="100%" stopColor="#FF91C7" />
                      </linearGradient>
                      <clipPath id="revealClip">
                        <rect 
                          x="0" 
                          y="0" 
                          height="125" 
                          width={isVisible ? "1418" : "0"}
                          style={{
                            transition: 'width 0.5s ease-out',
                            transitionDelay: '.5s'
                          }}
                        />
                      </clipPath>
                    </defs>
                    <path 
                      d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68ZM925.4 23.77c37.64 1.4 153.99 10.85 196.64 14.94 45.95 5.51 91.89 11.03 137.76 17.19 24.25 4.77 74.13 11.21 101.72 18.14-11.87-1.15-23.77-1.97-35.65-3.06-133.46-15.9-266.8-33.02-400.47-47.21Z" 
                      fill="url(#underlineGradient)"
                      clipPath="url(#revealClip)"
                    />
                  </svg>
                </span>
              </h2>
              <p 
                className={`text-xl text-gray-600 mb-8 leading-relaxed transition-all duration-1000 ease-out delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                Various reasons why you should buy our products to increase your beauty to the maximum
              </p>
              <button 
                className={`bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all duration-1000 ease-out delay-500 hover:scale-105 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards Positioned Around Center */}
          {features.map((feature, index) => {
            const positions = [
              { top: '0%', left: '15%', width: '280px', height: '200px' },
              { top: '0%', right: '13%', width: '250px', height: '180px' },
              { bottom: '6%', right: '13%', width: '280px', height: '200px' },
              { bottom: '10%', left: '8%', width: '260px', height: '180px' },
              { bottom: '40%', left: '0%', width: '260px', height: '180px' },
              { bottom: '40%', right: '0%', width: '260px', height: '180px' }
            ];

            return (
              <div
                key={feature.id}
                className={`absolute rounded-3xl p-6 ${feature.cardColor} shadow-lg cursor-pointer text-center overflow-hidden transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{
                  ...positions[index],
                  minHeight: feature.image ? '200px' : '180px',
                  transform: isVisible ? getCardTransform(index) : 'translate(0, 32px) scale(0.95)',
                  transitionDelay: `${200 + (index * 200)}ms`,
                  transition: 'all 0.3s ease-out, opacity 1s ease-out, transform 1s ease-out'
                }}
              >
                {/* Background Image */}
                {feature.image && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                  </div>
                )}

                {/* Content */}
                <div className={`relative text-center flex items-center flex-col z-10 ${feature.image ? 'text-white' : feature.textColor || 'text-gray-800'}`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 font-serif">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed opacity-90">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </div>
            );
          })}
        </div>

        {/* Mobile and Tablet Layout */}
        <div className="xl:hidden">
          {/* Header Content */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 sm:mb-6 leading-tight font-serif transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Why Choose Our<br />
              <span className="font-semibold relative inline-block">Product?
                <svg 
                  className='w-[100px] sm:w-[300px] mx-auto absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2' 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 1418 125"
                >
                  <defs>
                    <linearGradient id="underlineGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFB5D8" />
                      <stop offset="100%" stopColor="#FF91C7" />
                    </linearGradient>
                    <clipPath id="revealClipMobile">
                      <rect 
                        x="0" 
                        y="0" 
                        height="125" 
                        width={isVisible ? "1418" : "0"}
                        style={{
                          transition: 'width 2s ease-out',
                          transitionDelay: '1s'
                        }}
                      />
                    </clipPath>
                  </defs>
                  <path 
                    d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68ZM925.4 23.77c37.64 1.4 153.99 10.85 196.64 14.94 45.95 5.51 91.89 11.03 137.76 17.19 24.25 4.77 74.13 11.21 101.72 18.14-11.87-1.15-23.77-1.97-35.65-3.06-133.46-15.9-266.8-33.02-400.47-47.21Z" 
                    fill="url(#underlineGradientMobile)"
                    clipPath="url(#revealClipMobile)"
                  />
                </svg>
              </span>
            </h2>
            <p 
              className={`text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto transition-all duration-1000 ease-out delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Various reasons why you should buy our products to increase your beauty to the maximum
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {features.map((feature, index) => (
              <div
                key={`responsive-${feature.id}`}
                className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 ${feature.cardColor} shadow-lg cursor-pointer overflow-hidden transition-all duration-1000 ease-out hover:scale-105 hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  minHeight: feature.image ? '200px' : '160px',
                  transitionDelay: `${index * 150}ms`
                }}
              >
                {/* Background Image */}
                {feature.image && (
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-2xl sm:rounded-3xl"></div>
                  </div>
                )}

                {/* Content */}
                <div className={`relative z-10 text-center flex flex-col items-center ${feature.image ? 'text-white' : feature.textColor || 'text-gray-800'}`}>
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 hover:scale-110`}>
                    <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 font-serif">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm leading-relaxed opacity-90 text-center">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl"></div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button 
              className={`bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-1000 ease-out hover:scale-105 hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;