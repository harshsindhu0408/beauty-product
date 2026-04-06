"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import StepProgressIndicator from "@/components/StepProgressIndicator";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

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

/* ─── Mask email helper ─── */
const maskEmail = (email) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(user.length - 2, 2))}@${domain}`;
};

/* ─── Single OTP digit input ─── */
const OtpDigitInput = React.forwardRef(
  ({ value, onChange, onKeyDown, onPaste, index }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <motion.input
        ref={ref}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={(e) => {
          setFocused(true);
          e.target.select();
        }}
        onBlur={() => setFocused(false)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.05 }}
        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border-2 bg-stone-50/80 text-stone-800 transition-all duration-200 focus:outline-none ${
          focused
            ? "border-emerald-500 bg-white shadow-lg shadow-emerald-100/50 scale-105"
            : value
              ? "border-emerald-300 bg-emerald-50/50"
              : "border-stone-200 hover:border-stone-300"
        }`}
        aria-label={`Digit ${index + 1}`}
      />
    );
  },
);
OtpDigitInput.displayName = "OtpDigitInput";

/* ─── Main Component ─── */
const VerifyOtpPageClient = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(decodeURIComponent(emailFromParams));
    } else {
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  /* Countdown timer */
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /* Focus first input on mount */
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = useCallback(
    (index, e) => {
      const val = e.target.value;
      if (val && isNaN(val)) return;

      const newOtp = [...otp];
      newOtp[index] = val.slice(-1);
      setOtp(newOtp);

      // Auto-focus next
      if (val && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit if all filled
      if (val && index === OTP_LENGTH - 1) {
        const fullOtp = newOtp.join("");
        if (fullOtp.length === OTP_LENGTH) {
          submitOtp(fullOtp);
        }
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace") {
        if (otp[index] === "" && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    // Focus last filled or next empty
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if full
    if (pasted.length === OTP_LENGTH) {
      setTimeout(() => submitOtp(pasted), 200);
    }
  }, []);

  const submitOtp = async (otpString) => {
    if (otpString.length !== OTP_LENGTH) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Invalid OTP");
        // Shake and clear
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      toast.success(data?.message || "OTP verified successfully!");
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&token=${data?.data?.resetToken}`,
      );
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    submitOtp(otp.join(""));
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch(`${baseUrl}auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to resend OTP");
        return;
      }

      toast.success(data?.message || "OTP resent successfully!");
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AuthLayout>
      {/* Step indicator */}
      <StepProgressIndicator currentStep={2} />

      {/* Back link */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
        className="mb-6"
      >
        <Link
          href={`/forgot-password?email=${encodeURIComponent(email)}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
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
          Verify OTP
        </h1>
        <p className="text-stone-500 mt-2 text-sm leading-relaxed">
          Enter the 6-digit verification code sent to your email.
        </p>

        {/* Masked email badge */}
        {email && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2"
          >
            <Mail size={14} className="text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">
              Code sent to {maskEmail(email)}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* OTP Form */}
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        {/* OTP boxes */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
          className="flex justify-center gap-2.5 sm:gap-3"
        >
          {otp.map((digit, index) => (
            <OtpDigitInput
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              index={index}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
            />
          ))}
        </motion.div>

        {/* Resend section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={3}
          className="text-center"
        >
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Resend verification code
            </button>
          ) : (
            <p className="text-sm text-stone-400">
              Resend code in{" "}
              <span className="font-semibold text-stone-600 tabular-nums">
                {formatTime(countdown)}
              </span>
            </p>
          )}
        </motion.div>

        {/* Verify button */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={4}
        >
          <motion.button
            type="submit"
            disabled={isLoading || otp.join("").length < OTP_LENGTH}
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
                <span>Verifying…</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight size={17} />
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
        custom={5}
        className="mt-8 text-center"
      >
        <p className="text-sm text-stone-500">
          Need help?
          <Link
            href="/auth"
            className="ml-1.5 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default VerifyOtpPageClient;
