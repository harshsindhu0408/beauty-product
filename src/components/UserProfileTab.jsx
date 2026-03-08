import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  Pencil,
  X,
  LoaderCircle,
  Camera,
  Key,
} from "lucide-react";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";

/* ─── Date formatter ─── */
const formatDateShort = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

/* ─── Field Card Component (E-commerce Style) ─── */
const FieldCard = ({
  title,
  value,
  onEdit,
  isProtected,
  isVerified,
  extraData,
}) => (
  <div className="bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>
        {isVerified !== undefined && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isVerified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
          >
            {isVerified ? "Verified" : "Unverified"}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-1 text-gray-600">
        <div
          className={`text-sm ${isProtected ? "font-mono text-gray-500" : "text-gray-900 font-medium"}`}
        >
          {value || <span className="text-gray-400 italic">Not added yet</span>}
        </div>
        {extraData && (
          <div className="text-xs text-gray-500 break-words">{extraData}</div>
        )}
      </div>
    </div>

    <div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 bg-white border border-blue-600/20 hover:bg-blue-50 px-5 py-2 rounded-lg transition-all duration-200"
        >
          Edit
        </button>
      )}
    </div>
  </div>
);

/* ─── Edit Profile Modal ─── */
const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  React.useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || "",
        phone: user.profile.phone || "",
        bio: user.profile.bio || "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onUpdate(formData, () => setIsSubmitting(false));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-0"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white m-auto rounded-2xl w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100/50 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 relative">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                Edit Personal Info
              </h2>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                Update your account details
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6 flex-1 overflow-y-auto"
          >
            <div className="space-y-2">
              <label
                htmlFor="edit-name"
                className="text-sm font-bold text-gray-700"
              >
                Display Name
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className={`w-full px-5 py-3.5 bg-gray-50/50 text-gray-900 rounded-xl border-2 transition-all outline-none text-sm font-medium
                    ${focused === "name" ? "border-blue-500 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : "border-gray-200 focus:border-blue-400"}`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-phone"
                className="text-sm font-bold text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                className={`w-full px-5 py-3.5 bg-gray-50/50 text-gray-900 rounded-xl border-2 transition-all outline-none text-sm font-medium
                    ${focused === "phone" ? "border-blue-500 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : "border-gray-200 focus:border-blue-400"}`}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-bio"
                className="text-sm font-bold text-gray-700"
              >
                Biography
              </label>
              <textarea
                id="edit-bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                onFocus={() => setFocused("bio")}
                onBlur={() => setFocused(null)}
                rows={3}
                className={`w-full px-5 py-3.5 bg-gray-50/50 text-gray-900 rounded-xl border-2 transition-all outline-none text-sm font-medium resize-none
                    ${focused === "bio" ? "border-blue-500 bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : "border-gray-200 focus:border-blue-400"}`}
              />
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Main Profile Tab ─── */
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
        setUser(response?.data);
        toast.success("Profile details updated successfully", {
          position: "bottom-center",
          style: { background: "#333", color: "#fff", borderRadius: "8px" },
        });
      }
      setIsModalOpen(false);
      if (callback) callback();
    } catch (error) {
      if (callback) callback();
      console.error("Profile update failed:", error);
      toast.error("Could not update profile. Try again.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 pb-20">
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      {/* Hero Header Section */}
      <div className="bg-white rounded-2xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100%] opacity-50 pointer-events-none" />

        {/* Large Avatar container */}
        <div className="relative group shrink-0 z-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50">
            <img
              src={
                user?.profile?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.profile?.name || "U"}&background=f1f5f9&color=475569&size=256`
              }
              alt="Profile"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Email Verified Badge on avatar */}
          {user?.emailVerified && (
            <div className="absolute bottom-1 right-2 bg-blue-500 text-white w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center shadow-md pb-0.5">
              <CheckCircle size={16} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Hero User Details */}
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {user?.profile?.name || "User"}
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center justify-center md:justify-start gap-2">
            <Mail size={16} className="text-gray-400" />
            {user?.email}
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
              Member since {formatDateShort(user?.createdAt)}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-sm font-bold bg-gray-900 text-white hover:bg-black px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Setting Cards Section */}
      <h2 className="text-lg font-bold text-gray-900 px-1 mt-10 mb-2">
        Account Details
      </h2>

      <div className="grid grid-cols-1 gap-5">
        <FieldCard
          title="Personal Information"
          value={user?.profile?.name}
          extraData={user?.profile?.bio ? `Bio: ${user?.profile?.bio}` : ""}
          onEdit={() => setIsModalOpen(true)}
        />

        <FieldCard
          title="Email Address"
          value={user?.email}
          isVerified={user?.emailVerified}
          extraData="Used for order confirmation & login."
        />

        <FieldCard
          title="Mobile Number"
          value={user?.profile?.phone}
          extraData={
            user?.profile?.phone
              ? "Used for delivery tracking."
              : "Add a mobile number to strengthen your account security."
          }
          onEdit={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
};

export default UserProfileTab;
