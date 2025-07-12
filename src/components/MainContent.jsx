'use client'
import React from 'react';

const MainContent = ({ titleRef, subtitleRef, buttonRef, handleButtonHover }) => {
  return (
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
  );
};

export default MainContent;