import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Truck,
  Shield,
  Check,
  Share2,
  AlertCircle,
  CheckCircle,
  Headphones,
} from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ExpandableSections } from "./ExpandableSections";
import { AnimatePresence } from "framer-motion";
import { shareProduct } from "@/utils/share";
import toast from "react-hot-toast";

const Sparkles = () => {
  // A utility to generate a random number in a range
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

  const sparkles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: random(-50, 50),
    y: random(-50, 50),
    scale: random(0.5, 1.5),
    duration: random(0.4, 1.0),
    delay: random(0, 0.5),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map(({ id, x, y, scale, duration, delay }) => (
        <motion.div
          key={id}
          className="absolute bg-yellow-400 rounded-full"
          style={{ width: "8px", height: "8px", top: "50%", left: "50%" }}
          initial={{ opacity: 0 }}
          animate={{ x, y, scale: [0, scale, 0], opacity: [1, 1, 0] }}
          transition={{ duration, ease: "easeInOut", delay }}
        />
      ))}
    </div>
  );
};

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cartVariants = {
  initial: { x: 0 },
  animate: {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.4, repeat: Infinity, repeatType: "reverse" },
  },
};

const ProductSection = ({
  product,
  addToCartHandler,
  buyNowHandler,
  selectedVariant,
  setSelectedVariant,
  status,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollRef = useRef(null);
  const thumbnailsContainerRef = useRef(null);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Calculate final price
  const finalPrice = product.price + (selectedVariant?.priceAdjustment || 0);
  const discount =
    product.compareAtPrice > finalPrice
      ? Math.round(
          ((product.compareAtPrice - finalPrice) / product.compareAtPrice) * 100
        )
      : 0;

  const handleShareProduct = async () => {
    try {
      const result = await shareProduct(product, selectedVariant);

      if (result === "copy") {
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing product:", error);
      toast.error("Failed to share product", {
        duration: 3000,
        position: "bottom-center",
      });
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }
      />
    ));
  };

  // Auto-scroll timer function
  const startAutoScroll = () => {
    if (!product?.images?.length || product.images.length <= 1) return;

    autoScrollRef.current = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }, 3000);
  };

  // Reset auto-scroll function
  const resetAutoScroll = () => {
    // Clear existing timer
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    // Restart auto-scroll if it was enabled
    if (isAutoScrolling) {
      startAutoScroll();
    }
  };

  // Initialize and cleanup
  useEffect(() => {
    if (product?.images?.length > 1 && isAutoScrolling) {
      startAutoScroll();
    }

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [product?.images?.length, isAutoScrolling]);

  // Update thumbnail scroll position when active image changes
  useEffect(() => {
    if (thumbnailsContainerRef.current && product?.images?.length > 1) {
      const container = thumbnailsContainerRef.current;
      const thumbnailWidth = container.children[0]?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollPosition = activeImage * (thumbnailWidth + gap);

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeImage, product?.images?.length]);

  return (
    <section className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Main Image */}
          <motion.div
            variants={fadeIn}
            className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 shadow-lg relative group"
          >
            <img
              src={
                product?.images?.[activeImage]?.url || "/placeholder-image.jpg"
              }
              alt={product?.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product?.isFeatured && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
              {discount > 0 && (
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Auto-scroll indicator and controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
              {product?.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(index);
                    resetAutoScroll();
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImage === index ? "bg-white scale-125" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Thumbnails with auto-scroll */}
          {product?.images?.length > 1 && (
            <motion.div variants={fadeIn} className="relative">
              <div className="flex overflow-hidden">
                <div
                  className="flex gap-4 animate-infinite-scroll"
                  style={{
                    animation: `infinite-scroll ${
                      product.images.length * 3
                    }s linear infinite`,
                  }}
                >
                  {/* Duplicate images for seamless loop */}
                  {[...product.images, ...product.images].map(
                    (image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const actualIndex = index % product.images.length;
                          setActiveImage(actualIndex);
                          resetAutoScroll();
                        }}
                        className={`aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all flex-shrink-0 w-1/4 ${
                          activeImage === index % product.images.length
                            ? "border-green-600 ring-2 ring-green-200"
                            : "border-gray-200 hover:border-green-400"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product?.name} view ${
                            (index % product.images.length) + 1
                          }`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Manual navigation arrows */}
              <button
                onClick={() => {
                  const nextImage =
                    activeImage === 0
                      ? product.images.length - 1
                      : activeImage - 1;
                  setActiveImage(nextImage);
                  resetAutoScroll();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => {
                  const nextImage = (activeImage + 1) % product.images.length;
                  setActiveImage(nextImage);
                  resetAutoScroll();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Title and rating */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
                {product.name}
              </h1>

              {/* Share Button - Moved here for better placement */}
              <button
                onClick={handleShareProduct}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md min-w-[100px] justify-center"
              >
                <Share2 size={18} className="text-gray-600" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex">
                {renderStars(product.averageRating || 0)}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.reviewCount} reviews)
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-600">
                {product.soldCount} sold
              </span>
            </div>

            {/* SKU and availability */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>SKU: {product.sku}</span>
              <span className="flex items-center">
                {product.isInStock ? (
                  <>
                    <Check size={16} className="text-emerald-600 mr-1" />
                    In Stock
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-red-600 mr-1" />
                    Out of Stock
                  </>
                )}
              </span>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div variants={fadeIn} className="flex flex-col space-y-3">
            <div className="flex flex-wrap items-baseline gap-2">
              {/* Current Price */}
              <p className="text-3xl font-bold text-green-600">
                ₹{finalPrice ? finalPrice.toLocaleString("en-IN") : "0"}
              </p>

              {/* Original Price */}
              {selectedVariant?.compareAtPrice > finalPrice && (
                <p className="text-xl text-gray-400 line-through">
                  ₹{selectedVariant?.compareAtPrice}
                </p>
              )}

              {/* Discount Percentage */}
              {selectedVariant?.compareAtPrice > finalPrice && (
                <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-1 rounded-full">
                  {Math.round(
                    ((selectedVariant?.compareAtPrice - finalPrice) /
                      selectedVariant?.compareAtPrice) *
                      100
                  )}
                  % OFF
                </span>
              )}
            </div>

            {/* Tax Information */}
            <p className="text-sm text-gray-500">
              {finalPrice > 1000 ? (
                <>
                  Inclusive of all taxes +{" "}
                  <span className="text-emerald-600">FREE Shipping</span>
                </>
              ) : (
                <>Inclusive of all taxes</>
              )}
            </p>
          </motion.div>

          {/* Short description */}
          <motion.div variants={fadeIn}>
            <p className="text-gray-700 leading-relaxed">
              {product.shortDescription}
            </p>
          </motion.div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {product.variants[0].name}
                </h3>
                {selectedVariant && (
                  <span className="text-sm text-gray-500">
                    Stock: {selectedVariant.stock} available
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {product?.variants?.[0]?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(option)}
                    className={`px-4 cursor-pointer py-2 rounded-full border transition-colors ${
                      selectedVariant?.name === option.name
                        ? "border-green-600 bg-green-50 text-green-600"
                        : "border-gray-300 text-gray-700 hover:border-green-600"
                    }`}
                  >
                    {option?.name}
                    {/* Optional: Show price difference */}
                    {option?.priceAdjustment > 0 &&
                      ` (+₹${option?.priceAdjustment})`}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quantity Selector */}
          <motion.div
            variants={fadeIn}
            className="flex items-center space-x-4 py-4 border-t border-gray-200"
          >
            <span className="text-lg font-medium text-gray-900">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="w-10 cursor-pointer h-10 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors"
                disabled={quantity <= 1}
              >
                <span className="sr-only">Decrease quantity</span>−
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 cursor-pointer h-10 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors"
                disabled={selectedVariant && quantity >= selectedVariant.stock}
              >
                <span className="sr-only">Increase quantity</span>+
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={() => {
                addToCartHandler(selectedVariant, quantity);
              }}
              disabled={!product.isInStock || status !== "idle"}
              className="relative flex-1 cursor-pointer bg-green-600 text-white py-4 px-8 rounded-full font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Show sparkles only when adding */}
              {status === "adding" && <Sparkles />}

              <motion.svg
                variants={cartVariants}
                animate={status === "adding" ? "animate" : "initial"}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </motion.svg>

              {/* Animated Text */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {status === "added" ? "Added!" : "Add to Cart"}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              onClick={() => buyNowHandler(selectedVariant, quantity)}
              disabled={!product.isInStock}
              className="flex-1 cursor-pointer bg-gray-900 text-white py-4 px-8 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={fadeIn}
            className="pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Truck size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-gray-500">On orders over ₹1000</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Shield size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="font-medium">1-Year Warranty</p>
                  <p className="text-gray-500">Manufacturer coverage</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <CheckCircle size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Authentic Product</p>
                  <p className="text-gray-500">100% genuine guarantee</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Headphones size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Support</p>
                  <p className="text-gray-500">24/7 customer care</p>
                </div>
              </div>
            </div>
          </motion.div>

          <ExpandableSections
            product={product}
            selectedVariant={selectedVariant}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;
