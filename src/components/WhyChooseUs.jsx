"use client";
import React from "react";
import { DollarSign, Shield, Award, Leaf, Package, Heart } from "lucide-react";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Finest ingredients crafted with care for exceptional results.",
    },
    {
      icon: Shield,
      title: "100% Authentic",
      description: "Quality-checked products with free return guarantee.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description:
        "Sustainable ingredients and environmentally conscious practices.",
    },
    {
      icon: DollarSign,
      title: "Best Value",
      description: "Premium products at competitive prices for everyone.",
    },
    {
      icon: Package,
      title: "Fast Delivery",
      description: "Quick and secure shipping to your doorstep.",
    },
    {
      icon: Heart,
      title: "Expert Care",
      description: "Professional-grade formulations for your skin.",
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
            Our Promise
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight mb-4"
          >
            Why Choose Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 leading-relaxed"
          >
            Experience the difference with premium beauty products crafted for
            exceptional results.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group cursor-pointer relative bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-gray-200"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg group-hover:bg-gray-800">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 font-serif">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
