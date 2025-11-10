"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";

import { motion, AnimatePresence } from "framer-motion";


const CancelOrderModal = ({
  cancelModal,
  setCancelModal,
  cancelReason,
  setCancelReason,
  handleCancelOrder
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancellationReasons = [
    "Changed my mind",
    "Found better price elsewhere",
    "Shipping takes too long",
    "Ordered by mistake",
    "Product not needed anymore",
    "Other reason"
  ];

  const onCancelConfirm = async () => {
    if (!cancelReason.selectedReason) return;
    
    setIsSubmitting(true);
    await handleCancelOrder();
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setCancelModal({ isOpen: false })}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Cancel Order
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Order #{cancelModal.orderNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Please select a reason for cancellation:
          </p>
          
          {/* Cancellation Reasons */}
          <div className="space-y-3 mb-4">
            {cancellationReasons.map((reason) => (
              <label key={reason} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={cancelReason.selectedReason === reason}
                  onChange={(e) => setCancelReason(prev => ({
                    ...prev,
                    selectedReason: e.target.value,
                    customReason: ""
                  }))}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-700">{reason}</span>
              </label>
            ))}
          </div>

          {/* Custom Reason Input */}
          {cancelReason.selectedReason === "Other reason" && (
            <textarea
              value={cancelReason.customReason}
              onChange={(e) => setCancelReason(prev => ({
                ...prev,
                customReason: e.target.value
              }))}
              placeholder="Please specify your reason..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={() => setCancelModal({ isOpen: false })}
            className="flex-1 cursor-pointer px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onCancelConfirm}
            disabled={!cancelReason.selectedReason || isSubmitting || 
              (cancelReason.selectedReason === "Other reason" && !cancelReason.customReason.trim())}
            className={`flex-1 px-4 py-3 cursor-pointer rounded-xl font-medium transition-colors ${
              !cancelReason.selectedReason || isSubmitting ||
              (cancelReason.selectedReason === "Other reason" && !cancelReason.customReason.trim())
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CancelOrderModal;