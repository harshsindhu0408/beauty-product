"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const ForgetPasswordClient = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Pre-fill email from URL params if available
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [searchParams]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to send OTP");
        return;
      }

      toast.success(data?.message || "OTP sent successfully!");

      // Redirect to verify OTP page with email as parameter
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white font-sans overflow-hidden p-4">
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

      <div className="flex flex-col items-center w-full max-w-md">
        {/* Back Button */}
        <div className="self-start mb-6">
          <Link href="/auth">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex cursor-pointer items-center gap-2 text-emerald-600 hover:text-emerald-500 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back to Login
            </motion.button>
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
        >
          Saundrya Earth
        </motion.h1>

        <motion.div
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-500">
              Enter your email address and we&apos;ll send you an OTP to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-12 py-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending OTP...
                </div>
              ) : (
               <div className="cursor-pointer">Send OTP</div>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/auth">
              <span className="font-medium cusror-pointer text-emerald-600 hover:text-emerald-500 transition-colors cursor-pointer">
                Back to Login
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgetPasswordClient;
