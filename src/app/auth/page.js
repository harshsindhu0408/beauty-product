"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  Leaf,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/* ─── Google Icon SVG ──────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/* ─── Floating Feature Badges ──────────────── */
const features = [
  { icon: Leaf, text: "100% Natural" },
  { icon: Shield, text: "Safe & Tested" },
  { icon: Sparkles, text: "Premium Quality" },
];

/* ─── Animation Variants ──────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const formSwitch = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

/* ─── Input Component ──────────────── */
const FormInput = ({
  icon: Icon,
  type = "text",
  name,
  label,
  placeholder,
  value,
  onChange,
  required,
  showToggle,
  onToggle,
  isVisible,
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
        <Icon
          size={18}
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            focused ? "text-emerald-500" : "text-stone-400"
          }`}
        />
        <input
          id={name}
          type={showToggle ? (isVisible ? "text" : "password") : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-12 py-3.5 bg-stone-50/80 text-stone-800 rounded-xl border-0 focus:outline-none focus:bg-white transition-all duration-200 text-sm placeholder:text-stone-400"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none cursor-pointer"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Divider ──────────────── */
const OrDivider = () => (
  <div className="flex items-center gap-4 my-5">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
    <span className="text-xs font-medium text-stone-400 uppercase tracking-widest">
      or
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
  </div>
);

/* ─── Main Auth Component ──────────────── */
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const router = useRouter();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Login failed");
        return;
      }

      if (data?.data?.tokens?.accessToken) {
        Cookies.set("accessToken", data?.data?.tokens?.accessToken, {
          expires: rememberMe ? 30 : 7,
        });
        localStorage.setItem("accessToken", data?.data?.tokens?.accessToken);
      }

      toast.success(data?.message || "Login successful");
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${baseUrl}auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Signup failed");
        return;
      }

      toast.success(data?.message || "Signup successful");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      // Send the Google ID token to our backend
      const res = await fetch(`${baseUrl}auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Google login failed");
        return;
      }

      // Store tokens
      if (data?.data?.tokens?.accessToken) {
        Cookies.set("accessToken", data.data.tokens.accessToken, {
          expires: 30,
        });
        localStorage.setItem("accessToken", data.data.tokens.accessToken);
      }
      if (data?.data?.tokens?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
      }

      toast.success(data?.message || "Logged in with Google!");

      // If new user and phone is empty, redirect to profile completion
      if (data?.data?.isNewUser && !data?.data?.user?.profile?.phone) {
        router.push("/account?tab=profile");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong with Google login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  const handleForgotPassword = () => {
    router.push(`/forgot-password/?email=${formData.email}`);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setFormData({ name: "", email: "", password: "", phone: "" });
  };

  return (
    <div className="min-h-screen flex font-[var(--font-poppins)] bg-stone-50">
      {/* ─── LEFT PANEL: Brand / Hero ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/Saundrya1.png"
            alt="Saundrya Earth Beauty"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/70 via-emerald-950/50 to-stone-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo area */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-serif font-bold text-white/95 tracking-wide cursor-pointer">
                Saundrya
                <span className="text-emerald-300"> Earth</span>
              </h2>
            </Link>
          </motion.div>

          {/* Centre hero text */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/25 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Sparkles size={14} className="text-emerald-300" />
                <span className="text-emerald-200 text-xs font-medium tracking-wide uppercase">
                  Nature&apos;s Finest
                </span>
              </div>
              <h1 className="text-4xl xl:text-[3.25rem] font-serif font-bold text-white leading-tight">
                Discover Your
                <br />
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Natural Radiance
                </span>
              </h1>
              <p className="text-stone-300 text-base leading-relaxed max-w-md">
                Premium, organic beauty products crafted with ancient Ayurvedic
                wisdom and modern science. Because your skin deserves the best.
              </p>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {features.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.12 }}
                  className="flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/10 rounded-full px-4 py-2"
                >
                  <Icon size={15} className="text-emerald-300" />
                  <span className="text-white/80 text-xs font-medium">
                    {text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Testimonial at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5"
          >
            <p className="text-white/75 text-sm italic leading-relaxed">
              &ldquo;Saundrya Earth transformed my skincare routine. The
              products feel so pure and luxurious — my skin has never looked
              better.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Priya S.</p>
                <p className="text-white/50 text-xs">Verified Customer</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-3.5 h-3.5 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Auth Form ─── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden text-center mb-8"
          >
            <Link href="/">
              <h2 className="text-2xl font-serif font-bold text-stone-800 cursor-pointer">
                Saundrya
                <span className="text-emerald-600"> Earth</span>
              </h2>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={0}
            className="mb-8"
          >
            <h1 className="text-[1.75rem] sm:text-3xl font-bold text-stone-800 tracking-tight">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-stone-500 mt-2 text-sm leading-relaxed">
              {isLogin
                ? "Sign in to continue your beauty journey with us."
                : "Join Saundrya Earth and discover nature's best kept secrets."}
            </p>
          </motion.div>

          {/* Google Login — custom styled overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
          >
            <div className="relative w-full h-[50px] rounded-xl overflow-hidden">
              {/* Custom visible button (underneath) */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 border border-stone-200 bg-white rounded-xl text-sm font-medium text-stone-700 shadow-sm hover:border-stone-300 hover:bg-stone-50/50 transition-all duration-200 cursor-pointer">
                <GoogleIcon />
                <span>Continue with Google</span>
              </div>
              {/* Real invisible GoogleLogin on top — captures the click */}
              <div className="absolute inset-0 opacity-0 [&>div]:!w-full [&>div]:!h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_div]:!w-full [&_div]:!h-full overflow-hidden cursor-pointer">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  size="large"
                  width="440"
                  text="continue_with"
                />
              </div>
            </div>
          </motion.div>

          <OrDivider />

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              variants={formSwitch}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={isLogin ? handleLogin : handleSignup}
              className="space-y-4"
            >
              {/* Name — signup only */}
              {!isLogin && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <FormInput
                    icon={User}
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                  />
                </motion.div>
              )}

              {/* Email */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 0 : 1}
              >
                <FormInput
                  icon={Mail}
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </motion.div>

              {/* Password */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 1 : 2}
              >
                <FormInput
                  icon={Lock}
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  showToggle
                  isVisible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </motion.div>

              {/* Phone — signup only */}
              {!isLogin && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <FormInput
                    icon={Phone}
                    type="tel"
                    name="phone"
                    label="Phone Number"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    autoComplete="tel"
                  />
                </motion.div>
              )}

              {/* Remember me + Forgot password — login only */}
              {isLogin && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="flex items-center justify-between pt-1"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                        className="peer sr-only"
                      />
                      <div className="w-[18px] h-[18px] rounded-[5px] border-2 border-stone-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all duration-200 flex items-center justify-center group-hover:border-stone-400">
                        <svg
                          className={`w-2.5 h-2.5 text-white transition-opacity ${
                            rememberMe ? "opacity-100" : "opacity-0"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-stone-600 select-none">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={isLogin ? 3 : 4}
                className="pt-2"
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
                      <span>
                        {isLogin ? "Signing in…" : "Creating account…"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? "Sign In" : "Create Account"}</span>
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </AnimatePresence>

          {/* Switch mode */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={5}
            className="mt-8 text-center"
          >
            <p className="text-sm text-stone-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-1.5 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>

          {/* Footer / legal */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={6}
            className="mt-10 text-center text-xs text-stone-400 leading-relaxed"
          >
            By continuing, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="underline hover:text-stone-600 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-stone-600 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
