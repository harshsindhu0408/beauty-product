"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const VerifyOtpPageClient = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(decodeURIComponent(emailFromParams));
    } else {
      // Redirect back if no email provided
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpString,
        }),
      });

      const data = await res.json();
      console.log("this is the data we have ---->", data);

      if (!res.ok) {
        toast.error(data?.message || "Invalid OTP");
        return;
      }

      toast.success(data?.message || "OTP verified successfully!");

      // Redirect to reset password page
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&token=${
          data?.data?.resetToken
        }`
      );
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
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
        toast.error(data?.message || "Failed to resend OTP");
        return;
      }

      toast.success(data?.message || "OTP resent successfully!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP");
    }
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
          <Link href="/forgot-password">
            <motion.button
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex cursor-pointer items-center gap-2 text-emerald-600 hover:text-emerald-500 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify OTP
            </h1>
            <p className="text-gray-500 mb-4">
              Enter the 6-digit OTP sent to your email
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
              <Mail size={16} />
              {email}
            </div>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-12 text-center text-lg font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                />
              ))}
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
                  Verifying...
                </div>
              ) : (
                <div className="cursor-pointer">Verify OTP</div>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the OTP?{" "}
              <button
                onClick={handleResendOtp}
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors cursor-pointer"
              >
                Resend OTP
              </button>
            </p>

            <Link href="/auth">
              <span className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors cursor-pointer">
                Back to Login
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtpPageClient;
