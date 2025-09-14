"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight } from "lucide-react";

// Mock data to simulate API response
const MOCK_CART_DATA = {
  status: true,
  code: "CART_ITEMS_FETCHED_SUCCESSFULLY",
  message: "Cart items retrieved successfully",
  data: {
    items: [
      {
        _id: "itemObjectId1",
        product: {
          _id: "productId1",
          name: "Organic Rosehip Oil",
          price: 499,
          images: [
            {
              url: "https://placehold.co/400x400/98d498/ffffff?text=Rosehip",
              altText: "Organic Rosehip Oil",
            },
          ],
        },
        quantity: 2,
        selectedVariant: {
          variantName: "Size",
          optionName: "50ml",
          priceAdjustment: 0,
        },
        priceAtAddition: 499,
      },
      {
        _id: "itemObjectId2",
        product: {
          _id: "productId2",
          name: "Radiant Glow Face Serum",
          price: 799,
          images: [
            {
              url: "https://placehold.co/400x400/a398d4/ffffff?text=Serum",
              altText: "Radiant Glow Face Serum",
            },
          ],
        },
        quantity: 1,
        selectedVariant: {
          variantName: "Formula",
          optionName: "With Vitamin C",
          priceAdjustment: 50,
        },
        priceAtAddition: 799,
      },
    ],
    totalItems: 3,
    subtotal: 1066,
    discount: 0,
    shippingCost: 50,
    tax: 18,
    total: 1134,
    currency: "INR",
  },
};

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simulate API call
    const fetchCartData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setCart(MOCK_CART_DATA.data);
        setIsLoading(false);
      }, 1500); // Simulate network delay
    };

    fetchCartData();
  }, []);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) => {
        if (item._id === itemId) {
          const newTotal =
            (item.priceAtAddition +
              (item.selectedVariant?.priceAdjustment || 0)) *
            newQuantity;
          return {
            ...item,
            quantity: newQuantity,
            itemTotal: newTotal,
          };
        }
        return item;
      });

      const newSubtotal = updatedItems.reduce(
        (acc, item) =>
          acc +
          item.quantity *
            (item.product.price + (item.selectedVariant?.priceAdjustment || 0)),
        0
      );
      const newTotal = newSubtotal + prevCart.shippingCost + prevCart.tax;

      return {
        ...prevCart,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
      };
    });
  };

  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item._id !== itemId);
      const newSubtotal = updatedItems.reduce(
        (acc, item) =>
          acc +
          item.quantity *
            (item.product.price + (item.selectedVariant?.priceAdjustment || 0)),
        0
      );
      const newTotal = newSubtotal + prevCart.shippingCost + prevCart.tax;

      return {
        ...prevCart,
        items: updatedItems,
        subtotal: newSubtotal,
        total: newTotal,
      };
    });
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -200, transition: { duration: 0.3 } },
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-emerald-50 to-white font-sans"
    >
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

      <main className="max-w-6xl mx-auto px-4 py-20 relative z-10">
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
                {cart.items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col md:flex-row items-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg"
                  >
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.images[0].altText}
                      className="w-full md:w-32 h-32 rounded-xl object-cover mb-4 md:mb-0 md:mr-6"
                    />
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.selectedVariant.variantName}:{" "}
                        {item.selectedVariant.optionName}
                      </p>
                      <p className="mt-2 text-lg font-bold text-gray-800">
                        INR{" "}
                        {item.product.price +
                          (item.selectedVariant?.priceAdjustment || 0)}
                      </p>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0 md:ml-auto">
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
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition ml-4"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">
                      INR {cart.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-800">
                      INR {cart.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tax</span>
                    <span className="font-medium text-gray-800">
                      INR {cart.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-4 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>INR {cart.total.toFixed(2)}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  Buy Now
                  <ChevronRight size={20} className="ml-2" />
                </motion.button>
              </motion.div>
            </div>
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
              Looks like you haven&apos;t added anything to your cart yet. Explore
              our products to find something you&apos;ll love!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Cart;
