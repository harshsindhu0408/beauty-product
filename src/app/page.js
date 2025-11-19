import React from 'react';
import BeaucareHero from '@/components/BeaucareHero';
import WhyChooseUs from '@/components/WhyChooseUs';
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
