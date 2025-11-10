"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import {
  TruckIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
  ShoppingBagIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  Package,
  PackageCheck,
  PackageX,
  PackageSearch,
  Truck,
  Home,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Shield,
  HeadphonesIcon,
  RefreshCw,
  Navigation,
  ArrowUpRight,
} from "lucide-react";
import ClientOnlyLenis from "@/components/ClientOnlyLenis";


// Enhanced Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Enhanced UI Components
const GlassCard = ({ children, className = "", hover = false }) => (
  <motion.div
    variants={itemVariants}
    className={`
      bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft border border-white/60 
      overflow-hidden relative
      ${
        hover
          ? "hover:shadow-medium hover:translate-y-[-2px] transition-all duration-300"
          : ""
      }
      ${className}
    `}
    whileHover={hover ? { y: -2 } : {}}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
    {children}
  </motion.div>
);

const StatusCard = ({
  status,
  message,
  icon,
  color = "blue",
  progress = 0,
}) => {
  const colorConfig = {
    blue: {
      bg: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-200/60",
      text: "text-blue-700",
      progress: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    green: {
      bg: "from-green-500/10 to-emerald-500/10",
      border: "border-green-200/60",
      text: "text-green-700",
      progress: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    red: {
      bg: "from-red-500/10 to-pink-500/10",
      border: "border-red-200/60",
      text: "text-red-700",
      progress: "bg-gradient-to-r from-red-500 to-pink-500",
    },
    yellow: {
      bg: "from-yellow-500/10 to-amber-500/10",
      border: "border-yellow-200/60",
      text: "text-yellow-700",
      progress: "bg-gradient-to-r from-yellow-500 to-amber-500",
    },
    purple: {
      bg: "from-purple-500/10 to-violet-500/10",
      border: "border-purple-200/60",
      text: "text-purple-700",
      progress: "bg-gradient-to-r from-purple-500 to-violet-500",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-8 rounded-3xl bg-gradient-to-br ${config.bg} border ${config.border} backdrop-blur-sm overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent" />
      </div>

      <div className="relative flex items-start space-x-6">
        <div className="flex-shrink-0 p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft">
          {React.cloneElement(icon, {
            className: "w-8 h-8",
            style: { color: `var(--color-${color}-500)` },
          })}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-2xl font-bold ${config.text} mb-2`}>{status}</h4>
          <p className="text-gray-700 text-lg leading-relaxed">{message}</p>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Order Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${config.progress} shadow-sm`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TrackingTimeline = ({ activities, currentStatus }) => {
  const getStatusIcon = (status, isActive, index) => {
    const baseClasses = "w-7 h-7 p-1.5 rounded-full";

    if (isActive) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`${baseClasses} bg-green-500 text-white shadow-lg shadow-green-500/25`}
        >
          <CheckCircleIcon />
        </motion.div>
      );
    }

    const iconClass = `${baseClasses} bg-white/80 text-gray-400 shadow-soft border border-white/60`;

    switch (status?.toLowerCase()) {
      case "delivered":
        return <PackageCheck className={iconClass} />;
      case "shipped":
        return <Truck className={iconClass} />;
      case "out for delivery":
        return <TruckIcon className={iconClass} />;
      case "processing":
        return <PackageSearch className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <PackageSearch className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h4 className="text-xl font-semibold text-gray-600 mb-2">
          No Tracking Activities Yet
        </h4>
        <p className="text-gray-500 max-w-sm mx-auto">
          Your order is being processed. Tracking information will be available
          soon.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => {
        const isActive = index === 0;
        const isLast = index === activities.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="flex space-x-6 group"
          >
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              {getStatusIcon(activity.status, isActive, index)}
              {!isLast && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="w-0.5 h-full bg-gradient-to-b from-gray-200 to-transparent mt-2"
                />
              )}
            </div>

            {/* Content */}
            <motion.div
              className="flex-1 pb-8 group-hover:translate-x-1 transition-transform duration-200"
              whileHover={{ x: 2 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p
                    className={`text-lg font-semibold ${
                      isActive ? "text-green-600" : "text-gray-800"
                    } mb-1`}
                  >
                    {activity.status || "Status Update"}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {activity.description || "Package status has been updated"}
                  </p>
                </div>
                {activity.timestamp && (
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>

              {activity.location && (
                <div className="flex items-center space-x-3 text-gray-600 bg-white/50 rounded-xl p-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{activity.location}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

const EnhancedLiveTrackingMap = ({
  origin,
  destination,
  currentLocation,
  progress = 50,
}) => {
  return (
    <GlassCard hover={true} className="overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-white/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/50 to-emerald-50/50">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-500/10 shadow-soft">
            <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Live Package Tracking
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Real-time location updates
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 self-start sm:self-auto">
          <div className="flex items-center space-x-2 bg-green-500/15 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-green-500/20">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            <span className="text-xs sm:text-sm font-semibold text-green-700">
              Live Tracking
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Map Visualization */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/80 rounded-xl sm:rounded-2xl border border-white/60 overflow-hidden backdrop-blur-sm shadow-soft">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-grid-pattern transform scale-105" />
          </div>

          {/* Route Container - Adjusted for mobile */}
          <div className="absolute top-[70%] sm:top-[60%] left-4 right-4 sm:left-8 sm:right-8 transform -translate-y-1/2">
            {/* Base Route Line */}
            <div className="h-2 sm:h-3 bg-white/90 rounded-full shadow-inner border border-white/60">
              {/* Progress Line */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-500 rounded-full relative shadow-lg shadow-blue-500/25"
              >
                {/* Moving Truck Indicator */}
                <motion.div
                  animate={{
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-3 sm:-top-4 -right-4 sm:-right-5"
                >
                  <div className="relative transform hover:scale-110 transition-transform duration-300">
                    <Truck className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-700 drop-shadow-2xl filter" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Origin Marker - Stacked vertically on mobile */}
          <div className="absolute left-4 sm:left-8 top-[25%] sm:top-[25%] transform -translate-y-1/2 -translate-x-0 sm:-translate-x-1">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl shadow-red-500/30 border-2 border-white">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
                {origin || "Loading Center"}
              </div>
              <p className="text-xs font-semibold mt-1 sm:mt-2 text-gray-700 text-center">
                Origin
              </p>
            </motion.div>
          </div>

          {/* Destination Marker */}
          <div className="absolute right-4 sm:right-8 top-[25%] sm:top-[25%] transform -translate-y-1/2 translate-x-0 sm:translate-x-1">
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl shadow-green-500/30 border-2 border-white">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden sm:block">
                {destination || "Delivery Point"}
              </div>
              <p className="text-xs font-semibold mt-1 sm:mt-2 text-gray-700 text-center">
                Destination
              </p>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-3 sm:top-4 md:top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-xl sm:rounded-2xl shadow-soft border border-white/60">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                {progress}% Complete
              </span>
            </div>
          </div>

          {/* Milestone Dots - Hidden on very small screens */}
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-8 sm:px-12 hidden sm:flex">
            {[0, 25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full border-2 ${
                  progress >= milestone
                    ? "bg-emerald-500 border-white shadow-lg shadow-emerald-500/50"
                    : "bg-white border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Status Cards - Stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              label: "Estimated Delivery",
              value: "2-3 Days",
              subtext: "Nov 15-16, 2023",
              icon: Calendar,
              color: "blue",
            },
            {
              label: "Current Location",
              value: currentLocation || "In Transit",
              subtext: "Moving towards destination",
              icon: MapPin,
              color: "emerald",
            },
            {
              label: "Last Updated",
              value: "Just now",
              subtext: "Refreshing automatically",
              icon: Clock,
              color: "purple",
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.8 }}
              className="bg-gradient-to-br from-white to-gray-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-soft border border-white/60 hover:shadow-medium transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div
                      className={`p-2 rounded-lg sm:rounded-xl bg-${item.color}-500/10 group-hover:bg-${item.color}-500/20 transition-colors duration-200`}
                    >
                      <item.icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-${item.color}-600`}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {item.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item.subtext}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

const OrderTrackingPage = ({ orderData, orderId, trackingData }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const trackingInfo = trackingData;
  const shipmentTrack = trackingInfo?.shipment_track?.[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      console.log("Refreshing tracking data...");
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getOverallStatus = () => {
    if (trackingInfo?.error) {
      return {
        status: "Order Confirmed",
        message:
          "Your order has been confirmed and is being processed. Tracking details will be available soon.",
        icon: <PackageCheck className="w-8 h-8" />,
        color: "blue",
        progress: 25,
      };
    }

    const status = trackingInfo?.track_status;
    switch (status) {
      case 0:
        return {
          status: "Order Confirmed",
          message: "Your order has been confirmed and is being processed.",
          icon: <PackageCheck className="w-8 h-8" />,
          color: "blue",
          progress: 25,
        };
      case 1:
        return {
          status: "Shipped",
          message: "Your order has been shipped and is on its way to you.",
          icon: <Truck className="w-8 h-8" />,
          color: "purple",
          progress: 50,
        };
      case 2:
        return {
          status: "Out for Delivery",
          message:
            "Your order is out for delivery today! Get ready to receive it.",
          icon: <TruckIcon className="w-8 h-8" />,
          color: "yellow",
          progress: 75,
        };
      case 3:
        return {
          status: "Delivered",
          message:
            "Your order has been delivered successfully. Thank you for shopping with us!",
          icon: <PackageCheck className="w-8 h-8" />,
          color: "green",
          progress: 100,
        };
      default:
        return {
          status: "Processing Order",
          message: "We're preparing your order for shipment.",
          icon: <Package className="w-8 h-8" />,
          color: "blue",
          progress: 15,
        };
    }
  };

  const statusInfo = getOverallStatus();

  const formatOrderId = (id) => {
    return `#${id?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "-")}`;
  };

  return (
    <>
      <ClientOnlyLenis>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <PackageCheck className="w-8 h-8 text-white" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-700 font-medium"
                >
                  Loading your order details...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
          </div>

          {/* Header Section */}
          <section className="relative pt-20 pb-12">
            <div className="container mx-auto px-6 relative">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center flex flex-col items-center"
              >
                <motion.button
                  variants={itemVariants}
                  onClick={() => router.back()}
                  className="cursor-pointer mb-8 flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-soft border border-white/60 hover:shadow-medium hover:bg-white transition-all duration-300 text-gray-700 font-medium"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  <span>Back to Orders</span>
                </motion.button>

                <motion.h1
                  variants={itemVariants}
                  className="text-5xl md:text-6xl font-bold text-gray-900 my-4 leading-tight font-serif"
                >
                  Track Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 animate-gradient-x">
                    Package
                  </span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-6 text-xl text-gray-600 max-w-2xl leading-relaxed"
                >
                  Real-time tracking for your order {formatOrderId(orderId)}
                </motion.p>

                {/* Enhanced Metadata Row */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-600"
                >
                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-soft border border-white/60">
                    <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-soft border border-white/60">
                    <ClockIcon className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                      autoRefresh
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                        : "bg-white/80 text-gray-700 shadow-soft border border-white/60"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        autoRefresh ? "bg-white" : "bg-gray-400"
                      }`}
                    />
                    <RefreshCw
                      className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
                    />
                    Auto-refresh {autoRefresh ? "ON" : "OFF"}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Status Overview */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="container mx-auto px-6 mb-12"
          >
            <StatusCard
              status={statusInfo.status}
              message={statusInfo.message}
              icon={statusInfo.icon}
              color={statusInfo.color}
              progress={statusInfo.progress}
            />
          </motion.section>

          {/* Main Content */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="container mx-auto px-6 pb-20"
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                {/* Enhanced Live Tracking Map */}
                <EnhancedLiveTrackingMap
                  origin={shipmentTrack?.origin}
                  destination={shipmentTrack?.destination}
                  currentLocation={shipmentTrack?.current_status}
                  progress={statusInfo.progress}
                />

                {/* Enhanced Tracking Timeline */}
                <GlassCard>
                  <div className="p-6 border-b border-white/40 flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-purple-500/10">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Journey Timeline
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Complete order history and updates
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <TrackingTimeline
                      activities={trackingInfo?.shipment_track_activities || []}
                      currentStatus={trackingInfo?.track_status}
                    />
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-8">
                {/* Enhanced Order Summary */}
                <GlassCard hover={true}>
                  <div className="p-6 border-b border-white/40 flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10">
                      <ShoppingBagIcon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Order Details
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      {
                        label: "Order ID",
                        value: formatOrderId(orderId),
                        color: "text-gray-700",
                      },
                      {
                        label: "Current Status",
                        value: statusInfo.status,
                        color: "text-blue-600 font-semibold",
                      },
                      {
                        label: "Courier",
                        value: shipmentTrack?.courier_name || "To be assigned",
                        color: "text-gray-700",
                      },
                      {
                        label: "Tracking Number",
                        value: shipmentTrack?.awb_code || "Pending",
                        color: "text-gray-700",
                      },
                      {
                        label: "Estimated Delivery",
                        value: shipmentTrack?.edd
                          ? new Date(shipmentTrack.edd).toLocaleDateString()
                          : "2-3 business days",
                        color: "text-green-600 font-semibold",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center py-2 border-b border-white/40 last:border-b-0"
                      >
                        <span className="text-gray-600 font-medium">
                          {item.label}
                        </span>
                        <span className={item.color}>{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Enhanced Support Card */}
                <GlassCard hover={true}>
                  <div className="p-6 border-b border-white/40 flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <HeadphonesIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Need Help?
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      Our support team is here to help with any delivery
                      questions or concerns.
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3.5 px-6 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <PhoneIcon className="w-5 h-5" />
                      <span>Contact Support</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/orders")}
                      className="cursor-pointer w-full bg-white/80 border border-white/60 text-gray-700 py-3.5 px-6 rounded-2xl font-semibold hover:bg-white hover:shadow-medium transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <ShoppingBagIcon className="w-5 h-5" />
                      <span>View All Orders</span>
                    </motion.button>

                    {/* Support Features */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {[
                        {
                          icon: Shield,
                          label: "Secure",
                          color: "text-emerald-500",
                        },
                        {
                          icon: Clock,
                          label: "24/7 Support",
                          color: "text-blue-500",
                        },
                      ].map((feature, index) => (
                        <motion.div
                          key={feature.label}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.2 + 0.5 }}
                          className="flex items-center space-x-2 text-sm text-gray-600"
                        >
                          <feature.icon
                            className={`w-4 h-4 ${feature.color}`}
                          />
                          <span>{feature.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.section>
        </main>
      </ClientOnlyLenis>

      <style jsx global>{`
        .shadow-soft {
          box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.08),
            0 2px 8px -2px rgba(0, 0, 0, 0.04);
        }
        .shadow-medium {
          box-shadow: 0 8px 40px -4px rgba(0, 0, 0, 0.12),
            0 4px 16px -4px rgba(0, 0, 0, 0.06);
        }
        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(0, 0, 0, 0.03) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
};

export default OrderTrackingPage;
