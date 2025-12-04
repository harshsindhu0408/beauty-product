import React from "react";
import dynamic from "next/dynamic";
import BeaucareHero from "@/components/BeaucareHero";
import ProductSlider from "@/components/ProductSlider";
import ShopByCategories from "@/components/ShopByCategories";
import { FetchData } from "@/services/useServerFetch";

// Lazy load below-the-fold components
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const TestimonialsSection = dynamic(() =>
  import("@/components/TestimonialsSection")
);
const IngredientsShowcase = dynamic(() =>
  import("@/components/IngredientsShowcase")
);
const BrandStory = dynamic(() => import("@/components/BrandStory"));

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
