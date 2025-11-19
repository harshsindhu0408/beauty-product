"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AddressTabForShipping from "./AddressTabForShipping";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const OrderCheckoutForm = ({
  handleSubmit,
  currentStep,
  handleInputChange,
  nextStep,
  formData,
  setFormData,
  error,
  setError,
  prevStep,
  isSubmitting,
  addresses,
  cartItems,
  refreshAddresses,
}) => {
  const handleAddressSelect = (selectedAddress) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress, // Keep existing fields like name, email, phone
        _id: selectedAddress?._id || null,
        address: selectedAddress?.address || "",
        city: selectedAddress?.city || "",
        state: selectedAddress?.state || "",
        postalCode: selectedAddress?.postalCode || "",
        country: selectedAddress?.country || "India",
      },
    }));
  };

  return (
    <div className="lg:col-span-2 pb-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Collect All Information */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="space-y-8"
            >
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-lg">
                    <MapPin size={20} className="text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="shippingFirstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="shippingFirstName"
                      name="firstName"
                      value={formData.shippingAddress.firstName}
                      onChange={(e) => handleInputChange(e, "shippingAddress")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="shippingLastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="shippingLastName"
                      name="lastName"
                      value={formData.shippingAddress.lastName}
                      onChange={(e) => handleInputChange(e, "shippingAddress")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="shippingEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="shippingEmail"
                      name="email"
                      value={formData.shippingAddress.email}
                      onChange={(e) => handleInputChange(e, "shippingAddress")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="shippingPhone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="shippingPhone"
                      name="phone"
                      value={formData.shippingAddress.phone}
                      onChange={(e) => handleInputChange(e, "shippingAddress")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Address Selection */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <AddressTabForShipping
                    addressesData={addresses}
                    onAddressSelect={handleAddressSelect}
                    selectedAddressId={formData.shippingAddress._id}
                    refreshAddresses={refreshAddresses}
                  />
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <CreditCard size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Billing Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Where should we send the invoice?
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    name="sameAsShipping"
                    checked={formData.billingAddress.sameAsShipping}
                    onChange={(e) => handleInputChange(e, "billingAddress")}
                    className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="sameAsShipping"
                    className="ml-3 block text-sm font-medium text-gray-900"
                  >
                    Use same as shipping address
                  </label>
                </div>

                {!formData.billingAddress.sameAsShipping && (
                  <div className="space-y-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="billingFirstName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="billingFirstName"
                          name="firstName"
                          value={formData.billingAddress.firstName}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="billingLastName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="billingLastName"
                          name="lastName"
                          value={formData.billingAddress.lastName}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="billingEmail"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="billingEmail"
                          name="email"
                          value={formData.billingAddress.email}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="billingPhone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="billingPhone"
                          name="phone"
                          value={formData.billingAddress.phone}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="billingAddress"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address *
                      </label>
                      <input
                        type="text"
                        id="billingAddress"
                        name="address"
                        value={formData.billingAddress.address}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="billingCity"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City *
                        </label>
                        <input
                          type="text"
                          id="billingCity"
                          name="city"
                          value={formData.billingAddress.city}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="billingState"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State *
                        </label>
                        <input
                          type="text"
                          id="billingState"
                          name="state"
                          value={formData.billingAddress.state}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="billingPostalCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          id="billingPostalCode"
                          name="postalCode"
                          value={formData.billingAddress.postalCode}
                          onChange={(e) =>
                            handleInputChange(e, "billingAddress")
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                          required={!formData.billingAddress.sameAsShipping}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                    <Truck size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose how you want to pay
                    </p>
                  </div>
                </div>

                <div className="space-y-4 ">
                  <div className="flex items-start p-4 border-2 border-pink-200 bg-pink-50 rounded-lg hover:border-pink-300 transition-colors cursor-pointer">
                    <input
                      id="payment-online"
                      name="paymentMethod"
                      type="radio"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 mt-0.5"
                    />
                    <label
                      htmlFor="payment-online"
                      className="ml-3 block text-sm font-medium text-gray-900 flex-1"
                    >
                      <div className="flex cursor-pointer items-center justify-between">
                        <span className="flex items-center text-base font-semibold">
                          Credit/Debit Card or UPI
                          <span className="ml-3 px-2.5 py-1 text-xs bg-pink-500 text-white rounded-full font-medium">
                            Recommended
                          </span>
                        </span>
                      </div>
                      <span className="text-sm cursor-pointer text-gray-600 mt-1 block">
                        Pay securely using Razorpay - Instant confirmation
                      </span>
                    </label>
                  </div>

                  <div className="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                    <input
                      id="payment-cod"
                      name="paymentMethod"
                      type="radio"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 mt-0.5"
                    />
                    <label
                      htmlFor="payment-cod"
                      className="ml-3 cursor-pointer block text-sm font-medium text-gray-900 flex-1"
                    >
                      <span className="text-base cursor-pointer font-semibold">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-sm text-gray-600 mt-1 block">
                        Pay when your order is delivered - Additional charges
                        may apply
                      </span>
                    </label>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-3"
                  >
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none"
                    placeholder="Any special instructions, delivery preferences, or notes about your order..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Maximum 500 characters
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    nextStep();
                    // Smooth scroll to top
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="bg-pink-600 cursor-pointer text-white px-8 py-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Review Order
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Review Order & Place Order */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle size={24} className="text-pink-600" />
                Review Your Order
              </h2>

              {/* Shipping Address Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Shipping Address
                </h3>
                <p className="text-sm text-gray-600">
                  {formData.shippingAddress.firstName}{" "}
                  {formData.shippingAddress.lastName}
                  <br />
                  {formData.shippingAddress.address}
                  <br />
                  {formData.shippingAddress.city},{" "}
                  {formData.shippingAddress.state}{" "}
                  {formData.shippingAddress.postalCode}
                  <br />
                  {formData.shippingAddress.country}
                  <br />
                  {formData.shippingAddress.email}
                  {formData.shippingAddress.phone &&
                    ` • ${formData.shippingAddress.phone}`}
                </p>
              </div>

              {/* Billing Address Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Billing Address
                </h3>
                {formData.billingAddress.sameAsShipping ? (
                  <p className="text-sm text-gray-600">
                    Same as shipping address
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    {formData.billingAddress.firstName}{" "}
                    {formData.billingAddress.lastName}
                    <br />
                    {formData.billingAddress.address}
                    <br />
                    {formData.billingAddress.city},{" "}
                    {formData.billingAddress.state}{" "}
                    {formData.billingAddress.postalCode}
                    <br />
                    {formData.billingAddress.country}
                    <br />
                    {formData.billingAddress.email}
                    {formData.billingAddress.phone &&
                      ` • ${formData.billingAddress.phone}`}
                  </p>
                )}
              </div>

              {/* Payment Method Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Payment Method
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {formData.paymentMethod === "online"
                    ? "Credit/Debit Card or UPI (Razorpay)"
                    : "Cash on Delivery"}
                </p>
              </div>

              {/* Order Items Review */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item?.productId}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">Product : {item?.name}</p>
                        {item?.selectedVariant && (
                          <p className="text-gray-500">
                            {item?.selectedVariant?.variantName}:{" "}
                            {item?.selectedVariant?.optionName}
                          </p>
                        )}
                        <p className="text-gray-500">Qty: {item?.quantity}</p>
                      </div>
                      <p className="font-medium">
                        ₹{item?.itemTotal?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {formData.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Order Notes
                  </h3>
                  <p className="text-sm text-gray-600">{formData.notes}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 cursor-pointer px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back to Edit
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-pink-600 cursor-pointer text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-pink-400 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : formData.paymentMethod === "online" ? (
                    "Proceed to Payment"
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle
              size={20}
              className="text-red-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-red-800 text-sm">{error}</p>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default OrderCheckoutForm;
