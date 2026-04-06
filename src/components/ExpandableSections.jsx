import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const contentVariants = {
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  expanded: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

// Component implementation
export const ExpandableSections = ({ product, selectedVariant }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Function to get variant-specific specifications
  const getVariantSpecifications = () => {
    if (!selectedVariant) return [];
    
    const specs = [
      { label: "Variant", value: selectedVariant.name },
      { label: "SKU", value: selectedVariant.sku },
      { label: "Price", value: `₹${selectedVariant.price}` },
      { label: "Original Price", value: `₹${selectedVariant.compareAtPrice}` },
      { label: "Stock", value: selectedVariant.stock },
    ];
    
    return specs;
  };

  // Function to get product specifications
  const getProductSpecifications = () => {
    const specs = [
      { label: "Weight", value: `${product.weight} ${product.weightUnit}` },
      { label: "Category", value: product.categories?.[0]?.name || "N/A" },
      { label: "Brand", value: product?.brand?.name || "Generic" },
      { label: "Tags", value: product.tags?.join(", ") || "None" },
      { label: "In Stock", value: product.isInStock ? "Yes" : "No" },
      { label: "Total Quantity", value: product.quantity },
      { label: "Rating", value: `${product.averageRating || 0}/5 (${product.reviewCount || 0} reviews)` },
      { label: "Items Sold", value: product.soldCount || 0 },
    ];
    
    return specs;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="border-t border-gray-200 pt-6"
    >
      {/* Description Section */}
      <motion.div
        variants={sectionVariants}
        className="border-b border-gray-200"
      >
        <button
          onClick={() => toggleSection("description")}
          className="flex cursor-pointer justify-between items-center w-full py-4 text-left group"
          aria-expanded={expandedSection === "description"}
        >
          <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600">
            Description
          </h3>
          <motion.div
            animate={{ rotate: expandedSection === "description" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 group-hover:text-blue-600"
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expandedSection === "description" && (
            <motion.div
              key="description-content"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <div className="pb-4 text-gray-700 prose prose-sm max-w-none">
                <p>{product.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Specifications Section */}
      <motion.div
        variants={sectionVariants}
        className="border-b border-gray-200"
      >
        <button
          onClick={() => toggleSection("specifications")}
          className="flex cursor-pointer justify-between items-center w-full py-4 text-left group"
          aria-expanded={expandedSection === "specifications"}
        >
          <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600">
            Specifications
          </h3>
          <motion.div
            animate={{ rotate: expandedSection === "specifications" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 group-hover:text-blue-600"
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expandedSection === "specifications" && (
            <motion.div
              key="specifications-content"
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <div className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Specifications */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 border-b pb-1">Product Details</h4>
                    {getProductSpecifications().map((spec, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{spec.label}</span>
                        <span className="font-medium text-right max-w-xs">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Variant Specifications */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-800 border-b pb-1">Variant Details</h4>
                    {selectedVariant ? (
                      getVariantSpecifications().map((spec, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{spec.label}</span>
                          <span className="font-medium text-right max-w-xs">
                            {spec.value}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">No variant selected</div>
                    )}
                  </div>
                </div>
                
                {/* Custom Specifications if available */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-gray-800 border-b pb-1">Additional Specifications</h4>
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{spec.label}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shipping & Returns Section */}
      <motion.div
        variants={sectionVariants}
        className="border-b border-gray-200"
      >
        <button
          onClick={() => toggleSection("shipping")}
          className="flex cursor-pointer justify-between items-center w-full py-4 text-left group"
          aria-expanded={expandedSection === "shipping"}
        >
          <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600">
            Shipping & Returns
          </h3>
          <motion.div
            animate={{ rotate: expandedSection === "shipping" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 group-hover:text-blue-600"
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expandedSection === "shipping" && (
            <motion.div
              key="shipping-content"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: {
                  opacity: { duration: 0.2, ease: "easeOut" },
                  height: { duration: 0.3, ease: "easeOut" },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  opacity: { duration: 0.2, ease: "easeIn" },
                  height: { duration: 0.3, ease: "easeIn" },
                },
              }}
              className="overflow-hidden"
            >
              <div className="pb-4 text-gray-700">
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1, duration: 0.2 },
                  }}
                  className="mb-2"
                >
                  <strong>Free standard shipping</strong> on orders over ₹1000.
                  Express shipping options available at checkout.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.15, duration: 0.2 },
                  }}
                  className="mb-2"
                >
                  International shipping to select countries. Customs and import
                  taxes may apply.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};