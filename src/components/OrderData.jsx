"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, X } from "lucide-react";

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const OrderData = ({
  cartItems,
  orderSummary,
  promoCode,
  setPromoCode,
  handleApplyPromo,
  handleRemovePromo,
  isPromoLoading,
  appliedPromo,
}) => {
  return (
    <div className="lg:col-span-1">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideIn}
        className="bg-white rounded-2xl shadow-sm p-6 sticky top-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Order Summary
        </h2>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <div key={item?.productId} className="flex gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {/* You'll need to add product images to your API response */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image
                    src={item?.image}
                    alt={item?.name || "Product image"}
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {item?.name}{" "}
                  {/* You might want to display product name instead of ID */}
                </h3>
                {item?.selectedVariant && (
                  <p className="text-xs text-gray-500">
                    {item?.selectedVariant?.variantName}:{" "}
                    {item?.selectedVariant?.optionName}
                  </p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600">Qty: {item?.quantity}</p>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{item?.itemTotal?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code Section */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          {!appliedPromo ? (
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 hover:border-gray-300"
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                />
              </div>
              <button
                onClick={handleApplyPromo}
                disabled={isPromoLoading || !promoCode}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPromoLoading ? (
                  <span className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-100 p-1.5 rounded-md">
                  <Tag className="text-emerald-600" size={14} />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 font-medium leading-none">
                    Applied Code
                  </p>
                  <p className="text-sm font-bold text-emerald-800 leading-tight">
                    {appliedPromo.code}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemovePromo}
                disabled={isPromoLoading}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Remove Coupon"
              >
                {isPromoLoading ? (
                  <span className="block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <X size={16} />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              ₹{orderSummary?.subtotal?.toLocaleString("en-IN")}
            </span>
          </div>

          {orderSummary.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span className="flex items-center">Discount</span>
              <span className="font-medium">
                - ₹{orderSummary.discountAmount.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {orderSummary.shippingTotal === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₹${orderSummary.shippingTotal?.toLocaleString("en-IN")}`
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Tax (GST)</span>
            <span className="font-medium">
              ₹{orderSummary?.taxTotal?.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Free Shipping Progress & Message */}
          {orderSummary.subtotal < 1000 && (
            <div className="space-y-2">
              <div className="text-sm text-pink-600 bg-pink-50 p-2 rounded-lg">
                Add ₹{(1000 - orderSummary.subtotal)?.toLocaleString("en-IN")}{" "}
                more for free shipping!
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (orderSummary.subtotal / 1000) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹0</span>
                <span>₹1,000</span>
              </div>
            </div>
          )}

          {orderSummary.subtotal >= 1000 && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
              🎉 You've unlocked free shipping!
            </div>
          )}

        <div className="border-t border-gray-200 pt-4 flex justify-between items-end text-lg font-bold">
          <span>Total</span>
          <div className="text-right min-w-[120px]">
            {appliedPromo && (
              <div className="mb-1">
                <span className="text-sm font-normal text-gray-500 line-through">
                  ₹
                  {(
                    (orderSummary.subtotal || 0) +
                    (orderSummary.shippingTotal || 0) +
                    (orderSummary.taxTotal || 0)
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            )}
            <span className="text-emerald-700 text-xl">
              ₹{orderSummary.grandTotal?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        </div>
      </motion.div>
    </div>
  );
};

export default OrderData;
