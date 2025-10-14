import React from 'react';
import Image from "next/image";
import BeaucareHero from '@/components/BeaucareHero';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProductShowcase from '@/components/ProductShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import ProductSlider from '@/components/ProductSlider';

export default function Home() {
  return (
  <React.Fragment>
    <BeaucareHero/>
    <WhyChooseUs/>
    <ProductSlider/>
    {/* <ProductShowcase/> */}
    <TestimonialsSection/>
  </React.Fragment>
  );
}
