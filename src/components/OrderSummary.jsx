import { clientFetch } from "@/services/clientfetch";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ShoppingCart,
  Percent,
  Truck,
  ReceiptText,
  Info,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// A reusable component for each line item to keep the code clean
const SummaryLineItem = ({ icon, label, children, tooltip }) => {
  const Icon = icon;
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center text-gray-600 relative">
        <Icon className="mr-3 h-5 w-5 text-gray-500" />
        <span className="text-sm font-medium">{label}</span>
        {tooltip && (
          <div
            className="ml-2 cursor-help relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info size={14} className="text-gray-400" />
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

// Skeleton loader for when data is loading
const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="h-7 bg-gray-200 rounded mb-6"></div>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex justify-between items-center py-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
      ))}
      <div className="my-4 flex items-center justify-between pt-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded mt-6"></div>
    </div>
  );
};

export const OrderSummary = ({ cart, formatPrice, isLoading }) => {
  const router = useRouter();

  const cartCheckoutHandler = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      console.error("Cart is empty or invalid");
      return;
    }

    try {
      const checkoutItems = cart.items.map((item) => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          images: item.product.images,
        },
        quantity: item.quantity,
        price: item.priceAtAddition,
        selectedVariant: item.selectedVariant || null,
        itemTotal: item.itemTotal,
      }));

      const payload = {
        items: checkoutItems,
        source: "cart",
      };

      const response = await clientFetch("checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response && response.success) {
        const { sessionId, redirectUrl } = response.data;
        router.push(redirectUrl || `/checkout?sessionId=${sessionId}`);
      } else {
        console.error("Failed to create checkout session:", response?.message);
        // Handle error (show toast, alert, etc.)
      }
    } catch (error) {
      console.error("Error in checkout process:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="lg:col-span-1">
        <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
          <div className="flex items-center text-sm text-emerald-600 font-medium">
            <Shield size={16} className="mr-1" />
            Secure Checkout
          </div>
        </div>

        <div className="space-y-1 mb-2">
          <SummaryLineItem icon={ShoppingCart} label="Subtotal">
            <span className="font-medium text-gray-900">
              {formatPrice(cart.subtotal)}
            </span>
          </SummaryLineItem>

          {cart.discount > 0 && (
            <SummaryLineItem
              icon={Percent}
              label="Discount"
              tooltip="Discount applied from your coupon code"
            >
              <span className="font-medium text-emerald-600">
                - {formatPrice(cart.discount)}
              </span>
            </SummaryLineItem>
          )}

          <SummaryLineItem
            icon={Truck}
            label="Shipping"
            tooltip="Shipping costs calculated at checkout based on your location"
          >
            <span className="text-sm font-medium text-gray-500">
              {cart.shippingCost > 0
                ? formatPrice(cart.shippingCost)
                : "Calculated at next step"}
            </span>
          </SummaryLineItem>

          <SummaryLineItem
            icon={ReceiptText}
            label="Tax"
            tooltip="Taxes calculated based on your shipping address"
          >
            <span className="font-medium text-gray-900">
              {formatPrice(cart.tax)}
            </span>
          </SummaryLineItem>
        </div>

        {/* Total Section with enhanced styling */}
        <div className="my-4 flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <span className="text-lg font-bold text-gray-900">Total</span>
            <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
          </div>
          <div className="text-right">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-extrabold text-transparent block">
              {formatPrice(cart.total)}
            </span>
            {/* <p className="text-xs text-gray-500 mt-1">{cart.currency}</p> */}
          </div>
        </div>

        {/* Guarantee badges */}
        <div className="flex items-center justify-between my-5 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <Truck size={14} />
            </div>
            <span>Free shipping over ₹1000</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
              <Shield size={14} />
            </div>
            <span>Secure payment</span>
          </div>
        </div>

        <motion.button
          whileHover={{
            y: -2,
            boxShadow: "0 10px 25px -5px rgba(5, 150, 105, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          onClick={cartCheckoutHandler} // MOVE onClick HERE
          className="mt-4 cursor-pointer flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 font-bold text-white transition-all duration-300 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          />
          <span className="relative z-10">Proceed to Checkout</span>
          <ChevronRight size={20} className="ml-2 relative z-10" />
        </motion.button>

        <div className="text-center text-xs text-gray-500 mt-4">
          By completing your purchase you agree to our{" "}
          <p
            onClick={() => {
              router.push("/terms-and-conditions");
            }}
            className="text-emerald-600 cursor-pointer hover:underline"
          >
            Terms of Service
          </p>
        </div>
      </motion.div>
    </div>
  );
};
