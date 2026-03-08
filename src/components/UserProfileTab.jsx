import React, { useState, useEffect } from "react";
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
  Fingerprint,
} from "lucide-react";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";

/* ─── Date formatter ─── */
const formatDateShort = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* ─── Shared Components ─── */
const SectionBlock = ({
  title,
  description,
  children,
  customAction,
  icon: Icon,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-white rounded-2xl border border-emerald-100/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8"
  >
    <div className="px-6 py-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/50 to-white">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-emerald-100/50 border border-emerald-200/50 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-emerald-600" />
          </div>
        )}
        <div>
          <h3 className="text-base font-semibold text-stone-900 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-stone-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {customAction && <div>{customAction()}</div>}
    </div>
    <div className="p-0 sm:p-6 flex flex-col gap-0 sm:gap-4">{children}</div>
  </motion.div>
);

const FieldRow = ({
  label,
  value,
  description,
  isProtected = false,
  copyable = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-4 px-6 sm:px-4 border-b border-stone-50 last:border-0 hover:bg-emerald-50/30 transition-colors rounded-lg">
      <div className="w-full sm:w-1/3 mb-1.5 sm:mb-0">
        <span className="text-sm font-medium text-stone-600">{label}</span>
      </div>
      <div className="w-full sm:w-2/3 flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className={`text-sm ${isProtected ? "font-mono text-stone-500" : "text-stone-900 font-medium"} ${copyable ? "cursor-pointer hover:text-emerald-600 transition-colors" : ""}`}
            onClick={copyable ? handleCopy : undefined}
          >
            {value || "—"}
          </span>
          {description && (
            <span className="text-[13px] text-stone-400 mt-0.5">
              {description}
            </span>
          )}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-md transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Edit Profile Modal ─── */
const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({ name: "", phone: "", bio: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
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
    onUpdate(formData, () => setIsSubmitting(false));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-[480px] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 bg-gradient-to-r from-emerald-50/50 to-white">
            <div>
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                Edit Profile
              </h3>
              <p className="text-sm text-stone-500 mt-0.5">
                Update your personal details.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="edit-name"
                className="text-sm font-semibold text-stone-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="Jane Doe"
                className={`w-full px-4 py-3 bg-stone-50/50 text-stone-900 rounded-xl border transition-all text-sm outline-none ${
                  focused === "name"
                    ? "border-emerald-400 ring-4 ring-emerald-50"
                    : "border-stone-200"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edit-phone"
                className="text-sm font-semibold text-stone-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-3 bg-stone-50/50 text-stone-900 rounded-xl border transition-all text-sm outline-none ${
                  focused === "phone"
                    ? "border-emerald-400 ring-4 ring-emerald-50"
                    : "border-stone-200"
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="edit-bio"
                className="text-sm font-semibold text-stone-700"
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
                placeholder="Briefly describe yourself..."
                className={`w-full px-4 py-3 bg-stone-50/50 text-stone-900 rounded-xl border transition-all text-sm outline-none resize-none ${
                  focused === "bio"
                    ? "border-emerald-400 ring-4 ring-emerald-50"
                    : "border-stone-200"
                }`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-[0.8] py-3 text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                Save Changes
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
        toast.success("Profile updated seamlessly.");
      }
      setIsModalOpen(false);
      if (callback) callback();
    } catch (error) {
      if (callback) callback();
      console.error("Failed to update profile:", error);
      if (error.message === "Unauthorized") {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to update profile. Try again.");
      }
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500 slide-in-from-bottom-2">
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onUpdate={handleProfileUpdate}
      />

      <SectionBlock
        title="Personal Information"
        description="Update your contact info and personal details here."
        icon={User}
        customAction={() => (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold bg-emerald-50 border border-emerald-100 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 transition-colors px-4 py-2 rounded-lg"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        )}
      >
        <FieldRow
          label="Display Name"
          value={user?.profile?.name}
          description="This name will be displayed on your invoices and dashboard."
        />
        <FieldRow
          label="Email Address"
          value={user?.email}
          description="Your verified email address used for login."
        />
        <FieldRow
          label="Phone Number"
          value={user?.profile?.phone}
          description="We'll only use this for important delivery updates."
        />
        <FieldRow
          label="Biography"
          value={user?.profile?.bio}
          description="Your personal summary shown on your public profile."
        />
      </SectionBlock>

      <SectionBlock
        title="Security & Account"
        description="Permanent details about your account that cannot be changed directly."
        icon={Shield}
      >
        <FieldRow
          label="Verification Status"
          value={
            <div className="flex items-center gap-1.5">
              <CheckCircle
                size={16}
                className={
                  user?.emailVerified ? "text-emerald-500" : "text-amber-500"
                }
              />
              <span
                className={
                  user?.emailVerified ? "text-emerald-700" : "text-amber-700"
                }
              >
                {user?.emailVerified ? "Verified Account" : "Unverified"}
              </span>
            </div>
          }
          isProtected
        />
        <FieldRow
          label="Account Created"
          value={formatDateShort(user?.createdAt)}
          isProtected
        />
        <FieldRow
          label="Account Role"
          value={
            <span className="inline-flex py-1 px-3 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-xs capitalize font-bold tracking-wide">
              {user?.role || "User"}
            </span>
          }
        />
        <FieldRow
          label="User ID"
          value={user?._id}
          isProtected
          copyable
          description="Your unique internal identifier."
        />
      </SectionBlock>
    </div>
  );
};

export default UserProfileTab;
