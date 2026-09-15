"use client";

import Image from "next/image";
import { useRef } from "react";
import { Allura, Cormorant_Garamond, Montserrat } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const script = Allura({ subsets: ["latin"], weight: "400" });
const sans = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600"] });

const BOOKING_URL =
  "https://book.squareup.com/appointments/9fgpc4hm6ufnr4/location/LX4AV9V8XWJTQ/services";

const petals = [
  { left: "63%", top: "28%", size: 12, delay: 0.1, duration: 6.8 },
  { left: "78%", top: "39%", size: 9, delay: 1.5, duration: 7.5 },
  { left: "70%", top: "51%", size: 14, delay: 2.4, duration: 8.1 },
  { left: "85%", top: "59%", size: 10, delay: 0.8, duration: 6.4 },
  { left: "58%", top: "69%", size: 8, delay: 3.2, duration: 7.2 },
  { left: "76%", top: "78%", size: 12, delay: 1.9, duration: 8.6 },
];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set("[data-reveal], [data-tree], [data-petal]", {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .from("[data-bg]", { scale: 1.08, duration: 1.8 })
        .from(
          "[data-tree]",
          {
            opacity: 0,
            xPercent: 18,
            scale: 0.92,
            transformOrigin: "100% 100%",
            duration: 1.8,
          },
          0.15,
        )
        .from(
          "[data-reveal]",
          { opacity: 0, y: 24, duration: 0.85, stagger: 0.09 },
          0.35,
        )
        .from(
          "[data-petal]",
          { opacity: 0, scale: 0, duration: 0.45, stagger: 0.08 },
          0.9,
        );

      gsap.utils.toArray<HTMLElement>("[data-petal]").forEach((petal) => {
        gsap.to(petal, {
          x: "random(-28, 22)",
          y: "random(60, 115)",
          rotation: "random(140, 420)",
          duration: Number(petal.dataset.duration),
          delay: Number(petal.dataset.delay),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      const desktop = gsap.matchMedia();
      desktop.add("(min-width: 768px)", () => {
        gsap.to("[data-bg]", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.to("[data-tree]", {
          yPercent: -3,
          xPercent: 2,
          scale: 1.035,
          ease: "none",
          scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      });

      return () => desktop.revert();
    },
    { scope: hero },
  );

  return (
    <section
      ref={hero}
      className={`${sans.className} relative isolate min-h-[100svh] overflow-hidden bg-[#172119] text-[#f7f0e4]`}
    >
      <div data-bg className="absolute -inset-[5%]">
        <Image
          src="/images/ashiatsu-hero.png"
          alt="Barefoot bodywork massage treatment"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-center"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,22,15,.82)_0%,rgba(12,22,15,.66)_52%,rgba(12,22,15,.38)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,11,.3)_0%,transparent_31%,rgba(8,15,10,.14)_66%,rgba(8,15,10,.6)_100%)]" />

      <div
        data-tree
        aria-hidden="true"
        className="pointer-events-none absolute -right-[30%] top-[9%] z-[2] h-[90%] w-[112%] sm:-right-[16%] sm:top-[5%] sm:h-[98%] sm:w-[82%] lg:-right-[7%] lg:w-[62%]"
      >
        <Image
          src="/images/terrapin-tree-frame.png"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 112vw, (max-width: 1024px) 82vw, 62vw"
          className="object-contain object-right"
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
        {petals.map((petal, index) => (
          <span
            key={index}
            data-petal
            data-delay={petal.delay}
            data-duration={petal.duration}
            className="absolute block rounded-[90%_15%_80%_20%] bg-[radial-gradient(circle_at_35%_30%,#f8d9d5_0_24%,#d58f94_60%,#a95865_100%)] shadow-[0_2px_4px_rgba(40,14,16,.25)]"
            style={{
              left: petal.left,
              top: petal.top,
              width: petal.size,
              height: petal.size * 0.65,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 sm:px-10 lg:px-16">
        <header data-reveal className="flex h-[112px] items-center justify-between border-b border-[#f7f0e4]/25 sm:h-[126px]">
          <a href="#" aria-label="Terrapin Massage home" className="flex items-center gap-3.5 sm:gap-5">
            <span className={`${serif.className} grid size-[58px] place-items-center rounded-full border border-[#f7f0e4] text-[31px] sm:size-[66px] sm:text-[35px]`}>T</span>
            <span className="leading-none">
              <span className="block text-[13px] font-semibold tracking-[.25em] sm:text-[15px]">TERRAPIN</span>
              <span className={`${script.className} mt-1 block text-[24px] leading-none text-[#e2a1a6] sm:text-[28px]`}>Massage</span>
            </span>
          </a>

          <a href={BOOKING_URL} className="group flex items-center gap-2 text-[12px] font-semibold tracking-[.18em] sm:text-sm" target="_blank" rel="noreferrer">
            BOOK <span className="text-lg font-light transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </a>
        </header>

        <div className="flex flex-1 flex-col justify-center pb-24 pt-12 sm:pb-28 sm:pt-16 lg:max-w-[760px]">
          <p data-reveal className="mb-8 max-w-[90%] text-[10px] font-semibold uppercase leading-relaxed tracking-[.25em] text-[#f7f0e4] [text-shadow:0_2px_8px_rgba(8,18,11,1)] sm:text-xs">
            Grounded healing · Casper, Wyoming
          </p>

          <h1 data-reveal className={`${serif.className} max-w-[82%] text-[clamp(4.2rem,20vw,7rem)] font-normal leading-[.72] tracking-[-.055em] sm:max-w-[650px] sm:text-[8.5rem]`}>
            Move<br />
            <span className="ml-[.04em]">toward</span><br />
            <span className={`${script.className} inline-block translate-y-[.08em] font-normal tracking-normal text-[#dda0a6]`}>relief</span>
            <span className="ml-1 text-[.42em] text-[#f7f0e4]">.</span>
          </h1>

          <p data-reveal className="mt-9 max-w-[88%] text-[15px] leading-[1.8] text-[#eee7dc]/90 sm:mt-10 sm:max-w-[590px] sm:text-lg lg:text-xl">
            Personalized massage and barefoot bodywork designed to help you release tension, move more freely, and reconnect with your body.
          </p>

          <a
            data-reveal
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            className="group mt-9 flex w-fit min-w-[292px] items-center justify-between rounded-full bg-[#f7f0e4] px-8 py-5 text-[12px] font-semibold tracking-[.16em] text-[#242a23] transition hover:bg-[#edc7c5] sm:mt-10 sm:min-w-[360px] sm:px-9 sm:py-6 sm:text-sm"
          >
            BOOK YOUR MASSAGE
            <span className="text-lg font-light transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
