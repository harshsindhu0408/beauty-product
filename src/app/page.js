import React from "react";
import BeaucareHero from "@/components/BeaucareHero";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductSlider from "@/components/ProductSlider";
import ShopByCategories from "@/components/ShopByCategories";
import IngredientsShowcase from "@/components/IngredientsShowcase";
import BrandStory from "@/components/BrandStory";
import { FetchData } from "@/services/useServerFetch";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [banners, categories] = await Promise.all([
    FetchData("banner"),
    FetchData("category"),
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
