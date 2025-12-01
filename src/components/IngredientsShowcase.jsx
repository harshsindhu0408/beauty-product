"use client";
import React from "react";
import { Sparkles, Droplet, Leaf, Shield } from "lucide-react";
import { motion } from "framer-motion";

const IngredientsShowcase = () => {
  const ingredients = [
    {
      icon: Droplet,
      name: "Hyaluronic Acid",
      benefit: "Deep Hydration",
      description: "Locks in moisture for plump, dewy skin.",
    },
    {
      icon: Leaf,
      name: "Natural Botanicals",
      benefit: "Pure & Gentle",
      description: "Plant-based ingredients that nourish naturally.",
    },
    {
      icon: Sparkles,
      name: "Vitamin C",
      benefit: "Radiant Glow",
      description: "Brightens and evens skin tone.",
    },
    {
      icon: Shield,
      name: "Antioxidants",
      benefit: "Protection",
      description: "Defends against environmental damage.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3 font-medium"
          >
            Power Ingredients
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight mb-4"
          >
            What Makes It Work
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 leading-relaxed"
          >
            Scientifically proven ingredients that deliver real results.
          </motion.p>
        </div>

        {/* Ingredients Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group text-center p-8 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                <ingredient.icon className="w-7 h-7 text-gray-900 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-medium text-gray-900 mb-2 font-serif">
                {ingredient.name}
              </h3>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-semibold">
                {ingredient.benefit}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {ingredient.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientsShowcase;
