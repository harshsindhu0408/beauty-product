import React from 'react';
import Image from "next/image";
import BeaucareHero from '@/components/BeaucareHero';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProductShowcase from '@/components/ProductShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
  <React.Fragment>
    <BeaucareHero/>
    <WhyChooseUs/>
    <ProductShowcase/>
    {/* <TestimonialsSection/> */}
    <Footer/>
  </React.Fragment>
  );
}
