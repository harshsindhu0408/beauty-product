"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Save token to cookies + localStorage
      if (data?.data?.tokens?.accessToken) {
        Cookies.set("accessToken", data?.data?.tokens?.accessToken, {
          expires: 7,
        });
        localStorage.setItem("accessToken", data?.data?.tokens?.accessToken);
      }

      toast.success(data?.message || "Login successful");
      router.push("/");
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong during login");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    }
  };

  const handleForgotPassword = async() => {
    router.push(`/forgot-password/?email=${formData.email}`)
  }

  const formContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
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

  <div className="flex flex-col items-center">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-4xl md:text-5xl font-serif font-bold mb-10 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
    >
      Saundrya Earth
    </motion.h1>

    <motion.div
      key={isLogin ? "login" : "signup"}
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100 backdrop-blur-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isLogin ? "Welcome Back!" : "Join Our Family"}
        </h1>
        <p className="text-gray-500">
          {isLogin
            ? "Sign in to continue your journey."
            : "Create your account to get started."}
        </p>
      </div>

      <form
        onSubmit={isLogin ? handleLogin : handleSignup}
        className="space-y-6"
      >
        {!isLogin && (
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-12 py-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>
        )}
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-12 py-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-12 py-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />
        </div>
        {!isLogin && (
          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-12 py-4 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            />
          </div>
        )}

        {/* Forgot Password Link - Only show on login */}
        {isLogin && (
          <div className="text-right">
            <motion.button
              type="button"
              onClick={handleForgotPassword}
              whileTap={{ scale: 0.95 }}
              className="text-sm cursor-pointer text-emerald-600 hover:text-emerald-500 transition-colors font-medium"
            >
              Forgot your password?
            </motion.button>
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full cursor-pointer py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </motion.button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <motion.button
          onClick={() => setIsLogin(!isLogin)}
          whileTap={{ scale: 0.95 }}
          className="ml-2 cursor-pointer font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </motion.button>
      </div>
    </motion.div>
  </div>
</div>
  );
};

export default Auth;
