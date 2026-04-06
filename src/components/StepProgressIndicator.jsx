"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, KeyRound, LockKeyhole, Check } from "lucide-react";

const steps = [
  { id: 1, label: "Email", icon: Mail },
  { id: 2, label: "Verify OTP", icon: KeyRound },
  { id: 3, label: "New Password", icon: LockKeyhole },
];

const StepProgressIndicator = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1 : 1,
                  backgroundColor: isCompleted
                    ? "#059669"
                    : isActive
                      ? "#059669"
                      : "#f5f5f4",
                  borderColor: isCompleted
                    ? "#059669"
                    : isActive
                      ? "#059669"
                      : "#d6d3d1",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-shadow ${
                  isActive ? "shadow-lg shadow-emerald-200" : ""
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <Check size={18} className="text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <Icon
                    size={17}
                    className={isActive ? "text-white" : "text-stone-400"}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive || isCompleted
                    ? "text-emerald-700"
                    : "text-stone-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-stone-200 mx-2 -mt-5 relative overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgressIndicator;
