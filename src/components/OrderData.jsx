"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const OrderData = ({ cartItems, orderSummary }) => {
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

        {/* Order Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              ₹{orderSummary?.subtotal?.toLocaleString("en-IN")}
            </span>
          </div>
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
          {orderSummary.subtotal < 1000 && orderSummary.shippingTotal > 0 && (
            <div className="text-sm text-pink-600 bg-pink-50 p-2 rounded-lg">
              Add ₹{(1000 - orderSummary.subtotal)?.toLocaleString("en-IN")}{" "}
              more for free shipping!
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{orderSummary?.grandTotal?.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderData;
