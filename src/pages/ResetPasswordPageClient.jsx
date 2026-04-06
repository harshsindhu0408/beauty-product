"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  CheckCircle,
  Loader2,
  ArrowRight,
  PartyPopper,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import StepProgressIndicator from "@/components/StepProgressIndicator";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";

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

/* ─── Password Input ─── */
const PasswordInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  onToggle,
  autoComplete,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-stone-600 tracking-wide"
      >
        {label}
      </label>
      <div
        className={`relative group transition-all duration-300 rounded-xl ${
          focused
            ? "ring-2 ring-emerald-400/60 shadow-lg shadow-emerald-100/40"
            : "ring-1 ring-stone-200 hover:ring-stone-300"
        }`}
      >
        <Lock
          size={18}
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            focused ? "text-emerald-500" : "text-stone-400"
          }`}
        />
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          autoComplete={autoComplete}
          className="w-full pl-11 pr-12 py-3.5 bg-stone-50/80 text-stone-800 rounded-xl border-0 focus:outline-none focus:bg-white transition-all duration-200 text-sm placeholder:text-stone-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

/* ─── Success Screen ─── */
const SuccessScreen = () => {
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center py-8"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 mb-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: 0.5,
            }}
          >
            <CheckCircle
              size={40}
              className="text-emerald-600"
              strokeWidth={2}
            />
          </motion.div>
        </motion.div>

        {/* Party popper accent */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <PartyPopper size={18} className="text-amber-500" />
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            All Done
          </span>
          <PartyPopper
            size={18}
            className="text-amber-500"
            style={{ transform: "scaleX(-1)" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3"
        >
          Password Reset Successful
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-stone-500 text-sm leading-relaxed max-w-xs mx-auto mb-8"
        >
          Your password has been updated successfully. You can now sign in with
          your new password.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/auth">
            <motion.button
              whileHover={{
                y: -1,
                boxShadow: "0 12px 30px -6px rgba(16,185,129,0.35)",
              }}
              whileTap={{ scale: 0.985 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-sm"
            >
              <span>Back to Login</span>
              <ArrowRight size={17} />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
};

/* ─── Main Component ─── */
const ResetPasswordPageClient = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    const tokenFromParams = searchParams.get("token");

    if (emailFromParams && tokenFromParams) {
      setEmail(decodeURIComponent(emailFromParams));
      setResetToken(tokenFromParams);
    } else {
      toast.error("Invalid reset link");
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordsMatch = useMemo(() => {
    return (
      formData.confirmPassword.length > 0 &&
      formData.newPassword === formData.confirmPassword
    );
  }, [formData.newPassword, formData.confirmPassword]);

  const passwordsMismatch = useMemo(() => {
    return (
      formData.confirmPassword.length > 0 &&
      formData.newPassword !== formData.confirmPassword
    );
  }, [formData.newPassword, formData.confirmPassword]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}auth/set-new-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
          resetToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to reset password");
        return;
      }

      toast.success(data?.message || "Password reset successfully!");
      setIsSuccess(true);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* Show success screen */
  if (isSuccess) {
    return <SuccessScreen />;
  }

  return (
    <AuthLayout>
      {/* Step indicator */}
      <StepProgressIndicator currentStep={3} />

      {/* Back link */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
        className="mb-6"
      >
        <Link
          href={`/verify-otp?email=${encodeURIComponent(email)}`}
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
          Reset Password
        </h1>
        <p className="text-stone-500 mt-2 text-sm leading-relaxed">
          Create a new secure password for your account.
        </p>

        {/* Email badge */}
        {email && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2"
          >
            <Mail size={14} className="text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">
              {email}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Form */}
      <form onSubmit={handleResetPassword} className="space-y-5">
        {/* New Password */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
        >
          <PasswordInput
            name="newPassword"
            label="New Password"
            placeholder="Create a strong password"
            value={formData.newPassword}
            onChange={handleInputChange}
            showPassword={showNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator password={formData.newPassword} />
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={3}
        >
          <PasswordInput
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            autoComplete="new-password"
          />

          {/* Match indicator */}
          <AnimatePresence>
            {(passwordsMatch || passwordsMismatch) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    passwordsMatch ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <CheckCircle size={14} />
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={4}
          className="pt-2"
        >
          <motion.button
            type="submit"
            disabled={isLoading || !passwordsMatch}
            whileHover={
              !isLoading && passwordsMatch
                ? {
                    y: -1,
                    boxShadow: "0 12px 30px -6px rgba(16,185,129,0.35)",
                  }
                : {}
            }
            whileTap={!isLoading && passwordsMatch ? { scale: 0.985 } : {}}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Resetting Password…</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
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

export default ResetPasswordPageClient;
