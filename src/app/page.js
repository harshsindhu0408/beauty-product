import React from "react";
import dynamic from "next/dynamic";
import BeaucareHero from "@/components/BeaucareHero";
import ProductSlider from "@/components/ProductSlider";
import ShopByCategories from "@/components/ShopByCategories";
import { FetchData } from "@/services/useServerFetch";

// Lazy load below-the-fold components
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection"),
);
const IngredientsShowcase = dynamic(
  () => import("@/components/IngredientsShowcase"),
);
const BrandStory = dynamic(() => import("@/components/BrandStory"));

export const metadata = {
  title: "Saundrya Earth | Premium Skincare Products & Conscious Beauty",
  description:
    "Experience the science and soul of beauty with Saundrya Earth. Explore our premium collection of ethical skincare products, organic serums, and natural beauty essentials.",
  keywords: [
    "Saundrya Earth",
    "skincare products",
    "premium beauty products",
    "organic skincare",
    "clean beauty",
    "natural skincare India",
    "best skincare products",
    "cleanser",
    "face serum",
    "night cream",
    "sunscreen",
    "skincare",
    "skincare products",
    "skincare",
    
  ],
  alternates: {
    canonical: "https://www.saundryaearth.com",
  },
  openGraph: {
    title: "Saundrya Earth | Premium Skincare Products & Conscious Beauty",
    description:
      "Experience the science and soul of beauty with Saundrya Earth. Explore our premium collection of ethical skincare products and organic serums.",
    url: "https://www.saundryaearth.com",
  },
};

// Enable ISR with 1-hour revalidation
export const revalidate = 300;

export default async function Home() {
  const [banners, categories] = await Promise.all([
    FetchData("banner", {
      cache: "force-cache",
      next: { revalidate: 300 },
      skipAuth: true,
    }),
    FetchData("category", {
      cache: "force-cache",
      next: { revalidate: 300 },
      skipAuth: true,
    }),
  ]);

  const safeBanners = banners?.data || [];
  const safeCategories = categories?.data || [];

  return (
    <React.Fragment>
      <BeaucareHero banners={safeBanners} />

      <ProductSlider />
      <ShopByCategories categories={safeCategories} />
      <IngredientsShowcase />
      <BrandStory />
      <WhyChooseUs />
      <TestimonialsSection />
    </React.Fragment>
  );
}
