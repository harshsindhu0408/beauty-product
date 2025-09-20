import React from "react";
import { motion } from "framer-motion";
import { Package, Calendar, ChevronRight, ShoppingCart } from "lucide-react"; // Assuming you use lucide-react
import { useRouter } from "next/navigation";

// --- Helper Functions (Updated) ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// --- Status Badge Component ---
const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
    returned: "bg-orange-100 text-orange-800",
    default: "bg-gray-100 text-gray-800",
  };
  const style = statusStyles[status?.toLowerCase()] || statusStyles.default;
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${style}`}
    >
      {status}
    </span>
  );
};

// --- ENHANCED & FIXED ORDER CARD COMPONENT ---
const OrderCard = ({ order }) => {
  const router = useRouter();
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.07)" }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
    >
      <header className="bg-gray-50/50 p-4 border-b border-gray-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col">
          <p className="text-sm font-bold text-gray-800">
            Order ID: {/* FIX: Was order.orderId, now order.orderNumber */}
            <span className="font-mono text-pink-600">{order.orderNumber}</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <Calendar size={14} />
            {/* FIX: Was order.orderDate, now order.createdAt */}
            <span>Ordered on {formatDate(order.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <OrderStatusBadge status={order.status} />
          <p className="font-semibold text-gray-800">
            {/* FIX: Was order.totalPrice, now order.grandTotal. Added dynamic currency. */}
            {formatCurrency(order.grandTotal, order.currency)}
          </p>
        </div>
      </header>

      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Items ({order.itemCount})
        </h4>
        <ul className="space-y-1.5 text-sm text-gray-600">
          {/* FIX: Replaced broken image display with a text list of items */}
          {order.items.map((item) => (
            // FIX: Using item.sku as the key, since item._id doesn't exist
            <li key={item.sku} className="flex justify-between items-center">
              <span>{item.name}</span>
              <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                Qty: {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="p-4 border-t border-gray-100">
        <motion.button
          onClick={() => {
            router.push(`order/${order._id}`);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-md"
        >
          View Order Details <ChevronRight size={16} />
        </motion.button>
      </footer>
    </motion.div>
  );
};

// --- MAIN ORDERS TAB COMPONENT (FIXED) ---
const OrdersTab = ({ ordersData }) => {
  // FIX: Check length directly on ordersData prop, as it's an array.
  const hasOrders = ordersData?.orders?.length > 0;
  const router = useRouter();
  console.log("has orders -->", hasOrders);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.h3
        variants={itemVariants}
        className="text-2xl font-bold text-gray-800"
      >
        My Orders
      </motion.h3>

      {hasOrders ? (
        <>
          <div className="space-y-4">
            {/* FIX: Map directly over ordersData */}
            {ordersData?.orders?.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
          {ordersData?.orders?.length > 8 && (
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 cursor-pointer text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                View All Orders
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          variants={itemVariants}
          className="text-center py-16 px-6 bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/80"
        >
          <Package size={56} className="mx-auto text-gray-400" />
          <h4 className="mt-6 text-xl font-semibold text-gray-700">
            No Orders Yet
          </h4>
          <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
            You haven't placed any orders yet. When you do, they will appear
            here.
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              router.push("/products");
            }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 rounded-lg shadow-sm cursor-pointer focus:outline-none"
          >
            <ShoppingCart size={16} /> Start Shopping
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrdersTab;
