import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  MapPin,
  RotateCcw,
  Eye,
  ShoppingBag,
  LoaderCircle,
  Truck,
  Box,
  CheckCircle2,
  XCircle,
  LoaderCircle as Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { clientFetch } from "@/services/clientfetch";
import { toast } from "react-hot-toast";

// --- SHIMMER SKELETON COMPONENT ---
const OrderCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse mb-6">
    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-white">
      <div className="flex gap-6">
        <div className="space-y-2">
          <div className="h-2 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="hidden sm:block h-8 w-px bg-gray-200" />
        <div className="space-y-2">
          <div className="h-2 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-8 w-24 bg-gray-200 rounded-lg" />
    </div>
    <div className="p-6 flex gap-6">
      <div className="w-24 h-24 bg-gray-200 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="px-6 py-4 border-t border-gray-50 flex justify-end gap-3">
      <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      <div className="h-10 w-32 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

// --- Formatter Utilities ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Animations ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

// --- Components ---

const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || "pending";

  let styles = "bg-gray-100 text-gray-700";
  let dotColor = "bg-gray-400";
  let label = status;

  if (["processing", "confirmed"].includes(normalizedStatus)) {
    styles = "bg-blue-50 border border-blue-100 text-blue-700";
    dotColor = "bg-blue-500";
  } else if (["shipped", "dispatched"].includes(normalizedStatus)) {
    styles = "bg-yellow-50 border border-yellow-100 text-yellow-700";
    dotColor = "bg-yellow-500 animate-pulse";
  } else if (["delivered", "completed"].includes(normalizedStatus)) {
    styles = "bg-green-50 border border-green-100 text-green-700";
    dotColor = "bg-green-500";
  } else if (["cancelled", "failed"].includes(normalizedStatus)) {
    styles = "bg-red-50 border border-red-100 text-red-700";
    dotColor = "bg-red-500";
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const router = useRouter();

  const totalItems =
    order.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) ||
    order.itemCount ||
    0;
  const firstItem = order.items?.[0] || {};
  const remainingItemsCount = totalItems - (firstItem.quantity || 1);
  const productImage =
    firstItem.image ||
    firstItem.product?.images?.[0] ||
    `https://ui-avatars.com/api/?name=${firstItem.name || "Product"}&background=f8fafc&color=94a3b8&size=128`;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 group"
    >
      <div className="bg-gray-50/50 border-b border-gray-100 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Order Placed
            </p>
            <p className="text-xs sm:text-sm font-semibold text-gray-900">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Total Amount
            </p>
            <p className="text-xs sm:text-sm font-semibold text-gray-900">
              {formatCurrency(order.grandTotal, order.currency)}
            </p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Order ID
            </p>
            <p className="text-xs sm:text-sm font-mono font-medium text-blue-600">
              #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center sm:justify-end">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="p-5 sm:px-6 sm:py-6 flex flex-col sm:flex-row gap-5 items-start">
        <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden relative group-hover:border-gray-200 transition-colors">
          <img
            src={productImage}
            alt={firstItem.name || "Product image"}
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${firstItem.name || "P"}&background=f8fafc&color=94a3b8`;
            }}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug">
            {firstItem.name || "Premium Beauty Product"}
          </h3>
          {firstItem.quantity > 0 && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
              Quantity: {firstItem.quantity}
            </p>
          )}

          {remainingItemsCount > 0 && (
            <div className="inline-flex mt-3 items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md">
              <span className="text-[11px] sm:text-xs font-bold text-gray-600">
                +{remainingItemsCount} more item
                {remainingItemsCount > 1 ? "s" : ""} in this order
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3 justify-end">
        <button
          onClick={() => router.push(`/order/${order._id}`)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <Eye size={16} /> View Details
        </button>

        {!["cancelled", "delivered", "returned"].includes(
          order.status?.toLowerCase(),
        ) && (
          <button
            onClick={() => router.push(`/track/${order._id}`)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 border-blue-100 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all outline-none"
          >
            <MapPin size={16} /> Track Order
          </button>
        )}

        {/* <button
          onClick={() => { toast.success("Feature coming soon!") }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all shadow-blue-500/20 hover:shadow-blue-500/40 outline-none"
        >
          <RotateCcw size={16} /> Buy Again
        </button> */}
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---

const OrdersTab = ({ ordersData }) => {
  const router = useRouter();

  const [orders, setOrders] = useState(ordersData?.orders || []);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // This is status
  const [timeFilter, setTimeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  // Search Debounce Implementation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Unified API Call for fetching Filtered Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Updated to use the new getMyOrders API structure
        let queryParams = new URLSearchParams({
          page: "1",
          limit: "50",
          sort: "-createdAt",
        });

        if (filter !== "all") {
          queryParams.set("status", filter);
        }

        if (debouncedSearch.trim() !== "") {
          queryParams.set("search", debouncedSearch.trim());
        }

        if (paymentStatusFilter !== "all") {
          queryParams.set("paymentStatus", paymentStatusFilter);
        }

        if (paymentMethodFilter !== "all") {
          queryParams.set("paymentMethod", paymentMethodFilter);
        }

        // Date filtering
        if (timeFilter !== "all") {
          const now = new Date();
          let startDate;
          if (timeFilter === "30days") {
            startDate = new Date(now.setDate(now.getDate() - 30));
          } else if (timeFilter === "6months") {
            startDate = new Date(now.setMonth(now.getMonth() - 6));
          } else if (timeFilter === "2024") {
            startDate = new Date("2024-01-01T00:00:00.000Z");
            queryParams.set("endDate", "2024-12-31T23:59:59.999Z");
          }
          if (startDate) {
            queryParams.set("startDate", startDate.toISOString());
          }
        }

        const endpoint = `order/my-orders?${queryParams.toString()}`;
        const res = await clientFetch(endpoint);

        if (res?.success) {
          setOrders(res?.data?.orders || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    filter,
    debouncedSearch,
    timeFilter,
    paymentStatusFilter,
    paymentMethodFilter,
  ]);

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
      {/* Header & Filter Toolbar */}
      <div className="space-y-6 mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Order History
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track, return, or buy items again.
            </p>
          </div>
        </div>

        {/* Cohesive Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Enhanced Search Box */}
          <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="md:w-48 relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-2xl text-[13px] font-bold text-gray-700 appearance-none focus:border-blue-500 focus:outline-none transition-all cursor-pointer shadow-sm"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                backgroundSize: "12px",
              }}
            >
              <option value="all">Any Date</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Past 6 Months</option>
              <option value="2024">Year 2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internal Tab Filter (Amazon style) */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 border-b border-gray-200 pb-[1px]">
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors outline-none ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeOrderTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Orders List & Loading Overlays */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="space-y-6">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6 transition-opacity duration-300"
          >
            <AnimatePresence mode="popLayout">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 tracking-tight">
                    No Orders Found
                  </h4>
                  <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto">
                    {searchQuery || filter !== "all" || timeFilter !== "all"
                      ? "We couldn't find any orders matching your current filters. Try resetting them."
                      : "You haven't placed any orders yet. Start exploring our collections!"}
                  </p>

                  <button
                    onClick={() => {
                      if (
                        searchQuery ||
                        filter !== "all" ||
                        timeFilter !== "all"
                      ) {
                        setSearchQuery("");
                        setFilter("all");
                        setTimeFilter("all");
                      } else {
                        window.location.href = "/products";
                      }
                    }}
                    className="mt-8 px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                  >
                    {searchQuery || filter !== "all" || timeFilter !== "all"
                      ? "Clear All Filters"
                      : "Browse Products"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
