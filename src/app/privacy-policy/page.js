"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import Footer from "@/components/Footer";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Navigation from "@/components/Navigation";

export default function PrivacyPolicy() {
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
        ease: "easeOut",
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

  // Policy sections data
  const policySections = [
    {
      id: 1,
      title: "Information We Collect",
      content: [
        "At Saundrya Earth, we collect only what's essential to serve you better. This includes:",
        "- Personal details provided during account creation (name, email, contact information)",
        "- Skin profile data you voluntarily share for product recommendations",
        "- Purchase history and preferences to personalize your experience",
        "- Device and usage data for website optimization (collected through cookies)",
      ],
    },
    {
      id: 2,
      title: "How We Use Your Data",
      content: [
        "Your information enables us to:",
        "- Craft personalized skincare recommendations aligned with your unique biology",
        "- Improve our formulations through aggregated, anonymized data analysis",
        "- Process transactions with our ethical banking partners",
        "- Communicate important product updates and regenerative initiatives",
        "- Enhance your digital experience with mindful interface design",
      ],
    },
    {
      id: 3,
      title: "Data Protection",
      content: [
        "We implement rigorous measures to safeguard your information:",
        "- End-to-end encryption for all sensitive data transmissions",
        "- Regular audits by independent cybersecurity experts",
        "- Strict access controls limited to essential personnel",
        "- Anonymization of data used for research purposes",
        "- Secure deletion protocols when data is no longer required",
      ],
    },
    {
      id: 4,
      title: "Third-Party Sharing",
      content: [
        "We maintain radical transparency about data sharing:",
        "- Partner only with vetted, ethical service providers",
        "- Never sell or rent personal information to advertisers",
        "- Share anonymized data only for scientific research with institutional review boards",
        "- Disclose all third-party processors in our annual transparency report",
      ],
    },
    {
      id: 5,
      title: "Your Rights",
      content: [
        "You maintain full control over your information:",
        "- Access and download your complete data profile anytime",
        "- Request correction of inaccurate information",
        "- Withdraw consent for specific processing activities",
        "- Request deletion of personal data (with exceptions for legal requirements)",
        "- Opt-out of marketing communications with one click",
      ],
    },
    {
      id: 6,
      title: "Policy Updates",
      content: [
        "We evolve this policy with the same care as our formulations:",
        "- Notify users of material changes 30 days in advance",
        "- Archive previous versions for historical reference",
        "- Provide summary of changes in plain language",
        "- Offer opt-in consent for new data uses when required",
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
          {/* Floating gradient blobs */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute w-[80vw] h-[60vh] bg-pink-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 top-1/4 left-1/4"
              animate={{
                x: ["0%", "5%", "0%"],
                y: ["0%", "10%", "0%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-[80vw] h-[60vh] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 bottom-1/4 right-1/4"
              animate={{
                x: ["0%", "-8%", "0%"],
                y: ["0%", "-12%", "0%"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute w-[60vw] h-[50vh] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 top-1/3 right-1/3"
              animate={{
                x: ["0%", "15%", "0%"],
                y: ["0%", "-5%", "0%"],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 4,
              }}
            />
          </div>

          {/* Hero Section */}
          <section className="relative mt-10 pb-10 flex items-center justify-center overflow-hidden">
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
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="block">Privacy with</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Purpose</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 w-full h-4 bg-pink-200/60 z-0 transform origin-left"
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
                  Our commitment to data integrity mirrors our formulation
                  philosophy — transparent, intentional, and designed for
                  wellbeing.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="relative z-20">
            <div className="container mx-auto px-6 max-w-6xl">
              {/* Introduction */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-20"
              >
                <motion.div
                  variants={fadeIn}
                  className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-1/3">
                      <motion.h2
                        className="text-3xl font-bold text-gray-900 mb-6 font-serif"
                        style={{ y: y2 }}
                      >
                        Our Privacy Promise
                      </motion.h2>
                      <div className="h-px bg-gradient-to-r from-pink-300 to-purple-300 w-full my-6" />
                      <p className="text-pink-600 font-medium">
                        Last Updated:{" "}
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
                        At Saundrya Earth, we approach data privacy with the
                        same intentionality as our skincare formulations. This
                        policy outlines how we collect, use, and protect your
                        information in alignment with our core values of
                        transparency and respect for your natural integrity.
                      </motion.p>
                      <motion.div
                        variants={fadeIn}
                        className="bg-pink-50 rounded-xl p-6 border border-pink-100"
                      >
                        <h3 className="text-xl font-semibold text-pink-800 mb-3">
                          Quick Reference
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>
                              We collect minimal data necessary for your
                              experience
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Never sell your personal information</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Enterprise-grade security protections</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-500 mr-2">•</span>
                            <span>Clear controls for your preferences</span>
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.section>

              {/* Policy Sections */}
              {policySections.map((section, index) => (
                <motion.section
                  key={section.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={sectionVariants}
                  className={`mb-16 ${index % 2 === 0 ? "pl-0" : "pr-0"}`}
                >
                  <motion.div variants={fadeIn} className="relative">
                    {/* Decorative element */}
                    <div
                      className={`absolute -top-6 ${
                        index % 2 === 0 ? "-left-6" : "-right-6"
                      } w-24 h-24 rounded-full opacity-10 ${
                        index % 3 === 0
                          ? "bg-pink-300"
                          : index % 3 === 1
                          ? "bg-purple-300"
                          : "bg-blue-300"
                      } blur-xl`}
                    ></div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
                      {/* Section header with animated underline */}
                      <motion.div className="mb-8">
                        <motion.h2
                          className="text-3xl font-bold text-gray-900 font-serif inline-block"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          {section.title}
                          <motion.div
                            className="h-1 bg-gradient-to-r from-pink-300 to-purple-300 mt-2"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            style={{ originX: 0 }}
                          />
                        </motion.h2>
                      </motion.div>

                      {/* Section content */}
                      <div className="space-y-4">
                        {section.content.map((paragraph, pIndex) => (
                          <motion.p
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
                            className="text-gray-600 leading-relaxed"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </div>

                      {/* Section decorative icon */}
                      <motion.div
                        className="absolute bottom-4 right-4 text-gray-100"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 0.1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          {index % 3 === 0 ? (
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          ) : index % 3 === 1 ? (
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          ) : (
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                          )}
                        </svg>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.section>
              ))}

              {/* Contact Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mt-32"
              >
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-10 border border-pink-100 shadow-lg overflow-hidden">
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
                          Questions About Your Data?
                        </motion.h2>
                        <motion.p
                          className="text-lg text-gray-600 mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          viewport={{ once: true }}
                        >
                          Our Data Stewardship team is available to address any
                          concerns or requests regarding your personal
                          information.
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          viewport={{ once: true }}
                        >
                          <a
                            href="mailto:privacy@saundryaearth.com"
                            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                          >
                            Contact Our Privacy Team
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
                            Your Privacy Controls
                          </h3>
                          <ul className="space-y-3">
                            {[
                              "Update account information",
                              "Download your data",
                              "Adjust communication preferences",
                              "Submit deletion request",
                            ].map((item, i) => (
                              <li key={i} className="flex items-center">
                                <svg
                                  className="w-5 h-5 text-pink-500 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-pink-200 opacity-10 blur-xl"></div>
                </div>
              </motion.section>
            </div>
          </div>
        </main>
      </ReactLenis>

      <Footer />
    </>
  );
}
