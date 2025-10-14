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
  CheckCircle2,
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

// --- Helper to transform address for parent form ---
const transformAddressForForm = (address) => {
  if (!address) return {};
  return {
    _id: address._id, // Keep track of the ID for selection
    address: `${address.addressLine1}${
      address.addressLine2 ? `, ${address.addressLine2}` : ""
    }`,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };
};

// --- MAIN ADDRESSES TAB COMPONENT ---
const AddressTabForShipping = ({
  addressesData,
  onAddressSelect,
  selectedAddressId,
}) => {
  const [addresses, setAddresses] = useState(addressesData?.addresses || []);
  const [modalState, setModalState] = useState({ type: null, data: null });

  // Sync with parent prop if it changes
  useEffect(() => {
    setAddresses(addressesData?.addresses || []);
  }, [addressesData]);

  const handleOpenModal = (type, data = null) => setModalState({ type, data });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  const handleSaveAddress = async (addressData, onComplete) => {
    // This function now handles both creating/editing AND updating the parent form
    try {
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
        if (!response.success)
          throw new Error(response.message || "Failed to update");

        const updatedAddress = response.data;
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === addressData._id ? updatedAddress : addr
          )
        );
        toast.success("Address updated!");

        // If the edited address is the currently selected one, update the parent form
        if (selectedAddressId === updatedAddress._id) {
          onAddressSelect(transformAddressForForm(updatedAddress));
        }
      } else {
        // --- Adding new address ---
        const response = await clientFetch("address", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (!response.success)
          throw new Error(response.message || "Failed to add");

        const newAddress = response.data;
        setAddresses((prev) => [...prev, newAddress]);
        toast.success("New address added!");

        // *** Automatically select the newly added address ***
        onAddressSelect(transformAddressForForm(newAddress));
      }

      onComplete();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleDeleteAddress = async (onComplete) => {
    const addressToDelete = modalState.data;
    try {
      const response = await clientFetch(`address/${addressToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.success)
        throw new Error(response.message || "Failed to delete");

      setAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressToDelete._id)
      );
      toast.success("Address deleted!");

      // If the deleted address was the selected one, clear the selection in parent
      if (selectedAddressId === addressToDelete._id) {
        onAddressSelect(null);
      }

      onComplete();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  // --- RENDER LOGIC ---
  if (addresses.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Add a Shipping Address
        </h3>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <AddressForm onSave={handleSaveAddress} />
        </div>
      </motion.div>
    );
  }

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
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Choose an Address
          </h3>
          <motion.button
            type="button"
            onClick={() => handleOpenModal("add")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
          >
            + Add New
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address._id;
            return (
              <motion.div
                key={address._id}
                variants={itemVariants}
                onClick={() =>
                  onAddressSelect(transformAddressForForm(address))
                }
                className={`p-4 rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-200 relative ${
                  isSelected
                    ? "bg-pink-50 border-pink-500"
                    : "bg-white hover:border-pink-300 border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Fancy Radio Marker */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-pink-600 bg-pink-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 size={18} className="text-white" />
                      )}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800">
                            {address.title}
                          </h4>
                          {address.addressType === "home" ? (
                            <Home size={16} className="text-gray-500" />
                          ) : (
                            <Building2 size={16} className="text-gray-500" />
                          )}
                        </div>
                        <address className="mt-1 text-sm text-gray-600 not-italic space-y-0.5">
                          <p>{address.addressLine1}</p>
                          <p>
                            {address.city}, {address.state} -{" "}
                            {address.postalCode}
                          </p>
                        </address>
                      </div>
                      {address.isPrimary && (
                        <div className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star size={12} /> Primary
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal("edit", address);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal("delete", address);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

// --- REUSABLE ADDRESS FORM (Extracted from Modal) ---
const AddressForm = ({ onSave, initialData, isModal = false }) => {
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

  const [formData, setFormData] = useState(initialData || defaultAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData || defaultAddress);
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name])
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      newErrors.postalCode = "Must be a valid 6-digit PIN code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // This is still good practice
    if (!validateForm()) return;

    setIsSubmitting(true);
    onSave(formData, () => {
      setIsSubmitting(false);
      if (!isModal) setFormData(defaultAddress);
    });
  };
  return (
    <div className="space-y-4">
      {/* --- FORM FIELDS (Title, Address Line 1, etc.) --- */}
      {/* The structure is the same as the original modal form */}
      {/* For brevity, I'll show one field as an example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md text-sm ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md text-sm ${
              errors.addressLine1 ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.addressLine1 && (
            <p className="mt-1 text-xs text-red-500">{errors.addressLine1}</p>
          )}
        </div>
        {/* ... Add all other fields here (AddressLine2, City, State, PostalCode, Landmark) ... */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md text-sm ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md text-sm ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-red-500">{errors.state}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full mt-1 p-2 border rounded-md text-sm ${
              errors.postalCode ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.postalCode && (
            <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            readOnly
            className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-50 border-gray-300"
          />
        </div>
      </div>
      {/* --- Address Type, Primary Checkbox --- */}
      <div>{/* ... Address Type Radio buttons ... */}</div>
      <div className="flex items-center gap-2">
        {/* ... isPrimary Checkbox ... */}
      </div>

      <div className="flex justify-end pt-2">
        <motion.button
          type="button" // Set type to "button" to prevent submitting the parent form
          onClick={handleSubmit} // Trigger the submit logic on click
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg shadow-sm"
        >
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : initialData ? (
            "Update Address"
          ) : (
            "Save Address"
          )}
        </motion.button>
      </div>
    </div>
  );
};

// --- MODAL FOR ADDING/EDITING (Now uses AddressForm) ---
const AddressModal = ({ isOpen, onClose, onSave, addressToEdit }) => {
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
            <header className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">
                {addressToEdit ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </header>
            <div className="p-6 overflow-y-auto">
              <AddressForm
                onSave={(formData, onComplete) => {
                  onSave(formData, () => {
                    onComplete();
                    onClose(); // Close modal after saving
                  });
                }}
                initialData={addressToEdit}
                isModal={true}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- DELETE CONFIRMATION MODAL (No changes needed) ---
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onDelete,
  addressTitle,
}) => {
  // ... This component remains the same as your original ...
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
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center w-28 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
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

export default AddressTabForShipping;
