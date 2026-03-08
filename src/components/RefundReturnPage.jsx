"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence} from "framer-motion";
import dynamic from "next/dynamic";
import {
  ShieldCheck,
  Clock,
  XCircle,
  RefreshCcw,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Banknote} from "lucide-react";


export default function RefundReturnPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  // Use window scroll instead of target ref to avoid hydration mismatch
  
  // Parallax effects
      
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
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
        ease: "easeOut"}}};

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"}}};

  return (
    <>
      
        <main
          ref={containerRef}
          className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white relative overflow-hidden"
        >
          {/* Hero Section */}
          <section className="relative pb-10 flex items-center justify-center overflow-hidden">
            <motion.div
              
              className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
            />

            <div className="container pt-10 mx-auto px-6 relative z-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.3}}}}
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
                        ease: "easeOut"}}}}
                  className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight font-serif"
                >
                  <span className="block">Conscious</span>
                  <span className="relative inline-block">
                    <span className="relative z-10">Commerce</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className="absolute bottom-2 left-0 w-full h-4 bg-emerald-200/60 z-0 transform origin-left"
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
                        ease: "easeOut"}}}}
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 font-light"
                >
                  Transparent and ethical financial practices allowing us to
                  honor both our customers and our values.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="relative z-20 py-20">
            <div className="container mx-auto px-6 max-w-6xl">
              {/* Policy Section */}
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
                      
                    >
                      Return Policy
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent w-full my-8" />
                    <p className="text-amber-600 font-medium">01 — Terms</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }}}}
                      className="space-y-8"
                    >
                      <motion.div
                        variants={fadeIn}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                      >
                        <div className="flex items-start gap-4">
                          <XCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                              Our Current Stance
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                              At Saundrya Earth, we are deeply committed to the
                              conscious creation and ethical distribution of our
                              skincare rituals. As part of our sustainable
                              business model and to minimize environmental
                              impact through reduced shipping,{" "}
                              <strong className="text-gray-900">
                                we do not currently accept product returns
                              </strong>{" "}
                              for change of mind or preference.
                            </p>
                            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                              <div className="flex items-center gap-2 mb-2 text-amber-800 font-semibold">
                                <Clock size={18} />
                                <span>Important Notice</span>
                              </div>
                              <p className="text-amber-700 text-sm">
                                Please review your order carefully before
                                purchase. We cannot accommodate returns based on
                                scent preferences, texture expectations, or
                                desired results that vary by individual.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Cancellation Section */}
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
                      
                    >
                      Cancellations
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-full my-8" />
                    <p className="text-blue-600 font-medium">02 — Process</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }}}}
                      className="space-y-6"
                    >
                      <motion.div
                        variants={fadeIn}
                        className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100"
                      >
                        <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                          <CheckCircle className="text-blue-600" size={24} />
                          When Can Orders Be Cancelled?
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-medium text-blue-800 mb-3 text-sm uppercase tracking-wide">
                              Cancellable Statuses
                            </h4>
                            <ul className="space-y-3">
                              {["Pending", "Processing", "On-hold"].map(
                                (status) => (
                                  <li
                                    key={status}
                                    className="flex items-center gap-3 text-blue-700 bg-white/60 p-2 rounded-lg"
                                  >
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    {status}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-rose-800 mb-3 text-sm uppercase tracking-wide">
                              Non-Cancellable
                            </h4>
                            <ul className="space-y-3">
                              {[
                                "Shipped orders",
                                "Delivered orders",
                                "Already cancelled",
                              ].map((status) => (
                                <li
                                  key={status}
                                  className="flex items-center gap-3 text-rose-700 bg-white/60 p-2 rounded-lg"
                                >
                                  <div className="w-2 h-2 bg-rose-500 rounded-full" />
                                  {status}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                          variants={fadeIn}
                          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Customer Initiated
                          </h4>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="flex gap-2">
                              <span>•</span>Access dashboard
                            </li>
                            <li className="flex gap-2">
                              <span>•</span>Select "Cancel Order"
                            </li>
                            <li className="flex gap-2">
                              <span>•</span>Provide reason
                            </li>
                            <li className="flex gap-2">
                              <span>•</span>Automatic refund (Razorpay)
                            </li>
                          </ul>
                        </motion.div>

                        <motion.div
                          variants={fadeIn}
                          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h4 className="font-semibold text-gray-900 mb-4">
                            Admin Initiated
                          </h4>
                          <ul className="space-y-2 text-gray-600 text-sm">
                            <li className="flex gap-2">
                              <span>•</span>Inventory discrepancies
                            </li>
                            <li className="flex gap-2">
                              <span>•</span>Payment failures
                            </li>
                            <li className="flex gap-2">
                              <span>•</span>Customer request
                            </li>
                            <li className="flex gap-2">
                              <span>•</span>System errors
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Refunds Section */}
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
                      
                    >
                      Refund Process
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent w-full my-8" />
                    <p className="text-teal-600 font-medium">03 — Timeline</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }}}}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg text-gray-600 leading-relaxed"
                      >
                        All transactions are securely processed through{" "}
                        <strong>Razorpay</strong>, ensuring your financial data
                        remains protected. When a cancellation is approved, the
                        refund journey begins automatically.
                      </motion.p>

                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          {
                            step: "01",
                            title: "Request",
                            desc: "Cancellation initiated with valid reason",
                            color: "emerald",
                            icon: RefreshCcw},
                          {
                            step: "02",
                            title: "Processing",
                            desc: "Automatic Razorpay refund initiation",
                            color: "teal",
                            icon: CreditCard},
                          {
                            step: "03",
                            title: "Credit",
                            desc: "Amount reflects in 5-10 business days",
                            color: "cyan",
                            icon: Banknote},
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            variants={fadeIn}
                            className={`bg-${item.color}-50 p-6 rounded-2xl border border-${item.color}-100 text-center group hover:-translate-y-1 transition-transform duration-300`}
                          >
                            <div
                              className={`w-12 h-12 mx-auto bg-${item.color}-100 rounded-full flex items-center justify-center text-${item.color}-600 mb-4 group-hover:scale-110 transition-transform`}
                            >
                              <item.icon size={20} />
                            </div>
                            <h4
                              className={`text-${item.color}-900 font-semibold mb-2`}
                            >
                              {item.title}
                            </h4>
                            <p className={`text-${item.color}-700 text-sm`}>
                              {item.desc}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        variants={fadeIn}
                        className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Expected Timelines
                        </h4>
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span>Instant Refunds</span>
                            <span className="font-medium text-gray-900">
                              Immediate
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span>Bank Processing</span>
                            <span className="font-medium text-gray-900">
                              5-10 Business Days
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Status Tracking</span>
                            <span className="font-medium text-gray-900">
                              Order History / Razorpay
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Exceptions Section */}
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
                      
                    >
                      Exceptions
                    </motion.h2>
                    <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent w-full my-8" />
                    <p className="text-rose-600 font-medium">04 — Assurance</p>
                  </div>
                  <div className="md:w-2/3">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 }}}}
                      className="space-y-8"
                    >
                      <motion.p
                        variants={fadeIn}
                        className="text-lg text-gray-600"
                      >
                        While we maintain a strict policy for preference-based
                        returns, we stand behind our quality. In exceptional
                        cases, we address issues that fall outside our
                        standards.
                      </motion.p>
                      <div className="grid md:grid-cols-2 gap-6">
                        {[
                          {
                            title: "Damaged",
                            desc: "Shipping damage requires photo evidence within 48 hours.",
                            bg: "bg-rose-50",
                            border: "border-rose-100",
                            text: "text-rose-800"},
                          {
                            title: "Incorrect",
                            desc: "Wrong items must be reported within 24 hours with video.",
                            bg: "bg-amber-50",
                            border: "border-amber-100",
                            text: "text-amber-800"},
                          {
                            title: "Defects",
                            desc: "Manufacturing defects affecting safety/performance.",
                            bg: "bg-red-50",
                            border: "border-red-100",
                            text: "text-red-800"},
                          {
                            title: "Expired",
                            desc: "Products near/past expiration. Batch code required.",
                            bg: "bg-purple-50",
                            border: "border-purple-100",
                            text: "text-purple-800"},
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            variants={fadeIn}
                            className={`${item.bg} ${item.border} p-6 rounded-2xl border`}
                          >
                            <h4 className={`${item.text} font-semibold mb-2`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        variants={fadeIn}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4"
                      >
                        <AlertTriangle className="text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Documentation Required
                          </h4>
                          <p className="text-sm text-gray-600">
                            Clear photos/videos, order number, batch code, and a
                            description of the issue must be submitted within 48
                            hours of delivery.
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Environmental Commitment */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="mb-20"
              >
                <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/3">
                      <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                        Our Why
                      </h2>
                      <div className="w-20 h-1 bg-emerald-500 rounded-full mb-6" />
                      <p className="text-emerald-100">
                        Sustainability isn't just a buzzword—it's the reason we
                        say no to returns.
                      </p>
                    </div>
                    <div className="md:w-2/3 grid sm:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-medium mb-3 text-emerald-200">
                          Reducing Carbon
                        </h4>
                        <p className="text-emerald-50/80 text-sm leading-relaxed">
                          By eliminating reverse logistics, we significantly cut
                          transportation emissions, contributing to a cleaner
                          atmosphere.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-3 text-emerald-200">
                          Zero Waste
                        </h4>
                        <p className="text-emerald-50/80 text-sm leading-relaxed">
                          Returned beauty products often end up in landfills due
                          to hygiene regulations. We prevent this waste at the
                          source.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative background circle */}
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-800 rounded-full blur-3xl opacity-50" />
                </div>
              </motion.section>

              {/* Support Contact */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center pb-20"
              >
                <div className="inline-block p-8 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50">
                  <h3 className="text-xl font-serif text-gray-900 mb-2">
                    Need Assistance?
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Contact our conscious care team
                  </p>
                  <a
                    href="mailto:care@saundryaearth.com"
                    className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                  >
                    care@saundryaearth.com
                  </a>
                  <p className="text-xs text-gray-400 mt-2">
                    Mon-Sat, 10AM-6PM IST
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      
    </>
  );
}
