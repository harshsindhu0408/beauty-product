// components/RelatedProducts.jsx
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const RelatedProducts = ({
  products = [],
  title = "You May Also Like",
  subtitle = "Discover similar products that might interest you",
  maxProducts = 8,
}) => {
  const router = useRouter();

  // Return null if there are no products to display, preventing component render.
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  // Get primary image for a product, with robust checks
  const getPrimaryImage = (product) => {
    if (
      !product?.images ||
      !Array.isArray(product.images) ||
      product.images.length === 0
    ) {
      return null;
    }
    const primaryImage = product.images.find((img) => img?.isPrimary);
    return primaryImage || product.images[0];
  };

  // Format price with currency symbol, checking if the price is a valid number
  const formatPrice = (price) => {
    if (typeof price !== "number") {
      return "$0.00"; // Return a default value if price is not a number
    }
    return `$${price.toFixed(2)}`;
  };

  // Slice products to the maximum specified count
  const displayProducts = products.slice(0, maxProducts);

  return (
    <section className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product, index) => {
          // Ensure product is a valid object before trying to render it
          if (!product || typeof product !== "object") return null;

          const primaryImage = getPrimaryImage(product);
          const rating = Math.floor(product.averageRating ?? 0);
          const reviewCount = product.reviewCount ?? 0;

          return (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow duration-300"
              onClick={() =>
                product.slug && router.push(`/products/${product.slug}`)
              }
            >
              <div className="aspect-square w-full relative overflow-hidden">
                {primaryImage?.url ? (
                  <Image
                    src={primaryImage.url}
                    alt={
                      primaryImage.altText || product.name || "Product Image"
                    }
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* Discount badge - uses hasDiscount and discountPercentage from your data */}
                {product.hasDiscount && product.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </div>
                )}

                {/* Out of stock badge */}
                {product.isInStock === false && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button className="bg-white text-pink-600 px-4 py-1.5 rounded-full font-medium text-sm hover:bg-pink-50 transition-colors">
                    Quick View
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                  {product.name || "Untitled Product"}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {product.categories?.[0]?.name ?? "Uncategorized"}
                </p>

                <div className="flex items-center gap-2">
                  <p className="text-gray-900 font-bold">
                    {formatPrice(product.price)}
                  </p>

                  {/* Strikethrough price */}
                  {product.hasDiscount &&
                    typeof product.compareAtPrice === "number" &&
                    product.compareAtPrice > product.price && (
                      <p className="text-gray-400 text-sm line-through">
                        {formatPrice(product.compareAtPrice)}
                      </p>
                    )}
                </div>

                {/* Rating section */}
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating ? "fill-current" : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">
                    ({reviewCount})
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
