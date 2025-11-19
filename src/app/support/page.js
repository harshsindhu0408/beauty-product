"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useRef } from "react";
import {
  Mail,
  MessageSquare,
  Phone,
  Zap,
  ChevronRight,
  Loader2,
  Check,
  Sparkles,
  Wrench,
  CircleDollarSign,
} from "lucide-react";
import { clientFetch } from "@/services/clientfetch";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    subject: "General Support Inquiry", // Add subject field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        subject: formData.subject,
        message: `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
      };

      const response = await clientFetch(`support`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.success) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
          subject: "General Support Inquiry",
        });

        // Reset after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(response.message || "Failed to submit support request");
      }
    } catch (error) {
      console.error("Support request error:", error);
      setIsSubmitting(false);
      // You might want to add error state handling here
    }
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 3D Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 5]);

  const supportTabs = [
    {
      id: "general",
      label: "General Support",
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8 text-indigo-500" />,
      title: "Email Us",
      description: "Typically replies within 2 hours",
      action: "support@saundrya.com",
      link: "mailto:support@saundrya.com",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-pink-500" />,
      title: "Live Chat",
      description: "Available 24/7 for instant help",
      action: "Start Chat",
      link: "/support",
    },
    {
      icon: <Phone className="w-8 h-8 text-emerald-500" />,
      title: "Call Support",
      description: "Mon-Fri, 9AM-6PM EST",
      action: "+1 (555) 123-4567",
      link: "tel:+917403500777",
    },
  ];

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      >
        {/* Floating Particles Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-indigo-100 to-pink-100"
              style={{
                width: Math.random() * 10 + 5 + "px",
                height: Math.random() * 10 + 5 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.4,
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 100],
                x: [0, (Math.random() - 0.5) * 50],
                transition: {
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative pt-26 px-6">
          <motion.div
            style={{ y: y1, rotateX }}
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
                className="inline-flex items-center justify-center bg-indigo-100/50 rounded-full px-6 py-3 mb-8 border border-indigo-200 shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="text-indigo-700 font-medium">
                  Premium Support
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight font-serif"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                We&apos;re Here To{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                  Help You
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Our dedicated support team is ready to assist you with any
                questions or issues you may have.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer"
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
                >
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Support Tabs */}
        <section className="relative pb-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row border-b border-gray-200">
                {supportTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-6 px-8 flex items-center justify-center gap-3 transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 ${
                        activeTab === tab.id ? "scale-110" : ""
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span className="text-lg font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-8 md:p-12">
                {activeTab === "general" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-2 gap-12"
                  >
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">
                        General Support
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Have questions about our products, services, or
                        policies? Our general support team is here to help with
                        any non-technical inquiries.
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-indigo-100 p-2 rounded-lg mt-1">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Common Questions
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Browse our FAQ for quick answers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-indigo-100 p-2 rounded-lg mt-1">
                            <Mail className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Email Response
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Typically within 2 hours
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center"
                        >
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-emerald-600" />
                          </div>
                          <h4 className="text-xl font-medium text-gray-900 mb-2">
                            Message Sent!
                          </h4>
                          <p className="text-gray-600 mb-6">
                            We&apos;ll get back to you shortly.
                          </p>
                          <button
                            onClick={() => setIsSubmitted(false)}
                            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                          >
                            Send Another
                          </button>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="subject"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Subject
                            </label>
                            <input
                              type="text"
                              id="subject"
                              value={formData.subject}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  subject: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              required
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="message"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Your Message
                            </label>
                            <textarea
                              id="message"
                              rows="4"
                              value={formData.message}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  message: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              required
                            ></textarea>
                          </div>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                              isSubmitting
                                ? "bg-indigo-400"
                                : "bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                            }`}
                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message
                                <ChevronRight className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Contact Methods */}
            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-sm">
                      {method.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-1">
                      {method.description}
                    </p>
                    <motion.a
                      href={method.link}
                      className="inline-flex items-center gap-2 text-indigo-600 font-medium group"
                      whileHover={{ x: 5 }}
                    >
                      {method.action}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.a>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl p-1 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl p-12 text-center relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-indigo-100/20 blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-pink-100/20 blur-3xl"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif">
                    Still Need Help?
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    Our customer success team is available 24/7 to ensure you
                    get the best experience with our products.
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
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-5 h-5" />
                      Premium Support
                    </motion.a>
                    <motion.a
                      href="/live-chat"
                      className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Instant Chat
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default SupportPage;
