"use client";

import React, { useEffect, useState } from "react";
import {
  TruckIcon,
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CubeIcon,
  XCircleIcon,
  ArrowUturnLeftIcon,
  ArrowLeftIcon,
  StarIcon as StarIconOutline,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactLenis } from "@studio-freight/react-lenis";
import { clientFetch } from "@/services/clientfetch";
import toast from "react-hot-toast";

// --- HELPERS (Modified for INR) ---

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const formatCurrency = (amount, currency = "INR") => {
  try {
    if (!currency || typeof currency !== "string") {
      currency = "INR";
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount || 0);
  } catch (error) {
    console.error("Currency formatting error:", error);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount || 0);
  }
};

const formatDate = (dateString) => {
  try {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Date not available";
  }
};

// --- UI COMPONENTS ---
const InfoCard = ({
  title,
  icon,
  children,
  className = "",
  variants,
  custom = 0,
}) => (
  <motion.div
    variants={variants}
    custom={custom}
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    <div className="p-5 border-b border-gray-100 flex items-center space-x-3">
      {React.cloneElement(icon, { className: "h-6 w-6 text-pink-500" })}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </motion.div>
);

const AddressBlock = ({ address = {} }) => {
  if (!address || Object.keys(address).length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No address information available
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-600 leading-relaxed">
      <p className="font-semibold text-gray-800">
        {address.firstName || ""} {address.lastName || ""}
      </p>
      {address.address1 && <p>{address.address1}</p>}
      {(address.city || address.state || address.postalCode) && (
        <p>
          {address.city || ""}
          {address.city && address.state ? ", " : ""}
          {address.state || ""} {address.postalCode || ""}
        </p>
      )}
      {address.country && <p>{address.country}</p>}
      {address.phone && <p className="mt-2">{address.phone}</p>}
    </div>
  );
};

