'use client'
import React from 'react';

const MainContent = ({ titleRef, subtitleRef, buttonRef, handleButtonHover }) => {
  return (
    <div className="flex-1 flex items-end px-4 sm:px-20 mb-10">
      <div className="max-w-8xl mx-auto w-full">
        <div className="max-w-2xl">
          <h1 
            ref={titleRef}
            className="text-6xl md:text-7xl lg:text-8xl text-white leading-[105%] font-bold mb-8 tracking-wide font-serif"
          >
            Enhance<br />
            Your Beauty
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-white text-lg md:text-2xl leading-relaxed mb-6 max-w-[450px] font-semibold"
          >
            Beauty is important for self-confidence in your daily life, but sometimes you don't care enough about it{' '}
            <span className="text-white font-semibold">to maximize it</span>. So, let's enhance your beauty
          </p>

          <button  
            className="bg-black text-white px-6 py-2  rounded-full text-lg font-bold transition-all duration-300"
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