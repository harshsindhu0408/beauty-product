"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Helper component for star ratings
const StarRating = ({ rating = 0 }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Redesigned, compact Review Card
const ReviewCard = ({ review }) => {
  // Fallback data for robustness
  const authorName = review?.userId?.profile?.name ?? "Anonymous";
  const avatarUrl =
    review?.userId?.profile?.avatar ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${authorName}`;
  const comment = review?.comment ?? "No comment provided.";
  const rating = review?.rating ?? 0;
  const date = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <img
          src={avatarUrl}
          alt={authorName}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="ml-3 flex-1">
          <h4 className="font-semibold text-gray-800">{authorName}</h4>
          <StarRating rating={rating} />
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed flex-grow line-clamp-4">
        “{comment}”
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
        <span>{date}</span>
      </div>
    </div>
  );
};

// The main component to be exported and used on a product page
export default function ProductReviewsSection({
  reviews = [],
  productName = "our product",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Animate only once
        }
      },
      { threshold: 0.2 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="py-20 relative z-0 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Animated Header */}
        <div className="text-center mb-16" ref={titleRef}>
          <h2
            className={`text-4xl md:text-5xl font-light text-gray-800 mb-6 leading-tight font-serif transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            Reviews for <br />
            <span className="font-semibold relative inline-block">
              {productName}
              <svg
                className="w-[100px] sm:w-[300px] mx-auto absolute -bottom-3 left-1/2 transform -translate-x-1/2"
                viewBox="0 0 1418 125"
              >
                <defs>
                  <linearGradient
                    id="underlineGradientReviews"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FF8FBA" />
                    <stop offset="100%" stopColor="#FF3D8B" />
                  </linearGradient>
                  <clipPath id="underlineClipReviews">
                    <rect
                      x="0"
                      y="0"
                      height="125"
                      width={isVisible ? "1418" : "0"}
                      style={{
                        transition: "width 1s ease-out",
                        transitionDelay: "0.5s",
                      }}
                    />
                  </clipPath>
                </defs>
                <path
                  d="M1412.29 72.17c-11.04-5.78-20.07-14.33-85.46-25.24-22.37-3.63-44.69-7.56-67.07-11.04-167.11-22.06-181.65-21.24-304.94-30.56C888.78 1.39 822.57 1.1 756.44 0c-46.63-.11-93.27 1.56-139.89 2.5C365.5 13.55 452.86 7.68 277.94 23.15 202.57 33.32 127.38 45.01 52.07 55.69c-11.23 2.41-22.63 4.17-33.71 7.22C6.1 66.33 5.64 66.19 3.89 67.79c-7.99 5.78-2.98 20.14 8.72 17.5 33.99-9.47 32.28-8.57 178.06-29.66 4.26 4.48 7.29 3.38 18.42 3.11 13.19-.32 26.38-.53 39.56-1.12 53.51-3.81 106.88-9.62 160.36-13.95 18.41-1.3 36.8-3.12 55.21-4.7 23.21-1.16 46.43-2.29 69.65-3.4 120.28-2.16 85.46-3.13 234.65-1.52 23.42.99 1.57-.18 125.72 6.9 96.61 8.88 200.92 27.94 295.42 46.12 40.87 7.91 116.67 23.2 156.31 36.78 3.81 1.05 8.28-.27 10.51-3.58 3.17-3.72 2.66-9.7-.78-13.13-3.25-3.12-8.14-3.44-12.18-5.08-17.89-5.85-44.19-12.09-63.67-16.56l26.16 3.28c23.02 3.13 46.28 3.92 69.34 6.75 10.8.96 25.43 1.81 34.34-4.39 2.26-1.54 4.86-2.75 6.21-5.27 2.76-4.59 1.13-11.06-3.59-13.68Z"
                  fill="url(#underlineGradientReviews)"
                  clipPath="url(#underlineClipReviews)"
                />
              </svg>
            </span>
          </h2>
        </div>

        {reviews && reviews.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {reviews.map((review, index) => (
              <motion.div key={review._id || index} variants={itemVariants}>
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-500 bg-white/50 rounded-2xl p-8">
            <p>
              There are no reviews for this product yet. Be the first to leave
              one!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
