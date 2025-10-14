"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Leaf } from "lucide-react";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const faqs = [
    {
      question: "What makes Saundrya Earth products different?",
      answer:
        "Our products are crafted with 100% natural ingredients, sustainably sourced and free from harsh chemicals. Each formulation is designed to work in harmony with your skin's natural biology while respecting the environment.",
    },
    {
      question: "Are your products cruelty-free?",
      answer:
        "Absolutely! We're proud to be Leaping Bunny certified. We never test on animals at any stage of product development, and all our suppliers adhere to strict cruelty-free standards.",
    },
    {
      question: "How should I store my products?",
      answer:
        "For optimal shelf life, store in a cool, dry place away from direct sunlight. Our preservative-free products should be used within 6 months of opening. The expiration date is printed on each package.",
    },
    {
      question: "Can I use your products if I have sensitive skin?",
      answer:
        "Yes! Our formulations are designed for all skin types, including sensitive skin. We recommend doing a patch test before full application. If you have specific concerns, our Skin Harmony line is specially formulated for reactive skin.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "We currently ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination. You'll see all available options at checkout based on your location.",
    },
    {
      question: "What's your return policy?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, you can return unopened products for a full refund or opened products for store credit. See our Returns page for details.",
    },
    {
      question: "Are your packaging materials sustainable?",
      answer:
        "We use 100% recyclable and biodegradable materials whenever possible. Our glass bottles are designed for reuse, and we offer a recycling program where you can return empty containers for proper processing.",
    },
    {
      question: "How often are new products released?",
      answer:
        "We launch 2-3 carefully developed products per year. Each formulation undergoes at least 12 months of testing to ensure efficacy and safety. Subscribe to our newsletter for exclusive previews of upcoming releases.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-emerald-50 to-white"
      >
        {/* Floating decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-100/20 rounded-full filter blur-[100px]"
            animate={{
              x: ["0%", "5%", "0%"],
              y: ["0%", "10%", "0%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-amber-100/20 rounded-lg rotate-45 filter blur-[90px]"
            animate={{
              x: ["0%", "-8%", "0%"],
              y: ["0%", "-12%", "0%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative pt-26  pb-10 px-6">
          <motion.div
            style={{ y: y1, opacity }}
            className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
          />

          <div className="max-w-7xl mx-auto relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <motion.div
                className="inline-flex items-center justify-center bg-emerald-100/50 rounded-full px-6 py-3 mb-8 border border-emerald-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <HelpCircle className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-emerald-700 font-medium">
                  Frequently Asked Questions
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight font-serif"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Your Questions,{" "}
                <span className="text-emerald-600">Answered</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Everything you need to know about our products, sustainability
                practices, and brand philosophy.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative pb-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <motion.div
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${
                      activeIndex === index ? "shadow-md" : "hover:shadow-md"
                    }`}
                    whileHover={{ y: -3 }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                    >
                      <div className="flex items-start">
                        <div className="bg-emerald-100/50 p-3 rounded-lg mr-6">
                          <Leaf className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-medium text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      {activeIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 ml-4 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 ml-4 flex-shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: { duration: 0.3 },
                              opacity: { duration: 0.2, delay: 0.1 },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: { duration: 0.3 },
                              opacity: { duration: 0.2 },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 md:px-8 md:pb-8 ml-16 text-gray-600">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="mt-24 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-px mb-8"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-white rounded-[15px] px-4 py-2">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-medium">
                    Still have questions?
                  </span>
                </div>
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                We&apos;re here to help
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Our customer care team is available to answer any additional
                questions you may have about our products or practices.
              </p>

              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <motion.a
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Support
                </motion.a>
                <motion.a
                  href="/live-chat"
                  className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Live Chat
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

    </ReactLenis>
  );
};

export default FAQPage;
