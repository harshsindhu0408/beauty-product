"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import StepProgressIndicator from "@/components/StepProgressIndicator";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const ForgetPasswordClient = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to send OTP");
        return;
      }

      toast.success(data?.message || "OTP sent successfully!");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Step indicator */}
      <StepProgressIndicator currentStep={1} />

      {/* Back link */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
        className="mb-6"
      >
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={1}
        className="mb-8"
      >
        <h1 className="text-[1.75rem] sm:text-3xl font-bold text-stone-800 tracking-tight">
          Forgot Password
        </h1>
        <p className="text-stone-500 mt-2 text-sm leading-relaxed">
          Enter your registered email address and we&apos;ll send you a
          verification code to reset your password.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSendOtp} className="space-y-5">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
          className="space-y-1.5"
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-600 tracking-wide"
          >
            Email Address
          </label>
          <div
            className={`relative group transition-all duration-300 rounded-xl ${
              focused
                ? "ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-100/40"
                : "ring-1 ring-stone-200 hover:ring-stone-300"
            }`}
          >
            <Mail
              size={18}
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                focused ? "text-emerald-500" : "text-stone-400"
              }`}
            />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required
              autoComplete="email"
              className="w-full pl-11 pr-4 py-3.5 bg-stone-50/80 text-stone-800 rounded-xl border-0 focus:outline-none focus:bg-white transition-all duration-200 text-sm placeholder:text-stone-400"
            />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={3}
          className="pt-1"
        >
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={
              !isLoading
                ? {
                    y: -1,
                    boxShadow: "0 12px 30px -6px rgba(16,185,129,0.35)",
                  }
                : {}
            }
            whileTap={!isLoading ? { scale: 0.985 } : {}}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Sending OTP…</span>
              </>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={4}
        className="mt-8 text-center"
      >
        <p className="text-sm text-stone-500">
          Remember your password?
          <Link
            href="/auth"
            className="ml-1.5 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default ForgetPasswordClient;
