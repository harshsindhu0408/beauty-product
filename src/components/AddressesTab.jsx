import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Briefcase,
  MapPin,
  Pencil,
  Trash2,
  X,
  Plus,
  LoaderCircle,
  AlertTriangle,
  User,
  Phone,
  Building2,
  Hash,
  Map,
  Compass,
  Check,
  ChevronDown,
} from "lucide-react";
import { clientFetch } from "@/services/clientfetch";
import toast from "react-hot-toast";
import { INDIA_STATES, STATE_DISTRICTS } from "@/utils/indiaData";

// --- Custom Inputs & Components ---

const AddressTypeSelector = ({ value, onChange }) => {
  const types = [
    { id: "home", label: "Home", icon: Home },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "other", label: "Other", icon: MapPin },
  ];

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-bold text-stone-700 uppercase tracking-widest">
        Save Address As
      </label>
      <div className="flex gap-3">
        {types.map((t) => {
          const Icon = t.icon;
          const isActive = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 outline-none ${
                isActive
                  ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <Icon
                size={16}
                className={isActive ? "text-blue-600" : "text-stone-400"}
              />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AddressInputField = ({
  label,
  icon: Icon,
  required,
  error,
  type = "text",
  options = [],
  ...props
}) => (
  <div className="space-y-1.5 w-full">
    <label className="text-sm font-semibold text-stone-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div
      className={`relative flex items-center bg-stone-50/50 rounded-xl border-2 transition-all duration-200 outline-none ${
        error
          ? "border-red-400 bg-white shadow-[0_0_0_4px_rgba(248,113,113,0.1)]"
          : "border-stone-200 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
      }`}
    >
      {Icon && (
        <div className="absolute left-3.5 text-stone-400 pointer-events-none">
          <Icon size={18} />
        </div>
      )}
      {type === "select" ? (
        <select
          {...props}
          className={`w-full bg-transparent py-3.5 text-sm font-medium text-stone-900 outline-none appearance-none rounded-xl ${
            Icon ? "pl-11 pr-10" : "px-4"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...props}
          className={`w-full bg-transparent py-3.5 text-sm font-medium text-stone-900 outline-none placeholder:text-stone-400 rounded-xl ${
            Icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      )}
      {type === "select" && (
        <div className="absolute right-3.5 text-stone-400 pointer-events-none">
          <ChevronDown size={18} />
        </div>
      )}
    </div>
    {error && (
      <p className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1">
        <AlertTriangle size={12} /> {error}
      </p>
    )}
  </div>
);

const PrimaryToggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-colors duration-200 ${checked ? "border-blue-600 bg-blue-50/30" : "border-stone-200 hover:bg-stone-50"}`}
  >
    <div
      className={`relative w-12 h-6.5 rounded-full transition-colors duration-300 shrink-0 ${checked ? "bg-blue-600" : "bg-stone-300"}`}
    >
      <motion.div
        layout
        className="absolute top-1 bottom-1 w-4.5 bg-white rounded-full shadow-sm"
        initial={false}
        animate={{ left: checked ? "calc(100% - 22px)" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
    <div className="flex flex-col text-left">
      <span
        className={`text-sm tracking-tight ${checked ? "font-bold text-blue-900" : "font-semibold text-stone-900"}`}
      >
        Make this my default address
      </span>
      <span className="text-[13px] text-stone-500 mt-0.5">
        We'll automatically select this for future orders.
      </span>
    </div>
  </button>
);

// --- Main Address Page Component ---

const AddressesTab = ({ addressesData }) => {
  const [addresses, setAddresses] = useState(addressesData?.addresses || []);
  const [modalState, setModalState] = useState({ type: null, data: null });

  useEffect(() => {
    setAddresses(addressesData?.addresses || []);
  }, [addressesData]);

  const handleOpenModal = (type, data = null) => setModalState({ type, data });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  const handleSaveAddress = async (addressData, onComplete) => {
    try {
      const payload = {
        title: addressData.title.trim(),
        phone: addressData.phone?.trim(),
        addressLine1: addressData.addressLine1.trim(),
        addressLine2: addressData.addressLine2?.trim() || "",
        city: addressData.city.trim(),
        state: addressData.state.trim(),
        country: addressData.country.trim() || "India",
        postalCode: addressData.postalCode.trim(),
        landmark: addressData.landmark?.trim() || "",
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      };

      if (addressData._id && !addressData._id.startsWith("new-")) {
        const response = await clientFetch(`address/${addressData._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        if (!response.success)
          throw new Error(response.message || "Failed to update address");

        const updatedAddress = await response?.data;
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === addressData._id ? updatedAddress : addr,
          ),
        );
        toast.success("Address updated successfully!");
      } else {
        const response = await clientFetch("address", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        if (!response.success)
          throw new Error(response.message || "Failed to add address");
        const newAddress = await response.data;
        setAddresses((prev) => [...prev, newAddress]);
        toast.success("New address added successfully!");
      }
      onComplete();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(
        error.message || "An error occurred while saving the address",
      );
      onComplete(true); // pass back error flag
    }
  };

  const handleDeleteAddress = async (onComplete) => {
    const addressToDelete = modalState.data;
    try {
      const response = await clientFetch(`address/${addressToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.success)
        throw new Error(response.message || "Failed to delete address");

      setAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressToDelete._id),
      );
      toast.success("Address deleted successfully!");
      onComplete();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(
        error.message || "An error occurred while deleting the address",
      );
      onComplete();
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-500 pb-20">
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
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Saved Addresses
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage where your orders are delivered.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("add")}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {addresses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses?.map((address) => (
            <div
              key={address._id}
              className="group relative bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-300"
            >
              {address.isPrimary && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <Check size={12} strokeWidth={3} /> Default
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  {address.addressType === "home" ? (
                    <Home className="text-gray-600" size={20} />
                  ) : address.addressType === "work" ? (
                    <Briefcase className="text-gray-600" size={20} />
                  ) : (
                    <MapPin className="text-gray-600" size={20} />
                  )}
                </div>

                <div className="flex-1 mt-1">
                  <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    {address.title || "Full Name"}
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">
                      {address.addressType}
                    </span>
                  </h4>
                  {address.phone && (
                    <p className="text-sm font-medium text-gray-600 mt-1">
                      {address.phone}
                    </p>
                  )}

                  <div className="mt-4 text-sm text-gray-600 space-y-1.5 leading-relaxed">
                    <p className="font-medium text-gray-800">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} —{" "}
                      <span className="font-bold text-gray-800">
                        {address.postalCode}
                      </span>
                    </p>
                    <p className="text-gray-500">{address.country}</p>
                    {address.landmark && (
                      <p className="text-xs text-blue-600 font-medium mt-1 bg-blue-50/50 inline-block px-2 py-1 rounded">
                        Landmark: {address.landmark}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-end gap-3 opacity-100">
                <button
                  onClick={() => handleOpenModal("edit", address)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <div className="w-px h-4 bg-gray-200" />
                <button
                  onClick={() => handleOpenModal("delete", address)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} className="text-gray-300" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 tracking-tight">
            No Delivery Addresses
          </h4>
          <p className="mt-2 text-base text-gray-500 max-w-sm mx-auto">
            You haven't saved any addresses. Add your home or work address for
            faster checkout.
          </p>
          <button
            onClick={() => handleOpenModal("add")}
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
          >
            <Plus size={18} />
            Add First Address
          </button>
        </div>
      )}
    </div>
  );
};

// --- MODAL FOR ADDING/EDITING ---

const AddressModal = ({ isOpen, onClose, onSave, addressToEdit }) => {
  const defaultAddress = {
    title: "",
    phone: "",
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

  const [formData, setFormData] = useState(defaultAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFetchingPin, setIsFetchingPin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(addressToEdit || defaultAddress);
      setErrors({});
    }
  }, [addressToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const ne = { ...prev };
        delete ne[name];
        return ne;
      });
    }
  };

  const handlePincodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only 6 digits
    handleChange({ target: { name: "postalCode", value } });

    if (value.length === 6) {
      setIsFetchingPin(true);
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`,
        );
        const data = await res.json();
        if (data && data[0].Status === "Success") {
          const po = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: po.District || po.Block || po.Name,
            state: po.State,
            country: po.Country || "India",
          }));
          setErrors((prev) => {
            const n = { ...prev };
            delete n.city;
            delete n.state;
            return n;
          });
        }
      } catch (err) {
        // silently fail on network error
      } finally {
        setIsFetchingPin(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Name is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "District is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postalCode.trim() || !/^\d{6}$/.test(formData.postalCode))
      newErrors.postalCode = "Valid 6-digit PIN required";

    // Validate that city and state are within our lists
    if (formData.state && !INDIA_STATES.includes(formData.state)) {
      newErrors.state = "Please select a valid state from the list";
    }
    if (
      formData.state &&
      formData.city &&
      !STATE_DISTRICTS[formData.state]?.includes(formData.city)
    ) {
      newErrors.city = "Please select a valid district from the list";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    onSave(formData, (err) => {
      setIsSubmitting(false);
      if (!err) onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-[650px] max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex flex-col px-6 sm:px-8 py-6 border-b border-gray-100 bg-gray-50/30 relative">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {addressToEdit ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Update your delivery details for faster checkout.
            </p>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 overflow-y-auto space-y-6"
          >
            {/* ROW 1: Type Selection */}
            <AddressTypeSelector
              value={formData.addressType}
              onChange={(val) =>
                setFormData((p) => ({ ...p, addressType: val }))
              }
            />

            <div className="h-px w-full bg-gray-100" />

            {/* ROW 2: Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <AddressInputField
                label="Full Name"
                name="title"
                value={formData.title}
                onChange={handleChange}
                icon={User}
                placeholder="John Doe"
                required
                error={errors.title}
              />
              <AddressInputField
                label="Mobile Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="+91 9876543210"
              />
            </div>

            {/* ROW 3 & 4: Address Lines */}
            <AddressInputField
              label="Flat, House no., Building, Company"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              icon={Building2}
              placeholder="123, Tech Park"
              required
              error={errors.addressLine1}
            />
            <AddressInputField
              label="Area, Street, Sector, Village"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              icon={Map}
              placeholder="Optional address details"
            />

            {/* ROW 5: Pincode & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative">
                <AddressInputField
                  label="PIN Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handlePincodeChange}
                  icon={Hash}
                  placeholder="6 digits [0-9]"
                  maxLength={6}
                  required
                  error={errors.postalCode}
                />
                {isFetchingPin && (
                  <div className="absolute right-4 top-[38px]">
                    <LoaderCircle
                      size={16}
                      className="animate-spin text-blue-500"
                    />
                  </div>
                )}
              </div>
              <AddressInputField
                label="Country"
                name="country"
                value={formData.country}
                readOnly
                disabled
                className="w-full bg-transparent py-3.5 px-4 text-sm font-medium text-gray-500 outline-none cursor-not-allowed"
              />
            </div>

            {/* ROW 6: City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <AddressInputField
                label="State"
                name="state"
                value={formData.state}
                onChange={(e) => {
                  handleChange(e);
                  // Reset city when state changes
                  setFormData((prev) => ({ ...prev, city: "" }));
                }}
                type="select"
                options={INDIA_STATES}
                required
                error={errors.state}
              />
              <AddressInputField
                label="District/City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                type="select"
                options={STATE_DISTRICTS[formData.state] || []}
                disabled={!formData.state}
                placeholder={
                  formData.state ? "Select district" : "Select state first"
                }
                required
                error={errors.city}
              />
            </div>

            {/* ROW 7: Landmark */}
            <AddressInputField
              label="Landmark (Optional)"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              icon={Compass}
              placeholder="e.g. Near Apollo Hospital"
            />

            <div className="pt-2">
              <PrimaryToggle
                checked={formData.isPrimary}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, isPrimary: val }))
                }
              />
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-6 mt-6 bg-white flex flex-col-reverse sm:flex-row gap-4 sticky bottom-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto flex-1 py-4 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 focus:bg-gray-50 rounded-xl transition-all shadow-sm outline-none focus:border-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex-[2] flex items-center justify-center gap-2 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="animate-spin" size={20} /> Saving
                    Data...
                  </>
                ) : addressToEdit ? (
                  "Update Address"
                ) : (
                  "Save Delivery Address"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- MODAL FOR DELETE CONFIRMATION ---

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-[400px] p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto bg-red-50 border-8 border-red-50/50 w-20 h-20 flex items-center justify-center rounded-full mb-6">
            <Trash2 className="text-red-500" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            Delete Address
          </h3>
          <p className="text-[15px] font-medium text-gray-500 mt-2 leading-relaxed">
            Are you sure you want to remove this address? You'll need to add it
            again if you want to use it later.
          </p>
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <LoaderCircle className="animate-spin" size={20} />
              ) : (
                "Yes, Delete Address"
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full py-4 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressesTab;
