"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Truck, CheckCircle } from "lucide-react";
import OrderPageSteps from "@/components/OrderPageSteps";
import OrderCheckoutForm from "@/components/OrderCheckoutForm";
import OrderData from "@/components/OrderData";
import { clientFetch } from "@/services/clientfetch";

const CheckoutPage = ({ addresses, sessionData, sessionId, userData }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [addressesState, setAddressesState] = useState(addresses);
  const cartItems = sessionData?.items || [];

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
      // For online payment, redirect to payment gateway in same window
      if (formData.paymentMethod === "online" && orderData.data.paymentLink) {
        window.location.href = orderData.data.paymentLink;
      } else {
        // For COD, redirect to order details page
        router.push(`/order/${orderData.data.order.id}`);
      }
    } catch (error) {
      console.error("Order success handling error:", error);
      setError("Failed to process order. Please contact support.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      console.log("this is the data we have here right now --->", data);
      
      localStorage.setItem("currentOrderId", data.data.order.id);

      // Handle successful order creation
      handleOrderSuccess(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState(() => {
    const nameParts = userData?.profile?.name?.split(' ') || [];
    return {
      // Shipping Address
      shippingAddress: {
        _id: null,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
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
    const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

    // Mock shipping calculation (would come from your API in reality)
    const shippingTotal = 0;
    const taxTotal = subtotal * 0;
    const grandTotal = subtotal + shippingTotal + taxTotal;

    return {
      subtotal,
      shippingTotal,
      taxTotal,
      grandTotal,
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
            ", "
          )}`
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
    { id: 1, title: "Shipping Information", icon: <MapPin size={20} /> },
    { id: 2, title: "Billing Information", icon: <CreditCard size={20} /> },
    { id: 3, title: "Payment Method", icon: <Truck size={20} /> },
    { id: 4, title: "Review Order", icon: <CheckCircle size={20} /> },
  ];

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8">
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
          <OrderData cartItems={cartItems} orderSummary={orderSummary} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
