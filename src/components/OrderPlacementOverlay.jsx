"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";

const OrderPlacementOverlay = ({ status }) => {
  // status can be 'processing', 'success', 'error'

  return (
    <AnimatePresence>
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-md"
        >
          <div className="max-w-md w-full px-6 text-center">
            {status === "processing" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                    className="w-24 h-24 border-4 border-gray-100 border-t-pink-600 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag
                      size={32}
                      className="text-pink-600 animate-pulse"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Placing your order...
                </h2>
                <p className="text-gray-500 font-medium">
                  Please wait while we confirm your selection. This will only
                  take a moment.
                </p>

                {/* Progress bar simulation */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-8 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "90%" }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                  />
                </div>
              </motion.div>
            )}

            {status === "redirecting" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                    className="w-24 h-24 border-4 border-gray-100 border-t-blue-600 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={32} className="text-blue-600 animate-spin" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Redirecting to Payment...
                </h2>
                <p className="text-gray-500 font-medium">
                  Please complete the transaction on the secure payment gateway
                  to finalize your order.
                </p>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100"
                >
                  <CheckCircle2 size={48} className="text-green-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600 font-medium text-lg">
                  Your order has been placed successfully.
                </p>
                <p className="text-gray-400 mt-2">
                  Redirecting you to your order details...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderPlacementOverlay;
