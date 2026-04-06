// src/components/SkincareFeaturesSection.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  Leaf,
  Headset,
  Rabbit,
  Sprout,
  FlaskConical,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";

// An expanded and tailored array of features for a skincare brand.
const skincareFeatures = [
  {
    icon: <Sprout className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Clean Ingredients",
    description:
      "Our formulas are crafted without parabens, sulfates, or phthalates for pure, effective skincare.",
  },
  {
    icon: <Rabbit className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Cruelty-Free Promise",
    description:
      "We are 100% cruelty-free. No product or ingredient is ever tested on animals.",
  },
  {
    icon: (
      <FlaskConical className="w-12 h-12 text-pink-600" strokeWidth={1.5} />
    ),
    title: "Science-Backed Formulas",
    description:
      "Harnessing the power of nature and science for clinically proven, visible results.",
  },
  {
    icon: (
      <ClipboardCheck className="w-12 h-12 text-pink-600" strokeWidth={1.5} />
    ),
    title: "Dermatologist-Tested",
    description:
      "Every product is rigorously tested for safety and efficacy, ensuring it's gentle on your skin.",
  },
  {
    icon: <Leaf className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Sustainable & Conscious",
    description:
      "From responsibly sourced ingredients to recyclable packaging, we care for the planet.",
  },
  {
    icon: <Sparkles className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Visible Results Guarantee",
    description:
      "We're confident you'll love your radiant skin. See a noticeable difference or your money back.",
  },
  {
    icon: <Headset className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Expert Skincare Advice",
    description:
      "Our licensed estheticians are here to help you build your perfect skincare routine.",
  },
  {
    icon: <Truck className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Fast & Free Shipping",
    description:
      "Get your skincare essentials delivered quickly and free on all orders over ₹1000.",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-pink-600" strokeWidth={1.5} />,
    title: "Secure Checkout",
    description:
      "Your personal information and payment details are protected with top-tier security.",
  },
];

const SkincareFeaturesSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Commitment to Your Skin
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Experience skincare that's as thoughtful and conscious as you are.
            We believe in transparency, efficacy, and kindness.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {skincareFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex justify-center items-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkincareFeaturesSection;
