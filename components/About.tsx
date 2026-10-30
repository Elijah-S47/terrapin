"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const fallingPetals = [
  { left: "12%", top: "26%", size: 9, delay: 0.6, duration: 7.1 },
  { left: "27%", top: "32%", size: 11, delay: 2.3, duration: 8.3 },
  { left: "19%", top: "19%", size: 8, delay: 1.1, duration: 7.7 },
  { left: "35%", top: "25%", size: 10, delay: 3.2, duration: 8.8 },
  { left: "8%", top: "36%", size: 7, delay: 2.7, duration: 6.9 },
  { left: "41%", top: "36%", size: 9, delay: 0.4, duration: 7.9 },
  { left: "17%", top: "48%", size: 10, delay: 0.2, duration: 6.8 },
  { left: "29%", top: "57%", size: 8, delay: 1.4, duration: 7.5 },
  { left: "43%", top: "47%", size: 12, delay: 2.1, duration: 8.1 },
  { left: "58%", top: "59%", size: 9, delay: 0.8, duration: 6.4 },
  { left: "73%", top: "49%", size: 8, delay: 2.8, duration: 7.2 },
  { left: "84%", top: "60%", size: 11, delay: 1.7, duration: 8.6 },
];

export default function About() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const petals = gsap.utils.toArray<HTMLElement>("[data-about-petal]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(petals, { opacity: 0 });
        return;
      }

      gsap.fromTo(
        petals,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          delay: 0.3,
        },
      );

      petals.forEach((petal) => {
        gsap.to(petal, {
          x: "random(-24, 20)",
          y: "random(45, 85)",
          rotation: "random(140, 420)",
          duration: Number(petal.dataset.duration),
          delay: Number(petal.dataset.delay),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="about"
      aria-labelledby="about-heading"
      className="bg-[#f8f5ee] px-6 py-24 text-[#17201d] sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 md:grid-cols-[.9fr_1.1fr] md:gap-20">
        <div className="relative min-h-[360px] overflow-hidden rounded-[48%_48%_12px_12px] bg-[#e7e5d9] sm:min-h-[500px]">
          <Image
            src="/images/terrapin-cherry-tree.png"
            alt="Illustration of a blossoming cherry tree"
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-contain object-center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          >
            {fallingPetals.map((petal, index) => (
              <span
                key={index}
                data-about-petal
                data-delay={petal.delay}
                data-duration={petal.duration}
                className="absolute block rounded-[90%_15%_80%_20%] bg-[radial-gradient(circle_at_35%_30%,#f8d9d5_0_24%,#d58f94_60%,#a95865_100%)] shadow-[0_2px_4px_rgba(40,14,16,.25)]"
                style={{
                  left: petal.left,
                  top: petal.top,
                  width: petal.size,
                  height: petal.size * 0.65,
                  opacity: 0,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#777a65]">
            The heart of Terrapin
          </p>
          <h2
            id="about-heading"
            className="mt-5 font-serif text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl"
          >
            At Nature&apos;s Pace.
          </h2>
          <p className="mt-7 text-base leading-8 text-[#4c5148] sm:text-lg">
            Terrapin is a place to pause, take a breath, and give yourself room
            to feel better. Every session begins with listening and is
            personalized to support your comfort, your goals, and the way you
            want to feel.
          </p>
          <p className="mt-5 text-base leading-8 text-[#4c5148] sm:text-lg">
            Come as you are. We&apos;ll take it one step at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
