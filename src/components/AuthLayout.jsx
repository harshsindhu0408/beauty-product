"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Leaf, text: "100% Natural" },
  { icon: Shield, text: "Safe & Tested" },
  { icon: Sparkles, text: "Premium Quality" },
];

const AuthLayout = ({ children, securityMessage }) => {
  return (
    <div className="min-h-screen flex font-[var(--font-poppins)] bg-stone-50">
      {/* ─── LEFT PANEL: Brand / Hero ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/Saundrya 2.png"
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
                <ShieldCheck size={14} className="text-emerald-300" />
                <span className="text-emerald-200 text-xs font-medium tracking-wide uppercase">
                  Secure Account
                </span>
              </div>
              <h1 className="text-4xl xl:text-[3.25rem] font-serif font-bold text-white leading-tight">
                Securely Recover
                <br />
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Your Account
                </span>
              </h1>
              <p className="text-stone-300 text-base leading-relaxed max-w-md">
                {securityMessage ||
                  "Your security is our priority. Follow the simple steps to safely reset your password and get back to your beauty journey."}
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

          {/* Security assurance at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck size={20} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium mb-1">
                  Your data is protected
                </p>
                <p className="text-white/55 text-xs leading-relaxed">
                  We use industry-standard encryption to keep your account
                  secure. Your password is never stored in plain text.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-[460px]">
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

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
