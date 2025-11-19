"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { OrderSummary } from "@/components/OrderSummary";
import { clientFetch, debounce } from "@/services/clientfetch";
import toast from "react-hot-toast";

const CartPage = ({ initialCartData }) => {
  const [cart, setCart] = useState(initialCartData);
  const [isLoading, setIsLoading] = useState(!initialCartData);
  const containerRef = useRef(null);

  useEffect(() => {
    // If data is not passed initially, simulate a loading state
    if (!initialCartData) {
      setIsLoading(true);
      setTimeout(() => {
        // For demonstration, setting to an empty cart
        setCart({
          items: [],
          subtotal: 0,
          shippingCost: 0,
          tax: 0,
          discount: 0,
          total: 0,
          currency: "INR",
        });
        setIsLoading(false);
      }, 1500);
    }
  }, [initialCartData]);

  const updateCartTotals = (items, prevCart) => {
    const newSubtotal = items.reduce(
      (acc, item) =>
        acc +
        item.quantity *
          (item.product.price + (item.selectedVariant?.priceAdjustment || 0)),
      0
    );

    // Updated total calculation to include discount
    const newTotal =
      newSubtotal -
      (prevCart.discount || 0) +
      (prevCart.shippingCost || 0) +
      (prevCart.tax || 0);

    return {
      items,
      subtotal: newSubtotal,
      total: newTotal,
    };
  };

  const updateQuantityAPI = async (itemId, newQuantity) => {
    // Prevent API call for invalid quantities
    if (newQuantity < 0) return;

    // optimistic UI update for a smoother user experience
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // Recalculate totals client-side for immediate feedback
      const newSubtotal = updatedItems.reduce(
        (acc, item) =>
          acc +
          item.quantity *
            (item.product.price + (item.selectedVariant?.priceAdjustment || 0)),
        0
      );
      const newTotal =
        newSubtotal -
        (prevCart.discount || 0) +
        (prevCart.shippingCost || 0) +
        (prevCart.tax || 0);

      return {
        ...prevCart,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
      };
    });

    try {
      const response = await clientFetch(`cart/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response && response.success) {
        setCart(response.data);
      } else {
        // Revert UI state if API call fails
        setCart(initialCartData);
        toast.error(response?.message || "Failed to update item quantity.");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Revert UI state on error
      setCart(initialCartData);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    updateQuantityAPI(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    // Optimistic UI update for a smoother user experience
    const itemToRemove = cart.items.find((item) => item._id === itemId);
    const prevCart = cart;

    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item._id !== itemId);
      const newSubtotal = updatedItems.reduce(
        (acc, item) =>
          acc +
          item.quantity *
            (item.product.price + (item.selectedVariant?.priceAdjustment || 0)),
        0
      );
      const newTotal =
        newSubtotal -
        (prevCart.discount || 0) +
        (prevCart.shippingCost || 0) +
        (prevCart.tax || 0);

      return {
        ...prevCart,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
      };
    });

    try {
      const response = await clientFetch(`cart/${itemId}`, {
        method: "DELETE",
      });

      if (response && response.success) {
        setCart(response.data);
        toast.success(response.message);
      } else {
        // Revert UI state if API call fails
        setCart(prevCart);
        toast.error(response?.message || "Failed to remove item.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Revert UI state on error
      setCart(prevCart);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -200, transition: { duration: 0.3 } },
  };

  const formatPrice = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return `${cart?.currency || "INR"} 0.00`;
    }
    return `${cart?.currency || "INR"} ${amount.toFixed(2)}`;
  };

  return (
    <div ref={containerRef} className="min-h-screen font-sans bg-gray-50/50">
      <main className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center bg-emerald-100/50 rounded-full px-6 py-3 mb-8 border border-emerald-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ShoppingCart className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-emerald-700 font-medium">Your Cart</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Checkout Your{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Order
            </span>
          </h1>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-64 text-gray-500"
          >
            <svg
              className="animate-spin h-8 w-8 text-emerald-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-4">Loading your cart...</span>
          </motion.div>
        ) : cart && cart.items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cart.items.map((item) => {
                  const unitPrice =
                    item.product.price +
                    (item.selectedVariant?.priceAdjustment || 0);
                  const itemTotal = item.quantity * unitPrice;

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="grid grid-cols-12 items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Image */}
                      {item?.product?.images && (
                        <div className="col-span-12 sm:col-span-2">
                          <img
                            src={item?.product?.images[0]?.url}
                            alt={item?.product?.images[0]?.altText}
                            className="w-full h-28 rounded-xl object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="col-span-12 sm:col-span-5 text-center sm:text-left">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item?.product?.name}
                        </h3>
                        {/* More product info */}
                        <div className="text-xs text-gray-500 mt-1 space-x-2">
                          <span>
                            Brand:{" "}
                            <span className="font-medium text-gray-600">
                              {item.product.brand?.name}
                            </span>
                          </span>
                          <span>|</span>
                          <span>
                            SKU:{" "}
                            <span className="font-medium text-gray-600">
                              {item.product.sku}
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Category:{" "}
                          {item?.product?.categories?.[0]?.name ||
                            "No category"}
                        </p>

                        <p className="mt-2 text-lg font-bold text-gray-800 sm:hidden">
                          {formatPrice(unitPrice)} / unit
                        </p>
                      </div>

                      {/* Quantity & Controls */}
                      <div className="col-span-12 sm:col-span-5 flex items-center justify-between">
                        <div className="flex items-center">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                          >
                            <Minus size={16} />
                          </motion.button>
                          <span className="px-4 font-medium text-lg">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">
                            {formatPrice(itemTotal)}
                          </p>
                          <p className="text-xs text-gray-500 hidden sm:block">
                            ({formatPrice(unitPrice)} each)
                          </p>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 cursor-pointer rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition ml-3"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* order summary */}
            <OrderSummary cart={cart} formatPrice={formatPrice} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Looks like you haven&apos;t added anything to your cart yet.
              Explore our products to find something you&apos;ll love!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
