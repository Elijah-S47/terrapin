import Image from "next/image";
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
    <main id="top" className="relative isolate">
      <div aria-hidden="true" className="fixed inset-0 z-0">
        <Image
          src="/images/ashiatsu-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[63%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-[#101a13]/35" />
      </div>
      <Hero />
      <div className="relative z-10">
        <Services />
      </div>
      <Pricing />
      <div className="relative z-20">
        <About />
        <WhatToExpect />
        <Testimonials />
        <Location />
        <BookingCTA />
        <SiteFooter />
      </div>
    </main>
  );
}