const OrderTimeline = ({ status = "pending" }) => {
  const standardSteps = ["pending", "processing", "shipped", "delivered"];
  const isTerminalStatus = status === "cancelled" || status === "refunded";
  const currentStepIndex = standardSteps.indexOf(status);

  // Configuration for terminal statuses
  const terminalStatusConfig = {
    cancelled: {
      Icon: XCircleIcon,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      text: "Order Cancelled",
      message: "This order has been cancelled and will not be fulfilled.",
    },
    refunded: {
      Icon: ArrowUturnLeftIcon,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      text: "Order Refunded",
      message: "This order has been fully refunded.",
    },
  };

  if (isTerminalStatus) {
    const config = terminalStatusConfig[status];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex flex-col items-center justify-center p-8 rounded-2xl ${config.bgColor}`}
      >
        <config.Icon className={`w-16 h-16 ${config.iconColor}`} />
        <p className={`mt-4 text-2xl font-serif font-bold ${config.textColor}`}>
          {config.text}
        </p>
        <p className="mt-1 text-center text-gray-600">{config.message}</p>
      </motion.div>
    );
  }

  // Handle standard, linear statuses
  return (
    <div className="w-full px-2 sm:px-4">
      <div className="flex items-center">
        {standardSteps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    index <= currentStepIndex
                      ? "rgb(236 72 153)"
                      : "rgb(209 213 219)",
                  borderColor:
                    index <= currentStepIndex
                      ? "rgb(236 72 153)"
                      : "rgb(209 213 219)",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              >
                {index < currentStepIndex ? (
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                ) : (
                  <motion.div
                    animate={{
                      scale: index === currentStepIndex ? 1.2 : 1,
                      backgroundColor:
                        index === currentStepIndex
                          ? "rgb(255 255 255)"
                          : "rgb(209 213 219)",
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: index === currentStepIndex ? Infinity : 0,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="w-3 h-3 rounded-full"
                  ></motion.div>
                )}
              </motion.div>
              <p
                className={`mt-2 text-xs sm:text-sm capitalize transition-colors duration-300 ${
                  index <= currentStepIndex
                    ? "text-gray-800 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {step.replace("_", " ")}
              </p>
            </div>
            {index < standardSteps.length - 1 && (
              <motion.div
                initial={false}
                animate={{
                  borderColor:
                    index < currentStepIndex
                      ? "rgb(236 72 153)"
                      : "rgb(209 213 219)",
                }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                className="flex-auto border-t-2"
              ></motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// --- MODAL COMPONENT (WITH API CALL) ---
const ReviewModal = ({
  reviewModal,
  setReviewModal,
  reviewData,
  setReviewData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (isSubmitting || reviewData.rating === 0) return;

    setIsSubmitting(true);
    console.log("reviewModal", reviewModal);

    const payload = {
      productId: reviewModal.product?.product?._id || reviewModal.product?._id,
      rating: reviewData.rating,
      comment: reviewData.comment,
    };

    try {
      console.log("Submitting review with payload:", payload);

      const response = await clientFetch(`product/review`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response?.success) {
        setReviewData({ rating: 0, comment: "", hoverRating: 0 });
        setReviewModal({ isOpen: false, product: null });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(
        "There was an error submitting your review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const handleStarHover = (rating) => {
    setReviewData((prev) => ({ ...prev, hoverRating: rating }));
  };

  const handleStarLeave = () => {
    setReviewData((prev) => ({ ...prev, hoverRating: 0 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // --- THIS IS THE MODIFIED LINE ---
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setReviewModal({ isOpen: false, product: null })}
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
          <div className="flex items-center space-x-4">
            <img
              src={
                reviewModal.product?.product?.images?.[0]?.url ||
                `https://placehold.co/80x80/EBF4FF/7F9CF5?text=${(
                  reviewModal.product?.name || "?"
                ).charAt(0)}`
              }
              alt={reviewModal.product?.name}
              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Rate this product
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {reviewModal.product?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Star Rating */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                >
                  {star <= (reviewData.hoverRating || reviewData.rating) ? (
                    <StarIconSolid className="w-10 h-10 text-yellow-400" />
                  ) : (
                    <StarIconOutline className="w-10 h-10 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Labels */}
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600">
              {reviewData.rating === 0
                ? "Select your rating"
                : reviewData.rating === 1
                ? "Poor"
                : reviewData.rating === 2
                ? "Fair"
                : reviewData.rating === 3
                ? "Good"
                : reviewData.rating === 4
                ? "Very Good"
                : "Excellent"}
            </p>
          </div>

          {/* Review Comment */}
          <textarea
            value={reviewData.comment}
            onChange={(e) =>
              setReviewData((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Share your experience with this product... (Optional)"
            className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={() => setReviewModal({ isOpen: false, product: null })}
            className="flex-1 cursor-pointer px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={reviewData.rating === 0 || isSubmitting}
            className={`flex-1 px-4 py-3 cursor-pointer rounded-xl font-medium transition-colors ${
              reviewData.rating === 0 || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-pink-600 text-white hover:bg-pink-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN CLIENT COMPONENT ---
const OrderDetailsPage = ({ orderData }) => {
  const { order } = orderData || {};
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    product: null,
  });
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    hoverRating: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Order details are not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-transparent border-r-transparent border-pink-500 border-l-pink-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corrected Modal Rendering */}
        <AnimatePresence>
          {reviewModal.isOpen && (
            <ReviewModal
              reviewModal={reviewModal}
              setReviewModal={setReviewModal}
              reviewData={reviewData}
              setReviewData={setReviewData}
              orderId={order.id}
            />
          )}
        </AnimatePresence>

        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Header Section */}

          <section className="relative pt-16 pb-8">
            <div className="container mx-auto px-6 relative">
              {/* Back Button - Positioned independently */}
              <motion.button
                onClick={() => router.back()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-0 left-6 p-2 cursor-pointer rounded-full bg-white/60 shadow-sm border border-gray-200 backdrop-blur-sm"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
              </motion.button>

              {/* Main Centered Content Block */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center flex flex-col items-center"
              >
                <motion.p
                  variants={itemVariants}
                  className="mt-4 text-lg text-gray-600"
                >
                  Thank you for your purchase,{" "}
                  <span className="font-semibold">
                    {order?.shippingAddress?.firstName || "with us"}
                  </span>
                  !
                </motion.p>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold text-gray-900 my-2 leading-tight font-serif"
                >
                  Order{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    #{order.orderNumber || "N/A"}
                  </span>
                </motion.h1>

                {/* Metadata Row */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <span className="hidden sm:block text-gray-300">|</span>

                  <div className="flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">
                      {formatCurrency(order.grandTotal, "INR")}
                    </span>
                  </div>

                  <span className="hidden sm:block text-gray-300">|</span>

                  <div className="flex items-center gap-2">
                    <CubeIcon className="h-5 w-5 text-gray-400" />
                    <span className="font-medium">{order.itemCount} Items</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Order Status */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="container mx-auto px-6 mb-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <OrderTimeline status={order.status} />
            </div>
          </motion.section>

          {/* Main Content */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-6 pb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Items Ordered */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3">
                      <CubeIcon className="h-6 w-6 text-pink-500" /> Items
                      Ordered ({order.itemCount || 0})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {order?.items?.length > 0 ? (
                      order.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-5 flex items-center space-x-4"
                        >
                          <motion.img
                            src={
                              item.product?.images?.[0]?.url ||
                              `https://placehold.co/80x80/EBF4FF/7F9CF5?text=${(
                                item.name || "?"
                              ).charAt(0)}`
                            }
                            alt={item.name || "Product image"}
                            className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            whileHover={{ scale: 1.05 }}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {item.name || "Unnamed product"}
                            </p>
                            <p className="text-sm text-gray-500">
                              SKU: {item.sku || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Qty: {item.quantity || 0}
                            </p>
                            {/* Add Review Button */}
                            <button
                              onClick={() =>
                                setReviewModal({
                                  isOpen: true,
                                  product: item,
                                })
                              }
                              className="mt-3 cursor-pointer px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
                            >
                              <StarIconSolid className="w-4 h-4" />
                              <span>Write Review</span>
                            </button>
                          </div>
                          <div className="text-sm text-gray-600 text-right">
                            <p className="font-semibold text-gray-800">
                              {formatCurrency(item.total, "INR")}
                            </p>
                            <p className="text-gray-500">
                              {formatCurrency(item.price, "INR")} each
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-5 text-center text-gray-500">
                        No items found
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Payment & Financial Details */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Payment Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Method</span>
                          <span className="font-medium text-gray-700 uppercase">
                            {order.payment?.method || "Not specified"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className="font-medium text-gray-700 capitalize">
                            {order.payment?.status || "Unknown"}
                          </span>
                        </div>
                        {order.payment?.transactionId && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">
                              Transaction ID
                            </span>
                            <span className="font-medium text-gray-700 text-xs">
                              {order.payment.transactionId}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t sm:border-t-0 sm:border-l border-gray-100 pl-0 sm:pl-6 pt-6 sm:pt-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-medium text-gray-700">
                            {formatCurrency(order.subtotal, "INR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shipping</span>
                          <span className="font-medium text-gray-700">
                            {formatCurrency(order.shippingTotal, "INR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax</span>
                          <span className="font-medium text-gray-700">
                            {formatCurrency(order.taxTotal, "INR")}
                          </span>
                        </div>
                        {order.discountTotal > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span className="text-gray-500">Discount</span>
                            <span className="font-medium">
                              -{formatCurrency(order.discountTotal, "INR")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-md pt-2 border-t border-gray-200">
                          <span className="font-semibold text-gray-800">
                            Grand Total
                          </span>
                          <span className="font-bold text-gray-900">
                            {formatCurrency(order.grandTotal, "INR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8">
                <InfoCard
                  title="Customer"
                  icon={<UserIcon />}
                  variants={itemVariants}
                  custom={0.1}
                >
                  <p className="font-semibold text-gray-800">
                    {order.shippingAddress?.firstName || "Unknown"}{" "}
                    {order.shippingAddress?.lastName || ""}
                  </p>
                  <a
                    href={`mailto:${order.customer?.email || ""}`}
                    className="text-sm text-pink-600 hover:underline"
                  >
                    {order.customer?.email || "No email provided"}
                  </a>
                </InfoCard>

                <InfoCard
                  title="Shipping Address"
                  icon={<MapPinIcon />}
                  variants={itemVariants}
                  custom={0.2}
                >
                  <AddressBlock address={order.shippingAddress} />
                </InfoCard>

                <InfoCard
                  title="Billing Address"
                  icon={<MapPinIcon />}
                  variants={itemVariants}
                  custom={0.3}
                >
                  <AddressBlock address={order.billingAddress} />
                </InfoCard>

                <InfoCard
                  title="Shipping & Delivery"
                  icon={<TruckIcon />}
                  variants={itemVariants}
                  custom={0.4}
                >
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <span className="font-medium text-gray-500">Method:</span>{" "}
                      {order.shippingMethod || "Not specified"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-500">Status:</span>{" "}
                      <span className="capitalize">
                        {order.shippingStatus || "Not available"}
                      </span>
                    </p>
                    {order.shippingStatus === "delivered" &&
                      order.updatedAt && (
                        <p>
                          <span className="font-medium text-gray-500">
                            Delivered on:
                          </span>{" "}
                          {formatDate(order.updatedAt)}
                        </p>
                      )}
                  </div>
                </InfoCard>
              </div>
            </div>
          </motion.section>
        </main>
      </ReactLenis>
    </>
  );
};

export default OrderDetailsPage;
