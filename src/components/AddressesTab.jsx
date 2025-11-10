import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Home,
  Building2,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  LoaderCircle,
} from "lucide-react";
import { clientFetch } from "@/services/clientfetch";
import toast from "react-hot-toast";


// --- Animation Variants (can be in a separate file) ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};
const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const modalPanelVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// --- MAIN ADDRESSES TAB COMPONENT ---
const AddressesTab = ({ addressesData }) => {
  const [addresses, setAddresses] = useState(addressesData?.addresses || []);
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with parent prop if it changes
  useEffect(() => {
    setAddresses(addressesData?.addresses || []);
  }, [addressesData]);

  const handleOpenModal = (type, data = null) => setModalState({ type, data });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  const handleSaveAddress = async (addressData, onComplete) => {
    try {
      setIsSubmitting(true);

      // Prepare the payload according to API requirements
      const payload = {
        title: addressData.title.trim(),
        addressLine1: addressData.addressLine1.trim(),
        addressLine2: addressData.addressLine2?.trim() || "",
        city: addressData.city.trim(),
        state: addressData.state.trim(),
        country: addressData.country.trim(),
        postalCode: addressData.postalCode.trim(),
        landmark: addressData.landmark?.trim() || "",
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      };

      if (addressData._id && !addressData._id.startsWith("new-")) {
        // --- Editing existing address ---
        const response = await clientFetch(`address/${addressData._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (!response.success) {
          const errorData = response.message;
          toast.error(errorData);
          throw new Error(errorData || "Failed to update address");
        }

        const updatedAddress = await response?.data;

        // Update local state with the response data
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === addressData._id ? updatedAddress : addr
          )
        );

        toast.success("Address updated successfully!");
      } else {
        // --- Adding new address ---
        const response = await clientFetch("address", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.success) {
          const errorData = await response;
          toast.error(errorData);
          throw new Error(errorData || "Failed to add address");
        }

        const newAddress = await response.data;

        // Add new address to local state
        setAddresses((prev) => [...prev, newAddress]);

        toast.success("New address added successfully!");
      }

      onComplete();
    } catch (error) {
      console.error("Error saving address:", error);
      // You might want to add error handling UI here
      toast.error(
        error.message || "An error occurred while saving the address"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteAddress = async (onComplete) => {
    const addressToDelete = modalState.data;

    try {
      // --- Call API ---
      const response = await clientFetch(`address/${addressToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.success) {
        const errorData = response.message;
        toast.error(errorData);
        throw new Error(errorData || "Failed to delete address");
      }

      // --- Update local state ---
      setAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressToDelete._id)
      );

      toast.success("Address deleted successfully!");

      onComplete();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(
        error.message || "An error occurred while deleting the address"
      );
    }
  };

  return (
    <>
      <AddressModal
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        addressToEdit={modalState.data}
      />
      <DeleteConfirmationModal
        isOpen={modalState.type === "delete"}
        onClose={handleCloseModal}
        onDelete={handleDeleteAddress}
        addressTitle={modalState.data?.title}
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center"
        >
          <h3 className="text-xl font-bold text-gray-800">My Addresses</h3>
          <motion.button
            onClick={() => handleOpenModal("add")}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            className="text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded-lg shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
          >
            + Add New Address
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses?.map((address) => (
            <motion.div
              key={address._id}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.07)",
              }}
              className="bg-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-200/80 relative"
            >
              {address.isPrimary && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  <Star size={12} className="fill-current" /> Primary
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  {address.addressType === "home" ? (
                    <Home className="text-pink-500" size={20} />
                  ) : (
                    <Building2 className="text-pink-500" size={20} />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {address.title}
                </h4>
              </div>
              <address className="mt-3 text-sm text-gray-600 not-italic space-y-1">
                <p>
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} - {address.postalCode}
                </p>
                <p>{address.country}</p>
                {address.landmark && (
                  <p className="text-xs text-gray-400">
                    Landmark: {address.landmark}
                  </p>
                )}
              </address>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                <button
                  onClick={() => handleOpenModal("edit", address)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-md"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleOpenModal("delete", address)}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-md"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {addressesData?.pagination?.totalPages > 1 && (
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 cursor-pointer py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              View All Addresses
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

// --- MODAL FOR ADDING/EDITING ---
const AddressModal = ({ isOpen, onClose, onSave, addressToEdit }) => {
  const defaultAddress = {
    title: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    landmark: "",
    addressType: "home",
    isPrimary: false,
  };
  const [formData, setFormData] = useState(addressToEdit || defaultAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(addressToEdit || defaultAddress);
    setErrors({}); // Clear errors when modal opens/closes
  }, [addressToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    // Validate postal code format (6-digit Indian PIN)
    const postalCodeRegex = /^[1-9][0-9]{5}$/;
    if (formData.postalCode && !postalCodeRegex.test(formData.postalCode)) {
      newErrors.postalCode = "Must be a valid 6-digit Indian PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    onSave(formData, () => {
      setIsSubmitting(false);
      onClose();
    });
  };

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
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {addressToEdit ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <X size={20} />
              </button>
            </header>
            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>
                {/* Address Line 1 */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    className={`w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm ${
                      errors.addressLine1 ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.addressLine1}
                    </p>
                  )}
                </div>
                {/* Address Line 2 */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
                {/* City */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                  )}
                </div>
                {/* State */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                  )}
                </div>
                {/* Postal Code */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                {/* Country */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm bg-gray-50"
                    readOnly
                  />
                </div>
                {/* Landmark */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 text-sm"
                  />
                </div>
              </div>
              {/* Address Type */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Address Type
                </label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="addressType"
                      value="home"
                      checked={formData.addressType === "home"}
                      onChange={handleChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"
                    />{" "}
                    Home
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="addressType"
                      value="work"
                      checked={formData.addressType === "work"}
                      onChange={handleChange}
                      className="focus:ring-pink-500 h-4 w-4 text-pink-600 border-gray-300"
                    />{" "}
                    Work
                  </label>
                </div>
              </div>
              {/* Primary Address Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPrimary"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleChange}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor="isPrimary"
                  className="text-sm font-medium text-gray-600"
                >
                  Set as primary address
                </label>
              </div>
            </form>
            <footer className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
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
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : addressToEdit ? (
                  "Update Address"
                ) : (
                  "Add Address"
                )}
              </motion.button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- NEW MODAL FOR DELETE CONFIRMATION ---
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  addressTitle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(() => {
      setIsDeleting(false);
      onClose();
    });
  };

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
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
          >
            <div className="mx-auto bg-red-100 h-12 w-12 flex items-center justify-center rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-4">
              Delete Address?
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete the address titled "
              <strong>{addressTitle}</strong>"? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-28 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
              >
                {isDeleting ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  "Delete"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddressesTab;
