import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import WhatToExpect from "@/components/WhatToExpect";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import BookingCTA from "@/components/BookingCTA";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Services />
      <Pricing />
      <About />
      <WhatToExpect />
      <Testimonials />
      <Location />
      <BookingCTA />
      <SiteFooter />
    </main>
  );
}