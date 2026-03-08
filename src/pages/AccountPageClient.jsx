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
  Settings,
  Shield,
  CreditCard,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import UserProfileTab from "@/components/UserProfileTab";
import AddressesTab from "@/components/AddressesTab";
import OrdersTab from "@/components/OrdersTab";
import Cookies from "js-cookie";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";
import SupportTicketsTab from "@/components/SupportTicketsTab";

// --- MAIN CLIENT COMPONENT ---
const AccountPageClient = (data) => {
  const [user, setUser] = useState(data?.userData);
  const [supportTickets, setSupportTickets] = useState(data?.support);
  const ordersData = data?.orders;
  const addressesData = data?.addresses;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [addresses, setAddresses] = useState(addressesData?.addresses || []);

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

  const navItems = [
    { id: "profile", label: "My Profile", icon: UserCircle },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Order History", icon: Package },
    { id: "support", label: "Support", icon: MessageCircle },
  ];

  const getPageTitle = () => {
    const found = navItems.find((i) => i.id === activeTab);
    return found ? found.label : "Settings";
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case "profile":
        return "Update your personal details securely.";
      case "addresses":
        return "Manage your delivery locations.";
      case "orders":
        return "Track and view your past orders.";
      case "support":
        return "Need help? View your support tickets.";
      default:
        return "";
    }
  };

  /* Render Active Tab Content */
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
      default:
        return <UserProfileTab user={user} setUser={setUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50/80 via-white to-emerald-50/20 font-[var(--font-poppins)] selection:bg-emerald-100 selection:text-emerald-900 border-t border-stone-200/50">
      {/* Soft background decor */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-stone-100/50 to-transparent pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative">
        {/* Header section with brand colors */}
        <div className="mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-stone-900 tracking-tight leading-tight">
            Welcome back, <br className="sm:hidden" />
            <span className="text-emerald-600 font-serif italic">
              {user?.profile?.name?.split(" ")[0] || "User"}
            </span>
          </h1>
          <p className="text-stone-500 mt-3 text-base sm:text-lg max-w-xl">
            {getPageDescription()}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          {/* --- SIDEBAR NAVIGATION --- */}
          <aside className="w-full lg:w-64 shrink-0 transition-all">
            <nav className="flex flex-col gap-y-1.5 lg:sticky lg:top-8 bg-white/60 backdrop-blur-md p-2.5 rounded-2xl border border-stone-200/50 shadow-sm">
              {navItems.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive
                        ? "text-white shadow-md shadow-emerald-500/20"
                        : "text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar-tab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3">
                      <Icon
                        size={18}
                        className={`transition-colors duration-200 ${
                          isActive
                            ? "text-emerald-50"
                            : "text-stone-400 group-hover:text-emerald-500"
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span
                        className={`text-[15px] tracking-wide ${isActive ? "font-semibold" : "font-medium"}`}
                      >
                        {tab.label}
                      </span>
                    </div>

                    {!isActive && (
                      <ChevronRight
                        size={16}
                        className="text-stone-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10"
                      />
                    )}
                  </button>
                );
              })}

              <div className="my-2 border-t border-stone-200/50 mx-2" />

              <button
                onClick={handleLogout}
                className="group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer text-red-600 hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <LogOut
                    size={18}
                    className="text-red-400 group-hover:text-red-500"
                  />
                  <span className="text-[15px] font-medium tracking-wide">
                    Log Out
                  </span>
                </div>
              </button>
            </nav>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1 w-full max-w-[840px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Section Title */}
                <div className="mb-8 hidden lg:block">
                  <h2 className="text-2xl font-bold text-stone-800 tracking-tight">
                    {getPageTitle()}
                  </h2>
                </div>

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
