"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const rules = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  { id: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  {
    id: "special",
    label: "One special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

const PasswordStrengthIndicator = ({ password }) => {
  const passed = useMemo(
    () => rules.filter((r) => r.test(password)).length,
    [password],
  );

  const strength = useMemo(() => {
    if (passed === 0)
      return { label: "", color: "bg-stone-200", textColor: "text-stone-400" };
    if (passed === 1)
      return { label: "Weak", color: "bg-red-500", textColor: "text-red-600" };
    if (passed === 2)
      return {
        label: "Fair",
        color: "bg-amber-500",
        textColor: "text-amber-600",
      };
    if (passed === 3)
      return {
        label: "Good",
        color: "bg-emerald-400",
        textColor: "text-emerald-600",
      };
    return {
      label: "Strong",
      color: "bg-emerald-600",
      textColor: "text-emerald-700",
    };
  }, [passed]);

  if (!password) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-3 mt-3"
      >
        {/* Strength bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              Password strength
            </span>
            <span className={`text-[11px] font-semibold ${strength.textColor}`}>
              {strength.label}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: passed >= i ? "100%" : "0%" }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`h-full rounded-full ${strength.color}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rule checklist */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {rules.map((rule) => {
            const isPassed = rule.test(password);
            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5"
              >
                {isPassed ? (
                  <Check
                    size={13}
                    className="text-emerald-500 flex-shrink-0"
                    strokeWidth={3}
                  />
                ) : (
                  <X
                    size={13}
                    className="text-stone-300 flex-shrink-0"
                    strokeWidth={3}
                  />
                )}
                <span
                  className={`text-[11px] transition-colors duration-200 ${
                    isPassed ? "text-emerald-600" : "text-stone-400"
                  }`}
                >
                  {rule.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordStrengthIndicator;
