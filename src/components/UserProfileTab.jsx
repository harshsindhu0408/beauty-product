import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Clock, Pencil, X, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";

// --- Helper function to format dates ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// --- A component to display status/role badges ---
const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-800",
    superadmin: "bg-purple-100 text-purple-800",
    verified: "bg-blue-100 text-blue-800",
    default: "bg-gray-100 text-gray-800",
  };
  const styleKey = status?.toString().toLowerCase();
  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
        styles[styleKey] || styles.default
      }`}
    >
      {status?.toString()}
    </span>
  );
};

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};
const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const modalContentVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// --- Edit Profile Modal Component ---
const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pre-fill form when modal opens or user data changes
    if (user?.profile) {
      setFormData({
        name: user.profile.name || "",
        phone: user.profile.phone || "",
        bio: user.profile.bio || "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Pass data to parent, which will handle the "API call"
    onUpdate(formData, () => {
      setIsSubmitting(false);
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalContentVariants}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bol text-gray-800">Edit Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-600"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-600"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="text-sm font-medium text-gray-600"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex cursor-pointer items-center justify-center w-full px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:bg-pink-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main Profile Tab Component ---
const UserProfileTab = ({ user, setUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileUpdate = async (updatedData, callback) => {
    const profile = {
      name: updatedData.name,
      bio: updatedData.bio,
      phone: updatedData.phone,
    };

    try {
      const response = await clientFetch("profile", {
        method: "PATCH",
        body: JSON.stringify({ profile }),
      });

      if (response?.success) {
        // Call the parent's update function with the new user data
        setUser(response?.data);
        toast.success("Profile update success");
      }
      setIsModalOpen(false);

      if (callback) {
        callback();
      }
    } catch (error) {
      if (callback) {
        callback();
      }
      console.error("❌ Failed to update profile:", error);
      if (error.message === "Unauthorized") {
        toast.error("Please log in again to update your profile.");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
      throw error;
    }
  };

  return (
    <>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* --- Account & Security Card --- */}
        <motion.div
          variants={itemVariants}
          className="relative bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-200/80"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <ShieldCheck size={22} className="text-pink-500" />
              Profile & Account
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors p-2 rounded-md bg-pink-100 hover:bg-pink-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 text-sm">
            <div>
              <label className="text-gray-500">User ID</label>
              <p className="font-mono text-gray-700 text-xs mt-1 break-all">
                {user && <span>{user?._id}</span>}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Role</label>
              <div className="mt-1">
                <StatusBadge status={user?.role} />
              </div>
            </div>
            <div>
              <label className="text-gray-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={user?.status} />
              </div>
            </div>
            <div>
              <label className="text-gray-500">Email Verified</label>
              <div className="mt-1">
                <StatusBadge
                  status={user?.emailVerified ? "Verified" : "Not Verified"}
                />
              </div>
            </div>
            <div>
              <label className="text-gray-500">Phone Number</label>
              <p className="font-semibold text-gray-800 text-base mt-1">
                {user?.profile?.phone}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Token Version</label>
              <p className="font-semibold text-gray-800 text-base mt-1">
                {user?.tokenVersion}
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- Activity & Session Card --- */}
        <motion.div
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-200/80"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <Clock size={22} className="text-pink-500" />
            Activity & Session
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm">
            <div>
              <label className="text-gray-500">Last Login</label>
              <p className="font-semibold text-gray-800 mt-1">
                {formatDate(user?.lastLogin)}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Login IP</label>
              <p className="font-mono text-gray-700 mt-1">{user?.loginIp}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-gray-500">Login User Agent</label>
              <p className="font-mono text-gray-700 text-xs mt-1">
                {user?.loginUserAgent}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Account Created</label>
              <p className="font-semibold text-gray-800 mt-1">
                {formatDate(user?.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-gray-500">Last Updated</label>
              <p className="font-semibold text-gray-800 mt-1">
                {formatDate(user?.updatedAt)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default UserProfileTab;
