"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef, useState, useEffect, Suspense } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { clientFetch } from "@/services/clientfetch";

export default function PaymentCallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your payment...");
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get all parameters from URL
        const razorpay_payment_id = searchParams.get('razorpay_payment_id');
        const razorpay_payment_link_id = searchParams.get('razorpay_payment_link_id');
        const razorpay_payment_link_status = searchParams.get('razorpay_payment_link_status');
        const razorpay_signature = searchParams.get('razorpay_signature');

        // Check if we have the necessary parameters
        if (!razorpay_payment_id || !razorpay_signature) {
          setPaymentStatus("error");
          setMessage("Invalid payment response. Missing required parameters.");
          setIsLoading(false);
          return;
        }

        // Get order ID from localStorage (assuming you stored it when creating the order)
        const orderId = localStorage.getItem('currentOrderId');
        
        if (!orderId) {
          setPaymentStatus("error");
          setMessage("Order ID not found. Please contact support.");
          setIsLoading(false);
          return;
        }

        // Verify the payment with your backend
        const result = await clientFetch.post(`payment/verify`, {
          razorpay_payment_id,
          razorpay_payment_link_id,
          razorpay_payment_link_status,
          razorpay_signature,
          orderId,
        });

        if (result.success) {
          setPaymentStatus("success");
          setMessage("Payment verified successfully! Redirecting to your order details...");
          
          // Clear the order ID from localStorage
          localStorage.removeItem('currentOrderId');
          
          // Redirect to success page after 3 seconds
          setTimeout(() => {
            router.push(`/order/${orderId}`);
          }, 3000);
        } else {
          setPaymentStatus("error");
          setMessage(result?.message || "Payment verification failed. Please try again or contact support.");
        }

      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus("error");
        setMessage("An error occurred while verifying payment. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  const getStatusContent = () => {
    switch (paymentStatus) {
      case "verifying":
        return {
          icon: (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 border-4 border-t-transparent border-r-transparent border-blue-500 border-l-blue-500 rounded-full"
            />
          ),
          title: "Processing Payment",
          subtitle: message,
          color: "blue",
        };
      case "success":
        return {
          icon: (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          ),
          title: "Payment Successful",
          subtitle: message,
          color: "green",
        };
      case "error":
        return {
          icon: (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          ),
          title: "Payment Failed",
          subtitle: message,
          color: "red",
        };
      default:
        return {
          icon: null,
          title: "Unknown Status",
          subtitle: "Please contact support",
          color: "gray",
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white z-50 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full mx-auto mb-4"
                  />
                  <p className="text-gray-600">Processing your payment...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main ref={containerRef} className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="container mx-auto px-4 py-16">
              <motion.section
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-8"
                >
                  {statusContent.icon}
                </motion.div>

                <motion.h1
                  variants={fadeIn}
                  className={`text-4xl font-bold mb-4 text-${statusContent.color}-600`}
                >
                  {statusContent.title}
                </motion.h1>

                <motion.p
                  variants={fadeIn}
                  className="text-xl text-gray-600 mb-8"
                >
                  {statusContent.subtitle}
                </motion.p>

                {paymentStatus === "error" && (
                  <motion.div
                    variants={fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What to do next?
                    </h3>
                    <div className="space-y-4 text-left">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Retry Payment</h4>
                        <p className="text-gray-600 mb-2">
                          If the payment failed due to a technical issue, please try again.
                        </p>
                        <Link
                          href="/checkout"
                          className="inline-block px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                        >
                          Try Again
                        </Link>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Check Payment Method</h4>
                        <p className="text-gray-600">
                          Ensure your payment method has sufficient funds and is valid.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Contact Support</h4>
                        <p className="text-gray-600 mb-2">
                          If you continue to experience issues, please contact our support team.
                        </p>
                        <a
                          href="mailto:hello@saundryaearth.com"
                          className="inline-block px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          Contact Support
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentStatus === "success" && (
                  <motion.div
                    variants={fadeIn}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What's Next?
                    </h3>
                    <ul className="text-gray-600 space-y-2 text-left">
                      <li>• Check your email for order confirmation</li>
                      <li>• Track your order status in your account</li>
                      <li>• Prepare for your beauty journey with Saundrya Earth</li>
                    </ul>
                  </motion.div>
                )}

                <motion.div
                  variants={fadeIn}
                  className="space-y-4"
                >
                  <Link
                    href="/products"
                    className="inline-block px-8 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors mr-4"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/account"
                    className="inline-block px-8 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    View Account
                  </Link>
                </motion.div>

                {paymentStatus === "error" && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.3,
                        },
                      },
                    }}
                    className="space-y-8"
                  >
                    <motion.div
                      variants={fadeIn}
                      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Common Payment Issues
                          </h3>
                          <ul className="text-gray-600 space-y-2">
                            <li>• Insufficient funds in your account</li>
                            <li>• Network connectivity issues</li>
                            <li>• Browser security restrictions</li>
                            <li>• Payment method declined by bank</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Contact Support
                          </h3>
                          <a
                            href="mailto:hello@saundryaearth.com"
                            className="text-pink-500 hover:underline"
                          >
                            hello@saundryaearth.com
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.section>
            </div>
          </main>
        </ReactLenis>
      </>
    </Suspense>
  );
}