"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  Package,
  LogOut,
  MessageCircle,
  Shield,
  CreditCard,
  Heart,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import UserProfileTab from "@/components/UserProfileTab";
import AddressesTab from "@/components/AddressesTab";
import OrdersTab from "@/components/OrdersTab";
import Cookies from "js-cookie";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";
import SupportTicketsTab from "@/components/SupportTicketsTab";
import SecurityTab from "@/components/SecurityTab";

// --- MAIN CLIENT COMPONENT ---
const AccountPageClient = (data) => {
  const [user, setUser] = useState(data?.userData);
  const [supportTickets, setSupportTickets] = useState(data?.support);
  const ordersData = data?.orders;
  const addressesData = data?.addresses;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLogout = async () => {
    try {
      const res = await clientFetch("auth/logout", {
        method: "POST",
      });

      if (res?.success) toast.success("Logged out successfully!!");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userData");
      Cookies.remove("accessToken");
      Cookies.remove("userData");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Logout failed. Proceeding locally.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      Cookies.remove("accessToken");
      window.location.href = "/";
    }
  };

  const navGroups = [
    {
      title: "Dashboard",
      items: [
        {
          id: "orders",
          label: "My Orders",
          icon: Package,
          badge: ordersData?.length || null,
        },
      ],
    },
    {
      title: "Account Settings",
      items: [
        { id: "profile", label: "Profile Information", icon: User },
        { id: "addresses", label: "Manage Addresses", icon: MapPin },
        { id: "security", label: "Security", icon: Shield },
      ],
    },
    {
      title: "My Stuff",
      items: [{ id: "support", label: "Support Tickets", icon: MessageCircle }],
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserProfileTab user={user} setUser={setUser} />;
      case "addresses":
        return <AddressesTab addressesData={addressesData} />;
      case "orders":
        return <OrdersTab ordersData={ordersData} />;
      case "support":
        return <SupportTicketsTab supportTicketsData={supportTickets} />;
      case "security":
        return <SecurityTab />;
      case "wishlist":
      case "payments":
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
            <p className="text-gray-500 mt-1">
              This feature is currently under development.
            </p>
          </div>
        );
      default:
        return <UserProfileTab user={user} setUser={setUser} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Header / Menu Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
              <img
                src={
                  user?.profile?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.profile?.name || "U"}&background=f1f5f9&color=475569`
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">Hello,</p>
              <p className="text-sm font-semibold text-gray-800">
                {user?.profile?.name || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 bg-gray-50 rounded-md"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative items-start">
          {/* SIDEBAR */}
          <aside
            className={`w-full lg:w-[280px] shrink-0 transition-all ${isMobileMenuOpen ? "block" : "hidden lg:block"} lg:sticky lg:top-8 z-10`}
          >
            {/* User Greeting Card (Flipkart/Amazon style) */}
            <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-4 hidden lg:flex items-center gap-4 mb-4 border border-gray-100">
              <div className="relative group cursor-pointer w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-100">
                <img
                  src={
                    user?.profile?.avatar ||
                    `https://ui-avatars.com/api/?name=${user?.profile?.name || "U"}&background=f1f5f9&color=475569`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.profile?.name || "U"}&background=f1f5f9&color=475569`;
                  }}
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-[11px] text-gray-500 font-medium">Hello,</p>
                <div className="truncate font-semibold text-gray-800 text-base leading-tight mt-0.5">
                  {user?.profile?.name || "User"}
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden divide-y divide-gray-100/50">
              {navGroups.map((group, idx) => (
                <div key={idx} className="py-2">
                  <div className="px-5 mb-1 mt-2">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      {group.title}
                    </h4>
                  </div>
                  <div className="flex flex-col mt-1">
                    {group.items.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`group relative flex items-center justify-between px-5 py-3.5 transition-all duration-200 cursor-pointer ${
                            isActive ? "bg-blue-50/50" : "hover:bg-gray-50"
                          }`}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />
                          )}
                          <div className="flex items-center gap-4">
                            <Icon
                              size={20}
                              className={`transition-colors duration-200 ${
                                isActive
                                  ? "text-blue-600 fill-blue-50"
                                  : "text-gray-400 group-hover:text-blue-500"
                              }`}
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span
                              className={`text-sm ${isActive ? "font-semibold text-blue-700" : "font-medium text-gray-700 group-hover:text-blue-600"}`}
                            >
                              {tab.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {tab.badge && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {tab.badge}
                              </span>
                            )}
                            <ChevronRight
                              size={16}
                              className={`transition-all duration-200 ${isActive ? "text-blue-500" : "text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center justify-between px-5 py-3.5 transition-all duration-200 hover:bg-red-50 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <LogOut
                      size={20}
                      className="text-gray-400 group-hover:text-red-500 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                      Log Out
                    </span>
                  </div>
                </button>
              </div>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPageClient;
