"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Truck, CheckCircle } from "lucide-react";
import OrderPageSteps from "@/components/OrderPageSteps";
import OrderCheckoutForm from "@/components/OrderCheckoutForm";
import OrderData from "@/components/OrderData";
import OrderPlacementOverlay from "@/components/OrderPlacementOverlay";
import { clientFetch } from "@/services/clientfetch";
import { setCookie } from "@/utils/cookies";
import toast from "react-hot-toast";

const CheckoutPage = ({ addresses, sessionData, sessionId, userData }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placementStatus, setPlacementStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [addressesState, setAddressesState] = useState(addresses);
  const cartItems = sessionData?.items || [];

  // Promo Code State
  const [promoCode, setPromoCode] = useState("");
  // Initialize session state from initial sessionData
  const [sessionState, setSessionState] = useState(sessionData || {});
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  const refreshAddresses = async () => {
    try {
      const response = await clientFetch("address?isActive=true");
      if (response.success) {
        setAddressesState(response.data || []);
      }
    } catch (error) {
      console.error("Failed to refresh addresses:", error);
    }
  };

  const handleOrderSuccess = async (orderData) => {
    try {
      const isOnline = formData.paymentMethod === "online";

      if (!isOnline) {
        setPlacementStatus("success");
      } else {
        setPlacementStatus("redirecting");
      }

      const orderId = orderData.data.order._id || orderData.data.order.id;

      localStorage.setItem("currentOrderId", orderId);
      setCookie("currentOrderId", orderId, 1);

      // For online payment, redirect to payment gateway
      if (isOnline && orderData.data.paymentLink) {
        window.location.href = orderData.data.paymentLink;
      } else {
        // Wait for a short duration to show success message (for COD or fallback)
        setTimeout(() => {
          router.push(`/order/${orderId}`);
        }, 1500);
      }
    } catch (error) {
      console.error("Order success handling error:", error);
      setPlacementStatus("idle");
      toast.error("An unexpected error occurred. Please contact support.");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsPromoLoading(true);
    try {
      const payload = {
        code: promoCode,
        sessionId: sessionId,
      };

      const response = await clientFetch("promo/apply", {
        method: "POST",
        body: JSON.stringify(payload),
        throwError: true, // This ensures errors are thrown
      });

      if (response?.success) {
        toast.success(response?.message || "Promo code applied successfully!");

        // Re-fetch session to get the full updated state
        const sessionResponse = await clientFetch(
          `checkout/verify?sessionId=${sessionId}`,
        );
        if (sessionResponse?.success) {
          setSessionState(sessionResponse.data);
        }

        setPromoCode("");
      }
    } catch (error) {
      // Handle 404 and other errors properly
      const errorMessage =
        error.data?.message ||
        error.message ||
        "An error occurred while applying promo code";

      // Check if it's a 404 error (Invalid promo code)
      if (error.status === 404) {
        toast.error(errorMessage);
      } else {
        // Handle other types of errors
        console.error("Promo code error:", error);
        toast.error(errorMessage);
      }
    } finally {
      setIsPromoLoading(false);
    }
  };

  const handleRemovePromo = async () => {
    setIsPromoLoading(true);
    const payload = {
      code: sessionState?.appliedPromoCode?.code,
      sessionId: sessionId,
    };
    try {
      const response = await clientFetch("promo/remove", {
        method: "POST",
        body: JSON.stringify(payload),
        throwError: true,
      });

      if (response && response.success) {
        toast.success("Promo code removed");

        // Re-fetch session to get the full updated state
        const sessionResponse = await clientFetch(
          `checkout/verify?sessionId=${sessionId}`,
        );
        if (sessionResponse?.success) {
          setSessionState(sessionResponse.data);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message || "An error occurred while removing promo code",
      );
    } finally {
      setIsPromoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double clicks

    setIsSubmitting(true);
    setPlacementStatus("processing");
    setError(null);

    try {
      // Prepare order data according to your API
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.productId || item.product || item._id,
          quantity: item.quantity,
          price: item.price,
          ...(item.selectedVariant && {
            variant: {
              name: item.selectedVariant.variantName,
              option: item.selectedVariant.optionName,
            },
          }),
        })),
        shippingAddress: {
          firstName: formData.shippingAddress.firstName,
          lastName: formData.shippingAddress.lastName,
          email: formData.shippingAddress.email,
          phone: formData.shippingAddress.phone,
          address1: formData.shippingAddress.address,
          address2: "",
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state,
          postalCode: formData.shippingAddress.postalCode,
          country: formData.shippingAddress.country,
        },
        billingAddress: formData.billingAddress.sameAsShipping
          ? {
              firstName: formData.shippingAddress.firstName,
              lastName: formData.shippingAddress.lastName,
              email: formData.shippingAddress.email,
              phone: formData.shippingAddress.phone,
              address1: formData.shippingAddress.address,
              address2: "",
              city: formData.shippingAddress.city,
              state: formData.shippingAddress.state,
              postalCode: formData.shippingAddress.postalCode,
              country: formData.shippingAddress.country,
            }
          : {
              firstName: formData.billingAddress.firstName,
              lastName: formData.billingAddress.lastName,
              email: formData.billingAddress.email,
              phone: formData.billingAddress.phone,
              address1: formData.billingAddress.address,
              address2: "",
              city: formData.billingAddress.city,
              state: formData.billingAddress.state,
              postalCode: formData.billingAddress.postalCode,
              country: formData.billingAddress.country,
            },
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        checkoutSessionId: sessionId,
        discountCode: sessionState?.appliedPromoCode?.code, // Send discount code with order
      };

      // Call your API to create the order
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(orderData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      // Handle successful order creation
      await handleOrderSuccess(data);
    } catch (err) {
      console.error("Order creation error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setPlacementStatus("idle");
      setIsSubmitting(false);

      // Redirect with session ID to prevent loss of data
      toast.error(err.message || "Order placement failed.");
      router.push(`/checkout?sessionId=${sessionId}`);
    } finally {
      // isSubmitting will be set to false in handleOrderSuccess or here in error catch
    }
  };

  // Form state
  const [formData, setFormData] = useState(() => {
    const nameParts = userData?.profile?.name?.split(" ") || [];
    return {
      // Shipping Address
      shippingAddress: {
        _id: null,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: userData?.email || sessionData?.userEmail || "",
        phone: userData?.profile?.phone || "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
      // Billing Address
      billingAddress: {
        sameAsShipping: true,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      },
      // Payment method
      paymentMethod: "online", // "online" or "cod"
      // Shipping method
      shippingMethod: "standard",
      // Order notes
      notes: "",
    };
  });

  const calculateOrderSummary = () => {
    // Directly use values from sessionState as they are server-calculated
    return {
      subtotal: sessionState?.subtotal || 0,
      shippingTotal: sessionState?.shippingTotal || 0, // Use shippingTotal or shippingCharges based on API response
      taxTotal: sessionState?.taxTotal || 0,
      discountAmount: sessionState?.discountAmount || 0,
      grandTotal: sessionState?.grandTotal || 0,
    };
  };

  const orderSummary = calculateOrderSummary();

  // Handle form input changes
  const handleInputChange = (e, section) => {
    const { name, value, type, checked } = e.target;

    // Check if the name contains a dot (indicating nested property like "shippingAddress.firstName")
    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [name]: checked,
        },
      });

      // If billing address is same as shipping, copy shipping data
      if (name === "sameAsShipping" && checked) {
        setFormData({
          ...formData,
          billingAddress: {
            ...formData.shippingAddress,
            sameAsShipping: true,
          },
        });
      }
    } else {
      // Check if section is an object in formData (nested) or direct property
      if (typeof formData[section] === "object" && formData[section] !== null) {
        setFormData({
          ...formData,
          [section]: {
            ...formData[section],
            [name]: value,
          },
        });
      } else {
        // Direct property like paymentMethod
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  // Validate current step
  const validateStep = (step) => {
    if (step === 1) {
      const { firstName, lastName, email, _id } = formData.shippingAddress;

      const missingFields = [];
      if (!firstName) missingFields.push("First Name");
      if (!lastName) missingFields.push("Last Name");
      if (!email) missingFields.push("Email");
      if (!_id)
        missingFields.push("Shipping Address (please select an address)");

      if (missingFields.length > 0) {
        setError(
          `Please fill the following required fields: ${missingFields.join(
            ", ",
          )}`,
        );
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    if (step === 2 && !formData.billingAddress.sameAsShipping) {
      const { firstName, lastName, email, address, city, state, postalCode } =
        formData.billingAddress;

      if (
        !firstName ||
        !lastName ||
        !email ||
        !address ||
        !city ||
        !state ||
        !postalCode
      ) {
        setError("Please fill all required billing information");
        return false;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.paymentMethod) {
        setError("Please select a payment method");
        return false;
      }
    }

    setError(null);
    return true;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  // Steps configuration
  const steps = [
    { id: 1, title: "Order Details", icon: <MapPin size={20} /> },
    { id: 2, title: "Review Order", icon: <CheckCircle size={20} /> },
  ];

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8">
      <OrderPlacementOverlay status={placementStatus} />
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-200/40 via-sky-100/30 to-white"></div>
      <div className="max-w-6xl mx-auto">
        <OrderPageSteps steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <OrderCheckoutForm
            handleSubmit={handleSubmit}
            currentStep={currentStep}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            formData={formData}
            setFormData={setFormData}
            error={error}
            setError={setError}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            addresses={addressesState}
            refreshAddresses={refreshAddresses}
            cartItems={cartItems}
          />

          {/* Order Summary */}
          <OrderData
            cartItems={cartItems}
            orderSummary={orderSummary}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            handleApplyPromo={handleApplyPromo}
            handleRemovePromo={handleRemovePromo}
            isPromoLoading={isPromoLoading}
            appliedPromo={sessionState?.appliedPromoCode}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
