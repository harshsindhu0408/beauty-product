"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { clientFetch } from "@/services/clientfetch";
import { deleteCookie, getCookie } from "@/utils/cookies";

export default function PaymentCallbackPage() {
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
        const razorpay_payment_id = searchParams.get("razorpay_payment_id");
        const razorpay_payment_link_id = searchParams.get(
          "razorpay_payment_link_id"
        );
        const razorpay_payment_link_status = searchParams.get(
          "razorpay_payment_link_status"
        );
        const razorpay_signature = searchParams.get("razorpay_signature");

        // Check if we have the necessary parameters
        if (!razorpay_payment_id || !razorpay_signature) {
          setPaymentStatus("error");
          setMessage("Invalid payment response. Missing required parameters.");
          setIsLoading(false);
          return;
        }

        // Get order ID from localStorage (assuming you stored it when creating the order)
        const orderIdFromCookie = getCookie("currentOrderId");
        const orderIdFromLocalStorage = localStorage.getItem("currentOrderId");
        const orderId = orderIdFromCookie || orderIdFromLocalStorage;

        console.log(
          "this is the order id we have from the console here ---->",
          orderId
        );

        if (!orderId) {
          setPaymentStatus("error");
          setMessage(
            "Unable to find order information. Please contact support."
          );
          setIsLoading(false);
          return;
        }

        // Prepare payment verification data
        const paymentData = {
          razorpay_payment_id,
          razorpay_payment_link_id,
          razorpay_payment_link_status,
          razorpay_signature,
        };

        // Call your backend API to verify payment using clientFetch
        const result = await clientFetch(`order/${orderId}/verify-payment`, {
          method: "POST",
          body: JSON.stringify(paymentData),
        });

        if (result && result.success) {
          setPaymentStatus("success");
          setMessage(
            "Payment verified successfully! Your order is being processed."
          );

          // Clear the stored order ID
          localStorage.removeItem("currentOrderId");
          deleteCookie("currentOrderId");

          // Redirect to success page after 3 seconds
          setTimeout(() => {
            router.push(`/order/${orderId}`);
          }, 3000);
        } else {
          setPaymentStatus("error");
          setMessage(
            result?.message ||
              "Payment verification failed. Please try again or contact support."
          );
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setPaymentStatus("error");
        setMessage(
          "An error occurred while verifying payment. Please contact support."
        );
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
          showRedirect: false,
        };
      case "success":
        return {
          icon: (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          ),
          title: "Payment Successful!",
          subtitle: message,
          color: "green",
          showRedirect: true,
        };
      case "error":
        return {
          icon: (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          ),
          title: "Payment Failed",
          subtitle: message,
          color: "red",
          showRedirect: false,
        };
      default:
        return {
          icon: null,
          title: "Processing",
          subtitle: "Please wait...",
          color: "blue",
          showRedirect: false,
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <>
      <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-transparent border-r-transparent border-pink-500 border-l-pink-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <main
          ref={containerRef}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        >
          {/* Floating gradient blobs */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute w-[80vw] h-[60vh] bg-pink-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 top-1/4 left-1/4"
              animate={{
                x: ["0%", "5%", "0%"],
                y: ["0%", "10%", "0%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute w-[80vw] h-[60vh] bg-purple-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 bottom-1/4 right-1/4"
              animate={{
                x: ["0%", "-8%", "0%"],
                y: ["0%", "-12%", "0%"],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </div>

          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <motion.div
              style={{ y: y1, opacity }}
              className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent z-10 pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.3,
                    },
                  },
                }}
                className="text-center"
              >
                <motion.div variants={fadeIn} className="mb-8">
                  {statusContent.icon}
                </motion.div>

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className={`text-4xl md:text-6xl font-bold mb-8 leading-tight font-serif ${
                    statusContent.color === "green"
                      ? "text-green-600"
                      : statusContent.color === "red"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  <span className="relative inline-block">
                    <span className="relative z-10">{statusContent.title}</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                      className={`absolute bottom-0 left-0 w-full h-4 z-0 transform origin-left ${
                        statusContent.color === "green"
                          ? "bg-green-200/60"
                          : statusContent.color === "red"
                          ? "bg-red-200/60"
                          : "bg-blue-200/60"
                      }`}
                      style={{ bottom: "15%" }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12"
                >
                  {statusContent.subtitle}
                  {statusContent.showRedirect && (
                    <span className="block text-sm text-gray-500 mt-2">
                      Redirecting to order page...
                    </span>
                  )}
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  transition={{ delay: 1 }}
                  className="flex justify-center gap-4 flex-wrap"
                >
                  {paymentStatus === "error" && (
                    <>
                      <Link href="/cart">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 cursor-pointer py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          Try Again
                        </motion.button>
                      </Link>
                      <Link href="/support">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 cursor-pointer py-4 bg-gray-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                          Contact Support
                        </motion.button>
                      </Link>
                    </>
                  )}

                  {paymentStatus !== "error" && (
                    <Link href="/">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 cursor-pointer py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        Return Home
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Additional Help Section */}
          {paymentStatus === "error" && (
            <div className="relative z-20 py-20">
              <div className="container mx-auto px-6 max-w-5xl">
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={sectionVariants}
                >
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="md:w-1/3 sticky top-32">
                      <motion.h2
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-serif"
                        style={{ y: y2 }}
                      >
                        Need Help?
                      </motion.h2>
                      <div className="hidden md:block h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full my-8" />
                      <p className="text-purple-600 font-medium">
                        We&apos;re here for you
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
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
                    </div>
                  </div>
                </motion.section>
              </div>
            </div>
          )}
        </main>
      </ReactLenis>
    </>
  );
}
