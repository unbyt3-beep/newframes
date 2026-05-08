"use client";

import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Clientele from "@/components/Clientele/Clientele";
import WhatWeDo from "@/components/WhatWeDo/WhatWeDo";
import Services from "@/components/Services/Services";
import Portfolio from "@/components/Portfolio/Portfolio";
import SWOTAnalysis from "@/components/SWOT/SWOT";
import ThreatsToStrengths from "@/components/ThreatsToStrengths/ThreatsToStrengths";
import Stats from "@/components/Stats/Stats";
import Blog from "@/components/Blog/Blog";
import Testimonials from "@/components/Testimonials/Testimonials";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <WhatWeDo />
      <Clientele />
      <Services />
      <Portfolio />
      <SWOTAnalysis />
      <ThreatsToStrengths />
      <Stats />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
