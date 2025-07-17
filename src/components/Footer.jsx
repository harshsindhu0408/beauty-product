"use client";
import React, { useEffect, useRef, useState } from "react";
import { Instagram, Youtube, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail("");
    }, 1500);
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.381-.297 1.199-.336 1.363-.051.225-.165.271-.381.165-1.521-.708-2.474-2.94-2.474-4.733 0-3.86 2.806-7.4 8.085-7.4 4.243 0 7.539 3.028 7.539 7.065 0 4.215-2.659 7.6-6.35 7.6-1.24 0-2.41-.646-2.81-1.419l-.762 2.906c-.275 1.067-1.018 2.407-1.518 3.22C9.597 23.718 10.779 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
        </svg>
      ),
      href: "#",
      label: "Pinterest",
    },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const exploreLinks = [
    { name: "About", href: "#" },
    { name: "Product", href: "#" },
    { name: "Delivery", href: "#" },
    { name: "Cart", href: "#" },
  ];

  const othersLinks = [
    { name: "FAQ", href: "#" },
    { name: "Support", href: "#" },
    { name: "Terms Of Use", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-white to-pink-50"
    >
      {/* Newsletter Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="relative py-20 px-4 md:px-20 z-20 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute z-50 inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-purple-100 opacity-40 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-pink-100 opacity-40 blur-3xl"></div>
        </div>

        <div className="max-w-7xl  mx-auto relative">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1,
                },
              },
            }}
            className="flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="md:w-1/2 space-y-6">
              <motion.h3
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-4xl md:text-5xl font-light text-gray-800 leading-tight font-serif"
              >
                <span className="relative inline-block">
                  <span className="relative z-10">Stay Connected</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute bottom-2 left-0 w-full h-3 bg-pink-200/60 z-0"
                    style={{ originX: 0 }}
                  />
                </span>
              </motion.h3>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-xl text-gray-600 max-w-lg"
              >
                Join our newsletter for exclusive updates, special offers, and
                insider content.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center gap-4 pt-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-pink-300 to-purple-400 shadow-sm"
                      style={{ zIndex: 3 - item }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  Join 10,000+ subscribers
                </span>
              </motion.div>
            </div>

            <div className="md:w-1/2 w-full">
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="bg-white p-8 rounded-2xl border border-pink-100 shadow-lg text-center relative overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-pink-100/30 blur-xl"></div>
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-600 shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                    </motion.div>
                    <h4 className="text-2xl font-medium text-gray-800 mb-3">
                      Thank you for subscribing!
                    </h4>
                    <p className="text-gray-600 mb-6">
                      We'll be in touch with our best content soon.
                    </p>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                      onClick={() => setIsSubscribed(false)}
                    >
                      Back to form
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-pink-300 to-purple-300 opacity-20 blur-lg"></div>
                  <form
                    onSubmit={handleSubmit}
                    className="relative bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col gap-6">
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your beautiful email address"
                            required
                            className="w-full px-6 py-5 rounded-lg border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100/50 outline-none transition-all duration-300 text-lg placeholder-gray-400"
                          />
                          <svg
                            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>

                        <motion.button
                          whileHover={{
                            y: -2,
                            boxShadow:
                              "0 10px 20px -5px rgba(236, 72, 153, 0.3)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading}
                          className="px-8 py-5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin h-6 w-6 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Subscribing...</span>
                            </>
                          ) : (
                            <>
                              <span>Join Now</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                              </svg>
                            </>
                          )}
                        </motion.button>
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-gray-500 text-sm mt-6"
                      >
                        We respect your privacy. Unsubscribe at any time.
                      </motion.p>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Content */}
      <div className="py-16 md:py-20 lg:py-24 px-4 md:px-20 relative z-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gray-300"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gray-400"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gray-200"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between flex-wrap gap-12 lg:gap-16">
            {/* Left Section - Title and Social */}
            <div className="">
              <div className="mb-8">
                <h2
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif mb-2 transition-all duration-1000 ease-out ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  More About Us?
                </h2>
                <h3
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif transition-all duration-1000 ease-out delay-200 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  Follow Our media
                </h3>
              </div>

              {/* Social Media Links */}
              <div
                className={`flex items-center space-x-6 transition-all duration-1000 ease-out delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                    aria-label={social.label}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Section - Navigation Links */}
            <div className="">
              <div className="grid grid-cols-2 gap-8 sm:gap-12">
                {/* Explore Column */}
                <div
                  className={`transition-all duration-1000 ease-out delay-600 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <h4 className="text-lg font-medium text-gray-500 mb-6 uppercase tracking-wide">
                    Explore
                  </h4>
                  <ul className="space-y-4">
                    {exploreLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-gray-800 text-lg hover:text-gray-600 transition-colors duration-300 font-medium"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Others Column */}
                <div
                  className={`transition-all duration-1000 ease-out delay-800 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <h4 className="text-lg font-medium text-gray-500 mb-6 uppercase tracking-wide">
                    Others
                  </h4>
                  <ul className="space-y-4">
                    {othersLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="text-gray-800 text-lg hover:text-gray-600 transition-colors duration-300 font-medium"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <p className="text-white text-[24vw] -z-50 mt-50 -translate-x-5 sm:-translate-x-20 playfair-display leading-[50%]">
          Saundrya
        </p>
      </div>
    </footer>
  );
};

export default Footer;
