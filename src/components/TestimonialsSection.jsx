"use client";
import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TestimonialsSection = () => {
  const pressReviews = [
    {
      id: 1,
      publication: "Vogue India",
      quote:
        "Saundrya Earth is redefining the landscape of Indian skincare with its potent, science-backed ayurvedic formulations. A must-have for the modern vanity.",
      author: "Beauty Editor",
    },
    {
      id: 2,
      publication: "Elle India",
      quote:
        "Finally, a brand that marries sustainability with luxury. Their carbon-negative approach is not just a marketing gimmick but a tangible commitment to the planet.",
      author: "Sustainability Watch",
    },
    {
      id: 3,
      publication: "Harper's Bazaar India",
      quote:
        "The Midnight Restoration Cream is nothing short of a miracle. It delivers that elusive 'glass skin' glow overnight, proving that natural ingredients can be powerful.",
      author: "Best of Beauty 2024",
    },
    {
      id: 4,
      publication: "Femina",
      quote:
        "Ethical, effective, and elegant. Saundrya Earth proves that you don't have to compromise on performance to be kind to the environment.",
      author: "Editor's Pick",
    },
    {
      id: 5,
      publication: "Grazia India",
      quote:
        "From the packaging to the texture, everything about this brand screams 'quiet luxury'. The Morning Revival Serum has become a staple in our beauty closet.",
      author: "Skincare Awards",
    },
    {
      id: 6,
      publication: "Cosmopolitan India",
      quote:
        "A refreshing take on conscious beauty. Their shade range and inclusive ethos set a new standard for homegrown Indian brands.",
      author: "Beauty Team",
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-gray-50 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-4 block"
          >
            In The Press
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-serif text-gray-900 leading-tight"
          >
            Acclaimed by <br />
            <span className="italic text-gray-500">Industry Leaders</span>
          </motion.h2>
        </div>

        {/* Press Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {pressReviews.map((review, index) => (
            <PressCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PressCard = ({ review, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
      className="flex flex-col h-full border-t border-gray-200 pt-8 group hover:border-gray-900 transition-colors duration-500"
    >
      <div className="mb-6">
        <Quote className="w-8 h-8 text-gray-300 group-hover:text-gray-900 transition-colors duration-500" />
      </div>

      <blockquote className="flex-grow mb-8">
        <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-light">
          "{review.quote}"
        </p>
      </blockquote>

      <div className="mt-auto">
        <h3 className="text-xl font-serif text-gray-900 mb-1">
          {review.publication}
        </h3>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {review.author}
        </p>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
