"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRouter } from "next/navigation";

export default function VerificationResult({ status }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
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
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/auth");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status, router]);

  const getContent = () => {
    switch (status) {
      case "success":
        return {
          icon: "✨",
          title: "Email Verified Successfully!",
          message: "Your journey with Saundrya Earth begins now. Welcome to conscious beauty.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          gradient: "from-green-100 to-emerald-100",
          accentColor: "text-green-500",
        };
      case "failed":
        return {
          icon: "❌",
          title: "Verification Failed",
          message: "The verification link couldn't be processed. This might be due to an expired link or technical issue.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          gradient: "from-red-100 to-pink-100",
          accentColor: "text-red-500",
        };
      case "invalid":
        return {
          icon: "⚠️",
          title: "Invalid Verification Link",
          message: "The verification link appears to be invalid or malformed. Please check and try again.",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          gradient: "from-orange-100 to-amber-100",
          accentColor: "text-orange-500",
        };
      default:
        return {
          icon: "😔",
          title: "Something Went Wrong",
          message: "We encountered an unexpected error. Please try again later or contact our support team.",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          gradient: "from-gray-100 to-slate-100",
          accentColor: "text-gray-500",
        };
    }
  };

  const content = getContent();

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

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
              className={`absolute w-[80vw] h-[60vh] ${content.gradient} rounded-full mix-blend-multiply filter blur-[120px] opacity-30 top-1/4 left-1/4`}
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
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerChildren}
                className="text-center max-w-4xl mx-auto"
              >
                {/* Animated Icon */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="mb-8"
                >
                  <div className="text-8xl mb-6">{content.icon}</div>
                </motion.div>

                {/* Title */}
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
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="block">{content.title.split(' ')[0]}</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">
                      {content.title.split(' ').slice(1).join(' ')}
                    </span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className={`absolute bottom-0 left-0 w-full h-4 ${content.bgColor} z-0 transform origin-left`}
                      style={{ bottom: "15%" }}
                    />
                  </span>
                </motion.h1>

                {/* Message */}
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
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
                >
                  {content.message}
                </motion.p>

                {/* Countdown and Progress */}
                {status === "success" && (
                  <motion.div
                    variants={fadeIn}
                    transition={{ delay: 1 }}
                    className="mb-12"
                  >
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="text-lg text-gray-500">
                        Redirecting in
                      </div>
                      <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-lg font-medium text-gray-700 shadow-sm">
                        {countdown}s
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "linear" }}
                          className="bg-green-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  variants={fadeIn}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  {status === "success" ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/auth")}
                        className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Explore Saundrya Earth
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/auth")}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Sign In to Your Account
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/auth")}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Go to Login
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.reload()}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        Try Again
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/support")}
                        className="px-8 py-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Contact Support
                      </motion.button>
                    </>
                  )}
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  variants={fadeIn}
                  transition={{ delay: 1.5 }}
                  className="mt-16"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-serif">
                      What's Next?
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      {status === "success" ? (
                        <>
                          <p className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Access your personalized beauty dashboard</span>
                          </p>
                          <p className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Explore our conscious beauty collection</span>
                          </p>
                          <p className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Join our community of mindful consumers</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Check your email for a new verification link</span>
                          </p>
                          <p className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Ensure the link hasn't expired</span>
                          </p>
                          <p className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Contact us if issues persist</span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              variants={fadeIn}
              transition={{ delay: 2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer bg-white/80 backdrop-blur-sm"
              >
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
                  className="animate-bounce text-gray-600"
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </section>
        </main>
      </ReactLenis>
    </>
  );
}