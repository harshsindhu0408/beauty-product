"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Navigation from "@/components/Navigation";

export default function TermsOfService() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  // Terms sections data
  const termsSections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      icon: "✍️",
      content: [
        "By accessing or using Saundrya Earth's services, you agree to be bound by these Terms. If you disagree with any part, you may not access our services.",
        "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.",
      ],
    },
    {
      id: 2,
      title: "Product Use & Safety",
      icon: "🌿",
      content: [
        "Our products are designed for topical use only. Perform a patch test before full application.",
        "Discontinue use if irritation occurs and consult a dermatologist.",
        "Not intended to diagnose, treat, cure, or prevent any disease.",
        "Keep out of reach of children. Store in cool, dry conditions.",
      ],
    },
    {
      id: 3,
      title: "Intellectual Property",
      icon: "🖋️",
      content: [
        "All content on our platforms (logos, formulations, packaging designs) is our exclusive property.",
        "Unauthorized use of any trademarks, patents, or trade secrets is prohibited.",
        "You may share product images for personal, non-commercial purposes with proper attribution.",
      ],
    },
    {
      id: 4,
      title: "Purchases & Returns",
      icon: "📦",
      content: [
        "Full payment is required before order processing. We accept major credit cards and select digital wallets.",
        "Return unopened products within 30 days for full refund. Opened products may be eligible for store credit.",
        "Custom or personalized items are final sale. Damaged shipments must be reported within 7 days of delivery.",
      ],
    },
    {
      id: 5,
      title: "User Conduct",
      icon: "✨",
      content: [
        "You agree not to:",
        "- Submit false or misleading information",
        "- Use our services for any illegal purpose",
        "- Attempt to reverse engineer our formulations",
        "- Harass other community members",
        "- Automatically scrape or mine data",
      ],
    },
    {
      id: 6,
      title: "Limitation of Liability",
      icon: "⚖️",
      content: [
        "Saundrya Earth shall not be liable for:",
        "- Indirect, incidental, or consequential damages",
        "- Product misuse or allergic reactions",
        "- Third-party actions or service interruptions",
        "- Errors in product descriptions or pricing",
        "Our maximum liability shall not exceed the purchase price paid.",
      ],
    },
  ];

  return (
    <>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-transparent border-r-transparent border-pink-500 border-l-pink-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main
          ref={containerRef}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        >
          {/* Geometric background elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-100/20 rounded-full filter blur-[100px]"
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
            <motion.div
              className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-100/20 rounded-lg rotate-12 filter blur-[80px]"
              animate={{
                x: ["0%", "15%", "0%"],
                y: ["0%", "-5%", "0%"],
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 6,
              }}
            />
          </div>

          {/* Hero Section */}
          <section className="relative pt-26 flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.3,
                    },
                  },
                }}
                className="text-center"
              >
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="block">Conscious</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Agreement</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        delay: 0.8,
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute bottom-0 left-0 w-full h-4 bg-green-200/60 z-0 transform origin-left"
                      style={{ bottom: "15%" }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
                >
                  Our terms reflect the same intentionality we bring to our
                  formulations—clear, considered, and crafted with care.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="relative pb-10 z-20">
            <div className="container mx-auto px-6 max-w-5xl">
              {/* Introduction Card */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-20"
              >
                <motion.div
                  variants={fadeIn}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-green-100/10 blur-xl"></div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-amber-100/10 blur-xl"></div>

                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-1/3">
                      <motion.h2
                        className="text-3xl font-bold text-gray-900 mb-6 font-serif"
                        style={{ y: y2 }}
                      >
                        Terms Overview
                      </motion.h2>
                      <div className="h-px bg-gradient-to-r from-green-300 to-teal-300 w-full my-6" />
                      <p className="text-green-600 font-medium">
                        Effective:{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <motion.p
                        variants={fadeIn}
                        className="text-lg text-gray-600 leading-relaxed mb-6"
                      >
                        These Terms of Service govern your use of Saundrya
                        Earth&apost;s digital platforms, products, and services. By
                        engaging with our brand, you&apost;re entering into a
                        conscious agreement that respects both parties rights
                        and responsibilities.
                      </motion.p>
                      <motion.div
                        variants={fadeIn}
                        className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100"
                      >
                        <h3 className="text-xl font-semibold text-green-800 mb-3">
                          Key Principles
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>Transparency in all transactions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>Mutual respect in all interactions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>Accountability for both parties</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>Continuous improvement of terms</span>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.section>

              {/* Terms Sections - Alternating Layout */}
              {termsSections.map((section, index) => (
                <motion.section
                  key={section.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={sectionVariants}
                  className={`mb-16 ${
                    index % 2 === 0 ? "pl-0 md:pl-10" : "pr-0 md:pr-10"
                  }`}
                >
                  <motion.div variants={fadeIn} className="relative">
                    {/* Decorative corner */}
                    <div
                      className={`absolute -top-4 ${
                        index % 2 === 0 ? "-left-4" : "-right-4"
                      } w-16 h-16 border-t-2 ${
                        index % 3 === 0
                          ? "border-green-300"
                          : index % 3 === 1
                          ? "border-amber-300"
                          : "border-teal-300"
                      } ${
                        index % 2 === 0 ? "border-l-2" : "border-r-2"
                      } rounded-${
                        index % 2 === 0 ? "tl" : "tr"
                      }-2xl opacity-70`}
                    ></div>

                    <div
                      className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden ${
                        index % 2 === 0
                          ? "md:rounded-r-3xl"
                          : "md:rounded-l-3xl"
                      }`}
                    >
                      {/* Section header with icon */}
                      <motion.div className="flex items-start mb-6">
                        <motion.div
                          className="text-3xl mr-4"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          {section.icon}
                        </motion.div>
                        <div>
                          <motion.h2
                            className="text-2xl md:text-3xl font-bold text-gray-900 font-serif"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                          >
                            {section.title}
                            <motion.div
                              className={`h-0.5 mt-2 bg-gradient-to-r ${
                                index % 3 === 0
                                  ? "from-green-200 to-teal-200"
                                  : index % 3 === 1
                                  ? "from-amber-200 to-orange-200"
                                  : "from-teal-200 to-blue-200"
                              } w-3/4`}
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              transition={{ duration: 0.8, delay: 0.5 }}
                              viewport={{ once: true }}
                              style={{ originX: 0 }}
                            />
                          </motion.h2>
                        </div>
                      </motion.div>

                      {/* Section content with staggered animation */}
                      <div className="space-y-4 pl-12">
                        {section.content.map((paragraph, pIndex) => (
                          <motion.div
                            key={pIndex}
                            initial={{
                              opacity: 0,
                              x: pIndex % 2 === 0 ? -20 : 20,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.1 * pIndex + 0.3,
                              ease: "easeOut",
                            }}
                            viewport={{ once: true }}
                            className="flex items-start"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${
                                index % 3 === 0
                                  ? "bg-green-300"
                                  : index % 3 === 1
                                  ? "bg-amber-300"
                                  : "bg-teal-300"
                              }`}
                            ></div>
                            <p className="text-gray-600 leading-relaxed">
                              {paragraph}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Section decorative background pattern */}
                      <motion.div
                        className={`absolute -bottom-10 ${
                          index % 2 === 0 ? "-right-10" : "-left-10"
                        } text-8xl opacity-5 ${
                          index % 3 === 0
                            ? "text-green-200"
                            : index % 3 === 1
                            ? "text-amber-200"
                            : "text-teal-200"
                        }`}
                        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                        whileInView={{ rotate: 0, scale: 1, opacity: 0.05 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                      >
                        {section.icon}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.section>
              ))}

              {/* Closing Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mt-32"
              >
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-10 border border-green-100 shadow-lg overflow-hidden relative">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://res.cloudinary.com/dnvjct2if/image/upload/v1752659080/pattern_leaf_wyivyp.png')] bg-repeat"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                      <div className="md:w-1/2">
                        <motion.h2
                          className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          Need Clarification?
                        </motion.h2>
                        <motion.p
                          className="text-lg text-gray-600 mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          viewport={{ once: true }}
                        >
                          Our Customer Care team is available to help interpret
                          these terms or address any concerns about your
                          agreement with Saundrya Earth.
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          viewport={{ once: true }}
                          className="flex flex-wrap gap-4"
                        >
                          <a
                            href="mailto:terms@saundryaearth.com"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                          >
                            Contact Legal Team
                          </a>
                          <a
                            href="/support"
                            className="inline-block px-8 py-4 bg-white border border-green-200 text-gray-700 font-medium rounded-lg hover:bg-green-50 transition-all duration-300"
                          >
                            Visit Help Center
                          </a>
                        </motion.div>
                      </div>
                      <div className="md:w-1/2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 }}
                          viewport={{ once: true }}
                          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
                        >
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Document History
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "Current version: Updated for GDPR compliance",
                              "Previous revision: Added arbitration clause",
                              "Archive: Original terms (2018)",
                            ].map((item, i) => (
                              <li key={i} className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-green-300 mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-6">
                            <a
                              href="/legal/archive"
                              className="text-green-600 hover:text-green-700 font-medium flex items-center"
                            >
                              View Version History
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </a>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </main>
      </ReactLenis>

    </>
  );
}
