// utils/shareProduct.js
export const shareProduct = async (product, selectedVariant) => {
  try {
    // Get current URL path (like /products/saundrya-earth-radiance-boost-serum)
    const currentPath = window.location.pathname;
    const shareUrl = `${window.location.origin}${currentPath}`;

    const shareData = {
      title: product.name,
      text: product.shortDescription,
      url: shareUrl,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      return "copy";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      // Fallback to clipboard if share fails
      await navigator.clipboard.writeText(window.location.href);
      return "copy";
    }
  }
};

export const generateProductMetaTags = (product, selectedVariant) => {
  const finalPrice = product.price + (selectedVariant?.priceAdjustment || 0);
  const imageUrl = product?.images?.[0]?.url || "/placeholder-image.jpg";

  return {
    title: product.name,
    description: product.shortDescription,
    image: imageUrl,
    price: finalPrice,
    currency: "INR",
    availability: product.isInStock ? "in stock" : "out of stock",
    url: typeof window !== "undefined" ? window.location.href : "",
  };
};
