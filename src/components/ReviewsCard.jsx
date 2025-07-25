'use client'
import React from 'react';

const  ReviewsCard = ({ reviewsRef }) => {
  return (
    <div ref={reviewsRef} className="absolute bottom-8 right-8 hidden lg:block">
      <div className="rounded-2xl flex items-center space-x-4">
        <div className="flex-shrink-0 backdrop-blur-lg rounded-lg border border-[#ffffff45]">
          <img 
            src="/review-img.webp"
            alt="Customer reviews"
            className="w-26 h-26 p-1 rounded-lg object-cover"
          />
        </div>
        <div className=' flex justify-center items-center flex-col'>
          <h4 className="text-white backdrop-blur-lg px-2 py-1 rounded-full font-bold  mb-1 border border-[#ffffff45]">
            Our Rate Reviews
          </h4>
          <div className="flex items-center space-x-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-white fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white font-bold">
            <span className="font-bold">4.9</span> (528 Reviews)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewsCard;