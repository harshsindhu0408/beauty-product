"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Package,
  Trash2,
  LogOut,
  MessageCircle,
} from "lucide-react";
import UserProfileTab from "@/components/UserProfileTab";
import AddressesTab from "@/components/AddressesTab";
import OrdersTab from "@/components/OrdersTab";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";
import SupportTicketsTab from "@/components/SupportTicketsTab";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalPanelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
};

// Modal for Deletion Confirmation
const ConfirmationModal = ({ isOpen, onClose, onConfirm, addressTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalPanelVariants}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm"
          >
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mt-4">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete the address titled "
                <b>{addressTitle}</b>"? This action cannot be undone.
              </p>
            </div>
            <footer className="flex justify-center gap-3 p-4 bg-gray-50 rounded-b-2xl">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={onConfirm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              >
                Delete
              </motion.button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN CLIENT COMPONENT ---
const AccountPageClient = (data) => {
  // CORRECTLY destructure props with null checks
  const [user, setUser] = useState(data?.userData);
  const [supportTickets, setSupportTickets] = useState(data?.support);
  const ordersData = data?.orders;
  const addressesData = data?.addresses;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState(addressesData?.addresses || []);
  const [modalState, setModalState] = useState({ type: null, data: null });

  const handleLogout = async () => {
    try {
      // Call logout API first
      const res = await clientFetch("auth/logout", {
        method: "POST",
      });

      if (res?.success) {
        toast.success("Logged out successfully!!");
      }

      // Clear localStorage after successful API call
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");

      // Clear cookies
      Cookies.remove("accessToken", { path: "/" });

      // Navigate to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      Cookies.remove("accessToken", { path: "/" });
      router.push("/auth");
    }
  };

  const handleCloseModal = () => setModalState({ type: null, data: null });
  const handleDeleteAddress = () => {
    if (modalState.type === "delete" && modalState.data) {
      setAddresses((prev) =>
        prev.filter((addr) => addr._id !== modalState.data._id)
      );
      handleCloseModal();
    }
  };

  const handleUserUpdate = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile: {
        ...prevUser.profile,
        ...updatedUserData.profile,
      },
    }));
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={staggerContainer}
        >
          {/* --- PROFILE TAB --- */}
          {activeTab === "profile" && (
            <UserProfileTab user={user} setUser={setUser} />
          )}

          {/* --- ADDRESSES TAB --- */}
          {activeTab === "addresses" && (
            <AddressesTab addressesData={addressesData} />
          )}

          {/* --- ORDERS TAB --- */}
          {activeTab === "orders" && <OrdersTab ordersData={ordersData} />}

          {/* --- SUPPORT TAB --- */}
          {activeTab === "support" && (
            <SupportTicketsTab supportTicketsData={supportTickets} />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
        {/* Floating gradient blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute w-[60vw] h-[60vh] bg-pink-100/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 top-1/4 left-1/4"
            animate={{ x: ["0%", "5%", "0%"], y: ["0%", "10%", "0%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[70vw] h-[70vh] bg-purple-100/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 bottom-1/4 right-1/4"
            animate={{ x: ["0%", "-8%", "0%"], y: ["0%", "-12%", "0%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* REMOVED THE HEADER SECTION COMPLETELY */}

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* --- SIDEBAR NAVIGATION --- */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="lg:w-1/4"
            >
              <nav className="p-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/80 space-y-1">
                {/* User Profile Box at the top of sidebar */}
                <div className="flex flex-col items-center p-4 mb-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                  <img
                    src={
                      user?.profile?.avatar ||
                      `https://ui-avatars.com/api/?name=${
                        user?.profile?.name || "U"
                      }&background=E2E8F0&color=4A5568`
                    }
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full border-2 border-white shadow-md mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${
                        user?.profile?.name || "U"
                      }&background=E2E8F0&color=4A5568`;
                    }}
                  />
                  <h2 className="font-bold text-gray-800 text-center">
                    {user?.profile?.name || "User"}
                  </h2>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {[
                  { id: "profile", label: "My Profile", icon: User },
                  { id: "addresses", label: "My Addresses", icon: MapPin },
                  { id: "orders", label: "My Orders", icon: Package },
                  {
                    id: "support",
                    label: "Support Tickets",
                    icon: MessageCircle,
                  },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 cursor-pointer relative ${
                      activeTab !== tab.id &&
                      "hover:bg-gray-100/80 text-gray-600"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="active-tab-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-md"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-3">
                      <tab.icon
                        size={20}
                        className={
                          activeTab === tab.id ? "text-white" : "text-gray-500"
                        }
                      />
                      <span
                        className={activeTab === tab.id ? "text-white" : ""}
                      >
                        {tab.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
                <div className="pt-2 !mt-2 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut size={20} />
                    <span>Log Out</span>
                  </motion.button>
                </div>
              </nav>
            </motion.aside>

            {/* --- MAIN CONTENT AREA --- */}
            <motion.main
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <div className="min-h-[400px]">{renderContent()}</div>
            </motion.main>
          </div>
        </div>

        <ConfirmationModal
          isOpen={modalState.type === "delete"}
          onClose={handleCloseModal}
          onConfirm={handleDeleteAddress}
          addressTitle={modalState.data?.title}
        />
      </main>
    </>
  );
};

export default AccountPageClient;
