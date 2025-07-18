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
import Link from "next/link";

export default function NotFoundPage() {
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

  // Animation variants
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
          </div>

          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
                <motion.div
                  variants={fadeIn}
                  className="text-9xl md:text-[12rem] font-bold text-gray-900 mb-8 leading-none font-serif"
                >
                  404
                </motion.div>

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
                  className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="relative inline-block">
                    <span className="relative z-10">Page Not Found</span>
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
                  The page you're looking for doesn't exist or has been moved.
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  transition={{ delay: 1 }}
                  className="flex justify-center"
                >
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      Return Home
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="relative z-20 py-20">
            <div className="container mx-auto px-6 max-w-5xl">
              {/* Suggestions Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-32"
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      You Might Like
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent w-full my-8" />
                    <p className="text-pink-600 font-medium">Explore More</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.div
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {[
                          {
                            title: "Our Products",
                            description:
                              "Discover our conscious beauty collection",
                            link: "/products",
                            color: "bg-pink-100",
                          },
                          {
                            title: "Our Story",
                            description:
                              "Learn about our philosophy and mission",
                            link: "/about",
                            color: "bg-purple-100",
                          },
                          {
                            title: "Testimonials",
                            description: "See our customer reviews",
                            link: "/testimonials",
                            color: "bg-blue-100",
                          },
                          {
                            title: "FAQ",
                            description: "Read frequently asked questions",
                            link: "/faq",
                            color: "bg-green-100",
                          },
                        ].map((item, index) => (
                          <Link key={index} href={item.link}>
                            <motion.div
                              whileHover={{ y: -5 }}
                              className={`p-6 rounded-xl ${item.color} border border-gray-100 shadow-sm cursor-pointer h-full`}
                            >
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {item.title}
                              </h3>
                              <p className="text-gray-600">
                                {item.description}
                              </p>
                              <div className="mt-4 flex items-center text-pink-500">
                                <span className="mr-2">Explore</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Contact Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
              >
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="md:w-1/3 sticky top-32">
                    <motion.h2
                      className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                      style={{ y: y2 }}
                    >
                      Need Help?
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full my-8" />
                    <p className="text-purple-600 font-medium">Contact Us</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3,
                          },
                        },
                      }}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg md:text-xl text-gray-600 leading-relaxed"
                      >
                        If you can't find what you're looking for or need
                        assistance, our team is here to help.
                      </motion.p>

                      <motion.div
                        variants={fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                      >
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Email Us
                            </h3>
                            <a
                              href="mailto:hello@saundryaearth.com"
                              className="text-pink-500 hover:underline"
                            >
                              hello@saundryaearth.com
                            </a>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Live Chat
                            </h3>
                            <p className="text-gray-600">
                              Available Monday-Friday, 9am-5pm EST
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              Follow Us
                            </h3>
                            <div className="flex space-x-4">
                              {["Instagram", "Twitter", "Facebook"].map(
                                (social, index) => (
                                  <a
                                    key={index}
                                    href="#"
                                    className="text-gray-600 hover:text-pink-500 transition-colors"
                                  >
                                    {social}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Added Support Center Button */}
                      <motion.div
                        variants={fadeIn}
                        className="text-center pt-4"
                      >
                        <Link href="/support">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                          >
                            Visit Our Support Center
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="inline ml-2"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </motion.button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
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
