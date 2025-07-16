"use client";
import React from "react";
import { AudioPlayer } from "./AudioPlayer";

const TestimonialCard = React.forwardRef(
  ({ testimonial, variant = "default" }, ref) => {
    const isGrid = variant === "grid";

    return (
      <div
        ref={ref}
        className={`
        bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl
        ${
          isGrid
            ? "h-full flex flex-col"
            : "h-[400px] flex flex-col md:flex-row"
        }
      `}
      >
        {/* Image Section */}
        <div
          className={`
        ${isGrid ? "h-48 w-full" : "w-full md:w-[60%] h-48 md:h-full"}
        relative overflow-hidden
      `}
        >
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div
          className={`
        p-5 flex flex-col flex-1
        ${
          isGrid
            ? ""
            : "md:absolute md:bg-white md:h-[90%] md:rounded-2xl md:-translate-y-1/2 md:top-1/2 md:right-6 md:w-[50%]"
        }
      `}
        >
          <div className="flex-1">
            {/* Name and Rating */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {testimonial.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {testimonial.location}
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < testimonial.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Product and Date */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {testimonial.product}
              </span>
              <span className="text-sm text-gray-500">
                {testimonial.date}
              </span>
            </div>

            {/* Testimonial Text */}
            <div className="mb-4">
              <p className="text-gray-700">
                {testimonial.text}
              </p>
            </div>

            {/* Additional Info (if any) */}
            {testimonial.additionalInfo && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {testimonial.additionalInfo}
                </p>
              </div>
            )}
          </div>

          {/* Audio Player */}
          <div className={`${isGrid ? "mt-auto" : ""}`}>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">Listen to review:</span>
              <AudioPlayer audioUrl={testimonial.audioUrl} compact={isGrid} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

export default TestimonialCard;