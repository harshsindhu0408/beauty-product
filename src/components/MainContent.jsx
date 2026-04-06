"use client";
import React from "react";
import Link from "next/link";

const MainContent = ({
  titleRef,
  subtitleRef,
  buttonRef,
  handleButtonHover,
  title,
  description,
  targetUrl,
}) => {
  return (
    <div className="flex-1 flex items-end px-4 sm:px-20 mb-10">
      <div className="max-w-8xl mx-auto w-full">
        <div className="max-w-2xl">
          {/* <h1
            ref={titleRef}
            className="text-4xl md:text-5xl lg:text-6xl text-white leading-[105%] font-bold mb-4 tracking-wide font-serif"
          >
            {title || "Enhance Your Beauty"}
          </h1>

          <p
            ref={subtitleRef}
            className="text-white text-base md:text-xl leading-relaxed mb-4 max-w-[450px] font-semibold"
          >
            {description ||
              "Beauty is important for self-confidence in your daily life, but sometimes you don't care enough about it to maximize it. So, let's enhance your beauty"}
          </p> */}

          <Link href={targetUrl || "/products"}>
            {/* <button
              ref={buttonRef}
              className="bg-black text-white px-6 py-2  rounded-full text-lg font-bold transition-all duration-300"
              onMouseEnter={() => handleButtonHover(true)}
              onMouseLeave={() => handleButtonHover(false)}
            >
              Get Started
            </button> */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
