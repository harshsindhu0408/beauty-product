"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { clientFetch } from "@/services/clientfetch";
import ProductSection from "@/components/ProductSection";
import ReviewsSlider from "@/components/ReviewSlider";
import RelatedProducts from "@/components/RelatedProducts";
import FeaturesSection from "@/components/FeaturesSection";

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

const ProductPage = ({ productData, similarProducts }) => {
  const router = useRouter();
  const product = productData?.product;
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [status, setStatus] = useState("idle"); // 'idle', 'adding', 'added'

  // Calculate final price
  const finalPrice = product
    ? product.price + (selectedVariant?.priceAdjustment || 0)
    : 0;

  // Use useEffect to set initial variant
  useEffect(() => {
    if (product && !selectedVariant) {
      setSelectedVariant(product.variants?.[0]?.options?.[0] || null);
    }
  }, [product, selectedVariant]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Product not found
          </h2>
          <button
            onClick={() => router.push("/products")}
            className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-full"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const addToCartHandler = async (selectedVariant, quantity) => {
    if (status !== "idle") return;
    try {
      setStatus("adding");
      const payload = {
        productId: product._id,
        quantity: quantity,
      };

      if (selectedVariant && product.variants?.length > 0) {
        const variant = product.variants[0];
        payload.variant = {
          variantName: variant.name,
          optionName: selectedVariant.name,
          priceAdjustment: selectedVariant.priceAdjustment || 0,
        };
      }

      const response = await clientFetch("cart", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.success) {
        // toast.success(response.message);
        setTimeout(() => {
          setStatus("added");

          setTimeout(() => {
            router.push("/cart");
          }, 700);
        }, 500);
      } else {
        toast.error(response.message);
        throw new Error("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message);
    }
  };

  // Handle buy now
  const buyNowHandler = async (selectedVariant, quantity) => {
    try {
      const payload = {
        items: [
          {
            product: {
              _id: product._id,
              name: product.name,
              images: product.images,
            },
            quantity: quantity,
            price: finalPrice,
            selectedVariant: selectedVariant
              ? {
                  variantName: product.variants?.[0]?.name,
                  optionName: selectedVariant.name,
                  priceAdjustment: selectedVariant.priceAdjustment || 0,
                }
              : null,
            itemTotal: finalPrice * quantity,
          },
        ],
        source: "buy_now",
      };

      const response = await clientFetch("checkout", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response && response.success) {
        const { sessionId, redirectUrl } = response.data;
        router.push(redirectUrl || `/checkout?sessionId=${sessionId}`);
      } else {
        toast.error(response?.message || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Error in buy now:", error);
      toast.error("Failed to process buy now request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Product Section */}
      {productData && (
        <ProductSection
          product={productData.product}
          addToCartHandler={addToCartHandler}
          buyNowHandler={buyNowHandler}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          status={status}
        />
      )}

      {/* Reviews Section */}
      {product?.reviews?.length > 0 && (
        <ReviewsSlider
          reviews={product?.reviews}
          averageRating={product?.averageRating}
          reviewCount={product?.reviewCount}
          productname={product?.name}
        />
      )}

      {/* Similar products section */}
      {similarProducts?.products?.length > 0 && (
        <RelatedProducts
          products={similarProducts.products}
          title="You May Also Like"
          subtitle="Discover similar products that might interest you"
        />
      )}

      <FeaturesSection />
    </div>
  );
};

export default ProductPage;
