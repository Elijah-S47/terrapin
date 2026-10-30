import Image from "next/image";

export default function About() {
  return (
    <section
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
