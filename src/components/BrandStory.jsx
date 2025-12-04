"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const BrandStory = () => {
  const router = useRouter();

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-gray-50 overflow-hidden">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 order-2 lg:order-1 relative z-10"
          >
            <div className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-stone-100 shadow-sm lg:shadow-none lg:bg-transparent lg:border-none lg:p-0">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-4 font-semibold"
              >
                Our Heritage
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-[1.1] mb-6"
              >
                Crafted by Nature, <br />
                <span className="italic text-stone-600">
                  Perfected by Science
                </span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed"
              >
                <p>
                  Born from a desire to bridge the gap between ancient botanical
                  wisdom and modern dermatological science. We believe that true
                  beauty lies in the balance of nature's purity and clinical
                  precision.
                </p>
                <p>
                  Every drop is a promise—a commitment to sustainable sourcing,
                  transparent formulations, and results that honor your skin's
                  natural biology.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-10"
              >
                <button
                  onClick={() => router.push("/about")}
                  className="group cursor-pointer inline-flex items-center gap-2 text-gray-900 font-medium border-b border-gray-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-all duration-300"
                >
                  Discover Our Journey
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop"
                alt="Saundrya Earth Brand Story"
                fill
                className="object-cover transition-transform duration-[2s] hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {/* Decorative Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/10 to-transparent mix-blend-multiply" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
