"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "@/utils/mock";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TestimonialsGrid = () => {
  const gridRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power3.out",
      });

      // Card animations
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 80,
          duration: 0.4,
          delay: index * 0.1,
          ease: "back.out(1.2)",
        });

        // Hover animations
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Grid animation
      gsap.from(gridRef.current, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.4,
        ease: "power3.out",
      });
    }, gridRef); // scope the context to the gridRef

    return () => {
      ctx.revert(); // cleanup
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative"
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="will-change-transform"
          >
            <TestimonialCard testimonial={testimonial} variant="grid" />
          </div>
        ))}
      </div>
    </>
  );
};

export default TestimonialsGrid;
