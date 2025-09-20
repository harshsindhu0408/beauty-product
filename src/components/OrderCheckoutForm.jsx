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
    <div className="lg:col-span-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm p-6"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MapPin size={24} className="text-pink-600" />
                Shipping Information
              </h2>

              {/* Other shipping fields like First Name, Last Name, etc. can go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="shippingFirstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="shippingFirstName"
                    name="firstName"
                    value={formData.shippingAddress.firstName}
                    onChange={(e) => handleInputChange(e, "shippingAddress")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingLastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="shippingLastName"
                    name="lastName"
                    value={formData.shippingAddress.lastName}
                    onChange={(e) => handleInputChange(e, "shippingAddress")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* --- New Address Component Usage --- */}
              <AddressTabForShipping
                addressesData={addresses}
                onAddressSelect={handleAddressSelect}
                selectedAddressId={formData.shippingAddress._id}
              />

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
                >
                  Continue to Billing
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Billing Information */}
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
                <CreditCard size={24} className="text-pink-600" />
                Billing Information
              </h2>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  name="sameAsShipping"
                  checked={formData.billingAddress.sameAsShipping}
                  onChange={(e) => handleInputChange(e, "billingAddress")}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="sameAsShipping"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Same as shipping address
                </label>
              </div>

              {!formData.billingAddress.sameAsShipping && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="billingFirstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="billingFirstName"
                        name="firstName"
                        value={formData.billingAddress.firstName}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingLastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="billingLastName"
                        name="lastName"
                        value={formData.billingAddress.lastName}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="billingEmail"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="billingEmail"
                        name="email"
                        value={formData.billingAddress.email}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingPhone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="billingPhone"
                        name="phone"
                        value={formData.billingAddress.phone}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      id="billingAddress"
                      name="address"
                      value={formData.billingAddress.address}
                      onChange={(e) => handleInputChange(e, "billingAddress")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      required={!formData.billingAddress.sameAsShipping}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="billingCity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="billingCity"
                        name="city"
                        value={formData.billingAddress.city}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingState"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        id="billingState"
                        name="state"
                        value={formData.billingAddress.state}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="billingPostalCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="billingPostalCode"
                        name="postalCode"
                        value={formData.billingAddress.postalCode}
                        onChange={(e) => handleInputChange(e, "billingAddress")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                        required={!formData.billingAddress.sameAsShipping}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back to Shipping
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
                >
                  Continue to Payment
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment Method */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Truck size={24} className="text-pink-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="payment-online"
                    name="paymentMethod"
                    type="radio"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={(e) => handleInputChange(e, "paymentMethod")}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <label
                    htmlFor="payment-online"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    <span className="flex items-center">
                      Credit/Debit Card or UPI
                      <span className="ml-2 px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full">
                        Recommended
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">
                      Pay securely using Razorpay
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="payment-cod"
                    name="paymentMethod"
                    type="radio"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => handleInputChange(e, "paymentMethod")}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <label
                    htmlFor="payment-cod"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Cash on Delivery (COD)
                    <span className="text-xs text-gray-500 block">
                      Pay when your order is delivered
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="pt-4">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange(e, "notes")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back to Billing
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
                >
                  Review Order
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review Order */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
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
                  className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Back to Payment
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:bg-pink-400 flex items-center gap-2"
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
