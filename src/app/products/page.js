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
import { products } from "@/utils/mock";
import Navigation from "@/components/Navigation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
    const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Filter products based on active filter
  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((product) => product.category === activeFilter);

  // Featured products
  const featuredProducts = products.filter((product) => product.featured);

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
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
          <section className="relative mt-10 flex items-center justify-center overflow-hidden">
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
                  <span className="block">Conscious</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Beauty</span>
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
                  Formulated with intention, designed for impact
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Featured Products */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-20"
          >
            <div className="container mx-auto px-6">
              <motion.div
                variants={fadeIn}
                className="flex justify-between items-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">
                  Our Essentials
                </h2>
                <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1 mx-8" />
                <p className="text-pink-600 font-medium">Featured Collection</p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {featuredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
                  >
                    <div className="aspect-square w-full relative overflow-hidden">
                      <motion.img
                        src={product.imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <motion.button
                          onClick={() =>
                            toast.success(`Cart launching soon!!!!!`)
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white text-pink-600 px-6 py-2 rounded-full font-medium"
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm capitalize">
                            {product.category}
                          </p>
                        </div>
                        <p className="text-gray-900 font-bold">
                          ${product.price}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-3">
                        {product.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* All Products */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-20 bg-gradient-to-b from-white to-gray-50"
          >
            <div className="container mx-auto px-6">
              <motion.div
                variants={fadeIn}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-6 md:mb-0">
                  Complete Collection
                </h2>

                <div className="flex space-x-2 bg-gray-100 p-1 rounded-full">
                  {["all", "skincare", "makeup"].map((filter) => (
                    <motion.button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 text-sm font-medium rounded-full capitalize ${
                        activeFilter === filter
                          ? "bg-white text-pink-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Crucial change here: Using AnimatePresence around the filtered products */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter} // Key change: Important for AnimatePresence to detect changes
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit="exit" // Add an exit animation
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {filteredProducts?.length > 0 ? (
                    filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group"
                      >
                        <div className="aspect-square w-full relative overflow-hidden">
                          <motion.img
                            src={product.imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <motion.button
                              onClick={() =>
                                toast.success(`Quick add launching soon!!!!!`)
                              }
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white text-pink-600 px-4 py-1.5 rounded-full font-medium text-sm"
                            >
                              Quick Add
                            </motion.button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2 capitalize">
                            {product.category}
                          </p>
                          <p className="text-gray-900 font-bold">
                            ${product.price}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="col-span-full text-center py-16"
                    >
                      <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        Coming Soon!
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        We&apos;re currently working on new {activeFilter} products
                        that align with our values. Check back soon or sign up
                        for updates.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 bg-pink-600 text-white px-6 py-2 rounded-full font-medium"
                      >
                        Notify Me
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-20"
          >
            <div className="container mx-auto px-6 max-w-5xl">
              <motion.div variants={fadeIn} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                  Our Formulation Promise
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Every ingredient serves a purpose, every product tells a story
                  of conscious creation.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ),
                    title: "Clean Science",
                    description:
                      "We combine cutting-edge dermatology with time-tested botanicals for formulas that deliver visible results.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    ),
                    title: "Ethical Sourcing",
                    description:
                      "Our ingredients are sustainably harvested through fair-trade partnerships with farming communities.",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ),
                    title: "Zero Compromise",
                    description:
                      "No synthetic fragrances, parabens, sulfates, or other questionable ingredients—ever.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
                  >
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mx-auto mb-6">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="py-32 bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -left-20 -top-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl"></div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl"></div>
            </div>

            <div className="container mx-auto px-6 text-center relative z-10">
              <motion.div
                variants={staggerContainer}
                className="max-w-2xl mx-auto"
              >
                <motion.div variants={itemVariants} className="mb-8">
                  <motion.span
                    className="text-pink-600 font-semibold tracking-widest text-sm uppercase"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Luxurious Self-Care
                  </motion.span>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 font-serif leading-tight"
                >
                  Elevate Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Skincare Ritual
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                  Discover the art of conscious beauty with our thoughtfully
                  curated collection, crafted for those who seek both luxury and
                  sustainability.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <motion.button
                  onClick={() => router.push("/products")}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full font-medium text-lg hover:shadow-lg"
                  >
                    Explore Collection
                  </motion.button>

                  <motion.button
                  onClick={() => router.push("/about")}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "#f8fafc",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-full font-medium text-lg bg-white bg-opacity-50 hover:bg-opacity-100"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        </main>
      </ReactLenis>

      <Footer />
    </>
  );
}
