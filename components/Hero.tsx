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

function ArrowUpRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 transition-transform group-hover:translate-y-1">
      <path d="M12 5v14m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
          className="object-cover object-[63%_center] sm:object-center"
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

          <a href="#book" className="group flex items-center gap-2 text-[12px] font-semibold tracking-[.18em] sm:text-sm">
            BOOK <ArrowUpRight />
          </a>
        </header>

        <div className="flex flex-1 flex-col justify-center pb-24 pt-12 sm:pb-28 sm:pt-16 lg:max-w-[760px]">
          <p
            data-reveal
            className="mb-7 w-fit max-w-[82%] rounded-full border border-[#dbe2cc]/25 bg-[#101a13]/55 px-3.5 py-2 text-[9px] font-semibold uppercase leading-relaxed tracking-[.23em] text-[#e8eddc] shadow-[0_5px_24px_rgba(5,12,7,.24)] backdrop-blur-[3px] sm:mb-8 sm:px-4 sm:text-xs"
          >
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

          <div data-reveal className="mt-8 flex w-full max-w-[390px] flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-4">
            <a
              href="#book"
              className="group flex min-h-14 w-full items-center justify-between rounded-full bg-[#626b4f] px-7 py-4 text-[11px] font-semibold tracking-[.16em] text-[#242a23] transition hover:bg-[#edc7c5] sm:w-auto sm:min-w-[250px] sm:px-8 sm:text-xs"
            >
              BOOK NOW
              <ArrowUpRight />
            </a>

            <a
              href="#explore"
              className="group flex min-h-14 w-full items-center justify-between rounded-full border border-[#f7f0e4]/65 bg-[#132018]/45 px-7 py-4 text-[11px] font-semibold tracking-[.14em] text-[#f7f0e4] backdrop-blur-sm transition hover:border-[#e3a2a7] hover:bg-[#e3a2a7]/15 sm:w-auto sm:min-w-[230px] sm:px-8 sm:text-xs"
            >
              EXPLORE TERRAPIN
              <ArrowDown />
            </a>
          </div>
        </div>

        <footer data-reveal className="absolute bottom-6 left-6 flex items-center gap-3 sm:bottom-8 sm:left-10 lg:left-16">
          <span className={`${serif.className} grid size-11 place-items-center rounded-full border border-[#f7f0e4]/55 bg-black/55 text-xl`}>N</span>
          <span className="text-[9px] uppercase tracking-[.25em] text-[#f7f0e4]/65 sm:text-[10px]">At Nature&apos;s Pace</span>
        </footer>
      </div>
    </section>
  );
}
